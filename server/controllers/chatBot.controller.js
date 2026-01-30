// Import the Google Generative AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define an async controller function to handle chatbot requests
export const chatBotController = async (req, res) => {
    // Extract userMessage, userData, and fileData from the request body
    const { userMessage, userData, fileData } = req.body;

    // Safely access the user's name from userData (optional chaining avoids errors if undefined)
    const user = userData?.user?.name;

    try {
        // Initialize the client with the API key
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using "gemini-pro" as it is the standard free tier model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Construct the prompt history
        const history = [
            {
                role: "user",
                parts: [{
                    text: `Your name is Smriti, and the user's name is ${user}. 
                    You are a highly knowledgeable and responsible medical assistant AI. Your primary goal is to help users manage their health by providing accurate information, practical remedies, and appropriate guidance.
                    
                    **PROTOCOL FOR MEDICAL ADVICE:**
                    
                    1. **ASSESS SEVERITY (TRIAGE)**:
                       - **EMERGENCY/SERIOUS**: If the user describes symptoms like chest pain, trouble breathing, severe bleeding, or high fever:
                         - **STOP.** Do NOT suggest medications.
                         - **URGENTLY** advise them to visit the nearest hospital.
                       
                       - **MINOR/COMMON AILMENTS**: For everyday issues like flu, cold, mild fever, headaches, acidity:
                         - **ACTION**: You **MUST** suggest standard Over-The-Counter (OTC) medicines.
                         - **Specific Recommendations**:
                           - **Fever**: Suggest *Paracetamol 650mg* (Dolo 650) every 6 hours.
                           - **Headache**: Suggest *Ibuprofen* or *Paracetamol*.
                           - **Acidity**: Suggest *Pantoprazole* or antacid syrups.
                         - Always add: "Please read the label and ensure you have no allergies."

                    2. **MANDATORY DISCLAIMER**:
                       - Include: *"Disclaimer: I am an AI assistant. Consult a doctor if symptoms persist."*
                    
                    **TONE**:
                    - Be empathetic, professional, and clear.
                    - **If the user mentions a symptom like 'fever' without details, ASSUME it is a common case and suggest the OTC treatment immediately**, while adding the warning to seek help if it gets severe.`
                }],
            },
            {
                role: "model",
                parts: [{ text: "Understood. I am Smriti, your medical assistant. I will provide safe, practical advice and suggest OTC medicines for common ailments while ensuring user safety." }]
            }
        ];

        // Start a chat session
        const chat = model.startChat({
            history: history,
        });

        // Send the message
        let result;
        if (fileData) {
            // gemini-pro-vision (if needed) or gemini-1.5-flash for images
            // But gemini-pro doesn't support images well in this specific call format usually, prompts need to be different.
            // For now, let's keep it simple. If fileData exists, we might need a vision model.
            // Let's assume text only for now to fix the main issue, or use gemini-1.5-flash if image is present.
            if (fileData) {
                const visionModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Vision needs flash or pro-vision
                const imagePart = { inlineData: { mimeType: fileData.mimeType, data: fileData.data } };
                result = await visionModel.generateContent([userMessage, imagePart]);
            } else {
                result = await chat.sendMessage(userMessage);
            }
        } else {
            result = await chat.sendMessage(userMessage);
        }

        const response = await result.response;
        const text = response.text();

        // Send back a successful JSON response with the AI's message
        return res.status(200).json({
            success: true,
            message: text,
        });

    } catch (error) {
        console.error("Error in chatBotController (Switching to Local Mode):", error);

        // --- Local Rule-Based Fallback ---
        const msg = (userMessage || "").toLowerCase();
        let fallbackResponse = "I am currently offline due to a connection issue. Please consult a doctor for serious concerns.";

        if (msg.includes("fever") || msg.includes("temperature")) {
            fallbackResponse = "For fever, stay hydrated and rest. You can take **Paracetamol 650mg** (Dolo 650) after food. If fever exceeds 102°F or persists for more than 3 days, see a doctor immediately.";
        } else if (msg.includes("headache") || msg.includes("pain")) {
            fallbackResponse = "For headache or mild pain, try resting in a dark room and drinking water. You may take **Ibuprofen 400mg** or **Paracetamol**. If the pain is severe or sudden, seek medical help.";
        } else if (msg.includes("cold") || msg.includes("cough") || msg.includes("flu") || msg.includes("sneez")) {
            fallbackResponse = "For cold and cough, steam inhalation and warm fluids help. You can take **Cetirizine** or **Levocetirizine** at night for relief. If you have breathing difficulty, visit a hospital.";
        } else if (msg.includes("acidity") || msg.includes("gas") || msg.includes("stomach") || msg.includes("indigestion")) {
            fallbackResponse = "For acidity or gas, avoid spicy food. You can take **Pantoprazole 40mg** on an empty stomach or an antacid syrup like *Digene*. Drink plenty of water.";
        } else if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) {
            fallbackResponse = `Hello ${user || "there"}! I am Smriti, your AI medical assistant. I am running in **Offline Mode** right now, but I can still suggest remedies for common issues like fever, cold, or headache.`;
        }

        // Return the local response successfully
        return res.status(200).json({
            success: true,
            message: fallbackResponse
        });
    }
};