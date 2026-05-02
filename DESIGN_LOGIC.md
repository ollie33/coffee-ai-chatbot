# ☕ BrewCraft AI 客服 — 設計邏輯說明

## 1. 專案概述

本專案以規格書中的「前台對話模組（C端）」為核心，實作一個可部署於 Vercel 的 Next.js AI 客服機器人，作為個人作品集展示使用。

---

## 2. Vibe Coding 實作流程

### 什麼是 Vibe Coding？

Vibe Coding 是以「意圖描述」驅動 AI 寫程式的開發方式：
1. **描述意圖**，不直接手寫程式碼
2. **下 Prompt** 給 AI，AI 生成完整可運作的程式碼
3. **人工審查 + 快速迭代**，調整 Prompt 直到結果符合預期

---

## 3. System Prompt 設計邏輯

本系統的核心是 **System Prompt**，負責定義 AI 客服的行為。設計重點：

### 3.1 角色塑造
```
你是「啡比」——一個活潑、有品味的咖啡機品牌 AI 客服助理。
- 個性：熱情親切、懂咖啡、不油膩
- 語言：繁體中文，口氣自然像真人
```
**設計原因**：給 AI 一個明確的人物設定，避免機械式的回答，提升用戶體感。

### 3.2 結構化知識注入（RAG 概念簡化版）
```
【商品清單】
1. BARISTA PRO X1 - NT$28,900（21bar義式、內建磨豆機）
2. DRIP MASTER S3 - NT$8,990（SCA標準、10杯容量）
...
```
**設計原因**：將商品資訊直接注入 Context，讓 AI 可以根據用戶需求推薦正確商品，不需要真正的向量資料庫也能達到 RAG 的效果。

### 3.3 結構化輸出標記
```
推薦商品時，用 PRODUCT_CARD:商品ID 格式標記
若顧客非常不滿，回覆末尾加上 HANDOFF_TRIGGER
```
**設計原因**：讓 AI 輸出帶有可解析的標記，後端 API 路由用正則表達式擷取，前端據此渲染商品卡片或觸發轉接流程。這是**結構化 LLM 輸出**的實際應用。

---

## 4. 系統架構

```
User Input
    ↓
ChatWidget.tsx（前端 React）
    ↓ POST /api/chat
route.ts（Next.js API Route）
    ↓ 帶入商品+FAQ知識的 System Prompt
Anthropic Claude API
    ↓ 回傳含有標記的文字
route.ts（解析 PRODUCT_CARD / HANDOFF_TRIGGER）
    ↓ JSON: { message, productIds, shouldHandoff }
ChatWidget.tsx（渲染訊息 + 商品卡片 + 轉接流程）
```

---

## 5. 規格書對應

| 規格書功能 | 本實作對應 |
|-----------|-----------|
| F_C_01 AI 對話視窗 | ChatWidget.tsx 完整聊天介面 |
| 商品卡片渲染 | ProductCard 元件，含圖片/名稱/價格/購買連結 |
| 快速提問按鈕 | 首次開啟時顯示 4 個常見問題 |
| AI 思考中動畫 | typing-dot 動態動畫 |
| F_C_02 真人轉接 | 「轉接專人」按鈕 + 排隊人數提示 |
| 取消等待 | 轉接後可取消並回到 AI 對話 |
| 非服務時間提示 | HANDOFF_TRIGGER 機制（可擴充判斷時間）|

---

## 6. 部署步驟

```bash
# 1. Clone 專案
git clone <your-repo-url>

# 2. 安裝依賴
npm install

# 3. 設定 API Key
cp .env.local.example .env.local
# 在 .env.local 填入你的 ANTHROPIC_API_KEY

# 4. 本地開發
npm run dev

# 5. 部署到 Vercel
# 登入 vercel.com → New Project → 選 GitHub Repo
# 在 Environment Variables 設定 ANTHROPIC_API_KEY
# 點 Deploy，完成！
```

---

## 7. 技術選擇說明

| 技術 | 原因 |
|------|------|
| Next.js App Router | 同時處理前端 UI 與後端 API Route，一個框架搞定 |
| Vercel 部署 | 與 Next.js 無縫整合，API Key 可安全存在 Server 端 |
| Claude API | 繁體中文理解佳，指令遵循度高，適合客服場景 |
| Tailwind CSS | 快速樣式開發，搭配 CSS Variables 實現主題系統 |
| TypeScript | 型別安全，降低維護成本 |

---

## 8. 未來擴充方向

- **RAG 升級**：接入真實向量資料庫（Pinecone/Supabase pgvector）
- **訂單查詢**：整合訂單系統 API，AI 可查詢訂單狀態
- **B 端工作台**：真人客服接手介面（WebSocket 即時推播）
- **對話記錄**：LocalStorage 保留頁面跳轉後的對話
- **PII 遮蔽**：電話/姓名自動替換為 [PHONE]/[NAME] 後再送給 LLM
