import nodemailer from "nodemailer"

const sendEmail = async(email, otp) => {
    try{
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

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

        await transporter.sendMail(mailOptions);
    }catch(error){
        console.error('Email could not be sent:', error);
        throw new Error('Failed to send OTP email');
    }
};

export default sendEmail;