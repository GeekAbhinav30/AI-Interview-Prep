import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles, Zap, Crown} from 'lucide-react';

const PricingPage = () => {
  const [isDark, setIsDark] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();

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
  };

  const plans = [
    {
      name: 'Starter',
      icon: Sparkles,
      price: { monthly: 19, annual: 15 },
      color: '#0071e3',
      description: 'Perfect for getting started',
      features: [
        '10 interview sessions per month',
        'Basic AI feedback',
        'Video recording & playback',
        'Question generation from resume',
        'Email support',
        'Performance tracking'
      ],
      cta: 'Start free trial',
      popular: false
    },
    {
      name: 'Professional',
      icon: Zap,
      price: { monthly: 49, annual: 39 },
      color: '#bf5af2',
      description: 'For serious interview preparation',
      features: [
        'Unlimited interview sessions',
        'Advanced AI feedback & insights',
        'HD video recording',
        'Custom question templates',
        'Priority support',
        'Detailed analytics dashboard',
        'Export performance reports',
        'Industry-specific questions'
      ],
      cta: 'Start free trial',
      popular: true
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: { monthly: 99, annual: 79 },
      color: '#ffd60a',
      description: 'For teams and organizations',
      features: [
        'Everything in Professional',
        'Team management dashboard',
        'Unlimited team members',
        'Custom branding',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced security & compliance',
        'SLA guarantees'
      ],
      cta: 'Contact sales',
      popular: false
    }
  ];

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
      {/* Background effects */}
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
      
      {/* Navigation */}
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
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <img
              src="/Logoo.png"
              alt="IntervStack Logo"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                objectFit: 'contain'
              }}
            />
            <span style={{
              fontSize: '17px',
              fontWeight: 600,
              letterSpacing: '-0.022em',
              color: theme.text,
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              IntervStack
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a onClick={() => navigate('/')} style={{ 
              fontSize: '14px', 
              fontWeight: 500, 
              color: theme.textSecondary,
              textDecoration: 'none',
              transition: 'color 0.2s',
              cursor: 'pointer',
              fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>Home</a>
            <a href="#faq" style={{ 
              fontSize: '14px', 
              fontWeight: 500, 
              color: theme.textSecondary,
              textDecoration: 'none',
              transition: 'color 0.2s',
              cursor: 'pointer',
              fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>FAQ</a>
            
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
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="4" fill={theme.text} />
                  <g stroke={theme.text} strokeWidth="1.5" strokeLinecap="round">
                    <line x1="8" y1="1" x2="8" y2="2.5" />
                    <line x1="8" y1="13.5" x2="8" y2="15" />
                    <line x1="1" y1="8" x2="2.5" y2="8" />
                    <line x1="13.5" y1="8" x2="15" y2="8" />
                  </g>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
            }}
            onClick={() => navigate('/start-practicing')}>
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        paddingTop: '140px',
        paddingBottom: '80px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0 24px' }}>
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
              }}>Simple, transparent pricing</span>
            </div>
            
            <h1 style={{
              fontSize: 'clamp(48px, 6vw, 80px)',
              fontWeight: 700,
              letterSpacing: '-0.035em',
              lineHeight: '1.05',
              marginBottom: '24px',
              color: theme.text,
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              Invest in your<br />career success
            </h1>
            
            <p style={{
              fontSize: '21px',
              lineHeight: '1.47',
              color: theme.textSecondary,
              marginBottom: '48px',
              maxWidth: '640px',
              margin: '0 auto 48px',
              letterSpacing: '-0.015em',
              fontWeight: 400,
              fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              Choose the perfect plan for your interview preparation journey.
              All plans include a 14-day free trial.
            </p>

            {/* Billing Toggle */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              padding: '6px',
              background: theme.glass,
              backdropFilter: 'blur(20px)',
              borderRadius: '100px',
              border: `1px solid ${theme.border}`,
            }}>
              <button
                onClick={() => setIsAnnual(false)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '100px',
                  border: 'none',
                  background: !isAnnual ? theme.accent : 'transparent',
                  color: !isAnnual ? '#fff' : theme.textSecondary,
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '100px',
                  border: 'none',
                  background: isAnnual ? theme.accent : 'transparent',
                  color: isAnnual ? '#fff' : theme.textSecondary,
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Annual
                <span style={{
                  padding: '2px 8px',
                  background: '#30d158',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 600
                }}>Save 20%</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{
        padding: '60px 24px 120px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '32px',
            alignItems: 'stretch'
          }}>
            {plans.map((plan, idx) => (
              <motion.div
                key={idx}
                style={{
                  position: 'relative',
                  background: theme.glass,
                  backdropFilter: 'blur(40px)',
                  borderRadius: '28px',
                  padding: plan.popular ? '44px' : '40px',
                  border: plan.popular 
                    ? `2px solid ${plan.color}50`
                    : `1px solid ${theme.border}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'default',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                whileHover={{
                  borderColor: plan.popular ? `${plan.color}80` : theme.borderHover,
                  y: -8,
                  transition: { duration: 0.2 }
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '6px 20px',
                    background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}dd 100%)`,
                    borderRadius: '100px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    boxShadow: `0 4px 16px ${plan.color}40`,
                    fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{
                  width: '64px',
                  height: '64px',
                  background: `${plan.color}15`,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  border: `1px solid ${plan.color}30`
                }}>
                  <plan.icon size={32} color={plan.color} strokeWidth={2} />
                </div>

                <h3 style={{
                  fontSize: '28px',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  marginBottom: '8px',
                  color: theme.text,
                  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
                }}>{plan.name}</h3>

                <p style={{
                  fontSize: '15px',
                  color: theme.textSecondary,
                  marginBottom: '28px',
                  fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
                }}>{plan.description}</p>

                <div style={{ marginBottom: '32px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontSize: '56px',
                      fontWeight: 700,
                      letterSpacing: '-0.04em',
                      color: theme.text,
                      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
                    }}>
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span style={{
                      fontSize: '17px',
                      color: theme.textSecondary,
                      fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
                    }}>
                      /month
                    </span>
                  </div>
                  {isAnnual && (
                    <p style={{
                      fontSize: '13px',
                      color: theme.textTertiary,
                      margin: 0,
                      fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
                    }}>
                      Billed annually (${plan.price.annual * 12}/year)
                    </p>
                  )}
                </div>

                <div style={{ 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  marginBottom: '32px'
                }}>
                  {plan.features.map((feature, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start'
                    }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: `${plan.color}20`,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        <Check size={12} color={plan.color} strokeWidth={3} />
                      </div>
                      <span style={{
                        fontSize: '15px',
                        lineHeight: '1.5',
                        color: theme.text,
                        fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
                      }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  style={{
                    width: '100%',
                    backgroundColor: plan.popular ? plan.color : theme.accent,
                    color: '#fff',
                    padding: '16px 32px',
                    borderRadius: '980px',
                    fontSize: '16px',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    letterSpacing: '-0.01em',
                    boxShadow: `0 8px 24px ${plan.color}30`,
                    fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => navigate('/start-practicing')}
                >
                  {plan.cta}
                  <ArrowRight size={18} strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" style={{
        padding: '120px 24px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{
              fontSize: 'clamp(40px, 5vw, 64px)',
              fontWeight: 700,
              letterSpacing: '-0.032em',
              marginBottom: '20px',
              lineHeight: '1.1',
              color: theme.text,
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>Frequently asked questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              {
                q: 'Can I switch plans later?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any charges.'
              },
              {
                q: 'What happens after the free trial?',
                a: 'Your 14-day free trial gives you full access to all features. After the trial, you\'ll be charged based on your selected plan unless you cancel.'
              },
              {
                q: 'Do you offer refunds?',
                a: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with IntervStack, contact us for a full refund.'
              },
              {
                q: 'Is my data secure?',
                a: 'Absolutely. We use enterprise-grade encryption and never share your data with third parties. Your interview practice is completely private.'
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.'
              }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                style={{
                  background: theme.glass,
                  backdropFilter: 'blur(40px)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: `1px solid ${theme.border}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                whileHover={{
                  borderColor: theme.borderHover,
                  transition: { duration: 0.2 }
                }}
              >
                <h3 style={{
                  fontSize: '21px',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  marginBottom: '12px',
                  color: theme.text,
                  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
                }}>{faq.q}</h3>
                <p style={{
                  fontSize: '17px',
                  lineHeight: '1.6',
                  color: theme.textSecondary,
                  margin: 0,
                  fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
                }}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '120px 24px 160px',
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
              Start your free trial today
            </h2>
            <p style={{
              fontSize: '21px',
              color: theme.textSecondary,
              marginBottom: '48px',
              lineHeight: '1.5',
              letterSpacing: '-0.015em',
              fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>
              14 days free. No credit card required.<br />Cancel anytime.
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
              onClick={() => navigate('/start-practicing')}
            >
              Get started now
              <ArrowRight size={19} strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
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
            <img
              src="/Logoo.png"
              alt="IntervStack Logo"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                objectFit: 'contain'
              }}
            />
            <span style={{
              fontSize: '19px',
              fontWeight: 600,
              letterSpacing: '-0.022em',
              color: theme.text,
              fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
            }}>IntervStack</span>
          </div>
          
          <p style={{
            fontSize: '14px',
            color: theme.textSecondary,
            margin: 0,
            fontWeight: 400,
            fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif'
          }}>© 2026 IntervStack. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        @supports not (font-variation-settings: normal) {
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          }
        }
      `}</style>
    </div>
  );
};

export default PricingPage;