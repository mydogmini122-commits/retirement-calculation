import { GoogleGenAI, Type } from "@google/genai";
import { UserInputs, CalculationResult, AIAdviceResponse } from "./types";

// 修正 1：確保讀取的名稱是 GEMINI_API_KEY
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getFinancialAdvice = async (
  inputs: UserInputs,
  results: CalculationResult
): Promise<AIAdviceResponse> => {
  // 修正 2：明確指定模型名稱 (使用目前最穩定的 gemini-1.5-flash)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const age = inputs.currentAge;
  const gender = inputs.gender;
  // ... 這裡保留你原本的 ageSpecificInstruction 和 prompt 內容 ...

  try {
    // 修正 3：使用正確的模型呼叫語法
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error("API returned no content");
    return JSON.parse(text) as AIAdviceResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
