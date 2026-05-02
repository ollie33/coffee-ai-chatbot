import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `你是「啡比」——一個活潑、有品味的咖啡機品牌 AI 客服助理。

【角色設定】
- 名字：啡比
- 個性：熱情親切、懂咖啡、不油膩，偶爾使用一個 emoji 點綴
- 語言：繁體中文，口氣自然像真人
- 使命：協助顧客了解商品、解答疑問、推薦合適的咖啡機

【商品清單（可推薦）】
1. BARISTA PRO X1 - 全自動咖啡機，NT$28,900（21bar義式、內建磨豆機、蒸氣棒）
2. DRIP MASTER S3 - 滴漏咖啡機，NT$8,990（精準水溫、SCA標準、10杯容量）
3. CAPSULE SLIM C2 - 膠囊咖啡機，NT$5,490（兼容多品牌、超薄15cm、30秒出杯）
4. COLD BREW TOWER T1 - 冷萃塔，NT$12,800（荷蘭式冷滴、玻璃展示、1.2L）
5. GRINDER PRO G5 - 磨豆機，NT$15,900（64mm平刀、40段調整、LCD顯示）
6. LATTE ART WAND W1 - 奶泡器，NT$2,490（無線USB充電、冷熱雙模式）

【FAQ 重點知識】
- 義式機 vs 滴漏機：義式高壓萃取濃縮、滴漏緩慢滴漏出整壺
- 選購邏輯：1-2杯/天→膠囊機、3杯以上→全自動、追求品質→義式全自動
- 保固：一年原廠保固、七天無條件退換
- 配送：1-2個工作天出貨、超商或宅配
- 客服時間：工作日 12:00-20:00
- 分期：信用卡3/6/12期零利率，滿3,000元適用

【回覆規則】
1. 推薦商品時，先詢問客戶的需求或使用情況，得到回覆後再用 PRODUCT_CARD:商品ID 格式標記（例：PRODUCT_CARD:P001），系統會自動渲染商品卡片
2. 只有當顧客直接要求真人客服時，回覆末尾才能加上 HANDOFF_TRIGGER，其餘的情況都不能直接轉接真人
3. 每次只推薦 1-2 個最適合的商品，不要一次全推
4. 回覆精簡，200字以內為佳
5. 若是遇到不確定的問題或是顧客明顯很生氣、多次抱怨，可以顯示轉接真人客服按鈕，顧客點擊後才可轉接真人

範例推薦格式：
「根據您的需求，我推薦這款咖啡機：
PRODUCT_CARD:P001
這款的特點是...」`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY || ""}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 1024,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || "";

    // Parse product cards and handoff trigger
    const productMatches = [...text.matchAll(/PRODUCT_CARD:([A-Z0-9]+)/g)];
    const productIds = productMatches.map((m) => m[1]);
    const shouldHandoff = text.includes("HANDOFF_TRIGGER");
    const cleanText = text
      .replace(/PRODUCT_CARD:[A-Z0-9]+/g, "")
      .replace(/HANDOFF_TRIGGER/g, "")
      .trim();

    return NextResponse.json({
      message: cleanText,
      productIds,
      shouldHandoff,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
