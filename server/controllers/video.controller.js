import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;
// video token provider
export const tokenProvider = async (req, res) => {
  try {
    const user = req.user.id;
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const client = new StreamClient(apiKey, apiSecret);

    const exp = Math.round(Date.now() / 1000) + 60 * 60;
    const iat = Math.floor(Date.now() / 1000) - 60;

    const token = client.generateUserToken({
      user_id: user,
      exp,
      iat
    });

    res.status(200).json({
      success: true,
      token,
      apiKey,
      userId : user
    });
  } catch (err) {
    console.error("Stream token error:", err);
    res.status(500).json({ message: "Failed to generate token" });
  }
};
