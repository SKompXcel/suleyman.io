'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ChevronLeft, ChevronRight, Play, Pause, Sparkles } from 'lucide-react'

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

export default function SaraBirthdayPage() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [showError, setShowError] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.toLowerCase() === 'suleyman') {
      setShowSparkles(true)
      setTimeout(() => setIsUnlocked(true), 800)
    } else {
      setShowError(true)
      setTimeout(() => setShowError(false), 600)
    }
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <div className="min-h-screen overflow-x-hidden">
        {/* Animated gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-amber-50 animate-gradient-shift" />

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <PasswordLock
              key="lock"
              password={password}
              setPassword={setPassword}
              handleSubmit={handleSubmit}
              showError={showError}
              showSparkles={showSparkles}
            />
          ) : (
            <BirthdayContent key="content" />
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
      `}</style>
    </>
  )
}

function PasswordLock({ password, setPassword, handleSubmit, showError, showSparkles }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Sparkles effect */}
      {showSparkles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                scale: 0,
                x: '50vw',
                y: '50vh'
              }}
              animate={{
                opacity: 0,
                scale: 1,
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
                rotate: Math.random() * 360
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.03,
                ease: 'easeOut'
              }}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                boxShadow: '0 0 10px #D4AF37'
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        animate={showError ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative max-w-md w-full"
      >
        <div className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Lock icon */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full blur-xl opacity-50" />
              <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-full">
                <Lock className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
            </div>
          </motion.div>

          {/* Question */}
          <h2
            className="text-2xl md:text-3xl text-center mb-8 text-gray-800"
            style={{ fontFamily: "'Crimson Text', serif", fontWeight: 600 }}
          >
            Who's your favourite brother?
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600
                       hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300
                       text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02]
                       active:scale-[0.98]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Unlock
            </button>
          </form>

          {/* Error message */}
          <AnimatePresence>
            {showError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm mt-4 text-gray-600"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Try again... (hint: it's not Suleyman... jk it definitely is)
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

function BirthdayContent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
      className="relative z-10 min-h-screen"
    >
      {/* Intro section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="container mx-auto px-4 pt-12 md:pt-20 pb-8"
      >
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            <Sparkles className="w-8 h-8 text-yellow-500 mx-auto" fill="#EAB308" />
          </motion.div>
          <p
            className="text-lg md:text-xl text-gray-700 leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            I wanted to build you something special to show my appreciation.{' '}
            <span className="font-semibold">Happy 19th Birthday, Sara. 🤍</span>
          </p>
        </div>
      </motion.div>

      {/* Message section */}
      <MessageSection />

      {/* Carousel section */}
      <PhotoCarousel />

      {/* Bottom spacing */}
      <div className="h-20" />
    </motion.div>
  )
}

function MessageSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-2xl mx-auto">
        <div
          className="relative backdrop-blur-xl bg-white/60 border-l-4 border-yellow-500
                     rounded-3xl shadow-2xl p-8 md:p-12"
        >
          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-yellow-400/20 to-transparent rounded-tr-full" />

          <div
            className="relative space-y-6 text-gray-800 text-base md:text-lg leading-relaxed"
            style={{ fontFamily: "'Crimson Text', serif" }}
          >
            <p className="font-semibold text-xl md:text-2xl">Hi Sara,</p>

            <p>Today's a big day. It's honestly kind of bittersweet.</p>

            <p>
              I don't really know where to start, so I'll keep it simple. You once told me I inspire you.
              That's one of the best things an older brother can hear. But you should know you inspire me
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
              little menace running around my legs (little chinese minion)… to the day I watched you start
              at McMaster… to now. It's been a blessing seeing you become the person you've become.
            </p>

            <p>
              And for the record, you're the glue of this family. Mama and Baba raised us to protect our
              only sister like it's a job title, and honestly… fair. You have this way of calming everyone
              down when things get heated, like you're the family's option.
            </p>

            <p>
              I won't make this too sadies. Just know I'm always here. If you need me, I'm one call away.
              I hope you take comfort in that.
            </p>

            <p>
              So, from the proudest, strongest, most handsomest brother in the world (objectively,
              scientifically, unanimously agreed upon):
            </p>

            <p className="font-semibold text-xl">Happy Birthday, Sara. 🤍</p>

            <p className="font-semibold">
              Love,<br />
              Suleyman
            </p>

            <p className="italic text-base opacity-75 pt-4">You're ugly and fat</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [direction, setDirection] = useState(0)
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
        {/* Carousel container */}
        <div
          className="relative aspect-[4/3] md:aspect-[3/2]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Photos */}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 300 : -300, scale: 0.8, rotateZ: direction > 0 ? 10 : -10 }}
              animate={{ opacity: 1, x: 0, scale: 1, rotateZ: rotations[currentIndex] }}
              exit={{ opacity: 0, x: direction > 0 ? -300 : 300, scale: 0.8, rotateZ: direction > 0 ? -10 : 10 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Polaroid frame */}
              <div className="relative w-[85%] md:w-[70%] bg-white rounded-lg shadow-2xl p-4 md:p-6 pb-12 md:pb-16">
                <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                  <Image
                    src={IMAGES[currentIndex]}
                    alt={`Memory ${currentIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 85vw, 50vw"
                    priority={currentIndex === 0}
                  />
                </div>

                {/* Polaroid caption area */}
                <div className="absolute bottom-2 left-4 right-4 h-8 flex items-center justify-center">
                  <p
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {currentIndex + 1} / {IMAGES.length}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 md:p-4 rounded-full
                     bg-white/80 backdrop-blur-sm border border-yellow-400/50
                     hover:bg-yellow-400 hover:border-yellow-500 hover:scale-110
                     transition-all duration-300 shadow-lg group"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-white transition-colors" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 md:p-4 rounded-full
                     bg-white/80 backdrop-blur-sm border border-yellow-400/50
                     hover:bg-yellow-400 hover:border-yellow-500 hover:scale-110
                     transition-all duration-300 shadow-lg group"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-white transition-colors" />
          </button>

          {/* Play/Pause button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-4 right-4 z-10 p-3 rounded-full
                     bg-white/80 backdrop-blur-sm border border-yellow-400/50
                     hover:bg-yellow-400 hover:border-yellow-500 hover:scale-110
                     transition-all duration-300 shadow-lg group"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 md:w-5 md:h-5 text-gray-700 group-hover:text-white transition-colors" fill="currentColor" />
            ) : (
              <Play className="w-4 h-4 md:w-5 md:h-5 text-gray-700 group-hover:text-white transition-colors" fill="currentColor" />
            )}
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-yellow-500'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
