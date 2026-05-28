import Sale from '../models/Sale.model.js';
import Product from '../models/Product.model.js';

// @desc    Get top-level dashboard metrics (Revenue, Sales Count, Low Stock)
// @route   GET /api/analytics/dashboard
export const getDashboardMetrics = async(req, res) => {
    try{
        const ownerId = req.user._id;

        const salesData = await Sale.aggregate([
            { $match: { ownerId } },
            { $unwind: "$products" }, // Break apart the cart to calculate individual item costs
            {
                // Group back by Invoice to get the true Revenue and total Cost per sale
                $group: {
                    _id: "$_id",
                    invoiceRevenue: { $first: "$totalAmount" }, // Final amount paid (after tax/discount)
                    invoiceCost: { 
                        $sum: { $multiply: ["$products.quantity", "$products.purchasePriceAtTimeOfSale"] } 
                    }
                }
            },
            {
                // Group everything together for the grand total
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$invoiceRevenue" },
                    totalCost: { $sum: "$invoiceCost" },
                    totalSales: { $sum: 1 }
                }
            }
        ]);

        const totalRevenue = salesData.length > 0 ? salesData[0].totalRevenue : 0;
        const totalCost = salesData.length > 0 ? salesData[0].totalCost : 0;
        const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;
        const netProfit = totalRevenue - totalCost;

        const lowStockCount = await Product.countDocuments({
            ownerId,
            $expr: { $lte: ["$currentQuantity", "$minStockLevel"] }
        });

        const totalProducts = await Product.countDocuments({ownerId});

        const recentSales = await Sale.find({ ownerId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('products.product', 'name');

        res.status(200).json({
            totalRevenue,
            totalSales,
            totalCost,
            netProfit,
            lowStockCount,
            totalProducts,
            recentSales
        });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get the top 5 best-selling products
// @route   GET /api/analytics/top-products
export const getTopProducts = async (req, res) => {
    try {
        const topProducts = await Sale.aggregate([
            { $match: { ownerId: req.user._id } },
            { $unwind: "$products" }, // Deconstruct the products array inside sales
            {
                $group: {
                    _id: "$products.product",
                    totalQuantitySold: { $sum: "$products.quantity" },
                    revenueGenerated: {
                        $sum: { $multiply: ["$products.quantity", "$products.sellingPriceAtTimeOfSale"] }
                    }
                }
            },
            { $sort: { totalQuantitySold: -1 } }, // Sort by most sold
            { $limit: 5 }, // Keep only the top 5
            {
                // Join with the Product collection to get the names and images
                $lookup: {
                    from: "products", // The MongoDB collection name (usually pluralized lowercase)
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" } // Flatten the joined array
        ]);

        const formattedTopProducts = topProducts.map(item => ({
            productId: item._id,
            name: item.productDetails.name,
            SKU: item.productDetails.SKU,
            image: item.productDetails.images?.[0] || "",
            totalQuantitySold: item.totalQuantitySold,
            revenueGenerated: item.revenueGenerated
        }));

        res.status(200).json(formattedTopProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};