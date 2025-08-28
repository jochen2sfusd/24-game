import Link from 'next/link'

export default function LeaderboardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <Link href="/" className="inline-block mb-4">
            <button className="header-icon">🏠</button>
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4">🏆 Leaderboards</h1>
          <p className="text-xl text-gray-300">See the best players and compete for the top spot</p>
        </header>

        {/* Coming Soon Message */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-6">🚧</div>
            <h2 className="text-3xl font-bold text-white mb-4">Coming Soon!</h2>
            <p className="text-gray-300 mb-6 text-lg">
              Leaderboards are currently in development. Soon you&apos;ll be able to:
            </p>
            <ul className="text-left text-gray-300 space-y-2 mb-8">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                View global rankings for each game
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Compare your scores with friends
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Track your personal bests
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Earn achievements and badges
              </li>
            </ul>
            <Link href="/games/24">
              <button className="action-btn primary">
                <span>🎯 Play 24 Game</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
