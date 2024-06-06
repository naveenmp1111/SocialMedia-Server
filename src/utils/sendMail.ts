import configKeys from '../config';
import nodemailer from 'nodemailer'
import AppError from './appError';
import { HttpStatus } from '../types/httpStatus';

const sendMail = async (email: string, title: string, body: string) => {
    try {
        console.log(`Sending mail to: ${email}`);
        console.log(`Title: ${title}`);
        console.log(`Body: ${body}`);
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: configKeys.MAIL_USERNAME,
                pass: configKeys.MAIL_PASSKEY
            }
        });


        const mailOptions = {
            from: configKeys.MAIL_USERNAME,
            to: email,
            subject: title,
            text: body
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info.response;

    } catch (error) {
        console.error('Error sending email: ', error);

        throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);

    }
}

export default sendMail