
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInputs, CalculationResult, AIAdviceResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const allocationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "A humorous, simple summary adapted to the user's age." },
    allocation: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of asset class" },
          value: { type: Type.NUMBER, description: "Percentage value (0-100)" },
          color: { type: Type.STRING, description: "Hex color code" },
          description: { type: Type.STRING, description: "Very short simple explanation" },
          risk: { type: Type.STRING, description: "Risk explained simply (Simple)" },
          expectedReturn: { type: Type.STRING, description: "Return potential explained simply (Simple)" },
          riskDetail: { type: Type.STRING, description: "Professional detailed risk analysis (volatility, max drawdown)" },
          historicalPerformance: { type: Type.STRING, description: "Historical annualized return (CAGR) and context" }
        },
        required: ["name", "value", "color", "risk", "expectedReturn", "riskDetail", "historicalPerformance"]
      }
    },
    actionableSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of steps adapted to the user's age, using humor, slang, and relatable examples."
    },
    riskAnalysis: { type: Type.STRING, description: "Simple risk level." },
    passiveIncomeSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Passive income ideas adapted to the user's age, funny and relatable."
    },
    professionalAnalysis: { 
      type: Type.STRING, 
      description: "A serious, professional analysis of the gap and strategy for a 40+ year old adult. Use financial terminology." 
    },
    professionalSuggestions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "Concrete, mature actionable steps or investment vehicles (e.g. specific ETF types)." 
    }
  },
  required: ["summary", "allocation", "actionableSteps", "riskAnalysis", "passiveIncomeSuggestions", "professionalAnalysis", "professionalSuggestions"]
};

export const getFinancialAdvice = async (
  inputs: UserInputs,
  results: CalculationResult
): Promise<AIAdviceResponse> => {
  const isGap = results.gap > 0;
  const age = inputs.currentAge;

  if (!apiKey) {
    console.warn("API Key is missing, returning mock data.");
    
    // Custom Mock Data based on age group for fallback
    let mockSummary = "";
    let mockSteps = [];
    
    if (age < 30) {
        mockSummary = isGap 
          ? "哎呀！年輕人，還在躺平？每天一杯星巴克，難怪你離財富自由越來越遠。別再「精緻窮」了，老了只能喝西北風！" 
          : "太強了！少年股神是你？這年紀有這種規劃，簡直是把同齡人按在地上摩擦，繼續保持啊！";
        mockSteps = ["戒掉手搖飲和課金，那是智商稅", "下班別只會打傳說，學點技能吧", "ETF 定期定額買起來，別當韭菜"];
    } else if (age < 45) {
        mockSummary = isGap 
          ? "醒醒吧社畜！這點錢想退休？看來你得做到死或是期待老闆突然良心發現了。上有老下有小，還不快點去補破網！" 
          : "不錯喔！看來這幾年有認真被老闆榨取，資產累積得還可以，雖然髮際線高了點，但至少錢包是鼓的！";
        mockSteps = ["檢視一下你的爛保單，別被業務員洗腦", "別只會存定存，通膨會把你吃乾抹淨", "副業搞起來，別把雞蛋都放在老闆這個籃子裡"];
    } else if (age < 55) {
        mockSummary = isGap 
          ? "警報響起！時間不多了，這缺口有點嚇人啊！只剩肝指數在升，資產沒升？再不認真點，真的要變成「下流老人」預備軍了！" 
          : "薑還是老的辣！這資產配置很穩，看來你是準備好去環遊世界，而不是去公園搶紙箱了，令人羨慕！";
        mockSteps = ["沒用的聚餐少去，把錢留下來看醫生比較實在", "高風險的股票別碰了，你輸不起", "快點把債券部位拉高，保本要緊"];
    } else {
        mockSummary = isGap 
          ? "這把年紀了缺口還這麼大？你是打算靠兒女養嗎？如果兒女也沒錢怎麼辦？現在開始省吃儉用，或許還能少吃點土。" 
          : "財富自由的典範！您可以優雅地退休了，記得多教教年輕人怎麼理財，別讓他們太廢。";
        mockSteps = ["現金流是王道，確保每月有錢進帳", "醫療保險檢查一下，別讓醫藥費吃掉老本", "資產傳承可以開始規劃了"];
    }

    return {
      summary: mockSummary,
      allocation: [
        { 
          name: "股票 (錢滾錢)", 
          value: 60, 
          color: "#1e293b", 
          risk: "心臟要大顆，像坐雲霄飛車。",
          expectedReturn: "運氣好賺大錢，運氣不好住套房。",
          riskDetail: "高波動性資產，標準差約 15-20%，短期可能面臨 30% 以上的回撤風險。",
          historicalPerformance: "S&P 500 長期年化報酬率約 8-10% (名目)，是長期抗通膨的核心資產。"
        },
        { 
          name: "債券 (收租金)", 
          value: 30, 
          color: "#b45309", 
          risk: "比股票安全，但還是會波動。",
          expectedReturn: "穩定領利息，像乖乖存錢筒。",
          riskDetail: "利率風險與信用風險，但波動度通常低於股票，具備資產配置的對沖效果。",
          historicalPerformance: "投資級公司債長期平均報酬約 3-5%，提供穩定的現金流與較低的本金波動。"
        },
        { 
          name: "儲蓄與定存 (保命錢)", 
          value: 10, 
          color: "#94a3b8", 
          risk: "被通膨吃掉，錢會變薄。",
          expectedReturn: "少得可憐，但隨時能用。",
          riskDetail: "購買力風險 (通膨風險)，長期持有現金將導致實質資產縮水。",
          historicalPerformance: "短期國庫券或定存報酬率約 1-3%，主要功能為流動性管理而非資產增值。"
        }
      ],
      actionableSteps: mockSteps,
      riskAnalysis: "中等風險 (心臟還行)",
      passiveIncomeSuggestions: [
        "存股領股息，讓慣老闆幫你賺錢",
        "經營自媒體或頻道，雖然很捲但有機會",
        "閒錢放高活存數位帳戶，加減賺便當錢"
      ],
      professionalAnalysis: "根據目前的資產累積速率與通膨調整後的支出需求，您的退休準備金存在顯著缺口。建議立即檢視資產配置效率，提高權益類資產比例以對抗長壽風險，並善用複利效應縮小差距。當前的儲蓄率不足以支撐預期的替代率，需進行結構性調整。",
      professionalSuggestions: [
        "將每月結餘的 70% 投入全市場指數型 ETF (如 VT 或 VTI) 以獲取長期市場報酬。",
        "配置 20% 於投資級公司債或公債 (如 BND) 作為資產避震器。",
        "檢視非必要性支出，將儲蓄率提升至所得的 30% 以上。"
      ]
    };
  }

  // Constructing age-specific prompt instructions
  let ageSpecificInstruction = "";
  if (age < 30) {
    ageSpecificInstruction = `
      - **Target Audience**: Gen Z / Young Adults (<30).
      - **Roast Strategy**: Mock them for "Lying Flat" (躺平), "Exquisite Poverty" (精緻窮), spending on bubble tea/games, or being a "Moonlight Clan" (月光族).
      - **Tone**: Use internet slang. Be like a strict older sibling.
    `;
  } else if (age < 45) {
    ageSpecificInstruction = `
      - **Target Audience**: Working Class / Sandwich Generation (30-45).
      - **Roast Strategy**: Mock them for being a "Corporate Slave" (社畜), "Mortgage Slave" (房奴). Ask if they enjoy their high "Liver Index" (肝指數).
      - **Tone**: Sympathetic but brutal reality check about mid-life crisis.
    `;
  } else if (age < 55) {
    ageSpecificInstruction = `
      - **Target Audience**: Pre-Retirees (45-55).
      - **Roast Strategy**: Focus on "Time Running Out". Mock them if their waistline is growing faster than their savings. Warn about becoming "Lower-class Elderly" (下流老人).
      - **Tone**: Urgent, wake-up call.
    `;
  } else {
    ageSpecificInstruction = `
      - **Target Audience**: Retirees / Near Retirees (55+).
      - **Roast Strategy**: The "Final Countdown". Ask if they plan to rely on their children (who might be broke) or drink "Northwest Wind" (starve).
      - **Tone**: Critical, no-nonsense.
    `;
  }

  const prompt = `
    Role: You are a dual-persona financial advisor.
    
    Part 1: "The Venomous & Humorous Advisor" (毒舌博士)
    - **Context**: The user is ${inputs.currentAge} years old.
    ${ageSpecificInstruction}
    - **CRITICAL**: Use "Simple, Easy-to-Understand Language" (白話文). Do NOT use complex financial jargon in the summary or actionable steps. Talk like a funny, mean friend.
    - **Summary**:
      - If Gap > 0 ($${results.gap}): Roast them hard based on their age group.
      - If Gap <= 0: Praise them sarcastically (e.g., "Wow, look at Mr. Moneybags").
    - **Actionable Steps & Passive Income**:
      - Provide 3 steps and 3 income ideas suitable for a ${inputs.currentAge} year old.
      - Keep them short, punchy, and funny.
    - **Asset Allocation (Simple fields)**:
      - 'risk': 1 short sentence, simple metaphor (e.g. "Like a roller coaster").
      - 'expectedReturn': 1 short sentence (e.g. "Good luck winning the lottery").
      - 'name': Use "儲蓄與定存" instead of "Cash".

    Part 2: "The Professional Wealth Manager" (For Adult Report)
    - **Tone**: Serious, Professional, Data-driven.
    - **Language**: Formal Traditional Chinese. Use proper financial terminology (Inflation, CAGR, Asset Allocation).
    - **Analysis**: Analyze the $${results.gap} gap for a ${inputs.currentAge}-year-old.
    - **Asset Allocation (Professional fields)**:
      - 'riskDetail': Detailed metrics (Standard Deviation, Drawdown).
      - 'historicalPerformance': Specific historical data (e.g., S&P 500 avg return).

    User Financial Data:
    - Age: ${inputs.currentAge}
    - Retirement Age: ${inputs.retirementAge}
    - Current Savings: ${inputs.currentSavings}
    - Monthly Savings: ${inputs.monthlySavings}
    - Gap: ${results.gap}
    
    Output JSON only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: allocationSchema,
        temperature: 0.7
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAdviceResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback with empty professional fields if error, ensuring app doesn't crash
    return {
       summary: "AI 連線忙碌中，請稍後再試。",
       allocation: [],
       actionableSteps: [],
       riskAnalysis: "未知",
       passiveIncomeSuggestions: [],
       professionalAnalysis: "暫無法取得專業分析數據。",
       professionalSuggestions: []
    };
  }
};
