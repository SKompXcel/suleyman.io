import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Container } from '@/components/Container'

export default function BananaFest() {
  const [bananaCount, setBananaCount] = useState(0)
  const [confetti, setConfetti] = useState([])
  
  useEffect(() => {
    // Create floating bananas
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    }))
    setConfetti(newConfetti)
  }, [])

  const addBanana = () => {
    setBananaCount(prev => prev + 1)
  }

  return (
    <>
      <Head>
        <title>🍌 Banana Fest - You Missed It! 🍌</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0.5;
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        
        .banana-rain {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
        }
        
        .banana-fall {
          position: absolute;
          font-size: 2rem;
          animation: fall linear infinite;
        }
        
        .floating-banana {
          animation: float 3s ease-in-out infinite;
        }
        
        .pulse-banana {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .rainbow-text {
          animation: rainbow 3s linear infinite;
        }
      `}</style>

      {/* Banana rain effect */}
      <div className="banana-rain">
        {confetti.map((item) => (
          <div
            key={item.id}
            className="banana-fall"
            style={{
              left: `${item.left}%`,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`,
            }}
          >
            🍌
          </div>
        ))}
      </div>

      <Container className="mt-16 sm:mt-32">
        <div className="mx-auto max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center gap-4 mb-6 text-8xl">
              <span className="floating-banana" style={{ animationDelay: '0s' }}>🍌</span>
              <span className="floating-banana" style={{ animationDelay: '0.5s' }}>🎉</span>
              <span className="floating-banana" style={{ animationDelay: '1s' }}>🍌</span>
            </div>
            
            <h1 className="text-6xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-6 rainbow-text">
              BANANA FEST 2024
            </h1>
            
            <div className="bg-yellow-100 dark:bg-yellow-900/30 border-4 border-yellow-400 rounded-2xl p-8 mb-8 pulse-banana">
              <p className="text-4xl font-bold text-yellow-800 dark:text-yellow-300 mb-4">
                ⚠️ DEAR AYA & MARYAM ⚠️
              </p>
              <p className="text-2xl text-yellow-700 dark:text-yellow-400">
                You missed THE event of the year!
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* What You Missed Section */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-2xl border-2 border-yellow-300">
              <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-6 flex items-center gap-3">
                <span className="text-4xl">😢</span> What You Missed:
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl">
                  <div className="text-5xl mb-3">🍌</div>
                  <h3 className="font-bold text-xl mb-2 text-zinc-800 dark:text-zinc-100">
                    Unlimited Bananas
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    All-you-can-eat banana buffet. We&apos;re talking smoothies, splits, bread, and more!
                  </p>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl">
                  <div className="text-5xl mb-3">🎵</div>
                  <h3 className="font-bold text-xl mb-2 text-zinc-800 dark:text-zinc-100">
                    Banana Beats
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    DJ spinning nothing but banana-themed bangers. &quot;Yes, We Have No Bananas&quot; on repeat!
                  </p>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl">
                  <div className="text-5xl mb-3">👗</div>
                  <h3 className="font-bold text-xl mb-2 text-zinc-800 dark:text-zinc-100">
                    Banana Fashion
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Everyone came dressed as bananas. It was glorious. It was yellow. It was legendary.
                  </p>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl">
                  <div className="text-5xl mb-3">🏆</div>
                  <h3 className="font-bold text-xl mb-2 text-zinc-800 dark:text-zinc-100">
                    Epic Memories
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Moments that will be talked about for generations. &quot;Remember Banana Fest &apos;24?&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Meme Gallery */}
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-6 text-center">
                🎭 The Banana Meme Gallery 🎭
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                {/* Meme Card 1 */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
                  <div className="text-9xl mb-4">🍌</div>
                  <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-2">
                    &quot;WHERE WERE YOU?&quot;
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400 italic">
                    - Everyone at Banana Fest
                  </p>
                </div>
                
                {/* Meme Card 2 */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
                  <div className="text-7xl mb-4">😭🍌</div>
                  <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-2">
                    &quot;THIS COULD HAVE BEEN US&quot;
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400 italic">
                    But you were playing
                  </p>
                </div>
                
                {/* Meme Card 3 */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
                  <div className="text-7xl mb-4">🎉🍌🎊</div>
                  <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-2">
                    &quot;FOMO LEVEL: MAXIMUM&quot;
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400 italic">
                    Achievement Unlocked!
                  </p>
                </div>
                
                {/* Meme Card 4 */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
                  <div className="text-7xl mb-4">🍌👑</div>
                  <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-2">
                    &quot;WENT BANANAS WITHOUT YOU&quot;
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400 italic">
                    Literally and figuratively
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Section */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-2xl text-center">
              <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
                Click to Express Your Regret
              </h2>
              
              <button
                onClick={addBanana}
                className="bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-bold py-6 px-12 rounded-full text-2xl shadow-lg transform hover:scale-110 transition-all"
              >
                🍌 I REGRET EVERYTHING 🍌
              </button>
              
              {bananaCount > 0 && (
                <div className="mt-6">
                  <p className="text-6xl mb-4">
                    {'🍌'.repeat(Math.min(bananaCount, 20))}
                  </p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    Regret Level: {bananaCount}
                    {bananaCount > 10 && " 🔥"}
                    {bananaCount > 20 && " MAXIMUM REGRET!"}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Message */}
            <div className="bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 dark:from-yellow-900/40 dark:via-yellow-800/40 dark:to-yellow-900/40 rounded-2xl p-8 text-center shadow-2xl">
              <p className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">
                🍌 BANANA FEST 2025? 🍌
              </p>
              <p className="text-xl text-zinc-700 dark:text-zinc-300 mb-4">
                Mark your calendars. Set your alarms. Tattoo it on your forehead.
              </p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                DON&apos;T MISS IT AGAIN! 
              </p>
              <div className="text-6xl mt-4 animate-bounce">
                🍌🎉🍌
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
