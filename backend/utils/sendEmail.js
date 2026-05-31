import nodemailer from "nodemailer"

let transporter;

const getTransporter = () => {
    const { EMAIL_USER, EMAIL_PASS } = process.env;

    if (!EMAIL_USER || !EMAIL_PASS) {
        throw new Error('Email service is not configured');
    }

    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
        });
    }

    return transporter;
};

const sendEmail = async(email, otp) => {
    try{
        const emailTransporter = getTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'PetPulse - Your Registration OTP',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                  <h2>Welcome to PetPulse!</h2>
                  <p>Your One-Time Password for registration is:</p>
                  <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
                  <p>This code will expire in 5 minutes.</p>
                </div>
            `,
        };

        await emailTransporter.sendMail(mailOptions);
    }catch(error){
        console.error('Email could not be sent:', error);
        throw new Error(error.message || 'Failed to send OTP email');
    }
};

export default sendEmail;
