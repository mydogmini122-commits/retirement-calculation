import { GoogleGenAI } from "@google/genai";
import { UserInputs, CalculationResult, AIAdviceResponse } from "./types";

export const getFinancialAdvice = async (
  inputs: UserInputs,
  results: CalculationResult
): Promise<AIAdviceResponse> => {
  
  // 核心修正：嘗試所有可能的注入位置
  const apiKey = (globalThis as any).GEMINI_API_KEY || 
                 process.env.GEMINI_API_KEY || 
                 (import.meta as any).env?.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.length < 10) {
    throw new Error("偵測到 API Key 為空。請確認 Vercel 後台 Production 是否勾選並關閉 Build Cache 重新部署。");
  }

  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `你是一位毒舌財務顧問。使用者目前資產 ${inputs.currentSavings} TWD，退休金缺口 ${results.gap} TWD。請以繁體中文輸出符合 Schema 的 JSON。`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const text = result.response.text();
    if (!text) throw new Error("API 沒有回傳內容");
    return JSON.parse(text) as AIAdviceResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
