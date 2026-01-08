import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './MemoryGame.css'


const CARD_PAIRS = [
  { id: 1, emoji: '🚀', name: 'rocket' },
  { id: 2, emoji: '⭐', name: 'star' },
  { id: 3, emoji: '🎮', name: 'gamepad' },
  { id: 4, emoji: '💎', name: 'diamond' },
  { id: 5, emoji: '🔥', name: 'fire' },
  { id: 6, emoji: '⚡', name: 'lightning' },
  { id: 7, emoji: '🎯', name: 'target' },
  { id: 8, emoji: '🎪', name: 'circus' }
]

function MemoryGame() {
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [bestScore, setBestScore] = useState(() => {
    return JSON.parse(localStorage.getItem('memoryBestScore') || 'null')
  })

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Initialize game
  const initGame = useCallback(() => {
    // Create pairs of cards
    const cardPairs = CARD_PAIRS.flatMap((card, index) => [
      { ...card, uniqueId: index * 2 },
      { ...card, uniqueId: index * 2 + 1 }
    ])
    
    setCards(shuffleArray(cardPairs))
    setFlippedCards([])
    setMatchedPairs([])
    setMoves(0)
    setTimer(0)
    setGameStarted(false)
    setGameComplete(false)
    setIsLocked(false)
  }, [])

  // Start timer when game starts
  useEffect(() => {
    let interval
    if (gameStarted && !gameComplete) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, gameComplete])

  // Check for game completion
  useEffect(() => {
    if (matchedPairs.length === CARD_PAIRS.length && matchedPairs.length > 0) {
      setGameComplete(true)
      
      // Check for best score
      const currentScore = { moves, time: timer }
      if (!bestScore || moves < bestScore.moves || 
          (moves === bestScore.moves && timer < bestScore.time)) {
        setBestScore(currentScore)
        localStorage.setItem('memoryBestScore', JSON.stringify(currentScore))
      }
    }
  }, [matchedPairs, moves, timer, bestScore])

  // Handle card click
  const handleCardClick = useCallback((uniqueId) => {
    if (isLocked) return
    if (flippedCards.includes(uniqueId)) return
    if (matchedPairs.some(pair => 
      cards.find(c => c.uniqueId === uniqueId)?.id === pair
    )) return

    // Start game on first click
    if (!gameStarted) {
      setGameStarted(true)
    }

    const newFlippedCards = [...flippedCards, uniqueId]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1)
      setIsLocked(true)

      const [first, second] = newFlippedCards
      const firstCard = cards.find(c => c.uniqueId === first)
      const secondCard = cards.find(c => c.uniqueId === second)

      if (firstCard.id === secondCard.id) {
        // Match found!
        setMatchedPairs(prev => [...prev, firstCard.id])
        setFlippedCards([])
        setIsLocked(false)
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setFlippedCards([])
          setIsLocked(false)
        }, 1000)
      }
    }
  }, [flippedCards, matchedPairs, cards, isLocked, gameStarted])

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Check if card is flipped
  const isCardFlipped = (uniqueId) => {
    return flippedCards.includes(uniqueId) || 
           matchedPairs.some(pair => 
             cards.find(c => c.uniqueId === uniqueId)?.id === pair
           )
  }

  // Check if card is matched
  const isCardMatched = (uniqueId) => {
    return matchedPairs.some(pair => 
      cards.find(c => c.uniqueId === uniqueId)?.id === pair
    )
  }

  // Initialize on mount
  useEffect(() => {
    initGame()
  }, [initGame])

  return (
    <div className="page-container">
      <Link to="/" className="back-link">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Volver al Menú
      </Link>

      <div className="game-container memory-container">
        <h1 className="title-arcade">🧠 Memory</h1>

        {/* Stats */}
        <div className="memory-stats">
          <div className="stat-item">
            <span className="stat-label">Movimientos</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat-item timer">
            <span className="stat-label">Tiempo</span>
            <span className="stat-value">{formatTime(timer)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pares</span>
            <span className="stat-value">{matchedPairs.length}/{CARD_PAIRS.length}</span>
          </div>
        </div>

        {/* Best Score */}
        {bestScore && (
          <div className="best-score">
            🏆 Mejor: {bestScore.moves} movimientos en {formatTime(bestScore.time)}
          </div>
        )}

        {/* Game Board */}
        <div className="memory-board">
          {cards.map((card) => (
            <div
              key={card.uniqueId}
              className={`memory-card ${isCardFlipped(card.uniqueId) ? 'flipped' : ''} ${isCardMatched(card.uniqueId) ? 'matched' : ''}`}
              onClick={() => handleCardClick(card.uniqueId)}
            >
              <div className="card-inner">
                <div className="card-front">
                  <span className="card-icon">❓</span>
                </div>
                <div className="card-back">
                  <span className="card-emoji">{card.emoji}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Game Complete Modal */}
        {gameComplete && (
          <div className="game-complete-overlay">
            <div className="complete-modal">
              <h2>🎉 ¡Felicidades!</h2>
              <p>Encontraste todos los pares</p>
              <div className="final-stats">
                <div className="final-stat">
                  <span>Movimientos</span>
                  <strong>{moves}</strong>
                </div>
                <div className="final-stat">
                  <span>Tiempo</span>
                  <strong>{formatTime(timer)}</strong>
                </div>
              </div>
              {bestScore && bestScore.moves === moves && bestScore.time === timer && (
                <div className="new-record">🏆 ¡Nuevo Récord!</div>
              )}
              <button onClick={initGame} className="btn btn-primary">
                Jugar de Nuevo
              </button>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="memory-controls">
          <button onClick={initGame} className="btn btn-secondary">
            Reiniciar
          </button>
        </div>

        {/* Instructions */}
        <div className="instructions">
          <p>Encuentra todos los pares de cartas con el menor número de movimientos</p>
          <p>Haz clic en las cartas para voltearlas</p>
        </div>
      </div>
    </div>
  )
}

export default MemoryGame
