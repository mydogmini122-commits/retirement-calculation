import { GoogleGenAI } from "@google/genai";
import { UserInputs, CalculationResult, AIAdviceResponse } from "./types";

export const getFinancialAdvice = async (
  inputs: UserInputs,
  results: CalculationResult
): Promise<AIAdviceResponse> => {
  
  // 核心修正：從三個入口嘗試抓取鑰匙，直到抓到為止
  const apiKey = (globalThis as any).__GEMINI_API_KEY__ || 
                 process.env.GEMINI_API_KEY || 
                 (import.meta as any).env?.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API Key 還是讀不到，請確認 Vercel 後台 Production 勾選了沒？");
  }

  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const age = inputs.currentAge;
  const gender = inputs.gender;

  // ... 這裡保留你的毒舌邏輯 (ageSpecificInstruction) ...
  let ageSpecificInstruction = age < 35 ? "攻擊精緻窮" : "嘲諷社畜"; 

  const prompt = `你是一位毒舌財務顧問。使用者目前資產 ${inputs.currentSavings} TWD。請以繁體中文輸出符合 Schema 的 JSON。`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const text = result.response.text();
    return JSON.parse(text) as AIAdviceResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
