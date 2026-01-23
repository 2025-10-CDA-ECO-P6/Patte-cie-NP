import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export const sendEmail = async (
    to: string,
    subject: string,
    text: string
) => {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        throw new Error("GMAIL credentials are not set in environment variables");
    }

    await transporter.sendMail({
        from: `"Patte & Cie" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        text,
    });
};
