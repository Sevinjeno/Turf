import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Twilio Auth Token
const serviceId = process.env.TWILIO_SERVICE_SID; // Twilio Messaging Service SID

export const twilioClient = twilio(accountSid, authToken);

/**
 * Send OTP to the provided phone number via WhatsApp
 */
export const sendWhatsAppOTP = async (phone, otp) => {
    try {
        const message = await twilioClient.messages.create({
            from: 'whatsapp:+14155238886', // Twilio WhatsApp sender number
            to: `whatsapp:${phone}`,
            body: `Your login OTP is: ${otp}`,
        });
        return message.sid;
    } catch (error) {
        throw new Error('Failed to send WhatsApp OTP: ' + error.message);
    }
};