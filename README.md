# ☕ BrewCraft — AI 咖啡機客服專門店

> 基於 OpenAI API + Next.js + Vercel 打造的高質感 AI 客服展示專案。

## 🤖 智能客服 - 咖比 (Kabbi)

「咖比」是 BrewCraft 的 AI 品牌顧問，具備專業的咖啡知識與親切的對話風格。

### 核心功能
- ⚡ **AI 智能推薦**：根據用戶需求（杯數、口感、預算）精準推薦最適咖啡機。
- 🛍️ **動態商品卡片**：AI 會在對話中直接渲染商品卡片（含價格、特色、購買連結）。
- 📑 **Markdown 渲染**：支援列表、粗體等 Markdown 格式，讓產品說明更易讀。
- 🕒 **即時服務時鐘**：Header 顯示當前時間，並根據服務時間（每日 12:00-20:00）自動判斷狀態。
- 👥 **智慧真人轉接**：
  - 語意偵測：自動識別「找真人」、「轉接客服」等意圖。
  - 服務時間檢查：非服務時間會委婉告知並紀錄問題。
  - 等待模擬：顯示排隊人數與預計等待時間。
- 🛡️ **對話範圍限制**：嚴格聚焦於咖啡相關話題，拒絕無關請求（如寫程式、寫詩等）。

## 🚀 快速開始

### 1. 複製專案與安裝
```bash
git clone https://github.com/ollie33/coffee-ai-chatbot.git
cd coffee-ai-chatbot
npm install
```

### 2. 設定環境變數
建立 `.env.local` 並填入你的 OpenAI API Key：
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 啟動開發伺服器
```bash
npm run dev
```

## 🛠️ 技術棧

- **框架**：Next.js 15 (App Router / Turbopack)
- **AI 核心**：OpenAI GPT-4o-mini
- **樣式**：Tailwind CSS (v4)
- **圖示**：Lucide React
- **部署**：Vercel

## 🎨 設計規格
- **主色調**：Amber 950 (深琥珀色)
- **字體**：Playfair Display (標題) / DM Sans (內文)
- **風格**：現代簡約、高質感質感、適配各種裝置

---
*本專案僅供開發展示與 UI/UX 範例參考。*
