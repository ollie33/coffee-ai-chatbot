import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrewCraft | 咖啡機 AI 客服",
  description: "由 AI 驅動的咖啡機選購顧問 — 即時推薦、解答疑問、無縫轉接真人客服",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
