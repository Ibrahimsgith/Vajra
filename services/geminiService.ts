
import { GoogleGenAI, Type } from "@google/genai";

export const getStyleAdvice = async (occasion: string): Promise<string> => {
  // Check for API Key, which is a required environment variable for this feature.
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    throw new Error("The AI Style Advisor is currently unavailable. Please contact support.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Define the expected JSON structure for the AI's response.
    const styleAdviceSchema = {
      type: Type.OBJECT,
      properties: {
        jewelryType: { type: Type.STRING, description: "Type of jewelry, e.g., Necklace, Ring." },
        metal: { type: Type.STRING, description: "The metal for the jewelry, e.g., Gold, Silver." },
        gemstone: { type: Type.STRING, description: "The main gemstone, e.g., Diamond, Emerald." },
        styleDescription: { type: Type.STRING, description: "A brief, elegant description of the style." },
      },
      required: ["jewelryType", "metal", "gemstone", "styleDescription"],
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `As a luxury jewelry stylist for a brand named Vajra, recommend the perfect jewelry for a customer attending the following event: "${occasion}". Provide one specific recommendation.`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: styleAdviceSchema,
        },
    });

    const adviceText = response.text;
    if (!adviceText) {
      throw new Error("The AI returned an empty response.");
    }
    
    return adviceText;

  } catch (error) {
    console.error('Error getting style advice from Gemini API:', error);
    // Provide a user-friendly error message.
    throw new Error('Sorry, the AI Style Advisor could not generate a recommendation at this time. Please try again later.');
  }
};
