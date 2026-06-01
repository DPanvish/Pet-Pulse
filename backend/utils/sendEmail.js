import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_HOST,
      port: process.env.BREVO_PORT,
      secure: false, 
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'SchemaForge Support <support@schemaforge.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent successfully via Brevo:', info.messageId);

  } catch (error) {
    console.error('Email Dispatch Error:', error);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;