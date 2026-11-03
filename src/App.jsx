import { useState, useRef } from "react";

const FLOWERS = ['🌸', '🌺', '🌹', '🌻', '🌷', '🌼', '💐', '🌿'];
const BUBBLES = ['○', '◌', '◍', '●', '◉', '〇', '⋆'];
const SPARKLES = ['✨', '🌟', '💫', '⭐'];

const lyricsData = [
  { text: "Did we ever know?", delay: 300, speed: 70 },
  { text: "Did we ever know?", delay: 2400, speed: 70 },
  { text: "Did we ever know?", delay: 4100, speed: 120 },
  { text: "Is it all inside of my head?", delay: 8000, speed: 80 },
  { text: "Maybe you still think I don't care", delay: 11900, speed: 70 },
  { text: "But all I need is you", delay: 15900, speed: 80 },
  { text: "Yeah, you know it's true", delay: 18500, speed: 50 },
  { text: "yeah, you know it's true", delay: 20500, speed: 50 },
  { text: "Forget about where we are and let go", delay: 22700, speed: 110 },
  { text: "We're so close", delay: 28000, speed: 90 }
];

export default function App() {
  const [lyricText, setLyricText] = useState("✨ Klik Start Untuk Memulai ✨");
  const [flowerLeft, setFlowerLeft] = useState("🌸");
  const [flowerRight, setFlowerRight] = useState("💐");
  const [flowerLine, setFlowerLine] = useState("🌿 🌺 🌻 🌷 🌼");
  const [bottomBorder, setBottomBorder] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef(null);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const typeWriter = async (text, speed) => {
    setLyricText("");
    for (let i = 0; i < text.length; i++) {
      setLyricText((prev) => prev + text[i]);
      await sleep(speed);
    }
  };

  const updateBorders = (text) => {
    const topBubbles = [];
    const count = Math.min(text.length, 14);
    for (let i = 0; i < count; i++) {
      topBubbles.push(
        Math.random() < 0.3 
          ? SPARKLES[Math.floor(Math.random() * SPARKLES.length)] 
          : BUBBLES[Math.floor(Math.random() * BUBBLES.length)]
      );
    }
    setBottomBorder(topBubbles.join('   '));
    setFlowerLeft(FLOWERS[Math.floor(Math.random() * FLOWERS.length)]);
    setFlowerRight(FLOWERS[Math.floor(Math.random() * FLOWERS.length)]);
    
    const burst = [];
    for (let i = 0; i < 3; i++) {
      burst.push(FLOWERS[Math.floor(Math.random() * FLOWERS.length)]);
    }
    setFlowerLine(burst.join('   '));
  };

  const startSong = async () => {
    setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => console.log("Audio play error:", err));
    }

    for (let i = 0; i < lyricsData.length; i++) {
      const item = lyricsData[i];
      const prevDelay = i === 0 ? 0 : lyricsData[i - 1].delay;
      const currentWait = item.delay - prevDelay;

      await sleep(currentWait);
      updateBorders(item.text);
      await typeWriter(item.text, item.speed);
    }

    await sleep(2000);
    setLyricText("✨ Song Complete! ✨");
    setBottomBorder("🌟   🌟   🌟   🌟   🌟");
    setFlowerLine("🌸   🌺   🌹   🌻   🌷");
  };

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden select-none">
      <audio ref={audioRef} src="/song.mp3" preload="auto" />

      {/* BACKGROUND PIXEL ART KASTIL */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="pixel-cloud top-10 w-36 h-9" style={{ animationDuration: '40s', animationDelay: '-3s' }}></div>
        <div className="pixel-cloud top-20 w-52 h-12" style={{ animationDuration: '60s', animationDelay: '-18s' }}></div>
        
        <div className="absolute top-8 right-1/4 w-32 h-32 rounded-full bg-white/40 blur-xs border-2 border-white/60"></div>

        <div className="absolute bottom-28 w-full flex justify-between items-end px-8">
          <svg width="260" height="70" viewBox="0 0 120 30" shapeRendering="crispEdges">
            <path d="M0,25 h120 v5 h-120 z M10,15 h10 v10 h-10 z M30,15 h10 v10 h-10 z M50,15 h10 v10 h-10 z M70,15 h10 v10 h-10 z M90,15 h10 v10 h-10 z" fill="#6d487b"/>
          </svg>
          <svg width="320" height="240" viewBox="0 0 150 110" shapeRendering="crispEdges">
            <path d="M40,30 h30 v80 h-30 z M85,10 h25 v100 h-25 z M120,40 h25 v70 h-25 z" fill="#7a528a"/>
            <path d="M97,0 L80,10 H115 Z M55,20 L35,30 H75 Z M132,30 L115,40 H150 Z" fill="#4d2b5c"/>
            <rect x="94" y="25" width="6" height="10" fill="#fff3a1"/>
            <rect x="94" y="45" width="6" height="10" fill="#fff3a1"/>
          </svg>
        </div>

        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-b from-[#6e4e8a] to-[#432b57] border-t-2 border-[#bfa2d6]">
          <div className="absolute top-4 left-1/3 pixel-boat">
            <svg width="54" height="22" viewBox="0 0 24 10" shapeRendering="crispEdges">
              <path d="M2,3 h20 l-3,6 h-14 z" fill="#8c5338"/>
              <path d="M0,3 h24 v1 h-24 z" fill="#5e3420"/>
            </svg>
          </div>
        </div>
      </div>

      {/* JENDELA POP-UP LIRIK */}
      <div className="relative z-10 pixel-window p-4 max-w-lg w-full mx-4 text-center">
        <div className="bg-[#7a528a] border-b-2 border-[#5a3866] -mx-4 -mt-4 p-2 mb-6 flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <span className="text-xs">🎵</span>
            <span className="text-xs font-bold tracking-wider text-white">LYRICS_PLAYER.EXE</span>
          </div>
        </div>

        <div className="text-lg mb-4 flex items-center justify-center gap-3 min-h-[2rem]">
          <span>{flowerLeft}</span>
          <span className="text-xs tracking-widest text-[#7a488a] keep-spaces">{flowerLine}</span>
          <span>{flowerRight}</span>
        </div>

        <div className="min-h-[4.5rem] flex items-center justify-center py-2 px-4 bg-[#fff0f6] border-2 border-[#9e6fa8] rounded">
          <h1 className="text-xl md:text-2xl font-extrabold text-[#d62846] glow-text keep-spaces">
            {lyricText}
          </h1>
        </div>

        <div className="text-[11px] text-[#6b3e7a] tracking-widest min-h-[1.5rem] mt-4 font-bold keep-spaces">
          {bottomBorder}
        </div>

        {!isPlaying && (
          <div className="mt-6 mb-2">
            <button onClick={startSong} className="pixel-btn text-white font-bold py-2 px-6 text-sm tracking-wider cursor-pointer">
              ▶ START SONG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}