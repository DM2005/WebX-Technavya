import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function main() {
    try {
        const result = await ai.models.list();
        // Clean output of names only
        if (result && result.models) {
            console.log(JSON.stringify(result.models.map(m => m.name), null, 2));
        } else {
            console.log("No models found or structure mismatch");
            console.log(JSON.stringify(result, null, 2));
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}
main();
