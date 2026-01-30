import admin from "./firebaseAdmin.js";
import User from "../models/User.js";

export const notificationService = async ({ userId, title, body }) => {
  try {

    const user = await User.findById(userId);
    if (!user || !user.fcmToken) {
      throw new Error("FCM token not found for user");
    }

    // Build FCM message
    const message = {
      token: user.fcmToken,
      notification: {
        title,
        body,
      },
    };

    // Send push notification
    const response = await admin.messaging().send(message);
    return {
      success: true,
      messageId: response,
    };
  } catch (err) {
    console.error("Notification error:", err);
    return {
      success: false,
      error: err.message || "Something went wrong",
    };
  }
};
