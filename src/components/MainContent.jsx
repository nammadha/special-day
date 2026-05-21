import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// --- 1. The Moving Cartoon Lover Component ---
const FloatingLover = () => {
  return (
    <motion.div
      style={styles.floatingLover}
      animate={{
        y: [0, -40, 0],
        x: [0, 30, -30, 0],
        rotate: [0, 10, -10, 0]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      <span style={{ fontSize: '5rem', filter: 'drop-shadow(0px 10px 10px rgba(255, 77, 77, 0.5))' }}>
        👩‍❤️‍👨💘
      </span>
    </motion.div>
  );
};

// --- 2. Floating Background Hearts Component ---
const FloatingHearts = () => {
  const hearts = Array.from({ length: 15 }); 
  return (
    <div style={styles.heartsContainer}>
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          style={styles.heart}
          initial={{ y: '100vh', opacity: 0, scale: Math.random() * 0.5 + 0.5 }}
          animate={{ y: '-10vh', opacity: [0, 0.8, 0], x: Math.sin(i) * 50 }}
          transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
};

// --- 3. The Video Spinner Mini-Game ---
const VideoSpinner = ({ close }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState({ title: "❓❓❓", file: null });
  const [showVideo, setShowVideo] = useState(false);

  const videoOptions = [
    { title: "Our Best Travel Memories 🌿", file: "/vid1.mp4" },
    { title: "Funny Moments & Fails 😂", file: "/vid2.mp4" },
    { title: "My Special Birthday Message ❤️", file: "/vid3.mp4" },
    { title: "Late Night Goofing Around 🌙", file: "/vid4.mp4" },
    { title: "The 'You Being Cute' Compilation ✨", file: "/vid5.mp4" }
  ];

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setShowVideo(false);
    
    let counter = 0;
    const shuffle = setInterval(() => {
      setResult(videoOptions[Math.floor(Math.random() * videoOptions.length)]);
      counter++;
      
      if (counter > 30) {
        clearInterval(shuffle);
        setIsSpinning(false);
        
        const finalWinner = videoOptions[Math.floor(Math.random() * videoOptions.length)];
        setResult(finalWinner);
        setShowVideo(true); 
        
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff4d4d', '#ffb3b3', '#ffffff']
        });
      }
    }, 100);
  };

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <h2 style={styles.couponTitle}>🎬 Memory Roulette</h2>
      <p style={styles.couponText}>
        Spin the wheel to unlock a special video memory!
      </p>
      
      <motion.div 
        style={styles.resultBox}
        animate={{ scale: isSpinning ? [1, 1.05, 1] : 1 }}
        transition={{ repeat: isSpinning ? Infinity : 0, duration: 0.2 }}
      >
        <h3 style={{ fontSize: '1.4rem', color: '#ff4d4d', margin: '10px 0' }}>
          {isSpinning ? result.title : (showVideo ? `🎉 ${result.title} 🎉` : "❓❓❓")}
        </h3>
      </motion.div>

      {showVideo && result.file && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ marginTop: '20px', marginBottom: '20px' }}
        >
          <video 
            controls 
            autoPlay 
            style={{ width: '100%', borderRadius: '12px', border: '3px solid #ff4d4d', boxShadow: '0px 10px 20px rgba(0,0,0,0.3)' }}
          >
            <source src={result.file} type="video/mp4" />
          </video>
        </motion.div>
      )}
      
      <br />
      
      {!showVideo && (
        <button 
          style={{...styles.surpriseButton, opacity: isSpinning ? 0.5 : 1}} 
          onClick={spinWheel}
          disabled={isSpinning}
        >
          {isSpinning ? "Spinning..." : "SPIN 🎰"}
        </button>
      )}

      {showVideo && (
        <button 
          style={{...styles.surpriseButton, fontSize: '1.1rem', padding: '12px 30px'}} 
          onClick={spinWheel}
        >
          Spin Again! 🔄
        </button>
      )}
      
      <div style={{ marginTop: '25px' }}>
        <button style={styles.closeButton} onClick={close}>Close</button>
      </div>
    </div>
  );
};

// --- 4. Main Content Component ---
const MainContent = () => {
  const [showSurprise, setShowSurprise] = useState(false);

  return (
    <div style={styles.container}>
      {/* Background Video */}
      <video autoPlay loop muted playsInline style={styles.backgroundVideo}>
        <source src="/romantic-bg.mp4" type="video/mp4" />
      </video>
      <div style={styles.overlay}></div>

      {/* Background Audio */}
      <audio autoPlay loop>
        <source src="/cover.mp3" type="audio/mpeg" />
      </audio>

      <FloatingHearts />
      <FloatingLover />

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={styles.heroSection}
      >
        <h1 style={styles.title}>Happy Birthday, My Love!</h1>
        <p style={styles.subtitle}>Welcome to your special June 5th surprise. I love you!</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 1 }}
        style={styles.gridContainer}
      >
        <div style={styles.card}>
          <img src="/akku.jpg" alt="Our Favorite Memory" style={styles.media} />
          <p style={styles.caption}>Every moment with you is magic...</p>
        </div>
        
        <div style={styles.card}>
          <video controls autoPlay muted loop style={styles.media}>
            <source src="/she.mp4" type="video/mp4" />
          </video>
          <p style={styles.caption}>To a million more memories together.</p>
        </div>
      </motion.div>

      {/* The Hidden Button */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }} 
        style={styles.buttonContainer}
      >
        <motion.button 
          style={styles.surpriseButton}
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px #ff4d4d" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSurprise(true)}
        >
          I have one last gift for you... 🎁
        </motion.button>
      </motion.div>

      {/* The Pop-up Surprise Modal */}
      <AnimatePresence>
        {showSurprise && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalOverlay}
            onClick={() => setShowSurprise(false)}
          >
            <motion.div 
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              transition={{ type: "spring", bounce: 0.5 }}
              style={styles.couponCard}
              onClick={(e) => e.stopPropagation()} 
            >
              <VideoSpinner close={() => setShowSurprise(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 5. Premium Romantic Styles Object ---
const styles = {
  container: {
    minHeight: '100vh',
    color: '#fff',
    fontFamily: "'Poppins', sans-serif",
    padding: '5vw',
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  backgroundVideo: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    zIndex: -2, 
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
    zIndex: -1,
  },
  heartsContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none', 
    zIndex: 1,
  },
  heart: {
    position: 'absolute',
    fontSize: '2rem',
    filter: 'drop-shadow(0px 5px 5px rgba(255, 77, 77, 0.4))',
  },
  floatingLover: {
    position: 'fixed',
    top: '10%',
    right: '10%',
    zIndex: 10,
    pointerEvents: 'none',
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '10vh',
    marginTop: '8vh',
    position: 'relative',
    zIndex: 5,
    padding: '0 20px',
  },
  title: {
    fontSize: 'clamp(2.5rem, 7vw, 5rem)',
    color: '#ffffff', 
    marginBottom: '10px',
    fontFamily: "'Playfair Display', serif",
    fontWeight: '700',
    letterSpacing: '2px',
  },
  subtitle: {
    fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
    color: '#ffcccc',
    letterSpacing: '4px',
    fontWeight: '300',
    textTransform: 'uppercase',
  },
  gridContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '40px',
    justifyContent: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 5,
  },
  card: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderTop: '1px solid rgba(255, 255, 255, 0.4)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.4)',
    padding: '20px',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.05)',
  },
  media: {
    width: '100%',
    borderRadius: '16px',
    objectFit: 'cover',
    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
  },
  caption: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: '400',
    letterSpacing: '1px',
  },
  buttonContainer: {
    textAlign: 'center',
    marginTop: '80px',
    marginBottom: '60px',
    position: 'relative',
    zIndex: 5,
  },
  surpriseButton: {
    padding: '18px 45px',
    fontSize: '1.1rem',
    color: '#fff',
    background: 'linear-gradient(45deg, #ff4d4d, #ff3385)',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0px 15px 30px rgba(255, 77, 77, 0.4)',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: '600',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100, 
    backdropFilter: 'blur(12px)',
  },
  couponCard: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '30px',
    textAlign: 'center',
    maxWidth: '500px',
    width: '90%',
    color: '#1a1a1a',
    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
  },
  couponTitle: {
    fontSize: '2.2rem',
    color: '#ff4d4d',
    marginBottom: '20px',
    fontFamily: "'Playfair Display', serif",
    fontWeight: '800',
    letterSpacing: '1px',
  },
  couponText: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    marginBottom: '25px',
    fontWeight: '400',
    color: '#444',
  },
  resultBox: {
    background: '#f8f9fa',
    border: '2px dashed #ff4d4d',
    borderRadius: '20px',
    padding: '25px',
    margin: '25px 0',
    boxShadow: 'inset 0px 5px 15px rgba(0,0,0,0.05)',
  },
  closeButton: {
    padding: '12px 35px',
    fontSize: '1.1rem',
    background: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily: "'Poppins', sans-serif",
  }
};

export default MainContent;