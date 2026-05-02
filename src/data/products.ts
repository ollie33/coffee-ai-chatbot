export const products = [
  {
    id: "P001",
    name: "BARISTA PRO X1",
    category: "全自動咖啡機",
    price: 28900,
    originalPrice: 32900,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    badge: "熱銷款",
    rating: 4.8,
    reviews: 342,
    features: ["21 bar義式萃取壓力", "內建磨豆機", "蒸氣棒奶泡", "15秒快速加熱", "觸控螢幕"],
    description: "專業級義式咖啡機，一機掌控從磨豆到拉花的全流程",
    tags: ["全自動", "義式", "磨豆機", "蒸氣棒"],
    url: "https://example.com/products/barista-pro-x1"
  },
  {
    id: "P002",
    name: "DRIP MASTER S3",
    category: "滴漏咖啡機",
    price: 8990,
    originalPrice: 9990,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    badge: "新品",
    rating: 4.6,
    reviews: 128,
    features: ["精準水溫控制 92-96°C", "黃金萃取時間設定", "保溫板設計", "定時預約功能", "10杯容量"],
    description: "符合 SCA 黃金標準的滴漏咖啡機，讓每一杯手沖風味完美重現",
    tags: ["滴漏", "手沖風味", "預約", "SCA標準"],
    url: "https://example.com/products/drip-master-s3"
  },
  {
    id: "P003",
    name: "CAPSULE SLIM C2",
    category: "膠囊咖啡機",
    price: 5490,
    originalPrice: 6490,
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop",
    badge: "超值",
    rating: 4.4,
    reviews: 856,
    features: ["19 bar壓力萃取", "相容多品牌膠囊", "超薄機身15cm寬", "靜音馬達", "水箱可拆洗"],
    description: "極致簡約的廚房美學，兼容市售主流膠囊，三十秒快速出杯",
    tags: ["膠囊", "輕薄", "速成", "多品牌兼容"],
    url: "https://example.com/products/capsule-slim-c2"
  },
  {
    id: "P004",
    name: "COLD BREW TOWER T1",
    category: "冷萃咖啡器",
    price: 12800,
    originalPrice: 14800,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
    badge: "限量",
    rating: 4.9,
    reviews: 67,
    features: ["荷蘭式冷萃滴漏", "玻璃全透明設計", "流速精準調節", "附收納木架", "1.2L容量"],
    description: "展示級冷萃塔，讓時間為你萃取最純淨的咖啡精華",
    tags: ["冷萃", "展示", "荷蘭式", "精品"],
    url: "https://example.com/products/cold-brew-tower-t1"
  },
  {
    id: "P005",
    name: "GRINDER PRO G5",
    category: "磨豆機",
    price: 15900,
    originalPrice: 18000,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    badge: "專業",
    rating: 4.7,
    reviews: 234,
    features: ["64mm平刀刀盤", "40段研磨粗細調整", "低轉速低靜電", "0.1g精準定量", "LCD顯示"],
    description: "專業咖啡師愛用，64mm商用等級刀盤帶來均勻一致的研磨粒徑",
    tags: ["磨豆機", "平刀", "專業", "64mm"],
    url: "https://example.com/products/grinder-pro-g5"
  },
  {
    id: "P006",
    name: "LATTE ART WAND W1",
    category: "奶泡器",
    price: 2490,
    originalPrice: 2990,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    badge: "入門首選",
    rating: 4.3,
    reviews: 1203,
    features: ["自動溫度感測", "冷熱奶泡雙模式", "旋轉螺旋打發", "304不鏽鋼", "USB充電"],
    description: "無線設計、快速打發，在家輕鬆複製咖啡廳層次奶泡",
    tags: ["奶泡器", "無線", "入門", "拉花"],
    url: "https://example.com/products/latte-art-wand-w1"
  }
];

export const faqData = [
  {
    q: "咖啡機如何清潔和保養？",
    a: "每次使用後請清除粉渣並擦拭出水口。建議每月使用專用除垢劑進行除垢，延長機器使用壽命。全自動咖啡機通常有自動清潔程序，跟著螢幕提示操作即可。"
  },
  {
    q: "義式咖啡機和滴漏咖啡機有什麼差別？",
    a: "義式咖啡機使用9-21 bar高壓萃取，出品濃縮義式咖啡(Espresso)，口感濃郁、帶有克麗瑪(Crema)。滴漏咖啡機則以接近沸點的水溫緩慢滴漏萃取，適合喝一整壺、風味層次豐富的美式咖啡。"
  },
  {
    q: "如何選擇適合自己的咖啡機？",
    a: "建議根據以下三點判斷：1) 每天喝幾杯？1-2杯推薦膠囊機，3杯以上考慮全自動；2) 喜歡哪種風格？義式濃郁選 Espresso 機，清爽順口選滴漏機；3) 預算多少？入門1萬以內推薦膠囊機，追求品質3萬以上全自動機更適合。"
  },
  {
    q: "什麼是膠囊咖啡機？可以用哪些膠囊？",
    a: "膠囊咖啡機使用密封好的咖啡膠囊，方便快速無需磨豆。我們的 CAPSULE SLIM C2 兼容 Nespresso Original 規格的主流市售膠囊，包含星巴克、George Clooney 等多個品牌，選擇豐富。"
  },
  {
    q: "購買後多久可以收到商品？",
    a: "一般訂單 1-2 個工作天出貨，全台 7-11、全家、萊爾富等超商門市取件，或選擇宅配到府（3-5 個工作天）。本島離島均可寄送，離島運費另計。"
  },
  {
    q: "商品保固多久？可以退換貨嗎？",
    a: "所有咖啡機提供一年原廠保固，保固期間免費維修。購買後七天內可申請無條件退換貨（商品須保持原包裝完整）。超過七天如有品質問題，請聯繫客服安排送修。"
  },
  {
    q: "磨豆機的研磨粗細要怎麼調整？",
    a: "研磨粗細依沖煮方式而定：濃縮義式用細研磨（刻度1-5），滴漏手沖用中研磨（刻度10-20），法壓壺用粗研磨（刻度25-35）。新鮮磨豆是咖啡品質的關鍵，建議沖煮前再磨豆。"
  },
  {
    q: "如何聯繫真人客服？",
    a: "您可以直接在本對話框點選「轉接專人」按鈕，客服服務時間為工作日中午12:00至晚上8:00。非服務時間可留言，我們將於下一個工作日優先回覆您。"
  },
  {
    q: "是否提供分期付款？",
    a: "支援信用卡零利率分期（3、6、12期），適用 VISA、Mastercard、JCB 等主流卡別。消費滿 3,000 元即可申請分期，結帳時選擇分期選項即可。"
  },
  {
    q: "冷萃咖啡要怎麼製作？需要多長時間？",
    a: "冷萃咖啡使用常溫或冰水長時間浸泡研磨咖啡粉，通常需要 8-24 小時。我們的 COLD BREW TOWER T1 採用荷蘭式冷滴，建議設定 8-12 小時慢速滴漏，完成後冷藏可保存 1-2 週。"
  }
];
