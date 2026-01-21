import { GoogleGenAI, Type } from "@google/genai";
import { UserInputs, CalculationResult, AIAdviceResponse } from "./types";

// 確保讀取 GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

// 修正重點：正確初始化 GoogleGenAI 實例
const genAI = new GoogleGenAI(apiKey); 

export const getFinancialAdvice = async (
  inputs: UserInputs,
  results: CalculationResult
): Promise<AIAdviceResponse> => {
  
  // 修正重點：從實例中獲取模型
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const age = inputs.currentAge;
  const gender = inputs.gender;

  // ... 這裡保留你原本的 ageSpecificInstruction 邏輯 ...

  const prompt = `
    角色定位：你是一位個性鮮明、說話毒舌但專業的財務顧問『毒舌博士』。
    使用者財務數據：資產 ${inputs.currentSavings}，每月投資 ${inputs.monthlySavings}。
    任務：請以繁體中文輸出符合 Schema 的 JSON。
  `;

  try {
    // 修正重點：正確的 generateContent 調用語法
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error("API returned no content");
    return JSON.parse(text) as AIAdviceResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
