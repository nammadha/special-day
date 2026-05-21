import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Core Firebase SDK modules for the live database connection
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, runTransaction } from 'firebase/database';

// --- Integrated with your real project credentials ---
const firebaseConfig = {
  apiKey: "AIzaSyB07aZmzGvGZ3a2xiECSCp50HKgpoPcl0E",
  authDomain: "special-day-604b2.firebaseapp.com",
  databaseURL: "https://special-day-604b2-default-rtdb.firebaseio.com",
  projectId: "special-day-604b2",
  storageBucket: "special-day-604b2.firebasestorage.app",
  messagingSenderId: "722355482423",
  appId: "1:722355482423:web:417d643d9b8ddef9fc74b2"
};

// Initialize Firebase Realtime Instance
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ==========================================
// GAME 1: CLASSIC MEMORY MATCH
// ==========================================
const MemoryMatch = ({ setScore, setGameOver, gameStarted }) => {
  const icons = ['❤️', '💖', '🎁', '🌹', '👩‍❤️‍👨', '💍', '💌', '🍿'];
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (gameStarted) {
      const deck = [...icons, ...icons]
        .sort(() => Math.random() - 0.5)
        .map((icon, idx) => ({ id: idx, icon, flipped: false, solved: false }));
      setCards(deck);
      setSelected([]);
    }
  }, [gameStarted]);

  const handleCardClick = (idx) => {
    if (selected.length === 2 || cards[idx].flipped || cards[idx].solved) return;
    const newCards = [...cards];
    newCards[idx].flipped = true;
    setCards(newCards);

    const newSelected = [...selected, idx];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (cards[first].icon === cards[second].icon) {
        newCards[first].solved = true;
        newCards[second].solved = true;
        setCards(newCards);
        setSelected([]);
        setScore((s) => s + 1);
        if (newCards.every((c) => c.solved)) setGameOver(true);
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
          setSelected([]);
        }, 800);
      }
    }
  };

  return (
    <div style={styles.memoryGrid}>
      {cards.map((card, idx) => (
        <div 
          key={card.id} 
          style={{ 
            ...styles.memoryCard, 
            background: card.flipped || card.solved ? 'rgba(255,255,255,0.2)' : 'linear-gradient(45deg, #ff4d4d, #ff3385)' 
          }} 
          onClick={() => handleCardClick(idx)}
        >
          {card.flipped || card.solved ? card.icon : '❓'}
        </div>
      ))}
    </div>
  );
};

// ==========================================
// GAME 2: LOVE CROSSWORD CLUES
// ==========================================
const LoveCrossword = ({ setScore, setGameOver, gameStarted }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const riddles = [
    { clue: "What is our absolute favorite food to order together on a cozy night? 🍕", answer: "pizza" },
    { clue: "Fill in the blank of our custom brand title: '________' Group 👑", answer: "nammadha" },
    { clue: "What month is your incredible birthday in? 🌹", answer: "june" }
  ];

  const checkAnswer = () => {
    if (input.trim().toLowerCase() === riddles[currentLevel].answer) {
      setScore((s) => s + 1);
      setInput('');
      setError('');
      if (currentLevel < riddles.length - 1) {
        setCurrentLevel(currentLevel + 1);
      } else {
        setGameOver(true);
      }
    } else {
      setError("Try again, my love! 🙈");
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <p style={{ color: '#ffb3b3', marginBottom: '15px', fontWeight: '600' }}>Level {currentLevel + 1} of {riddles.length}</p>
      <p style={{ fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.5' }}>{riddles[currentLevel].clue}</p>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Type answer here..." 
        style={styles.textInput}
      />
      {error && <p style={{ color: '#ff4d4d', fontSize: '0.9rem', margin: '10px 0' }}>{error}</p>}
      <br />
      <button style={styles.gameButton} onClick={checkAnswer}>Submit 🗝️</button>
    </div>
  );
};

// ==========================================
// GAME 3: WORD SCRAMBLE CRUSH
// ==========================================
const WordScramble = ({ setScore, setGameOver, gameStarted }) => {
  const [currentWord, setCurrentWord] = useState(0);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const pool = [
    { scrambled: "R O F E R E V", original: "forever" },
    { scrambled: "H C T C A O L E O", original: "chocolate" },
    { scrambled: "E N I M A", original: "anime" }
  ];

  const checkWord = () => {
    if (input.trim().toLowerCase() === pool[currentWord].original) {
      setScore((s) => s + 1);
      setInput('');
      setError('');
      if (currentWord < pool.length - 1) {
        setCurrentWord(currentWord + 1);
      } else {
        setGameOver(true);
      }
    } else {
      setError("Unscramble carefully! 🤔");
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <p style={{ color: '#ffb3b3', marginBottom: '15px' }}>Unscramble the romantic words:</p>
      <h2 style={{ letterSpacing: '4px', color: '#fff', fontSize: '2rem', marginBottom: '20px' }}>{pool[currentWord].scrambled}</h2>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Your guess..." 
        style={styles.textInput}
      />
      {error && <p style={{ color: '#ff4d4d', fontSize: '0.9rem', margin: '10px 0' }}>{error}</p>}
      <br />
      <button style={styles.gameButton} onClick={checkWord}>Verify ✨</button>
    </div>
  );
};

// ==========================================
// GAME 4: EMOJI SECRET CODE
// ==========================================
const EmojiDecoder = ({ setScore, setGameOver, gameStarted }) => {
  const [lvl, setLvl] = useState(0);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const puzzles = [
    { emojis: "🍿 + 🎥 = ???", answer: "movie" },
    { emojis: "🎧 + 🎵 = ???", answer: "music" },
    { emojis: "🌙 + 💬 = ???", answer: "chat" }
  ];

  const evaluateCode = () => {
    if (input.trim().toLowerCase() === puzzles[lvl].answer) {
      setScore((s) => s + 1);
      setInput('');
      setError('');
      if (lvl < puzzles.length - 1) {
        setLvl(lvl + 1);
      } else {
        setGameOver(true);
      }
    } else {
      setError("The secret combination is different! 🕵️‍♀️");
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <p style={{ color: '#ffb3b3', marginBottom: '15px' }}>Guess the secret word from the emojis:</p>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{puzzles[lvl].emojis}</h1>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Decode it..." 
        style={styles.textInput}
      />
      {error && <p style={{ color: '#ff4d4d', fontSize: '0.9rem', margin: '10px 0' }}>{error}</p>}
      <br />
      <button style={styles.gameButton} onClick={evaluateCode}>Decode 🔓</button>
    </div>
  );
};

// ==========================================
// GAME 5: THE PERFECT PAIR
// ==========================================
const PerfectPair = ({ setScore, setGameOver, gameStarted }) => {
  const [matchedCount, setMatchedCount] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);

  const completePairs = [
    { text: "Romeo", pairId: 1, type: "left" },
    { text: "Juliet", pairId: 1, type: "right" },
    { text: "Burger", pairId: 2, type: "left" },
    { text: "Fries", pairId: 2, type: "right" },
    { text: "Chai", pairId: 3, type: "left" },
    { text: "Biscuit", pairId: 3, type: "right" },
    { text: "Moon", pairId: 4, type: "left" },
    { text: "Stars", pairId: 4, type: "right" }
  ];

  useEffect(() => {
    if (gameStarted) {
      setItems([...completePairs].sort(() => Math.random() - 0.5));
      setSelectedItem(null);
      setMatchedCount(0);
    }
  }, [gameStarted]);

  const handleItemClick = (clickedItem, idx) => {
    if (clickedItem.matched) return;

    if (!selectedItem) {
      setSelectedItem({ ...clickedItem, originalIndex: idx });
    } else {
      if (selectedItem.pairId === clickedItem.pairId && selectedItem.type !== clickedItem.type) {
        const updated = [...items];
        updated[selectedItem.originalIndex].matched = true;
        updated[idx].matched = true;
        setItems(updated);
        setSelectedItem(null);
        setScore((s) => s + 1);
        
        const currentMatches = matchedCount + 1;
        setMatchedCount(currentMatches);
        if (currentMatches === 4) setGameOver(true);
      } else {
        setSelectedItem(null);
      }
    }
  };

  return (
    <div>
      <p style={{ fontSize: '0.85rem', color: '#ffcccc', marginBottom: '15px' }}>Click a word, then click its perfect matching half! 🥂</p>
      <div style={styles.pairsGrid}>
        {items.map((item, idx) => (
          <button 
            key={idx}
            disabled={item.matched}
            style={{ 
              ...styles.pairBtn, 
              backgroundColor: item.matched ? 'rgba(255,255,255,0.1)' : (selectedItem?.originalIndex === idx ? '#ff3385' : 'rgba(255,255,255,0.05)'),
              textDecoration: item.matched ? 'line-through' : 'none',
              color: item.matched ? '#666' : '#fff'
            }}
            onClick={() => handleItemClick(item, idx)}
          >
            {item.text}
          </button>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// MAIN COUNTDOWN ARCHITECTURE CABINET
// ==========================================
const CountdownScreen = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ Days: 0, Hours: 0, Minutes: 0, Seconds: 0 });
  const [activeGame, setActiveGame] = useState(0); 
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Real-time synchronization state tracking
  const [ticketReason, setTicketReason] = useState("Click Below to Generate a Reason! 👇");
  const [kissCount, setKissCount] = useState(0);
  const [burstKisses, setBurstKisses] = useState([]);

  const gameTitles = ["Memory Match", "Love Crossword", "Scramble Crush", "Emoji Decoder", "Perfect Pairs"];

  const reasonsArray = [
    "I love how you can instantly make me smile no matter how tough my day is. ❤️",
    "The way you care about the tiniest details in our relationship is pure magic.",
    "Your laugh is my absolute favorite sound in the entire world. 🎶",
    "I love how safe and completely at home I feel whenever we talk.",
    "Your beautiful kind eyes and how genuinely supportive you are of me. ✨",
    "How we can turn an ordinary evening into an endless inside joke party. 😂",
    "Because you are my best friend, my soulmate, and my favorite person all in one.",
    "I love your cooking taste, your cinematic choices, and your golden heart.",
    "The absolute dedication and love you pour into making me feel special. 🌹",
    "Simply because you are YOU, and I wouldn't trade you for anything in the universe."
  ];

  // 1. Clock countdown effect hook
  useEffect(() => {
    const checkTime = setInterval(() => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          Minutes: Math.floor((difference / 1000 / 60) % 60),
          Seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(checkTime);
  }, [targetDate]);

  // 2. Real-time background cloud listener hook
  useEffect(() => {
    const kissCountRef = ref(db, 'liveData/kissCount');
    const unsubscribe = onValue(kissCountRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        // Explode a visual kiss whenever the tracker on the database ticks upward
        if (data > kissCount) {
          const id = Date.now() + Math.random();
          setBurstKisses(prev => [...prev, { id, left: Math.random() * 80 + 10 }]);
          setTimeout(() => {
            setBurstKisses(prev => prev.filter(k => k.id !== id));
          }, 2000);
        }
        setKissCount(data);
      }
    });
    return () => unsubscribe();
  }, [kissCount]);

  const changeGame = (idx) => {
    setActiveGame(idx);
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
  };

  const drawTicket = () => {
    const randomReason = reasonsArray[Math.floor(Math.random() * reasonsArray.length)];
    setTicketReason(randomReason);
  };

  // 3. Thread-safe writing transactional engine
  const sendKiss = () => {
    const kissCountRef = ref(db, 'liveData/kissCount');
    runTransaction(kissCountRef, (currentValue) => {
      return (currentValue || 0) + 1;
    });
  };

  return (
    <div style={styles.container}>
      <video autoPlay loop muted playsInline style={styles.backgroundVideo}><source src="/romantic-bg.mp4" type="video/mp4" /></video>
      <div style={styles.overlay}></div>

      {/* Floating Kisses Container Portals */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 99 }}>
        <AnimatePresence>
          {burstKisses.map(k => (
            <motion.div
              key={k.id}
              initial={{ y: '100vh', opacity: 1, scale: 1 }}
              animate={{ y: '-10vh', opacity: 0, scale: 1.5, x: Math.sin(k.id) * 60 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              style={{ position: 'absolute', left: `${k.left}%`, fontSize: '3rem' }}
            >
              💋
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div style={styles.layoutWrapper}>
        {/* Left Side: Clock Engine */}
        <div style={styles.leftSection}>
          <span style={{ fontSize: '3.5rem' }}>❤️</span>
          <h1 style={styles.header}>Something Beautiful Awaits...</h1>
          <p style={styles.subHeader}>Your Birthday Hub unlocks at Midnight on June 5th ✨</p>
          <div style={styles.timerContainer}>
            {Object.keys(timeLeft).map((key) => (
              <div key={key} style={styles.timeBox}>
                <span style={styles.number}>{String(timeLeft[key]).padStart(2, '0')}</span>
                <span style={styles.label}>{key}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Cute Puzzle Cabinet */}
        <div style={styles.rightSection}>
          <div style={styles.gameCabinet}>
            <div style={styles.tabsHeader}>
              {gameTitles.map((title, idx) => (
                <button key={idx} onClick={() => changeGame(idx)} style={{ ...styles.tabBtn, backgroundColor: activeGame === idx ? '#ff3385' : 'rgba(255,255,255,0.06)', color: activeGame === idx ? '#fff' : '#ccc' }}>
                  {idx + 1}
                </button>
              ))}
            </div>

            <h3 style={{ margin: '15px 0', color: '#ffb3b3', fontSize: '1.2rem', fontWeight: '600' }}>🧩 Puzzle {activeGame + 1}: {gameTitles[activeGame]}</h3>

            <div style={{ position: 'relative', minHeight: '270px' }}>
              <div style={styles.scoreboard}><span>Score: {score}</span></div>

              {!gameStarted && !gameOver && (
                <div style={styles.gameOverlayScreen}>
                  <p style={{ marginBottom: '20px', color: '#ffcccc' }}>Ready to exercise your brain while waiting? Tap to play! 💕</p>
                  <button style={styles.gameButton} onClick={() => setGameStarted(true)}>Start Puzzle</button>
                </div>
              )}

              {gameOver && (
                <div style={styles.gameOverlayScreen}>
                  <h4 style={{ color: '#ff4d4d', fontSize: '1.5rem', marginBottom: '10px' }}>Bravo! 🎉</h4>
                  <p style={{ marginBottom: '20px' }}>You completely solved this module!</p>
                  <button style={styles.gameButton} onClick={() => { setGameOver(false); setGameStarted(true); setScore(0); }}>Play Again 🔄</button>
                </div>
              )}

              {activeGame === 0 && <MemoryMatch setScore={setScore} setGameOver={setGameOver} gameStarted={gameStarted} />}
              {activeGame === 1 && <LoveCrossword setScore={setScore} setGameOver={setGameOver} gameStarted={gameStarted} />}
              {activeGame === 2 && <WordScramble setScore={setScore} setGameOver={setGameOver} gameStarted={gameStarted} />}
              {activeGame === 3 && <EmojiDecoder setScore={setScore} setGameOver={setGameOver} gameStarted={gameStarted} />}
              {activeGame === 4 && <PerfectPair setScore={setScore} setGameOver={setGameOver} gameStarted={gameStarted} />}
            </div>
          </div>
        </div>

        {/* Dynamic Row: Reason Generator & Love Counter */}
        <div style={styles.bottomRowContainer}>
          {/* Ticket Station */}
          <div style={styles.featureGlassCard}>
            <h4 style={styles.cardTitleTitle}>🎫 Why I Love You Token</h4>
            <div style={styles.reasonDisplayBox}>
              <p style={{ fontStyle: 'italic', color: '#fff', fontSize: '1.05rem', lineHeight: '1.5' }}>"{ticketReason}"</p>
            </div>
            <button style={styles.ticketActionBtn} onClick={drawTicket}>Pull A Ticket 🎲</button>
          </div>

          {/* Interactive Kisses Tracker */}
          <div style={styles.featureGlassCard}>
            <h4 style={styles.cardTitleTitle}>💋 Live Virtual Kiss Station</h4>
            <p style={{ color: '#ffcccc', fontSize: '0.95rem', marginBottom: '15px' }}>Tap the giant heart below to send me sweet virtual kisses!</p>
            <h2 style={{ fontSize: '2.5rem', margin: '10px 0', color: '#ff3385', fontWeight: 'bold' }}>{kissCount}</h2>
            <p style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Kisses Sent Tracker</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={styles.heartBlastBtn}
              onClick={sendKiss}
            >
              ❤️
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Custom Master Architectural CSS Rules ---
const styles = {
  container: { minHeight: '100vh', width: '100vw', color: '#fff', fontFamily: "'Poppins', sans-serif", position: 'relative', overflowX: 'hidden', overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 15px' },
  backgroundVideo: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', zIndex: -2 },
  overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'linear-gradient(to bottom, rgba(15,0,5,0.4) 0%, rgba(5,0,2,0.92) 100%)', zIndex: -1 },
  layoutWrapper: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '40px', maxWidth: '1200px', width: '100%', justifyContent: 'center', alignItems: 'center', zIndex: 5 },
  leftSection: { flex: '1 1 450px', textAlign: 'center', maxWidth: '500px' },
  rightSection: { flex: '1 1 420px', display: 'flex', justifyContent: 'center' },
  header: { fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: '700', fontFamily: "'Playfair Display', serif", lineHeight: '1.2', marginBottom: '10px' },
  subHeader: { fontSize: '0.95rem', color: '#ffcccc', letterSpacing: '2px', marginBottom: '35px', fontWeight: '300' },
  timerContainer: { display: 'flex', gap: '12px', justifyContent: 'center' },
  timeBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', padding: '18px 12px', borderRadius: '18px', minWidth: '85px' },
  number: { fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: '700' },
  label: { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '6px', color: '#ffb3b3' },
  
  gameCabinet: { background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '24px', padding: '25px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', position: 'relative' },
  tabsHeader: { display: 'flex', gap: '8px', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' },
  tabBtn: { border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease' },
  scoreboard: { display: 'flex', justifyContent: 'flex-end', fontSize: '0.9rem', fontWeight: '600', color: '#ffb3b3', marginBottom: '10px' },
  gameOverlayScreen: { position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(12, 3, 7, 0.95)', backdropFilter: 'blur(4px)', borderRadius: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 10, padding: '20px', textAlign: 'center' },
  gameButton: { padding: '12px 30px', background: 'linear-gradient(45deg, #ff4d4d, #ff3385)', color: '#fff', border: 'none', borderRadius: '25px', fontWeight: '600', cursor: 'pointer', letterSpacing: '1px', boxShadow: '0 10px 20px rgba(255,51,133,0.3)' },
  textInput: { padding: '12px 15px', width: '100%', maxWidth: '280px', fontSize: '1.1rem', borderRadius: '12px', border: '2px solid rgba(255,51,133,0.4)', background: 'rgba(0,0,0,0.3)', color: '#fff', textAlign: 'center', outline: 'none' },

  memoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' },
  memoryCard: { height: '52px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem', cursor: 'pointer', userSelect: 'none', border: '1px solid rgba(255,255,255,0.1)' },
  pairsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' },
  pairBtn: { border: '1px solid rgba(255,255,255,0.15)', padding: '12px', borderRadius: '12px', fontSize: '1rem', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s ease' },

  bottomRowContainer: { display: 'flex', flexWrap: 'wrap', gap: '30px', width: '100%', maxWidth: '980px', marginTop: '20px', justifyContent: 'center' },
  featureGlassCard: { flex: '1 1 400px', maxWidth: '470px', background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '25px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' },
  cardTitleTitle: { fontSize: '1.15rem', color: '#ffb3b3', fontWeight: '600', marginBottom: '15px', letterSpacing: '1px' },
  reasonDisplayBox: { minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '15px' },
  ticketActionBtn: { padding: '10px 25px', background: 'transparent', border: '2px solid #ff3385', color: '#fff', borderRadius: '20px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease' },
  heartBlastBtn: { width: '65px', height: '65px', borderRadius: '50%', background: 'linear-gradient(45deg, #ff4d4d, #ff3385)', border: 'none', color: '#fff', fontSize: '1.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px', boxShadow: '0 10px 25px rgba(255,51,133,0.4)' }
};

export default CountdownScreen;