import { GoogleGenAI, Type } from "@google/genai";
import { UserInputs, CalculationResult, AIAdviceResponse } from "./types";

// 嘗試從所有可能的入口讀取鑰匙
const apiKey = (window as any).__GEMINI_API_KEY__ || process.env.GEMINI_API_KEY || '';

// 確保 genAI 被正確初始化
const genAI = new GoogleGenAI(apiKey);

export const getFinancialAdvice = async (
  inputs: UserInputs,
  results: CalculationResult
): Promise<AIAdviceResponse> => {

  // 獲取模型實例 (使用穩定版 1.5-flash)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const age = inputs.currentAge;
  const gender = inputs.gender;

  let ageSpecificInstruction = "";
  if (age < 35) {
    ageSpecificInstruction = `針對 20-30 世代${gender}性，重點攻擊『精緻窮』、${gender === '男' ? '3C/課金/模型' : '醫美/名牌包/下午茶'}。用網路迷因風格。`;
  } else if (age < 50) {
    ageSpecificInstruction = `針對 35-50 世代${gender}性，嘲諷『社畜生涯』、${gender === '男' ? '中年發福/車貸陷阱' : '家庭開銷/團購成癮'}，強調時間流逝的殘酷。`;
  } else {
    ageSpecificInstruction = `針對 50 世代以上${gender}性，強調『下流老人風險』與醫療支出，語氣嚴厲警告立即轉換防禦型配置。`;
  }

  const prompt = `
    角色定位：你是一位個性鮮明、說話毒舌但專業的財務顧問『毒舌博士』。
    語氣：尖銳、充滿諷刺、幽默、像是一個嘴巴很壞但說實話的專業損友。

    使用者財務數據：
    - 性別：${gender}
    - 目前年齡：${age} 歲
    - 目前資產：${inputs.currentSavings} TWD
    - 每月投資：${inputs.monthlySavings} TWD
    - 退休金缺口：${results.gap} TWD

    任務要求：
    1. 毒舌博士診斷 (summary)：${ageSpecificInstruction}。
    2. 資產配置建議 (allocation)：提供 3-4 類資產。
    3. 行動建議：提供實質建議。

    請務必以繁體中文輸出符合 Schema 的 JSON。
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const text = result.response.text();
    if (!text) throw new Error("API returned no content");
    return JSON.parse(text) as AIAdviceResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
