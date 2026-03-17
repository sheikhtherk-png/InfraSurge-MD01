
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client using the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const diagnoseDomainHealth = async (domainName: string, issues: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a clinical diagnosis for the email infrastructure domain: ${domainName}. 
      The following issues were detected: ${issues.join(', ')}.
      Provide a "Surgical Plan" in 3 bullet points:
      1. Immediate treatment (The most critical fix).
      2. Post-op recovery (How to warm up again).
      3. Long-term preventative care (Monitoring strategy).
      Keep the tone medical and professional.`,
    });
    // Directly access the text property as per the latest SDK guidelines.
    return response.text;
  } catch (error) {
    console.error("Diagnosis failed:", error);
    return "The clinical diagnostic tool is currently unavailable. Please check DNS records manually.";
  }
};
