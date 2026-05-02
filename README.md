# ☕ BrewCraft — AI 咖啡機客服

> 以 Claude API + Next.js + Vercel 實作的 AI 客服展示專案

## 功能特色

- 🤖 **AI 智慧問答**：由 Claude Sonnet 驅動，懂咖啡、會推薦
- 🛍️ **商品卡片推薦**：AI 自動判斷需求，渲染商品卡片（含購買連結）
- 👤 **真人轉接機制**：一鍵轉接，顯示排隊人數
- ⚡ **快速提問**：預設常見問題，降低對話門檻

## 快速開始

```bash
npm install
cp .env.local.example .env.local
# 填入你的 ANTHROPIC_API_KEY
npm run dev
```

## 部署到 Vercel

1. Push 到 GitHub
2. 在 [vercel.com](https://vercel.com) 連結 GitHub Repo
3. Environment Variables 加入 `ANTHROPIC_API_KEY`
4. 點 Deploy ✅

## 技術棧

- **框架**：Next.js 15 (App Router)
- **AI**：Anthropic Claude Sonnet
- **部署**：Vercel
- **樣式**：Tailwind CSS + CSS Variables
