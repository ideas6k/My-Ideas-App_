import { GoogleGenAI, Type } from "@google/genai";
import type { Prompt } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generatePrompt = async (category: string): Promise<Partial<Prompt>> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a creative and detailed programming prompt for a ${category} project. The prompt should be suitable for an intermediate developer. Provide a title, a short description (desc), and the full prompt text.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "A short, catchy title for the programming project prompt."
            },
            desc: {
              type: Type.STRING,
              description: "A one-sentence description of the project."
            },
            text: {
              type: Type.STRING,
              description: "The full, detailed text of the prompt, explaining the project requirements, features, and potential technologies."
            }
          },
          required: ["title", "desc", "text"],
        },
      },
    });

    const jsonString = response.text.trim();
    const generatedData = JSON.parse(jsonString);

    return {
      title: generatedData.title,
      desc: generatedData.desc,
      text: generatedData.text,
    };
  } catch (error) {
    console.error("Error generating prompt with Gemini:", error);
    throw new Error("Failed to generate prompt. Please try again.");
  }
};
