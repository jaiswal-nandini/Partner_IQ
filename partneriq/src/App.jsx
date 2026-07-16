import { useState, useEffect, useRef } from "react";                    
import { motion, AnimatePresence } from "framer-motion";      
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,               
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,      
  ResponsiveContainer, LineChart, Line
} from "recharts";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  green: "#1a3a2a",
  greenMid: "#2d5a3d",
  greenLight: "#4a8c5c",
  cream: "#f5f0e8",
  creamDark: "#e8e0d0",
  gold: "#c9a84c",                                      
  goldLight: "#e8c96a",                                      
  white: "#ffffff",
  dark: "#0f1f16",
  darkCard: "#162a1f",
  text: "#1a3a2a",
  textMuted: "#5a7a6a",
  danger: "#c0392b",
  warn: "#e67e22",
  success: "#27ae60",
};

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
const PARTNER = {
  name: "Nandini",
  id: "P-20847",
  level: 3,
  score: 78,
  streak: 5,
  shiftScore: 84,
  lastLogin: "2 Days Ago",
  avatar: "N",
};

const KNOWLEDGE_DATA = [
  { subject: "Hot Bar", A: 88, fullMark: 100 },
  { subject: "Cold Bar", A: 62, fullMark: 100 },
  { subject: "Shelf Life", A: 71, fullMark: 100 },
  { subject: "Coffee Know.", A: 85, fullMark: 100 },
  { subject: "Tasting", A: 74, fullMark: 100 },
  { subject: "Operations", A: 79, fullMark: 100 },
];

const PROGRESS_DATA = [
  { day: "Mon", score: 62 }, { day: "Tue", score: 68 },     
  { day: "Wed", score: 71 }, { day: "Thu", score: 75 },
  { day: "Fri", score: 78 }, { day: "Sat", score: 76 },
  { day: "Sun", score: 78 },
];

const RECIPES = [
  {
    id: 1, name: "Caffè Latte", category: "hot", icon: "☕",
    marking: "L", shots: "1 (T), 2 (G/V)", syrups: "None (classic)",
    milk: "Steamed whole milk", temp: "140–160°F",
    steps: ["Pull espresso shots into cup", "Steam milk to velvety microfoam", "Pour milk over espresso at an angle", "Top with thin layer of foam"],
    finish: "Light foam cap. Optional latte art.",
    tags: ["espresso", "milk", "classic"]
  },
  {
    id: 2, name: "Cappuccino", category: "hot", icon: "☕",
    marking: "C", shots: "1 (T/S), 2 (G/V)", syrups: "None",
    milk: "Dense, dry foam", temp: "140–160°F",
    steps: ["Pull espresso shots", "Steam milk to thick dry foam (1:1:1 ratio)", "Pour equal parts espresso, steamed milk, foam"],
    finish: "Dust with cocoa powder. Thick foam cap.",
    tags: ["espresso", "foam", "classic"]
  },
  {                                                             
    id: 3, name: "White Chocolate Mocha", category: "hot", icon: "☕",
    marking: "WM", shots: "1 (T), 2 (G/V)", syrups: "White Mocha: 2 (T), 3 (G), 4 (V)",
    milk: "Steamed whole milk", temp: "140–160°F",
    steps: ["Add white mocha sauce to cup", "Pull espresso shots over sauce", "Stir to combine", "Add steamed milk"],
    finish: "Whipped cream topping.",
    tags: ["espresso", "white mocha", "sweet"]
  },
  {
    id: 4, name: "Caramel Macchiato", category: "hot", icon: "☕",
    marking: "CM", shots: "1 (T), 2 (G/V)", syrups: "Vanilla: 2 (T), 3 (G), 4 (V)",
    milk: "Steamed whole milk", temp: "140–160°F",
    steps: ["Add vanilla syrup to cup", "Add milk and steam", "Pour espresso shots on top (macchiato style)", "Drizzle caramel cross-hatch on top"],
    finish: "Caramel drizzle cross-hatch pattern.",
    tags: ["espresso", "vanilla", "caramel", "layered"]
  },
  {
    id: 5, name: "Caffè Mocha", category: "hot", icon: "☕",
    marking: "M", shots: "1 (T), 2 (G/V)", syrups: "Mocha: 2 (T), 3 (G), 4 (V)",
    milk: "Steamed whole milk", temp: "140–160°F",
    steps: ["Add mocha sauce to cup", "Pull espresso shots over sauce", "Stir well", "Add steamed milk"],
    finish: "Whipped cream + mocha drizzle.",                  
    tags: ["espresso", "mocha", "chocolate"]
  },
  {
    id: 6, name: "Flat White", category: "hot", icon: "☕",
    marking: "FW", shots: "Ristretto: 2 (T/S), 3 (G/V)", syrups: "None",
    milk: "Microfoamed whole milk (thin)", temp: "140–160°F",
    steps: ["Pull ristretto shots", "Steam whole milk to silky microfoam", "Pour in a circular motion over shots"],
    finish: "Dot of white foam in center.",
    tags: ["ristretto", "microfoam", "premium"]
  },
  {
    id: 7, name: "Caffè Americano", category: "hot", icon: "☕",
    marking: "A", shots: "1 (T/S), 2 (G/V)", syrups: "None",
    milk: "None (hot water)", temp: "Hot water",
    steps: ["Pull espresso shots into cup", "Add hot water to fill"],
    finish: "Serve as-is. Optional cream on side.",
    tags: ["espresso", "water", "simple"]
  },
  {
    id: 8, name: "Cold Brew", category: "cold", icon: "🧊",
    marking: "CB", shots: "None", syrups: "Optional",
    milk: "Optional", temp: "Cold / Over ice",
    steps: ["Fill cup with ice", "Pour cold brew concentrate to fill line", "Add any requested syrups", "Optional: splash of cold foam"],
    finish: "Cold foam or vanilla sweet cream optional.",
    tags: ["cold brew", "cold", "concentrate"]
  },
  {
    id: 9, name: "Iced Caffè Latte", category: "cold", icon: "🧊",
    marking: "IL", shots: "1 (T), 2 (G/V)", syrups: "None (classic)",
    milk: "Cold milk poured over ice", temp: "Cold / Over ice",
    steps: ["Fill cup with ice", "Add espresso shots", "Pour cold milk to fill"],
    finish: "Serve immediately. Stir straw included.",
    tags: ["espresso", "iced", "milk"]
  },
  {
    id: 10, name: "Iced Americano", category: "cold", icon: "🧊",
    marking: "IA", shots: "1 (T/S), 2 (G/V)", syrups: "None",
    milk: "Cold water", temp: "Cold / Over ice",
    steps: ["Fill cup with ice", "Pull espresso shots over ice", "Add cold water to fill"],
    finish: "Serve immediately.",
    tags: ["espresso", "iced", "water"]
  },
  {
    id: 11, name: "Iced Mocha", category: "cold", icon: "🧊",
    marking: "IM", shots: "1 (T), 2 (G/V)", syrups: "Mocha: 2 (T), 3 (G), 4 (V)",
    milk: "Cold milk over ice", temp: "Cold / Over ice",
    steps: ["Add mocha sauce to cup", "Add ice", "Pull espresso over sauce and ice", "Add cold milk to fill"],
    finish: "Whipped cream + mocha drizzle.",
    tags: ["espresso", "iced", "mocha", "chocolate"]
  },
  {
    id: 12, name: "Frappuccino® Blended", category: "cold", icon: "🥤",
    marking: "F", shots: "Optional", syrups: "Frappuccino syrup base",
    milk: "Whole milk (default)", temp: "Blended / Frozen",
    steps: ["Add milk to cold cup line", "Add Frappuccino base syrup", "Add espresso if required", "Add flavoring syrups/sauces", "Add ice to top line", "Blend until smooth"],
    finish: "Whipped cream + drizzle per recipe.",
    tags: ["blended", "frozen", "frappuccino"]
  },
];

const SHELF_LIFE = [
  { name: "Whipped Topping", supplier: "Kerry", primary: "9 months", storage: "Refrigerated 35–45°F", open: "3 days", openStorage: "Refrigerated, covered" },
  { name: "Mocha Sauce", supplier: "Fontana", primary: "12 months", storage: "Ambient, cool & dry", open: "30 days", openStorage: "Ambient or refrigerated" },
  { name: "Vanilla Syrup", supplier: "Fontana", primary: "24 months", storage: "Ambient, cool & dry", open: "30 days", openStorage: "Ambient, sealed" },
  { name: "Caramel Sauce", supplier: "Fontana", primary: "12 months", storage: "Ambient, cool & dry", open: "30 days", openStorage: "Ambient or refrigerated" },
  { name: "White Mocha Sauce", supplier: "Fontana", primary: "12 months", storage: "Ambient, cool & dry", open: "30 days", openStorage: "Ambient or refrigerated" },
  { name: "Pumpkin Sauce", supplier: "Fontana", primary: "12 months", storage: "Ambient, cool & dry", open: "7 days", openStorage: "Refrigerated, covered" },
  { name: "Condensed Milk", supplier: "Various", primary: "12 months", storage: "Ambient, sealed", open: "3 days", openStorage: "Refrigerated, covered" },
  { name: "Coffee Frappuccino Mix", supplier: "Internal", primary: "7 days (made fresh)", storage: "Refrigerated", open: "N/A", openStorage: "Use within production date" },
  { name: "Cream Frappuccino Mix", supplier: "Internal", primary: "7 days (made fresh)", storage: "Refrigerated", open: "N/A", openStorage: "Use within production date" },
  { name: "Cold Brew Concentrate", supplier: "Internal", primary: "8 days (made fresh)", storage: "Refrigerated 35–40°F", open: "N/A", openStorage: "Keep sealed, refrigerated" },
  { name: "Vanilla Sweet Cream", supplier: "Internal", primary: "3 days", storage: "Refrigerated", open: "N/A", openStorage: "Use within 3 days of prep" },
  { name: "Classic Syrup", supplier: "Fontana", primary: "24 months", storage: "Ambient, cool & dry", open: "30 days", openStorage: "Ambient, sealed" },
  { name: "Hazelnut Syrup", supplier: "Fontana", primary: "24 months", storage: "Ambient, cool & dry", open: "30 days", openStorage: "Ambient, sealed" },
  { name: "Brown Sugar Syrup", supplier: "Fontana", primary: "14 days", storage: "Refrigerated", open: "14 days", openStorage: "Refrigerated" },
];

const COFFEES = [
  { name: "Sumatra", region: "Asia/Pacific", process: "Wet-hulled (Giling Basah)", notes: "Earthy, herbal, full-bodied, low acidity", roast: "Dark", emoji: "🌿" },
  { name: "Kenya", region: "Africa", process: "Washed", notes: "Bold, berry, blackcurrant, bright acidity", roast: "Medium", emoji: "🫐" },
  { name: "Pike Place® Roast", region: "Latin America blend", process: "Various", notes: "Smooth, balanced, rich cocoa, toasted nut", roast: "Medium", emoji: "⚖️" },
  { name: "Nariño", region: "Colombia", process: "Washed", notes: "Balanced, caramel sweetness, bright citrus", roast: "Medium", emoji: "🍋" },
  { name: "Caffè Verona®", region: "Blend (Latin/Italian)", process: "Various", notes: "Dark cocoa, caramelized sugar, subtle smokiness", roast: "Dark", emoji: "🍫" },
  { name: "Komodo Dragon Blend®", region: "Asia/Pacific blend", process: "Various", notes: "Full-bodied, earthy, herbal complexity", roast: "Dark", emoji: "🦎" },
  { name: "Ethiopia", region: "Africa", process: "Natural/Washed", notes: "Jasmine floral, citrus, blueberry, tea-like", roast: "Light-Medium", emoji: "🌸" },
  { name: "Casi Cielo®", region: "Guatemala", process: "Washed", notes: "Bright, lemon zest, sweet apple, crisp finish", roast: "Medium", emoji: "✨" },
];

const QUIZ_QUESTIONS = [
  { q: "How many pumps of vanilla syrup go in a Grande Caramel Macchiato?", options: ["2", "3", "4", "5"], answer: 1, category: "Recipes", explanation: "Grande gets 3 pumps of vanilla syrup in a Caramel Macchiato." },
  { q: "What is the shelf life of opened Whipped Topping?", options: ["1 day", "3 days", "7 days", "14 days"], answer: 1, category: "Shelf Life", explanation: "Opened whipped topping lasts 3 days refrigerated and covered." },
  { q: "Which coffee region is Sumatra from?", options: ["Africa", "Latin America", "Asia/Pacific", "Arabia"], answer: 2, category: "Coffee Knowledge", explanation: "Sumatra is from the Asia/Pacific coffee growing region." },
  { q: "What defines a Flat White vs a Latte?", options: ["Different cup size", "Ristretto shots + less microfoam", "Different syrup", "Different temperature"], answer: 1, category: "Recipes", explanation: "A Flat White uses ristretto shots and has less microfoam than a latte." },
  { q: "What is the 'macchiato' style in Caramel Macchiato?", options: ["Caramel first", "Milk first, espresso poured on top", "Espresso first, milk added", "Blended together"], answer: 1, category: "Recipes", explanation: "Macchiato means 'marked' — milk goes first, espresso is poured on top to 'mark' it." },
  { q: "How long can Cold Brew Concentrate be stored?", options: ["3 days", "5 days", "8 days", "14 days"], answer: 2, category: "Shelf Life", explanation: "Cold Brew Concentrate has an 8-day shelf life when refrigerated." },
];

const TASTING_METHODS = [
  {
    method: "French Press", icon: "🫙",
    grind: "Coarse", ratio: "1:15 (coffee:water)", quantity: "30g per 450ml",
    steps: ["Heat water to 200°F (just off boil)", "Add coarse ground coffee to press", "Pour water, saturate all grounds", "Place lid on (don't press yet)", "Steep for 4 minutes", "Press plunger slowly and steadily", "Pour immediately to avoid over-extraction"],
    notes: "Full-bodied, oils intact, rich texture",
    pairings: ["Dark chocolate", "Cheese platter", "Almond biscotti"]
  },
  {
    method: "Pour Over", icon: "⬇️",
    grind: "Medium-fine", ratio: "1:16 (coffee:water)", quantity: "22g per 350ml",
    steps: ["Place filter, rinse with hot water", "Add ground coffee, create well in center", "Bloom: pour 44ml, wait 30 seconds", "Pour in slow circles, starting center", "Maintain water level with steady pours", "Total brew time: 3–4 minutes"],
    notes: "Clean, bright, delicate flavors highlighted",
    pairings: ["Fresh fruit", "Light pastries", "Citrus tart"]
  },
  {
    method: "Chemex", icon: "🧪",
    grind: "Medium-coarse", ratio: "1:16", quantity: "42g per 700ml",
    steps: ["Insert Chemex filter, rinse thoroughly", "Add ground coffee to filter", "Bloom pour: 80ml, wait 45 seconds", "Begin slow continuous pour in spirals", "Pour in stages, keeping drawdown even", "Total brew time: 5–6 minutes"],
    notes: "Exceptionally clean, sweet, tea-like clarity",     
    pairings: ["Honey cake", "Vanilla shortbread", "Stone fruit"]
  },
  {
    method: "Siphon", icon: "⚗️",
    grind: "Medium", ratio: "1:14", quantity: "25g per 350ml",
    steps: ["Add water to bottom vessel", "Heat until water rises to top vessel", "Add coffee to top vessel", "Stir gently to immerse all grounds", "Remove heat after 1.5 minutes", "Coffee draws back through filter", "Serve immediately from bottom vessel"],
    notes: "Theatrical, clean, exceptionally sweet and aromatic",
    pairings: ["Dark chocolate truffles", "Cardamom cookies", "Mango slices"]
  },
];

// ─── GEMINI API CALL ──────────────────────────────────────────────────────────
async function askGemini(prompt) {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const q = prompt.toLowerCase();

  if (q.includes("latte")) {
    return "A Latte is made with espresso and steamed milk. Grande size contains 2 espresso shots and a light layer of foam.";
  }

  if (q.includes("shelf life")) {
    return "Shelf Life module helps partners quickly find product expiry and storage information.";
  }
                                                                
  if (q.includes("coffee")) {
    return "Coffee knowledge includes origin, roast profile, processing method, acidity, body, and tasting notes.";
  }

  if (q.includes("study plan")) {
    return "Today's study plan: Learn all Frappuccino recipes, review syrup pumps, and complete the Level 2 quiz.";
  }

  return "PartnerIQ AI recommends focusing on your weakest area today. Complete your learning module and test your knowledge to improve your score.";
}

// ─── MICRO COMPONENTS ─────────────────────────────────────────────────────────
const Badge = ({ children, color = "gold" }) => {
  const colors = {
    gold: "bg-amber-100 text-amber-800 border border-amber-300",
    green: "bg-emerald-100 text-emerald-800 border border-emerald-300",
    red: "bg-red-100 text-red-700 border border-red-300",
    blue: "bg-blue-100 text-blue-700 border border-blue-300",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[color]}`}>
      {children}
    </span>
  );
};

const Card = ({ children, className = "", onClick, hover = true }) => (
  <motion.div
    whileHover={hover ? { y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" } : {}}
    onClick={onClick}
    className={`bg-white rounded-2xl border border-stone-200 shadow-sm ${onClick ? "cursor-pointer" : ""} ${className}`}
  >
    {children}
  </motion.div>
);

const ProgressBar = ({ value, color = "#4a8c5c", label, showPct = true }) => (
  <div className="w-full">
    {(label || showPct) && (
      <div className="flex justify-between text-xs text-stone-500 mb-1">
        <span>{label}</span>
        {showPct && <span className="font-semibold" style={{ color }}>{value}%</span>}
      </div>
    )}
    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
      />
    </div>
  </div>
);

const AITyping = ({ text, onDone }) => {
  const [displayed, setDisplayed] = useState("");
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx < text.length) {
      const t = setTimeout(() => {
        setDisplayed(prev => prev + text[idx]);
        setIdx(i => i + 1);
      }, 12);
      return () => clearTimeout(t);
    } else {
      onDone?.();
    }
  }, [idx, text]);
  return <span>{displayed}<span className="animate-pulse">▋</span></span>;
};

// ─── AI CHAT BOX ─────────────────────────────────────────────────────────────
const AIChatBox = ({ placeholder, systemContext, suggestions = [], className = "" }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (q) => {
    const question = q || input.trim();
    if (!question) return;
    setMessages(m => [...m, { role: "user", content: question }]);
    setInput("");
    setLoading(true);
    const reply = await askGemini(question, systemContext);
    setMessages(m => [...m, { role: "ai", content: reply }]);
    setLoading(false);
  };

  return (
    <div className={'flex flex-col gap-3 ' + className}>
      {suggestions.length > 0 && messages.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => send(s)}
              className="text-xs bg-stone-50 border border-stone-200 text-stone-600 px-3 py-1.5 rounded-full hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all">
              {s}
            </button>
          ))}
        </div>
      )}
      {messages.length > 0 && (
        <div className="max-h-72 overflow-y-auto flex flex-col gap-3 pr-1">
          {messages.map((m, i) => (
            <div key={i} className={'flex ' + (m.role === "user" ? "justify-end" : "justify-start")}

            >
              {m.role === "ai" && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5 flex-shrink-0"
                  style={{ background: C.greenMid, color: C.cream }}>AI</div>
              )}
              <div className={'max-w-[85%] text-sm rounded-2xl px-4 py-2.5 leading-relaxed ' + (m.role === "user"
                ? "text-white rounded-tr-sm" : "bg-stone-50 border border-stone-200 text-stone-700 rounded-tl-sm")}
                style={m.role === "user" ? { background: C.greenMid } : {}}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                style={{ background: C.greenMid, color: C.cream }}>AI</div>
              <div className="bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-stone-400"
                    animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder={placeholder}
          className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent placeholder-stone-400"
        />
        <button onClick={() => send()}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-white"
          style={{ background: C.greenMid }}>
          Ask
        </button>
      </div>
    </div>
  );
};

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [id, setId] = useState("P-20847");
  const [pw, setPw] = useState("partner123");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = () => {
    if (!id || !pw) { setErr("Please enter your Partner ID and password."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  return (
    <div className="min-h-screen flex" style={{ background: C.dark }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${C.green} 0%, ${C.greenMid} 100%)` }}>
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="absolute rounded-full border"
              style={{
                width: `${120 + i * 80}px`, 
                height: `${120 + i * 80}px`,
                borderColor: C.gold, 
                opacity: 0.3 - i * 0.04,
                top: `${10 + i * 8}%`, 
                left: `${-10 + i * 5}%`
              }} />
          ))}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: C.gold }}>☕</div>
            <span className="text-2xl font-bold tracking-tight" style={{ color: C.cream, fontFamily: "'Georgia', serif" }}>PartnerIQ</span>
          </div>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold leading-tight" style={{ color: C.cream, fontFamily: "'Georgia', serif" }}>
            Your knowledge.<br />Your craft.<br />
            <span style={{ color: C.goldLight }}>Your edge.</span>
          </h1>
          <p className="text-lg opacity-80" style={{ color: C.creamDark }}>
            "One Partner. One Cup.<br />One Neighborhood at a Time."
          </p>
          <div className="space-y-3">
            {["AI-powered learning coach", "Beverage recipe mastery", "Shift readiness scoring", "Coffee tasting studio"].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{ background: C.gold, color: C.dark }}>✓</div>
                <span className="text-sm" style={{ color: C.creamDark }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-3 opacity-50">
          <div className="w-8 h-0.5 rounded" style={{ background: C.gold }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: C.creamDark }}>Partner Learning Platform</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: C.gold }}>☕</div>
              <span className="text-xl font-bold" style={{ color: C.cream, fontFamily: "'Georgia', serif" }}>PartnerIQ</span>
            </div>
            <p className="text-sm opacity-60" style={{ color: C.creamDark }}>One Partner. One Cup. One Neighborhood at a Time.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: C.cream }}>Welcome back</h2>
            <p className="text-sm" style={{ color: "#6b8a7a" }}>Sign in to continue your learning journey</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: "#6b8a7a" }}>Partner ID</label>
              <input value={id} onChange={e => setId(e.target.value)}
                placeholder="e.g. P-20847"
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                style={{ background: "#1a2e22", border: "1px solid #2d4a38", color: C.cream, focusRing: C.gold }} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: "#6b8a7a" }}>Password</label>
              <input value={pw} onChange={e => setPw(e.target.value)} type="password"
                placeholder="••••••••"
                onKeyDown={e => e.key === "Enter" && handle()}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                style={{ background: "#1a2e22", border: "1px solid #2d4a38", color: C.cream }} />
            </div>
            {err && <p className="text-xs text-red-400">{err}</p>}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handle} disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: loading ? "#2d5a3d" : C.gold, color: loading ? C.cream : C.dark }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </motion.button>
          </div>

          <p className="text-center text-xs" style={{ color: "#4a6a5a" }}>
            Demo: use any Partner ID + password
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "recipes", label: "Recipes", icon: "📋" },
  { id: "shelflife", label: "Shelf Life", icon: "🗓" },
  { id: "coffee", label: "Coffee Knowledge", icon: "🌍" },
  { id: "tasting", label: "Coffee Tasting", icon: "🍵" },
  { id: "quiz", label: "Knowledge Test", icon: "🏆" },
  { id: "ai", label: "Partner AI", icon: "🤖" },
  { id: "profile", label: "Profile", icon: "👤" },
];

const Sidebar = ({ active, setActive, collapsed, setCollapsed }) => (
  <motion.div
    animate={{ width: collapsed ? 64 : 240 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="flex-shrink-0 h-screen sticky top-0 flex flex-col border-r border-stone-200 overflow-hidden"
    style={{ background: C.white }}>
    {/* Logo */}
    <div className="flex items-center gap-3 p-4 border-b border-stone-100" style={{ minHeight: 64 }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
        style={{ background: C.gold, color: C.dark }}>☕</div>
      <AnimatePresence>
        {!collapsed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="font-bold text-base whitespace-nowrap" style={{ color: C.green, fontFamily: "'Georgia', serif" }}>
            PartnerIQ
          </motion.span>
        )}
      </AnimatePresence>
      <button onClick={() => setCollapsed(!collapsed)}
        className="ml-auto text-stone-400 hover:text-stone-600 transition-colors text-sm flex-shrink-0">
        {collapsed ? "▶" : "◀"}
      </button>
    </div>

    {/* Nav */}
    <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
      {NAV.map(item => (
        <button key={item.id} onClick={() => setActive(item.id)}
          className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ' + (active === item.id ? "text-white" : "text-stone-500 hover:bg-stone-50 hover:text-stone-700")}
          style={active === item.id ? { background: C.greenMid } : {}}>
          <span className="text-base flex-shrink-0 w-5 text-center">{item.icon}</span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-sm font-medium whitespace-nowrap">{item.label}</motion.span>
            )}
          </AnimatePresence>
        </button>
      ))}
    </nav>

    {/* Partner chip */}
    <div className="p-3 border-t border-stone-100">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: C.gold, color: C.dark }}>{PARTNER.avatar}</div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-xs font-semibold leading-tight" style={{ color: C.green }}>{PARTNER.name}</p>
              <p className="text-xs text-stone-400">Level {PARTNER.level}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </motion.div>
);

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ setPage }) => {
  const [dailyAnswer, setDailyAnswer] = useState("");
  const [dailyFeedback, setDailyFeedback] = useState(null);

  const dailyQ = QUIZ_QUESTIONS[Math.floor(Date.now() / 86400000) % QUIZ_QUESTIONS.length];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: C.green, fontFamily: "'Georgia', serif" }}>
            Hi, {PARTNER.name} 👋
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">Ready to brew some knowledge today?</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          <span className="text-lg">🔥</span>
          <div>
            <p className="text-xs text-amber-600 font-semibold">{PARTNER.streak} Day Streak</p>
            <p className="text-xs text-amber-500">Keep it up!</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: "Knowledge Score", 
            value: `${PARTNER.score}%`, 
            icon: "📊", 
            color: C.greenMid, 
            sub: "↑ 3% this week" 
          },
          { 
            label: "Shift Ready Score", 
            value: `${PARTNER.shiftScore}%`, 
            icon: "⚡", 
            color: C.gold, 
            sub: "Hot Bar & POS ready" },
          { 
            label: "Partner Level", 
            value: `Level ${PARTNER.level}`, 
            icon: "🏅", 
            color: "#7c3aed", 
            sub: "2 levels remaining" },
          { 
            label: "Last Login", 
            value: `${PARTNER.lastLogin}`, 
            icon: "🕐", 
            color: "#0891b2", 
            sub: PARTNER.id },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}>
            <Card className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                  style={{ background: s.color + "18" }}>{s.icon}</div>
                <span className="text-xs text-stone-400">{s.sub}</span>
              </div>
              <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-stone-500 mt-0.5">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Plan */}
        <Card className="p-5 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: C.greenMid, color: C.cream }}>📚</div>
            <h2 className="font-bold text-sm" style={{ color: C.green }}>Today's Learning Plan</h2>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">⏱ 10 min</span>
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5">🎯 Core Hot Beverages</span>
          </div>
          <div className="space-y-2 mb-4">
            {["Latte", "Cappuccino", "White Mocha", "Caramel Macchiato"].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-stone-600">
                <div className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                  style={{ borderColor: i < 2 ? C.greenMid : C.gold, background: i < 2 ? C.greenMid : "transparent" }}>
                  {i < 2 && <span className="text-white text-xs flex items-center justify-center h-full">✓</span>}
                </div>
                <span className={i < 2 ? "line-through text-stone-400" : ""}>{t}</span>
              </div>
            ))}
          </div>
          <ProgressBar value={50} color={C.greenMid} label="Progress" />
          <button onClick={() => setPage("recipes")}
            className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: C.greenMid }}>
            Continue Learning →
          </button>
        </Card>

        {/* Shift Ready */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: C.gold, color: C.dark }}>⚡</div>
            <h2 className="font-bold text-sm" style={{ color: C.green }}>Shift Ready Score</h2>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke={C.gold} strokeWidth="3"
                  strokeDasharray={`${PARTNER.shiftScore} ${100 - PARTNER.shiftScore}`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold" style={{ color: C.gold }}>{PARTNER.shiftScore}%</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {[["Hot Bar", true], ["POS", true], ["Cold Bar", false], ["Shelf Life", false]].map(([label, ready]) => (
                <div key={label} className="flex items-center gap-2 text-sm">
                  <span>{ready ? "✓" : "⚠"}</span>
                  <span className={ready ? "text-emerald-700 font-medium" : "text-amber-600"}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <ProgressBar value={88} color={C.greenMid} label="Hot Bar" />
            <ProgressBar value={62} color={C.warn} label="Cold Bar" />
            <ProgressBar value={71} color="#0891b2" label="Shelf Life" />
          </div>
        </Card>

        {/* Quick Ask */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "#7c3aed20", color: "#7c3aed" }}>🤖</div>
            <h2 className="font-bold text-sm" style={{ color: C.green }}>Quick Ask Partner AI</h2>
          </div>
          <AIChatBox
            placeholder="Ask anything about recipes, shelf life, coffee..."
            systemContext="You are PartnerIQ, an AI assistant for coffee shop partners. You help with beverage recipes (pumps, shots, build steps), shelf life information, coffee origins and knowledge, tasting notes, and operational guidance. Be concise, accurate, and friendly. Use bullet points for recipes."
            suggestions={[
              "How many pumps in a Grande White Mocha?",
              "Shelf life of whipped cream?",
              "What is a Flat White?",
              "Tell me about Sumatra coffee"
            ]}
          />
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Knowledge Breakdown Chart */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-ce
[04-06-2026 02:59] Nandini: nter justify-between mb-4">
            <h2 className="font-bold text-sm" style={{ color: C.green }}>Knowledge Breakdown</h2>
            <Badge color="green">This Week</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={KNOWLEDGE_DATA}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#6b7280" }} />
                <Radar name="Score" dataKey="A" stroke={C.greenMid} fill={C.greenMid} fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="space-y-2.5">
              {KNOWLEDGE_DATA.map(d => (
                <div key={d.subject}>
                  <div className="flex justify-between text-xs text-stone-500 mb-1">
                    <span>{d.subject}</span><span className="font-semibold" style={{ color: C.greenMid }}>{d.A}%</span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${d.A}%`, background: C.greenMid }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Daily Challenge */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: "#fee2e2" }}>🎯</div>
            <h2 className="font-bold text-sm" style={{ color: C.green }}>Daily Challenge</h2>
            <Badge color="red">Today</Badge>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed mb-4">{dailyQ.q}</p>
          <div className="space-y-2 mb-4">
            {dailyQ.options.map((opt, i) => (
              <button key={i} onClick={() => {
                if (dailyFeedback) return;
                setDailyAnswer(i);
                setDailyFeedback(i === dailyQ.answer);
              }}
                className={'w-full text-left text-sm px-3 py-2.5 rounded-xl border transition-all ' + (
                  dailyFeedback !== null
                    ? i === dailyQ.answer ? "border-emerald-400 bg-emerald-50 text-emerald-700 font-medium"
                      : dailyAnswer === i ? "border-red-300 bg-red-50 text-red-600" : "border-stone-200 text-stone-400"
                    : dailyAnswer === i ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-stone-200 hover:border-stone-300 text-stone-600"
                  )}>
                <span className="font-mono text-xs mr-2">{String.fromCharCode(65 + i)}</span>{opt}
              </button>
            ))}
          </div>
          <AnimatePresence>
            {dailyFeedback !== null && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={'text-xs rounded-xl p-3 ' + (dailyFeedback ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200")}>
                {dailyFeedback ? "🎉 Correct! " : "❌ Not quite. "}{dailyQ.explanation}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* Progress & Adaptive Recs */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h2 className="font-bold text-sm mb-4" style={{ color: C.green }}>Weekly Progress</h2>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={PROGRESS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis domain={[50, 90]} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="score" stroke={C.greenMid} strokeWidth={2.5} dot={{ fill: C.greenMid, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h2 className="font-bold text-sm mb-4" style={{ color: C.green }}>AI Recommendations</h2>
          <div className="space-y-2.5">
            {[
              { area: "Cold Bar Practice", reason: "62% score — needs work", urgent: true, icon: "🧊" },
              { area: "Frappuccino Recipes", reason: "Not practiced this week", urgent: false, icon: "🥤" },
              { area: "Shelf Life Essentials", reason: "71% — improve before shift", urgent: false, icon: "🗓" },
              { area: "Coffee Origins Review", reason: "Tasting session upcoming", urgent: false, icon: "🌍" },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:bg-stone-50"
                style={{ borderColor: r.urgent ? "#fca5a5" : "#e5e7eb" }}>
                <span className="text-base">{r.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-700">{r.area}</p>
                  <p className="text-xs text-stone-400">{r.reason}</p>
                </div>
                {r.urgent && <Badge color="red">Priority</Badge>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── RECIPES MODULE ───────────────────────────────────────────────────────────
const Recipes = () => {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = RECIPES.filter(r =>
    (cat === "all" || r.category === cat) &&
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: C.green, fontFamily: "'Georgia', serif" }}>Recipes</h1>
        <div className="flex gap-2">
          {["all", "hot", "cold"].map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={'px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ' + (cat === c ? "text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200")}
              style={cat === c ? { background: C.greenMid } : {}}>
              {c === "all" ? "All" : c === "hot" ? "☕ Hot" : "🧊 Cold"}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search recipes..."
          className="w-full px-4 py-3 pl-10 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
        <span className="absolute left-3.5 top-3.5 text-stone-400 text-sm">🔍</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(r => (
          <Card key={r.id} className="p-4" onClick={() => setSelected(r)}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: r.category === "hot" ? "#fef3c7" : "#e0f2fe" }}>
                {r.icon}
              </div>
              <div>
                <h3 className="font-bold text-sm" style={{ color: C.green }}>{r.name}</h3>
                <p className="text-xs text-stone-400">Cup mark: <span className="font-mono font-bold">{r.marking}</span></p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-stone-500">
              <p><span className="font-medium">Shots:</span> {r.shots}</p>
              <p><span className="font-medium">Syrups:</span> {r.syrups}</p>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {r.tags.slice(0, 3).map(t => <Badge key={t} color="green">{t}</Badge>)}
            </div>
            </Card>
        ))}
      </div>

      {/* Recipe AI */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: "#7c3aed20", color: "#7c3aed" }}>🤖</div>
          <h2 className="font-bold text-sm" style={{ color: C.green }}>AI Recipe Assistant</h2>
        </div>
        <AIChatBox
          placeholder="How do I make a Grande White Mocha?"
          systemContext="You are a Starbucks recipe expert. When asked about beverages, provide: exact pump counts by size (Tall/Grande/Venti), shot counts, milk type, build sequence (add sauce → shots → milk), and finishing touches. Be precise and concise. Format with clear sections."
          suggestions={["How do I make a Grande Caramel Macchiato?", "What's the build for a Venti Cold Brew?", "How many pumps in a Tall Flat White?"]}
        />
      </Card>

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: selected.category === "hot" ? "#fef3c7" : "#e0f2fe" }}>
                    {selected.icon}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg" style={{ color: C.green }}>{selected.name}</h2>
                    <p className="text-xs text-stone-400">Cup Mark: <span className="font-mono font-bold">{selected.marking}</span></p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-stone-400 hover:text-stone-600 text-xl">×</button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {[["Shots", selected.shots], ["Syrups", selected.syrups], ["Milk", selected.milk], ["Temperature", selected.temp]].map(([k, v]) => (
                  <div key={k} className="bg-stone-50 rounded-xl p-3">
                    <p className="text-xs text-stone-400 mb-1">{k}</p>
                    <p className="text-sm font-medium text-stone-700">{v}</p>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <h3 className="font-bold text-sm mb-2" style={{ color: C.green }}>Build Sequence</h3>
                <ol className="space-y-2">
                  {selected.steps.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm text-stone-600">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: C.greenMid, color: "white" }}>{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs font-bold text-amber-700 mb-1">✨ Finish & Connect</p>
                <p className="text-sm text-amber-600">{selected.finish}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── SHELF LIFE MODULE ────────────────────────────────────────────────────────
const ShelfLife = () => {
  const [search, setSearch] = useState("");
  const filtered = SHELF_LIFE.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: C.green, fontFamily: "'Georgia', serif" }}>Shelf Life</h1>

      <div className="relative">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-3 pl-10 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
        <span className="absolute left-3.5 top-3.5 text-stone-400 text-sm">🔍</span>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: C.green }}>
                {["Product", "Supplier", "Primary Shelf Life", "Storage", "Opened Life", "Open Storage"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold tracking-wide" style={{ color: C.cream }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={i} className={'border-b border-stone-100 hover:bg-stone-50 transition-colors ' + (i % 2 === 0 ? "" : "bg-stone-50/40")}>
                  <td className="px-4 py-3 font-medium text-stone-700">{s.name}</td>
                  <td className="px-4 py-3 text-stone-500">{s.supplier}</td>
                  <td className="px-4 py-3"><Badge color="green">{s.primary}</Badge></td>
                  <td className="px-4 py-3 text-stone-500 text-xs">{s.storage}</td>
                  <td className="px-4 py-3"><Badge color="gold">{s.open}</Badge></td>
                  <td className="px-4 py-3 text-stone-500 text-xs">{s.openStorage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: "#7c3aed20", color: "#7c3aed" }}>🤖</div>
          <h2 className="font-bold text-sm" style={{ color: C.green }}>AI Shelf Life Assistant</h2>
        </div>
        <AIChatBox
          placeholder="What is the shelf life of whipped topping?"
          systemContext="You are a food safety expert for a coffee shop. Answer questions about product shelf life clearly and simply. Include: unopened shelf life, opened shelf life, storage conditions, and any important safety notes. Be direct and practical."
          suggestions={["Shelf life of whipped cream?", "How long does cold brew last?", "When does vanilla sweet cream expire?"]}
        />
      </Card>
    </div>
  );
};

// ─── COFFEE KNOWLEDGE ─────────────────────────────────────────────────────────
const CoffeeKnowledge = () => {
  const [selected, setSelected] = useState(null);
  const [aiContent, setAiContent] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const learnMore = async (coffee) => {
    setSelected(coffee);
    setAiContent("");
    setAiLoading(true);
    const reply = await askGemini(
      `Tell me about ${coffee.name} coffee in 3-4 sentences. Cover: origin region, processing method, flavor profile, and what makes it unique. Be engaging and educational, suitable for barista training.`
    );
    setAiContent(reply);
    setAiLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: C.green, fontFamily: "'Georgia', serif" }}>Coffee Knowledge</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-4">
            {COFFEES.map((c, i) => (
              <Card key={i} className="p-4" onClick={() => learnMore(c)}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: "#f5f0e8" }}>{c.emoji}</div>
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: C.green }}>{c.name}</h3>
                    <p className="text-xs text-stone-400">{c.region}</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-stone-500 mb-3">
                  <p><span className="font-medium">Process:</span> {c.process}</p>
                  <p><span className="font-medium">Roast:</span> {c.roast}</p>
                  <p className="italic text-stone-400">"{c.notes}"</p>
                </div>
                <button className="text-xs font-semibold transition-all hover:opacity-80"
                  style={{ color: C.greenMid }}>
                  Learn More with AI →
                </button>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="font-bold text-sm mb-3" style={{ color: C.green }}>Coffee Journey</h2>
            <div className="space-y-3">
              {[
                { step: "Origin", desc: "Bean is grown at high altitude", icon: "🌱" },
                { step: "Harvest", desc: "Hand-picked at peak ripeness", icon: "🫒" },
                { step: "Processing", desc: "Washed, natural, or wet-hulled", icon: "💧" },
                { step: "Roasting", desc: "Light to dark — flavor transformation", icon: "🔥" },
                { step: "Grinding", desc: "Grind size affects extraction", icon: "⚙️" },
                { step: "Brewing", desc: "Water + coffee = magic", icon: "☕" },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 bg-stone-50">{s.icon}</div>
                  <div>
                    <p className="text-xs font-semibold text-stone-700">{s.step}</p>
                    <p className="text-xs text-stone-400">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {selected && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{selected.emoji}</span>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: C.green }}>{selected.name}</h3>
                  <p className="text-xs text-stone-400">{selected.region}</p>
                </div>
              </div>
              <div className="text-sm text-stone-600 leading-relaxed">
                {aiLoading ? (
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-stone-400"
                        animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                    ))}
                  </div>
                ) : aiContent}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── COFFEE TASTING ───────────────────────────────────────────────────────────
const CoffeeTasting = () => {
  const [selected, setSelected] = useState(TASTING_METHODS[0]);
  const [scriptInput, setScriptInput] = useState({ coffee: "", method: "French Press", pairing: "" });
  const [script, setScript] = useState("");
  const [scriptLoading, setScriptLoading] = useState(false);

  const generateScript = async () => {
    if (!scriptInput.coffee) return;
    setScriptLoading(true);
    setScript("");
    const reply = await askGemini(
      `Generate a professional coffee tasting presentation script for a Starbucks barista. Coffee: ${scriptInput.coffee}, Brewing method: ${scriptInput.method}, Food pairing: ${scriptInput.pairing || "none"}. Include: welcome, coffee origin story, brewing process narration,sensory experience guide (aroma, flavor, finish), and food pairing explanation. Keep it warm, educational, and engaging. About 200 words.`
    );
    setScript(reply);
    setScriptLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: C.green, fontFamily: "'Georgia', serif" }}>Coffee Tasting Studio</h1>

      <div className="flex gap-2 flex-wrap">
        {TASTING_METHODS.map(m => (
          <button key={m.method} onClick={() => setSelected(m)}
            className={'px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ' + (selected.method === m.method ? "text-white" : "bg-stone-100 text-stone-500 hover:bg-stone-200")}
            style={selected.method === m.method ? { background: C.greenMid } : {}}>
            {m.icon} {m.method}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{selected.icon}</span>
            <h2 className="font-bold" style={{ color: C.green }}>{selected.method}</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[["Grind", selected.grind], ["Ratio", selected.ratio], ["Quantity", selected.quantity]].map(([k, v]) => (
              <div key={k} className="bg-stone-50 rounded-xl p-3 text-center">
                <p className="text-xs text-stone-400 mb-1">{k}</p>
                <p className="text-xs font-bold text-stone-700">{v}</p>
              </div>
            ))}
          </div>
          <h3 className="font-bold text-sm mb-3" style={{ color: C.green }}>Brewing Steps</h3>
          <ol className="space-y-2 mb-4">
            {selected.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-stone-600">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: C.gold, color: C.dark }}>{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
            <p className="text-xs font-bold text-amber-700 mb-1">🎶 Tasting Notes</p>
            <p className="text-sm text-amber-600">{selected.notes}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <p className="text-xs font-bold text-emerald-700 mb-1">🍽 Food Pairings</p>
            <p className="text-sm text-emerald-600">{selected.pairings.join(" · ")}</p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "#7c3aed20", color: "#7c3aed" }}>✍️</div>
            <h2 className="font-bold text-sm" style={{ color: C.green }}>Tasting Script Generator</h2>
          </div>
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1">Coffee Name</label>
              <input value={scriptInput.coffee} onChange={e => setScriptInput({ ...scriptInput, coffee: e.target.value })}
                placeholder="e.g. Sumatra, Kenya, Pike Place"
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1">Brewing Method</label>
              <select value={scriptInput.method} onChange={e => setScriptInput({ ...scriptInput, method: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-300">
                {TASTING_METHODS.map(m => <option key={m.method}>{m.method}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1">Food Pairing (optional)</label>
              <input value={scriptInput.pairing} onChange={e => setScriptInput({ ...scriptInput, pairing: e.target.value })}
                placeholder="e.g. dark chocolate, almond biscotti"
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
            </div>
            <button onClick={generateScript} disabled={!scriptInput.coffee || scriptLoading}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: C.greenMid }}>
              {scriptLoading ? "Generating..." : "✨ Generate Tasting Script"}
            </button>
          </div>
          {script && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
              <p className="text-xs font-bold text-stone-500 mb-2 uppercase tracking-wide">Generated Script</p>
              <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">{script}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

// ─── KNOWLEDGE TEST ───────────────────────────────────────────────────────────
const KnowledgeTest = () => {
  const [level, setLevel] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  const levelQuestions = QUIZ_QUESTIONS.slice(0, 5);
  const current = levelQuestions[qIdx];

  const pick = (i) => {
    if (selected !== null) return;
    setSelected(i);
    setTimeout(() => {
      const newAnswers = [...answers, i === current.answer];
      setAnswers(newAnswers);
      if (qIdx + 1 < levelQuestions.length) {
        setQIdx(q => q + 1);
        setSelected(null);
      } else {
        setDone(true);
      }
    }, 1000);
  };

  const reset = () => { setLevel(null); setQIdx(0); setAnswers([]); setSelected(null); setDone(false); };

  if (!level) return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: C.green, fontFamily: "'Georgia', serif" }}>Knowledge Test</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5].map(l => {
          const locked = l > 3;
          return (
            <Card key={l} className={`p-5 ${locked ? "opacity-60" : ""}`}
              onClick={!locked ? () => setLevel(l) : undefined}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: locked ? "#f3f4f6" : C.gold + "30" }}>
                  {locked ? "🔒" : "🏅"}
                </div>
                {!locked && <Badge color="gold">Available</Badge>}
              </div>
              <h3 className="font-bold" style={{ color: C.green }}>Level {l}</h3>
              <p className="text-xs text-stone-400 mt-1">
                {l === 1 ? "Hot Beverages Basics" : l === 2 ? "Cold Bar Essentials" : l === 3 ? "Shelf Life & Safety" : l === 4 ? "Coffee Origins" : "Master Barista"}
              </p>
              <div className="mt-3">
                <ProgressBar value={l === 1 ? 100 : l === 2 ? 80 : l === 3 ? 40 : 0} color={C.greenMid} showPct={false} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  if (done) {
    const score = Math.round((answers.filter(Boolean).length / answers.length) * 100);
    return (
      <div className="flex items-center justify-center min-h-64">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-sm">
          <div className="text-6xl mb-4">{score >= 80 ? "🎉" : score>= 60 ? "👍" : "📚"}</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: C.green }}>Level {level} Complete</h2>
          <div className="text-5xl font-bold mb-2" style={{ color: score >= 80 ? C.greenMid : C.warn }}>{score}%</div>
          <p className="text-stone-500 text-sm mb-2">{answers.filter(Boolean).length}/{answers.length} correct</p>
          <p className="text-stone-500 text-sm mb-6">{score >= 80 ? "Excellent! You've mastered this level." : score >= 60 ? "Good effort! Keep practicing." : "Review this material and try again."}</p>
          <button onClick={reset} className="px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: C.greenMid }}>Try Another Level</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: C.green, fontFamily: "'Georgia', serif" }}>Level {level}</h1>
        <button onClick={reset} className="text-sm text-stone-400 hover:text-stone-600">← Back</button>
      </div>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-stone-500">Question {qIdx + 1} of {levelQuestions.length}</span>
          <Badge color="blue">{current.category}</Badge>
        </div>
        <ProgressBar value={((qIdx) / levelQuestions.length) * 100} color={C.greenMid} showPct={false} />
        <Card className="p-6 mt-4">
          <h2 className="text-base font-bold text-stone-800 mb-6 leading-relaxed">{current.q}</h2>
          <div className="space-y-3">
            {current.options.map((opt, i) => (
              <motion.button key={i} whileHover={selected === null ? { scale: 1.01 } : {}}
                onClick={() => pick(i)}
                className={`w-full text-left text-sm px-4 py-3 rounded-xl border-2 transition-all font-medium ${selected !== null
                  ? i === current.answer ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : selected === i ? "border-red-300 bg-red-50 text-red-600"
                    : "border-stone-200 text-stone-400"
                  : "border-stone-200 hover:border-emerald-300 text-stone-700"
                  }`}>
                <span className="w-6 h-6 inline-flex items-center justify-center rounded-full border text-xs mr-3"
                  style={{ borderColor: "currentColor" }}>{String.fromCharCode(65 + i)}</span>
                {opt}
              </motion.button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── PARTNER AI PAGE ──────────────────────────────────────────────────────────
const PartnerAI = () => {
  const suggestions = [
    "What should I study today?",
    "Why might I be struggling with Cold Bar?",
    "Create a 5-minute learning plan for me.",
    "Prepare me for a Hot Bar shift.",
    "Prepare me for a Cold Bar shift.",
    "Explain the difference between a macchiato and a latte.",
    "What are common mistakes with Frappuccinos?",
    "Help me understand coffee origins.",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: "#7c3aed20", color: "#7c3aed" }}>🤖</div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: C.green, fontFamily: "'Georgia', serif" }}>Partner AI Coach</h1>
          <p className="text-stone-400 text-sm">Your personal AI learning companion</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-5 h-full">
            <AIChatBox
              placeholder="Ask me anything — recipes, study plans, explanations..."
              systemContext="You are PartnerIQ, an expert AI learning coach for coffee shop partners. You know everything about: Starbucks-style beverage recipes (exact pump counts, build sequences), shelf life guidelines, coffee origins and tasting notes, brewing methods, and operational best practices.
              The partner's current profile: Knowledge Score: ${PARTNER.score}%, Level: ${PARTNER.level}, Weak areas: Cold Bar (62%), Shelf Life (71%). Provide personalized, actionable advice. Be encouraging and specific."
              suggestions={suggestions}
              className="h-full"
            />
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold text-sm mb-3" style={{ color: C.green }}>Your Profile Summary</h3>
            <div className="space-y-2.5">
              <ProgressBar value={88} color={C.greenMid} label="Hot Bar" />
              <ProgressBar value={62} color={C.warn} label="Cold Bar" />
              <ProgressBar value={71} color="#0891b2" label="Shelf Life" />
              <ProgressBar value={85} color="#7c3aed" label="Coffee Knowledge" />
              <ProgressBar value={74} color={C.gold} label="Tasting" />
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold text-sm mb-3" style={{ color: C.green }}>Quick Prompts</h3>
            <div className="space-y-2">
              {suggestions.slice(0, 5).map((s, i) => (
                <div key={i} className="text-xs text-stone-500 bg-stone-50 rounded-lg px-3 py-2 border border-stone-100">
                  "{s}"
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
const Profile = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold" style={{ color: C.green, fontFamily: "'Georgia', serif" }}>Profile</h1>
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="p-6 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4"
          style={{ background: C.gold, color: C.dark }}>{PARTNER.avatar}</div>
        <h2 className="text-xl font-bold" style={{ color: C.green }}>{PARTNER.name} Partner</h2>
        <p className="text-stone-400 text-sm mb-2">{PARTNER.id}</p>
        <div className="flex justify-center gap-2 mb-4">
          <Badge color="green">Level {PARTNER.level}</Badge>
          <Badge color="gold">{PARTNER.streak} Day Streak 🔥</Badge>
        </div>
        <p className="text-sm text-stone-500">Last Login: {PARTNER.lastLogin}</p>
      </Card>

      <Card className="p-5 lg:col-span-2">
        <h2 className="font-bold text-sm mb-4" style={{ color: C.green }}>Learning Analytics</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { 
              label: "Knowledge Score", 
              value: `${PARTNER.score}%`, 
              icon: "📊" },
            { 
              label: "Shift Ready", 
              value: "${PARTNER.shiftScore}%", 
              icon: "⚡" },
            { 
              label: "Quizzes Taken", 
              value: "47", icon: "📝" },
            { 
              label: "Modules Done", 
              value: "12/18", icon: "✅" },
          ].map((s, i) => (
            <div key={i} className="bg-stone-50 rounded-xl p-4">
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-lg font-bold" style={{ color: C.green }}>{s.value}</p>
              <p className="text-xs text-stone-400">{s.label}</p>
            </div>
          ))}
        </div>
        <h3 className="font-semibold text-sm mb-3" style={{ color: C.green }}>Achievements</h3><div className="flex flex-wrap gap-2">
            {["☕ Latte Master", "🔥 5-Day Streak", "📚 Fast Learner", "⚡ Hot Bar Ready", "🌍 Coffee Explorer"].map((a, i) => (
              <span key={i} className="text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 font-medium">{a}</span>
            ))}
          </div>
      </Card>
    </div>
  </div>
);

// ─── APP SHELL ────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const pages = {
    dashboard: <Dashboard setPage={setPage} />,
    recipes: <Recipes />,
    shelflife: <ShelfLife />,
    coffee: <CoffeeKnowledge />,
    tasting: <CoffeeTasting />,
    quiz: <KnowledgeTest />,
    ai: <PartnerAI />,
    profile: <Profile />,
  };

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="flex h-screen bg-stone-50 font-sans overflow-hidden">
      <Sidebar active={page} setActive={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div key={page}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}>
              {pages[page]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
);
}