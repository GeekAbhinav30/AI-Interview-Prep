import { useState, useRef } from 'react';
import { motion, useScroll, useTransform} from 'framer-motion';
import { ArrowRight, Sparkles, Video, Mic, Brain, Zap, Shield, TrendingUp } from 'lucide-react';

const HomePage = () => {
  const [isDark, setIsDark] = useState(true);
  const macbookRef = useRef(null);
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: macbookRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const lid = useTransform(scrollYProgress, [0, 0.25, 0.5], [65, 15, 0]);
  const lidRotate = lid;
  
  const macScale = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.75, 0.95, 1]);
  const macOpacity = useTransform(scrollYProgress, [0, 0.2], [0.4, 1]);
  
  const screenGlow = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const screenContent = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.35, 0.5], [30, 0]);
  
  const heroY = useTransform(heroProgress, [0, 1], [0, -120]);
  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);

  const theme = {
    bg: isDark ? '#000000' : '#ffffff',
    bgGradient: isDark 
      ? 'linear-gradient(180deg, #000000 0%, #0a0e1a 50%, #000000 100%)'
      : 'linear-gradient(180deg, #ffffff 0%, #f5f7fa 50%, #ffffff 100%)',
    surface: isDark ? 'rgba(20, 20, 22, 0.7)' : 'rgba(255, 255, 255, 0.7)',
    surfaceHover: isDark ? 'rgba(30, 30, 35, 0.8)' : 'rgba(250, 250, 252, 0.9)',
    text: isDark ? '#f5f5f7' : '#1d1d1f',
    textSecondary: isDark ? '#a1a1a6' : '#6e6e73',
    textTertiary: isDark ? '#6e6e73' : '#86868b',
    border: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    borderHover: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.14)',
    glass: isDark ? 'rgba(29, 29, 31, 0.72)' : 'rgba(255, 255, 255, 0.72)',
    accent: '#0071e3',
    accentHover: '#0077ed',
    macBodyTop: isDark ? '#2c2c2e' : '#e8e8ed',
    macBodyBottom: isDark ? '#1c1c1e' : '#d1d1d6',
    keyboardBg: isDark ? '#1a1a1c' : '#c7c7cc',
    keyBg: isDark ? '#2c2c2e' : '#ffffff',
    trackpadBg: isDark ? '#1c1c1e' : '#d1d1d6',
  };

  return (
    <div style={{ 
      background: theme.bgGradient,
      color: theme.text,
      minHeight: '100vh',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif'
    }}>
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: isDark
          ? 'radial-gradient(circle at 20% 50%, rgba(0, 113, 227, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.05) 0%, transparent 50%)'
          : 'radial-gradient(circle at 20% 50%, rgba(0, 113, 227, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.02) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
        opacity: isDark ? 0.4 : 0.2,
        pointerEvents: 'none',
        zIndex: 0
      }} />
      
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        backdropFilter: 'saturate(180%) blur(20px)',
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.72)' : 'rgba(255, 255, 255, 0.72)',
        borderBottom: `1px solid ${theme.border}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              background: 'linear-gradient(135deg, #0071e3 0%, #005bb5 100%)',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 113, 227, 0.3)'
            }}>
              <Sparkles size={14} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{
              fontSize: '17px',
              fontWeight: 600,
              letterSpacing: '-0.022em',
              color: theme.text,
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>InterviewPro</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#features" style={{ 
              fontSize: '14px', 
              fontWeight: 500, 
              color: theme.textSecondary,
              textDecoration: 'none',
              transition: 'color 0.2s',
              cursor: 'pointer',
              fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>Features</a>
            <a href="#how" style={{ 
              fontSize: '14px', 
              fontWeight: 500, 
              color: theme.textSecondary,
              textDecoration: 'none',
              transition: 'color 0.2s',
              cursor: 'pointer',
              fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>How it works</a>
            
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '18px',
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.surface,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.surfaceHover;
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.surface;
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position: 'relative', zIndex: 1 }}>
                  <circle cx="8" cy="8" r="4" fill={theme.text} />
                  <g stroke={theme.text} strokeWidth="1.5" strokeLinecap="round">
                    <line x1="8" y1="1" x2="8" y2="2.5" />
                    <line x1="8" y1="13.5" x2="8" y2="15" />
                    <line x1="1" y1="8" x2="2.5" y2="8" />
                    <line x1="13.5" y1="8" x2="15" y2="8" />
                    <line x1="2.9" y1="2.9" x2="3.9" y2="3.9" />
                    <line x1="12.1" y1="12.1" x2="13.1" y2="13.1" />
                    <line x1="2.9" y1="13.1" x2="3.9" y2="12.1" />
                    <line x1="12.1" y1="3.9" x2="13.1" y2="2.9" />
                  </g>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position: 'relative', zIndex: 1 }}>
                  <path d="M13.5 8.5C13.5 11.2614 11.2614 13.5 8.5 13.5C5.73858 13.5 3.5 11.2614 3.5 8.5C3.5 5.73858 5.73858 3.5 8.5 3.5C8.58485 3.5 8.66913 3.5033 8.75275 3.50982C7.97212 4.21942 7.5 5.22784 7.5 6.34C7.5 8.54914 9.25086 10.3 11.46 10.3C12.3282 10.3 13.1226 10.0042 13.7598 9.51275C13.8467 9.82725 13.8933 10.1585 13.8933 10.5C13.8933 10.5848 13.8903 10.6691 13.8843 10.7527C13.6693 10.8297 13.4407 10.87 13.2033 10.87C11.8226 10.87 10.7033 9.75071 10.7033 8.37C10.7033 7.40212 11.2226 6.55962 11.9893 6.10275C11.9048 6.01913 11.8118 5.94275 11.7118 5.875C11.1614 5.51242 10.4621 5.2 9.5 5.2C6.73858 5.2 4.5 7.43858 4.5 10.2C4.5 12.2426 5.88507 13.9573 7.77893 14.4893C7.46913 14.7818 7.06913 15 6.5 15C4.84315 15 3.5 13.6569 3.5 12C3.5 11.4621 3.65982 10.9621 3.93934 10.5466C2.76242 9.53858 2 8.02132 2 6.5C2 3.73858 4.23858 1.5 7 1.5C9.54765 1.5 11.6547 3.42793 11.9643 5.92893C12.9121 6.5121 13.5 7.58507 13.5 8.5Z" fill={theme.text} />
                </svg>
              )}
            </button>
            
            <button style={{
              backgroundColor: theme.accent,
              color: '#fff',
              padding: '8px 18px',
              borderRadius: '980px',
              fontSize: '14px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '-0.01em',
              fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.accentHover;
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.accent;
              e.currentTarget.style.transform = 'scale(1)';
            }}>
              Get started
            </button>
          </div>
        </div>
      </nav>

      <motion.section 
        ref={heroRef}
        style={{
          paddingTop: '140px',
          paddingBottom: '100px',
          textAlign: 'center',
          position: 'relative',
          y: heroY,
          opacity: heroOpacity,
          zIndex: 1
        }}
      >
        <div style={{ maxWidth: '980px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '100px',
              backgroundColor: theme.surface,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
              border: `1px solid ${theme.border}`,
              marginBottom: '28px'
            }}>
              <Sparkles size={14} color={theme.accent} strokeWidth={2.5} />
              <span style={{
                fontSize: '13px',
                fontWeight: 500,
                color: theme.textSecondary,
                letterSpacing: '0.01em',
                fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
              }}>Powered by advanced AI</span>
            </div>
            
            <h1 style={{
              fontSize: 'clamp(52px, 7vw, 96px)',
              fontWeight: 700,
              letterSpacing: '-0.035em',
              lineHeight: '1.05',
              marginBottom: '24px',
              color: theme.text,
              transition: 'color 0.3s ease',
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              Master your<br />next interview
            </h1>
            
            <p style={{
              fontSize: '21px',
              lineHeight: '1.47',
              color: theme.textSecondary,
              marginBottom: '40px',
              maxWidth: '680px',
              margin: '0 auto 40px',
              letterSpacing: '-0.015em',
              fontWeight: 400,
              fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              AI-powered interview preparation with personalized questions,
              real-time feedback, and comprehensive performance analytics.
            </p>
            
            <motion.button
              style={{
                backgroundColor: theme.accent,
                color: '#fff',
                padding: '14px 32px',
                borderRadius: '980px',
                fontSize: '17px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '-0.015em',
                boxShadow: isDark ? '0 4px 24px rgba(0, 113, 227, 0.25)' : '0 4px 24px rgba(0, 113, 227, 0.15)',
                fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.accentHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.accent}
            >
              Start practicing
              <ArrowRight size={18} strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      <section 
        ref={macbookRef}
        style={{
          minHeight: '160vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
          zIndex: 1
        }}
      >
        <div style={{
          position: 'sticky',
          top: '20vh',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          perspective: '2000px',
          perspectiveOrigin: 'center center'
        }}>
          <motion.div
            style={{
              scale: macScale,
              opacity: macOpacity,
              transformStyle: 'preserve-3d',
              position: 'relative',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              contain: 'layout paint'
            }}
          >
            <motion.div
              style={{
                rotateX: lidRotate,
                transformOrigin: 'bottom center',
                transformStyle: 'preserve-3d',
                position: 'relative'
              }}
            >
              <div style={{
                background: `linear-gradient(180deg, ${theme.macBodyTop} 0%, ${theme.macBodyBottom} 100%)`,
                borderRadius: '16px 16px 0 0',
                padding: '22px 22px 12px',
                position: 'relative',
                boxShadow: isDark
                  ? '0 40px 120px rgba(0, 0, 0, 0.9), 0 20px 60px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
                  : '0 40px 120px rgba(0, 0, 0, 0.3), 0 20px 60px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)',
                borderBottom: 'none',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  gap: '6px'
                }}>
                  <div style={{ 
                    width: '40px', 
                    height: '5px', 
                    background: isDark 
                      ? 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.06) 100%)'
                      : 'linear-gradient(90deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.08) 100%)',
                    borderRadius: '3px'
                  }} />
                </div>

                <div style={{
                  width: '100%',
                  aspectRatio: '16/10',
                  background: '#000',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 2px 8px rgba(0, 0, 0, 0.6)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '14px',
                    display: 'flex',
                    gap: '8px',
                    zIndex: 100
                  }}>
                    {['#ff5f57', '#febc2e', '#28ca42'].map((color, idx) => (
                      <motion.div
                        key={idx}
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: color,
                          cursor: 'pointer',
                          boxShadow: `0 2px 6px ${color}80, inset 0 -1px 2px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.3)`
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      />
                    ))}
                  </div>

                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: screenGlow
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle at center, rgba(0, 113, 227, 0.18) 0%, transparent 70%)'
                    }} />
                  </motion.div>

                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: screenContent,
                      y: contentY
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: isDark 
                        ? 'linear-gradient(135deg, #0a0a0b 0%, #0f1419 50%, #0a0a0b 100%)'
                        : 'linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 50%, #f5f5f7 100%)',
                      padding: '52px 44px 44px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '24px',
                        right: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                        borderRadius: '100px',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.15)'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#ef4444',
                          boxShadow: '0 0 10px rgba(239, 68, 68, 0.7)',
                          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                        }} />
                        <span style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#ef4444',
                          letterSpacing: '0.04em',
                          fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
                        }}>RECORDING</span>
                      </div>

                      <div style={{
                        background: isDark 
                          ? 'rgba(255, 255, 255, 0.04)'
                          : 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(24px)',
                        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'}`,
                        borderRadius: '18px',
                        padding: '36px',
                        boxShadow: isDark 
                          ? '0 12px 48px rgba(0, 0, 0, 0.5)'
                          : '0 12px 48px rgba(0, 0, 0, 0.1)'
                      }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                          <div style={{
                            width: '52px',
                            height: '52px',
                            background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.18) 0%, rgba(0, 113, 227, 0.08) 100%)',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(0, 113, 227, 0.25)',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(0, 113, 227, 0.15)'
                          }}>
                            <Brain size={26} color={theme.accent} strokeWidth={2} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: theme.textTertiary,
                              letterSpacing: '0.1em',
                              marginBottom: '14px',
                              textTransform: 'uppercase',
                              fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
                            }}>Question 3 of 12</div>
                            <p style={{
                              fontSize: '19px',
                              lineHeight: '1.5',
                              color: isDark ? '#f5f5f7' : '#1d1d1f',
                              fontWeight: 500,
                              letterSpacing: '-0.015em',
                              margin: 0,
                              fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
                            }}>
                              Describe a situation where you successfully led a team through a complex technical challenge. What was your approach?
                            </p>
                          </div>
                        </div>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr',
                        gap: '18px',
                        marginTop: 'auto'
                      }}>
                        <div style={{
                          aspectRatio: '16/9',
                          background: isDark
                            ? 'linear-gradient(135deg, #1a1a1c 0%, #0f0f10 100%)'
                            : 'linear-gradient(135deg, #d1d1d6 0%, #b4b4b9 100%)',
                          borderRadius: '14px',
                          position: 'relative',
                          overflow: 'hidden',
                          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)'}`,
                          boxShadow: isDark 
                            ? 'inset 0 2px 8px rgba(0, 0, 0, 0.4)'
                            : 'inset 0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}>
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: isDark 
                              ? 'radial-gradient(circle at 30% 40%, rgba(0, 113, 227, 0.08) 0%, transparent 60%)'
                              : 'radial-gradient(circle at 30% 40%, rgba(0, 113, 227, 0.04) 0%, transparent 60%)'
                          }} />
                          <div style={{
                            position: 'absolute',
                            bottom: '14px',
                            left: '14px',
                            display: 'flex',
                            gap: '10px'
                          }}>
                            <div style={{
                              padding: '7px 12px',
                              background: 'rgba(0, 0, 0, 0.6)',
                              backdropFilter: 'blur(12px)',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '7px',
                              border: '1px solid rgba(255, 255, 255, 0.15)'
                            }}>
                              <Video size={13} color="#fff" strokeWidth={2.5} />
                              <span style={{ fontSize: '12px', color: '#fff', fontWeight: 700, fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif' }}>HD</span>
                            </div>
                            <div style={{
                              padding: '7px 12px',
                              background: 'rgba(0, 0, 0, 0.6)',
                              backdropFilter: 'blur(12px)',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '7px',
                              border: '1px solid rgba(255, 255, 255, 0.15)'
                            }}>
                              <Mic size={13} color="#fff" strokeWidth={2.5} />
                              <div style={{
                                width: '36px',
                                height: '4px',
                                background: 'rgba(255, 255, 255, 0.3)',
                                borderRadius: '2px',
                                overflow: 'hidden',
                                position: 'relative'
                              }}>
                                <div style={{
                                  position: 'absolute',
                                  left: 0,
                                  top: 0,
                                  height: '100%',
                                  width: '70%',
                                  background: '#10b981',
                                  borderRadius: '2px'
                                }} />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px'
                        }}>
                          {[1, 2].map((i) => (
                            <div key={i} style={{
                              flex: 1,
                              background: isDark
                                ? 'rgba(255, 255, 255, 0.03)'
                                : 'rgba(0, 0, 0, 0.04)',
                              borderRadius: '12px',
                              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`,
                              position: 'relative',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: isDark
                                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, transparent 100%)'
                                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%)'
                              }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 50%)',
                    pointerEvents: 'none'
                  }} />
                </div>
              </div>

             <div style={{
  height: '16px',
  background: `linear-gradient(180deg, ${theme.macBodyBottom} 0%, ${isDark ? '#0a0a0b' : '#b4b4b9'} 100%)`,
  borderRadius: '0 0 16px 16px',
  position: 'relative',
  boxShadow: isDark
    ? '0 12px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04)'
    : '0 12px 48px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.08)',
  borderTop: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease'
}}>
  <svg 
    width="26" 
    height="30" 
    viewBox="0 0 24 28" 
    fill="none"
    style={{ 
      opacity: isDark ? 0.5 : 0.4,
      marginTop: '-1px'
    }}
  >
    <path 
      d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" 
      fill={isDark ? '#ffffff' : '#000000'}
    />
  </svg>
</div>

              {/* Base without keyboard */}
              <div style={{
                marginTop: '4px',
                height: '24px',
                background: `linear-gradient(180deg, ${isDark ? '#1a1a1c' : '#d1d1d6'} 0%, ${isDark ? '#0a0a0b' : '#b4b4b9'} 100%)`,
                borderRadius: '0 0 18px 18px',
                position: 'relative',
                boxShadow: isDark
                  ? '0 16px 64px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.04)'
                  : '0 16px 64px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.08)',
                borderTop: 'none',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '120px',
                  height: '4px',
                  background: isDark 
                    ? 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent 100%)'
                    : 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.1) 80%, transparent 100%)',
                  borderRadius: '2px'
                }} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="features" style={{
        padding: '160px 24px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '100px' }}>
            <h2 style={{
              fontSize: 'clamp(40px, 5vw, 64px)',
              fontWeight: 700,
              letterSpacing: '-0.032em',
              marginBottom: '20px',
              lineHeight: '1.1',
              color: theme.text,
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>Built for excellence</h2>
            <p style={{
              fontSize: '21px',
              color: theme.textSecondary,
              lineHeight: '1.5',
              letterSpacing: '-0.015em',
              fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>Everything you need to prepare, practice, and perform</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '32px' }}>
            {[
              {
                icon: Brain,
                title: 'Intelligent Question Generation',
                desc: 'AI analyzes your resume and target role to generate highly relevant, personalized interview questions',
                color: '#0071e3'
              },
              {
                icon: Video,
                title: 'High-Fidelity Recording',
                desc: 'Practice with HD video capture and detailed playback analysis to refine your presentation and body language',
                color: '#bf5af2'
              },
              {
                icon: Mic,
                title: 'Advanced Voice Analysis',
                desc: 'Real-time feedback on speech clarity, pace, and confidence with actionable improvement suggestions',
                color: '#ff375f'
              },
              {
                icon: Zap,
                title: 'Instant AI Feedback',
                desc: 'Get immediate, comprehensive feedback on your answers with specific areas for improvement',
                color: '#ffd60a'
              },
              {
                icon: TrendingUp,
                title: 'Performance Analytics',
                desc: 'Track your progress over time with detailed metrics and insights on your interview skills',
                color: '#30d158'
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                desc: 'Your data is encrypted end-to-end and never shared. Practice with complete privacy and confidence',
                color: '#64d2ff'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                style={{
                  background: theme.glass,
                  backdropFilter: 'blur(40px)',
                  borderRadius: '24px',
                  padding: '40px',
                  border: `1px solid ${theme.border}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'default'
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: idx * 0.08, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                whileHover={{
                  borderColor: theme.borderHover,
                  y: -4,
                  transition: { duration: 0.2 }
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: `${feature.color}15`,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  border: `1px solid ${feature.color}30`
                }}>
                  <feature.icon size={28} color={feature.color} strokeWidth={2} />
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  marginBottom: '12px',
                  color: theme.text,
                  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
                }}>{feature.title}</h3>
                <p style={{
                  fontSize: '17px',
                  lineHeight: '1.55',
                  color: theme.textSecondary,
                  letterSpacing: '-0.012em',
                  margin: 0,
                  fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
                }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" style={{ padding: '160px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '100px' }}>
            <h2 style={{
              fontSize: 'clamp(40px, 5vw, 64px)',
              fontWeight: 700,
              letterSpacing: '-0.032em',
              marginBottom: '20px',
              lineHeight: '1.1',
              color: theme.text,
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>How it works</h2>
            <p style={{
              fontSize: '21px',
              color: theme.textSecondary,
              lineHeight: '1.5',
              letterSpacing: '-0.015em',
              fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>Three steps to interview mastery</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            {[
              {
                num: '01',
                title: 'Upload your professional profile',
                desc: 'Share your resume and career background. Our AI performs deep analysis of your experience, skills, and achievements to understand your unique professional story.'
              },
              {
                num: '02',
                title: 'Define your target role',
                desc: 'Provide the job description and requirements. The system intelligently matches your background with role expectations to generate perfectly tailored questions.'
              },
              {
                num: '03',
                title: 'Practice with precision',
                desc: 'Record high-quality video responses and receive comprehensive AI feedback. Track your improvement over time with detailed performance analytics and actionable insights.'
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.1, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
              >
                <div style={{
                  fontSize: '80px',
                  fontWeight: 700,
                  color: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                  letterSpacing: '-0.03em',
                  lineHeight: '1',
                  userSelect: 'none',
                  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
                }}>{step.num}</div>
                <div style={{ flex: 1, paddingTop: '8px' }}>
                  <h3 style={{
                    fontSize: '32px',
                    fontWeight: 600,
                    letterSpacing: '-0.025em',
                    marginBottom: '16px',
                    color: theme.text,
                    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
                  }}>{step.title}</h3>
                  <p style={{
                    fontSize: '19px',
                    lineHeight: '1.6',
                    color: theme.textSecondary,
                    letterSpacing: '-0.015em',
                    margin: 0,
                    fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
                  }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{
        padding: '160px 24px',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isDark
            ? 'radial-gradient(circle at 50% 50%, rgba(0, 113, 227, 0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(0, 113, 227, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <h2 style={{
              fontSize: 'clamp(44px, 6vw, 72px)',
              fontWeight: 700,
              letterSpacing: '-0.035em',
              lineHeight: '1.08',
              marginBottom: '28px',
              color: theme.text,
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              Ready to transform<br />your interview performance?
            </h2>
            <p style={{
              fontSize: '21px',
              color: theme.textSecondary,
              marginBottom: '48px',
              lineHeight: '1.5',
              letterSpacing: '-0.015em',
              fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              Join professionals who are mastering their interview skills<br />with AI-powered preparation
            </p>
            <motion.button
              style={{
                backgroundColor: theme.accent,
                color: '#fff',
                padding: '16px 36px',
                borderRadius: '980px',
                fontSize: '17px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                letterSpacing: '-0.015em',
                boxShadow: isDark 
                  ? '0 8px 32px rgba(0, 113, 227, 0.3)'
                  : '0 8px 32px rgba(0, 113, 227, 0.2)',
                fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.accentHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.accent}
            >
              Get started now
              <ArrowRight size={19} strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <footer style={{
        backgroundColor: isDark ? '#000' : '#f5f5f7',
        borderTop: `1px solid ${theme.border}`,
        padding: '64px 24px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #0071e3 0%, #005bb5 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(0, 113, 227, 0.25)'
            }}>
              <Sparkles size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{
              fontSize: '19px',
              fontWeight: 600,
              letterSpacing: '-0.022em',
              color: theme.text,
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>InterviewPro</span>
          </div>
          <p style={{
            fontSize: '14px',
            color: theme.textSecondary,
            margin: 0,
            fontWeight: 400,
            fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
          }}>© 2025 InterviewPro. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        * {
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        /* Fallback font stack */
        @supports not (font-variation-settings: normal) {
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;