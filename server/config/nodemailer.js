import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: '587',
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }

});

export default transporter;