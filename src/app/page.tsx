import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">

      {/* ── Nav ── */}
      <nav className="bg-black text-white px-10 md:px-20 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">☕</span>
          <span className="font-display text-2xl font-semibold tracking-tight text-white">
            BrewCraft
          </span>
        </div>
        <div className="flex items-center gap-8">
          {["商品", "關於我們", "門市"].map((item) => (
            <span
              key={item}
              className="text-lg text-neutral-400 hover:text-white cursor-pointer transition-colors"
            >
              {item}
            </span>
          ))}
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="relative bg-black text-white overflow-hidden" style={{ minHeight: "85vh" }}>
        {/* subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-10 py-40">
          <span className="inline-block text-sm tracking-widest uppercase text-neutral-500 mb-8 border border-neutral-800 px-6 py-2 rounded-full">
            AI 智慧客服體驗
          </span>

          <h1 className="font-display text-6xl md:text-8xl font-bold mb-8 leading-[1.08]">
            每一杯，
            <br />
            <span className="text-neutral-400">都值得完美</span>
          </h1>

          <p className="text-neutral-400 text-xl md:text-2xl max-w-2xl leading-relaxed">
            讓智能顧問幫你找到最適合的咖啡機，
            <br />
            從選購到保養，一鍵搞定
          </p>

          <div className="mt-12 inline-block bg-white text-black text-lg font-medium px-8 py-4 rounded-full cursor-pointer hover:bg-neutral-200 transition-colors select-none">
            立即體驗客服 ↘
          </div>
        </div>

        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-50 to-transparent" />
      </div>

      {/* ── Features ── */}
      <div className="py-32 px-12 md:px-20 bg-neutral-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: "🎯", title: "智慧推薦", desc: "根據需求精準配對最適合的咖啡機" },
            { icon: "⚡", title: "即時解答", desc: "常見問題即時回覆，5 秒內給你答案" },
            { icon: "👤", title: "真人轉接", desc: "複雜問題一鍵轉接專業客服人員" },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white border border-neutral-200 rounded-3xl p-10 hover:shadow-lg transition-shadow flex flex-col items-center text-center"
            >
              <div className="text-5xl mb-6">{f.icon}</div>
              <h3 className="font-semibold text-2xl text-neutral-900 mb-3">{f.title}</h3>
              <p className="text-lg text-neutral-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Demo hint card ── */}
      <div className="pb-32 px-12 md:px-20">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="bg-white border border-neutral-200 rounded-3xl p-12 shadow-sm w-full text-center">
            <h2 className="font-semibold text-2xl text-neutral-900 mb-8">您可以嘗試輸入：</h2>
            <ul className="text-xl text-neutral-600 space-y-5 flex flex-col items-start inline-block text-left max-w-max mx-auto">
              {[
                "「請問你們有賣什麼咖啡機？」",
                "「我想找半自動的咖啡機」",
                "「咖啡機保固期多久？」",
                "「我要轉接真人客服」",
              ].map((q) => (
                <li key={q} className="flex items-center gap-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 shrink-0" />
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Chat Widget ── */}
      <ChatWidget />
    </main>
  );
}
