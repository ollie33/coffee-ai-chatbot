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


      {/* ── Chat Widget ── */}
      <ChatWidget />
    </main>
  );
}
