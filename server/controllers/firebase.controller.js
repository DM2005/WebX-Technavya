import { notificationService } from "../services/notification.js";

export const sendFirebaseNotification = async (req, res) => {
  try {
    const { userId, title, body } = req.body;
    const response = await notificationService({ userId, title, body });

    if (response.success) {
      return res.status(200).json({
        success: true,
        message: "Notification sent successfully",
      });  
    }

    return res.status(400).json({
      success: false,
      message: response.error || "Failed to send notification",
    });

  } catch (error) {
    console.log("Error in firebase controller", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error in firebase controller",
    });
  }
};
