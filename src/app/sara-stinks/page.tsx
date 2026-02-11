'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Lock, ChevronLeft, ChevronRight, Play, Pause, Sparkles,
  Heart, Star, Gift, Cake, PartyPopper, Crown, Zap
} from 'lucide-react'

// Image paths
const IMAGES = [
  '/SaraBDAY/1.jpeg',
  '/SaraBDAY/2.jpg',
  '/SaraBDAY/3.jpg',
  '/SaraBDAY/4.jpeg',
  '/SaraBDAY/5.png',
  '/SaraBDAY/6.jpg',
  '/SaraBDAY/7.jpg',
  '/SaraBDAY/8.jpg',
  '/SaraBDAY/9.JPG',
]

// Fun facts easter eggs
const SARA_FACTS = [
  "Fun fact: Sara has been 19 for exactly 0 days! 🎂",
  "Achievement unlocked: Survived another year with Suleyman as a brother 🏆",
  "Sara's superpower: Making everyone laugh even when they're mad 😄",
  "Breaking news: Sara is still the family's favorite (don't tell anyone) 👑",
  "Did you know? Sara is 100% glue and 0% stink (despite the URL) ✨",
  "Plot twist: She's actually the smart one in the family 🧠",
]

export default function SaraBirthdayPage() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [showError, setShowError] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [showSecretMessage, setShowSecretMessage] = useState(false)
  const [currentFact, setCurrentFact] = useState('')
  const [showFact, setShowFact] = useState(false)
  const [retardCounter, setRetardCounter] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.toLowerCase() === 'suleyman') {
      setShowSparkles(true)
      setTimeout(() => setIsUnlocked(true), 800)
      // Show random fact after unlock
      setTimeout(() => {
        setCurrentFact(SARA_FACTS[Math.floor(Math.random() * SARA_FACTS.length)])
        setShowFact(true)
        setTimeout(() => setShowFact(false), 5000)
      }, 2000)
    } else {
      setRetardCounter(prev => prev + 1)
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    }
  }

  // Easter egg: Click counter
  const handleLogoClick = () => {
    setClickCount(prev => prev + 1)
    if (clickCount + 1 === 19) {
      setShowSecretMessage(true)
      setTimeout(() => setShowSecretMessage(false), 4000)
    }
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(10px); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          25% { background-position: 50% 50%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 50%; }
        }

        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-gradient-shift {
          background-size: 400% 400%;
          animation: gradient-shift 20s ease infinite;
        }
      `}</style>

      <div className="min-h-screen overflow-x-hidden relative">
        {/* Animated gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-pink-100 via-purple-100 via-rose-100 to-amber-50 animate-gradient-shift" />

        {/* Floating decorative elements */}
        <FloatingDecorations />

        {/* Secret message toast */}
        <AnimatePresence>
          {showSecretMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-2xl"
            >
              <p className="font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                🎉 You found the secret! You clicked 19 times for 19 years! 🎂
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fun fact notification */}
        <AnimatePresence>
          {showFact && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed top-8 right-8 z-50 max-w-sm px-6 py-4 bg-white/90 backdrop-blur-xl border-2 border-purple-300 rounded-2xl shadow-2xl"
            >
              <p className="text-sm text-gray-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {currentFact}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <PasswordLock
              key="lock"
              password={password}
              setPassword={setPassword}
              handleSubmit={handleSubmit}
              showError={showError}
              showSparkles={showSparkles}
              retardCounter={retardCounter}
            />
          ) : (
            <BirthdayContent key="content" onLogoClick={handleLogoClick} clickCount={clickCount} />
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

function FloatingDecorations() {
  const decorations = [
    { icon: Heart, color: 'text-pink-400', size: 'w-6 h-6', top: '10%', left: '10%', delay: 0 },
    { icon: Star, color: 'text-yellow-400', size: 'w-5 h-5', top: '20%', right: '15%', delay: 1 },
    { icon: Sparkles, color: 'text-purple-400', size: 'w-7 h-7', top: '70%', left: '8%', delay: 2 },
    { icon: Heart, color: 'text-rose-400', size: 'w-5 h-5', top: '80%', right: '10%', delay: 0.5 },
    { icon: Star, color: 'text-amber-400', size: 'w-6 h-6', top: '15%', right: '25%', delay: 1.5 },
    { icon: Sparkles, color: 'text-pink-400', size: 'w-5 h-5', top: '60%', right: '20%', delay: 2.5 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {decorations.map((deco, i) => {
        const Icon = deco.icon
        const style: any = { animationDelay: `${deco.delay}s` }
        if (deco.top) style.top = deco.top
        if (deco.left) style.left = deco.left
        if (deco.right) style.right = deco.right

        return (
          <div
            key={i}
            className={`absolute ${i % 2 === 0 ? 'animate-float' : 'animate-float-slow'} opacity-20`}
            style={style}
          >
            <Icon className={`${deco.size} ${deco.color}`} fill="currentColor" />
          </div>
        )
      })}
    </div>
  )
}

function PasswordLock({ password, setPassword, handleSubmit, showError, showSparkles, retardCounter }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Enhanced sparkles effect with confetti */}
      {showSparkles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Sparkles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              initial={{
                opacity: 1,
                scale: 0,
                x: '50vw',
                y: '50vh'
              }}
              animate={{
                opacity: 0,
                scale: [0, 1.5, 0],
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
                rotate: Math.random() * 360
              }}
              transition={{
                duration: 1.2,
                delay: i * 0.02,
                ease: 'easeOut'
              }}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                boxShadow: '0 0 15px #FCD34D'
              }}
            />
          ))}
          {/* Confetti */}
          {[...Array(50)].map((_, i) => {
            const colors = ['bg-pink-400', 'bg-purple-400', 'bg-yellow-400', 'bg-rose-400', 'bg-amber-400']
            return (
              <motion.div
                key={`confetti-${i}`}
                initial={{
                  opacity: 1,
                  x: '50vw',
                  y: '50vh',
                  rotate: 0
                }}
                animate={{
                  opacity: 0,
                  x: `${20 + Math.random() * 60}vw`,
                  y: `${100 + Math.random() * 20}vh`,
                  rotate: Math.random() * 720
                }}
                transition={{
                  duration: 1.5 + Math.random() * 0.5,
                  delay: i * 0.01,
                  ease: 'easeOut'
                }}
                className={`absolute w-3 h-3 ${colors[i % colors.length]} rounded-sm`}
              />
            )
          })}
        </div>
      )}

      <motion.div
        animate={showError ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative max-w-md w-full"
      >
        <div className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
          {/* Animated gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400 opacity-20 blur-xl animate-gradient-shift" />

          {/* Lock icon */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex justify-center mb-8 relative z-10"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full blur-xl opacity-50" />
              <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-full shadow-2xl">
                <Lock className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              {/* Rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border-2 border-yellow-400 rounded-full opacity-30"
                style={{ padding: '-4px' }}
              />
            </div>
          </motion.div>

          {/* Question */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl text-center mb-2 text-gray-800 relative z-10"
            style={{ fontFamily: "'Crimson Text', serif", fontWeight: 600 }}
          >
            Who's your favourite brother?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-600 text-center mb-8 italic relative z-10"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            (Hint: Also the most handsome one)
          </motion.p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div className="relative">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your answer..."
                className="w-full px-6 py-4 rounded-2xl border-2 border-yellow-400/50 bg-white/80 backdrop-blur-sm
                         focus:border-yellow-500 focus:ring-4 focus:ring-yellow-400/20 focus:outline-none
                         transition-all duration-300 text-lg text-gray-800"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                autoFocus
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600
                       hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 transition-all duration-300
                       text-white font-semibold text-lg shadow-lg hover:shadow-xl relative overflow-hidden group"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <span className="relative z-10">Unlock Birthday Surprise</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </motion.button>
          </form>

          {/* Error message */}
          <AnimatePresence>
            {showError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center mt-4 relative z-10 space-y-2"
              >
                <motion.p
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.1, 1] }}
                  className="text-lg font-bold text-red-500"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Retard Counter: +1 🤡
                </motion.p>
                <p
                  className="text-2xl font-bold text-gray-800"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Total: {retardCounter}
                </p>
                <p
                  className="text-sm text-gray-600 italic"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  (hint: the bestest one <span className="font-bold">definitely</span> is 😉)
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

function BirthdayContent({ onLogoClick, clickCount }: { onLogoClick: () => void; clickCount: number }) {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
      className="relative z-10 min-h-screen"
    >
      {/* Intro section with parallax */}
      <motion.div
        style={{ opacity, scale }}
        className="container mx-auto px-4 pt-12 md:pt-20 pb-8"
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Clickable sparkle - easter egg */}
          <motion.div
            onClick={onLogoClick}
            whileHover={{ scale: 1.2, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block cursor-pointer relative"
            title={clickCount > 0 ? `Clicks: ${clickCount}/19 🎉` : "Click me!"}
          >
            <Sparkles className="w-10 h-10 text-yellow-500 mx-auto drop-shadow-lg" fill="#EAB308" />
            {clickCount > 0 && clickCount < 19 && (
              <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {clickCount}
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1
              className="text-4xl md:text-6xl font-bold mb-4 pb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 bg-clip-text text-transparent leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Happy 19th Birthday!
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-lg md:text-xl text-gray-700 leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            I wanted to build you something special to show my appreciation.{' '}
            <span className="font-semibold text-purple-600">Happy 19th Birthday, Sara. 🤍</span>
          </motion.p>

          {/* Fun stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8"
          >
            <StatCard icon={Cake} label="Years Amazing" value="0" color="from-pink-400 to-rose-500" />
            <StatCard icon={Crown} label="Family Rank" value="#1" color="from-yellow-400 to-amber-500" />
            <StatCard icon={Heart} label="Love Level" value="∞" color="from-purple-400 to-pink-500" />
            <StatCard icon={Zap} label="Weight" value="9000+" color="from-orange-400 to-red-500" />
          </motion.div>
        </div>
      </motion.div>

      {/* Message section */}
      <MessageSection />

      {/* Carousel section */}
      <PhotoCarousel />

      {/* Footer with easter egg */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-12 text-center"
      >
        <p className="text-sm text-gray-500 italic" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Made with 💛 (and questionable coding skills) by your favorite brother
        </p>
        <p className="text-xs text-gray-400 mt-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          P.S. Yes, I know the URL says "sara-stinks" - it's called humor, look it up. While you're checking take a shower. 😏
        </p>
      </motion.div>

      {/* Bottom spacing */}
      <div className="h-20" />
    </motion.div>
  )
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateZ: 2 }}
      className="relative group cursor-pointer"
    >
      <div className={`backdrop-blur-xl bg-white/60 border border-white/60 rounded-2xl p-4 shadow-lg transition-all duration-300 group-hover:shadow-2xl`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
        <Icon className={`w-6 h-6 mx-auto mb-2 bg-gradient-to-br ${color} bg-clip-text text-transparent`} />
        <p className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>{value}</p>
        <p className="text-xs text-gray-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
      </div>
    </motion.div>
  )
}

function MessageSection() {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null)

  // Easter egg tooltips
  const tooltips: Record<string, string> = {
    'inspire': '❤️ Anger...',
    'chinese minion': '😂 Never letting you forget this',
    'glue': '🫶 Seriously though, take a shower',
    'sadies': '😭 We tried',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="relative backdrop-blur-xl bg-white/60 border-l-4 border-yellow-500
                     rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden group"
        >
          {/* Animated decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-bl-full transition-all duration-500 group-hover:scale-110" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-400/20 to-transparent rounded-tr-full transition-all duration-500 group-hover:scale-110" />

          {/* Floating hearts on hover */}
          <motion.div
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-6 h-6 text-pink-400" fill="currentColor" />
          </motion.div>

          <div
            className="relative space-y-6 text-gray-800 text-base md:text-lg leading-relaxed"
            style={{ fontFamily: "'Crimson Text', serif" }}
          >
            <p className="font-semibold text-xl md:text-2xl">Hi Sara,</p>

            <p>Today's a big day. It's honestly kind of bittersweet.</p>

            <p>
              I don't really know where to start, so I'll keep it simple. You once told me I{' '}
              <span
                className="relative cursor-help border-b-2 border-dotted border-purple-400"
                onMouseEnter={() => setHoveredWord('inspire')}
                onMouseLeave={() => setHoveredWord(null)}
              >
                inspire
                {hoveredWord === 'inspire' && (
                  <span className="absolute -top-8 left-0 bg-purple-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                    {tooltips['inspire']}
                  </span>
                )}
              </span>{' '}
              you. That's one of the best things an older brother can hear. But you should know you inspire me
              every day too. You're a big reason I work as hard as I do.
            </p>

            <p>
              This past year has been stressful, and I know you've carried a lot on your shoulders. I see it.
              And I'm genuinely grateful for it. It makes me proud — and it makes me happy, even if I don't
              always say it properly.
            </p>

            <p>I wish I could do more for you and for the whole family. Inshallah, one day I will.</p>

            <p>
              I'm also grateful for the age gap. I got to watch you grow into who you are — from the tiny
              little menace running around my legs ({' '}
              <span
                className="relative cursor-help border-b-2 border-dotted border-pink-400"
                onMouseEnter={() => setHoveredWord('chinese minion')}
                onMouseLeave={() => setHoveredWord(null)}
              >
                little chinese minion
                {hoveredWord === 'chinese minion' && (
                  <span className="absolute -top-8 left-0 bg-pink-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap z-10">
                    {tooltips['chinese minion']}
                  </span>
                )}
              </span>
              )… to the day I watched you start at McMaster… to now. It's been a blessing seeing you become the person you've become.
            </p>

            <p>
              And for the record, you're the{' '}
              <span
                className="relative cursor-help border-b-2 border-dotted border-yellow-400 font-semibold"
                onMouseEnter={() => setHoveredWord('glue')}
                onMouseLeave={() => setHoveredWord(null)}
              >
                glue
                {hoveredWord === 'glue' && (
                  <span className="absolute -top-8 left-0 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap z-10">
                    {tooltips['glue']}
                  </span>
                )}
              </span>{' '}
              of this family. Mama and Baba raised us to protect our only sister like it's a job title, and honestly… fair. You have this way of calming everyone
              down when things get heated, like you're the family's option.
            </p>

            <p>
              I won't make this too{' '}
              <span
                className="relative cursor-help border-b-2 border-dotted border-blue-400"
                onMouseEnter={() => setHoveredWord('sadies')}
                onMouseLeave={() => setHoveredWord(null)}
              >
                sadies
                {hoveredWord === 'sadies' && (
                  <span className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap z-10">
                    {tooltips['sadies']}
                  </span>
                )}
              </span>
              . Just know I'm always here. If you need me, I'm one call away.
              I hope you take comfort in that.
            </p>

            <p>
              So, from the proudest, strongest, most handsomest brother in the world (objectively,
              scientifically, unanimously agreed upon):
            </p>

            <motion.p
              className="font-semibold text-xl"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Happy Birthday, Sara. 🤍
            </motion.p>

            <p className="font-semibold">
              Love,<br />
              Suleyman
            </p>

            <motion.p
              className="italic text-base opacity-75 pt-4"
              whileHover={{ scale: 1.1, opacity: 1 }}
              transition={{ type: 'spring' }}
            >
              You're ugly and fat
            </motion.p>

            <p className="text-xs opacity-50">(jk you're aight)</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [direction, setDirection] = useState(0)
  const [likeCount, setLikeCount] = useState(0)
  const [showLikeHeart, setShowLikeHeart] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isPlaying])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsPlaying(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % IMAGES.length)
  }

  const handlePrevious = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext()
      } else {
        handlePrevious()
      }
    }
  }

  const handleLike = () => {
    setLikeCount(prev => prev + 1)
    setShowLikeHeart(true)
    setTimeout(() => setShowLikeHeart(false), 1000)
  }

  const rotations = [2, -2, 2, -2, 2, -2, 2, -2, 2]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative z-20"
        >
          <h2
            className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Memory Lane
          </h2>
          <p className="text-gray-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {IMAGES.length} moments of pure awesomeness ✨
          </p>
        </motion.div>

        {/* Carousel container */}
        <div
          className="relative aspect-[4/3] md:aspect-[3/2] mt-8"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleLike}
        >
          {/* Like animation */}
          <AnimatePresence>
            {showLikeHeart && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 1.5, 1.2], opacity: [1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              >
                <Heart className="w-24 h-24 text-red-500" fill="currentColor" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Photos */}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{
                opacity: 0,
                x: direction > 0 ? 300 : -300,
                scale: 0.8,
                rotateZ: direction > 0 ? 10 : -10,
                rotateY: direction > 0 ? 20 : -20
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                rotateZ: rotations[currentIndex],
                rotateY: 0
              }}
              exit={{
                opacity: 0,
                x: direction > 0 ? -300 : 300,
                scale: 0.8,
                rotateZ: direction > 0 ? -10 : 10,
                rotateY: direction > 0 ? -20 : 20
              }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Polaroid frame */}
              <motion.div
                className="relative w-[85%] md:w-[70%] bg-white rounded-lg shadow-2xl p-4 md:p-6 pb-12 md:pb-16 hover:shadow-3xl transition-shadow duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-gray-100 rounded">
                  <Image
                    src={IMAGES[currentIndex]}
                    alt={`Memory ${currentIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 85vw, 50vw"
                    priority={currentIndex === 0}
                  />
                </div>

                {/* Polaroid caption area with counter */}
                <div className="absolute bottom-2 left-4 right-4 h-8 flex items-center justify-between px-2">
                  <p
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {currentIndex + 1} / {IMAGES.length}
                  </p>
                  {likeCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 text-red-500"
                    >
                      <Heart className="w-4 h-4" fill="currentColor" />
                      <span className="text-xs font-semibold">{likeCount}</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows - enhanced */}
          <motion.button
            onClick={handlePrevious}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 md:p-4 rounded-full
                     bg-white/90 backdrop-blur-sm border border-yellow-400/50
                     hover:bg-yellow-400 hover:border-yellow-500
                     transition-all duration-300 shadow-lg group"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-white transition-colors" />
          </motion.button>

          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 md:p-4 rounded-full
                     bg-white/90 backdrop-blur-sm border border-yellow-400/50
                     hover:bg-yellow-400 hover:border-yellow-500
                     transition-all duration-300 shadow-lg group"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-white transition-colors" />
          </motion.button>

          {/* Enhanced controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <motion.button
              onClick={() => setIsPlaying(!isPlaying)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-white/90 backdrop-blur-sm border border-yellow-400/50
                       hover:bg-yellow-400 hover:border-yellow-500
                       transition-all duration-300 shadow-lg group"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 md:w-5 md:h-5 text-gray-700 group-hover:text-white transition-colors" fill="currentColor" />
              ) : (
                <Play className="w-4 h-4 md:w-5 md:h-5 text-gray-700 group-hover:text-white transition-colors" fill="currentColor" />
              )}
            </motion.button>

            <motion.button
              onClick={handleLike}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-white/90 backdrop-blur-sm border border-pink-400/50
                       hover:bg-pink-400 hover:border-pink-500
                       transition-all duration-300 shadow-lg group"
              aria-label="Like this photo"
            >
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-gray-700 group-hover:text-white transition-colors" fill={likeCount > 0 ? "currentColor" : "none"} />
            </motion.button>
          </div>
        </div>

        {/* Enhanced dot indicators */}
        <div className="flex justify-center gap-2 mt-20 md:mt-16 flex-wrap relative z-20">
          {IMAGES.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>

        {/* Pro tip */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-gray-500 mt-6 italic relative z-20"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          💡 Pro tip: Double-click a photo to like it, or use arrow keys to navigate
        </motion.p>
      </div>
    </motion.div>
  )
}
