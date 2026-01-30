import crypto from "crypto";
import bcrypt from "bcryptjs";
import OtpVerification from "../models/OtpVerification.js"
import { Resend } from 'resend';


const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

if (!resendApiKey) {
  console.warn("⚠️  RESEND_API_KEY is missing (verifyEmail). Email sending will be disabled.");
}


export const sendOtpForRegister = async (req, res) => {
  try {
    const { email } = req.body;



    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }


    const otp = crypto.randomInt(100000, 999999).toString();


    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);


    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);


    await OtpVerification.deleteMany({ email });


    await OtpVerification.create({
      email,
      otp: hashedOtp,
      expiresAt,
    });

    if (resend) {
      const response = await resend.emails.send({
        from: 'Triksha Support <support@triksha.in>',
        to: [email],
        subject: 'Email Verification',
        html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                      🏥 Triksha
                    </h1>
                    <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">
                      Healthcare You Can Trust
                    </p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; text-align: center;">
                      🔐 Verification Required
                    </h2>
                    
                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; text-align: center;">
                      We received a request to verify your account. Please use the verification code below to complete the process.
                    </p>
                    
                    <!-- OTP Box -->
                    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                      <p style="color: #ffffff; font-size: 16px; margin: 0 0 10px 0; font-weight: bold;">
                        Your Verification Code
                      </p>
                      <div style="background-color: rgba(255, 255, 255, 0.2); border-radius: 8px; padding: 20px; margin: 15px 0;">
                        <span style="color: #ffffff; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                          ${otp}
                        </span>
                      </div>
                      <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 10px 0 0 0;">
                        ⏰ This code expires in <strong>5 minutes</strong>
                      </p>
                    </div>
                    
                    <!-- Instructions -->
                    <div style="background-color: #f8f9ff; border-left: 4px solid #667eea; padding: 20px; border-radius: 0 8px 8px 0; margin: 30px 0;">
                      <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">
                        📋 How to use this code:
                      </h3>
                      <ul style="color: #666666; margin: 0; padding-left: 20px; line-height: 1.6;">
                        <li>Enter the code in the verification field</li>
                        <li>Complete the process within 5 minutes</li>
                        <li>Do not share this code with anyone</li>
                      </ul>
                    </div>
                    
                    <!-- Security Notice -->
                    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 30px 0;">
                      <p style="color: #856404; margin: 0; text-align: center; font-size: 14px;">
                        🛡️ <strong>Security Notice:</strong> If you didn't request this code, please ignore this email or contact our support team.
                      </p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #dee2e6;">
                    <p style="color: #6c757d; font-size: 14px; margin: 0 0 15px 0;">
                      Thank you for choosing Triksha for your healthcare needs.
                    </p>
                    <p style="color: #6c757d; font-size: 12px; margin: 0;">
                      This is an automated message. Please do not reply to this email.<br>
                      © 2025 Triksha. All rights reserved.
                    </p>
                    
                    <!-- Social Links (Optional) -->
                    <div style="margin-top: 20px;">
                      <a href="#" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                        <span style="background-color: #667eea; color: white; padding: 8px 12px; border-radius: 20px; font-size: 12px;">
                          🌐 Website
                        </span>
                      </a>
                      <a href="#" style="display: inline-block; margin: 0 10px; text-decoration: none;">
                        <span style="background-color: #667eea; color: white; padding: 8px 12px; border-radius: 20px; font-size: 12px;">
                          📞 Support
                        </span>
                      </a>
                    </div>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
      });
    } else {
      console.log(`[DEV] Mock sending OTP verification email to ${email}: ${otp}`);
    }


    res.status(200).json({ message: "OTP sent successfully", status: true });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP", details: error.message });
  }
};



export const verifyOtpForRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const userOtpRecord = await OtpVerification.findOne({ email });

    if (!userOtpRecord) {
      return res.status(400).json({ error: "No OTP found for this email" });
    }
    if (userOtpRecord.expiresAt < Date.now()) {
      await OtpVerification.deleteMany({ email });
      return res.status(400).json({ error: "OTP expired, please request a new one" });
    }


    const isMatch = await bcrypt.compare(otp, userOtpRecord.otp);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    await OtpVerification.deleteMany({ email });

    res.status(200).json({ message: "OTP verified successfully", status: true });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

