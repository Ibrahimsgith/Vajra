
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const styleAdviceSchema = {
  type: Type.OBJECT,
  properties: {
    jewelryType: {
      type: Type.STRING,
      description: 'The type of jewelry recommended (e.g., Necklace, Earrings, Ring).',
    },
    metal: {
      type: Type.STRING,
      description: 'The recommended metal (e.g., Yellow Gold, Platinum, Rose Gold).',
    },
    gemstone: {
      type: Type.STRING,
      description: 'The recommended gemstone (e.g., Diamond, Sapphire, Pearl, or "None").',
    },
    styleDescription: {
      type: Type.STRING,
      description: 'A brief, elegant description of why this style fits the occasion.',
    },
  },
  required: ["jewelryType", "metal", "gemstone", "styleDescription"],
};

export const getStyleAdvice = async (occasion: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `As a luxury jewelry stylist for a brand named Vajra, recommend the perfect jewelry for a customer attending the following event: "${occasion}". Provide one specific recommendation.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: styleAdviceSchema,
      },
    });

    return response.text;
  } catch (error) {
    console.error('Error fetching style advice from Gemini API:', error);
    throw new Error('Failed to get style advice. Please try again.');
  }
};
