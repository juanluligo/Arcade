import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './SnakeGame.css'

// ========================================
// LISTA DOBLEMENTE ENLAZADA (Data Structure)
// ========================================
class Nodo {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.anterior = null
    this.siguiente = null
  }
}

class ListaDoblementeEnlazada {
  constructor() {
    this.cabeza = null
    this.cola = null
    this.tamano = 0
  }

  agregarAlInicio(x, y) {
    const nuevoNodo = new Nodo(x, y)
    if (!this.cabeza) {
      this.cabeza = nuevoNodo
      this.cola = nuevoNodo
    } else {
      nuevoNodo.siguiente = this.cabeza
      this.cabeza.anterior = nuevoNodo
      this.cabeza = nuevoNodo
    }
    this.tamano++
  }

  eliminarDelFinal() {
    if (!this.cabeza) return
    if (!this.cabeza.siguiente) {
      this.cabeza = null
      this.cola = null
    } else {
      this.cola = this.cola.anterior
      this.cola.siguiente = null
    }
    this.tamano--
  }

  obtener(index) {
    if (index < 0 || index >= this.tamano) return null
    let actual = this.cabeza
    let contador = 0
    while (contador < index) {
      actual = actual.siguiente
      contador++
    }
    return actual
  }

  recorrer(callback) {
    let actual = this.cabeza
    while (actual) {
      callback(actual)
      actual = actual.siguiente
    }
  }

  buscarColision(x, y) {
    let actual = this.cabeza ? this.cabeza.siguiente : null
    while (actual) {
      if (actual.x === x && actual.y === y) return true
      actual = actual.siguiente
    }
    return false
  }

  limpiar() {
    this.cabeza = null
    this.cola = null
    this.tamano = 0
  }
}

// ========================================
// SNAKE GAME COMPONENT
// ========================================
function SnakeGame() {
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState('waiting') // waiting, playing, paused, gameOver
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snakeHighScore') || '0')
  })

  // Game configuration
  const CONFIG = {
    CANVAS_SIZE: 400,
    GRID_SIZE: 20,
    INITIAL_SPEED: 150,
    MIN_SPEED: 80,
    SPEED_INCREMENT: 5
  }

  // Initialize game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    gameRef.current = {
      ctx,
      snake: new ListaDoblementeEnlazada(),
      direction: { x: 1, y: 0 },
      lastDirection: { x: 1, y: 0 },
      food: { x: 0, y: 0 },
      speed: CONFIG.INITIAL_SPEED,
      intervalId: null
    }

    // Initialize snake
    gameRef.current.snake.agregarAlInicio(10, 10)
    
    // Generate initial food
    generateFood()
    
    // Draw initial state
    draw()
  }, [])

  // Generate food at safe position
  const generateFood = useCallback(() => {
    const game = gameRef.current
    const gridCount = CONFIG.CANVAS_SIZE / CONFIG.GRID_SIZE
    let attempts = 0
    
    do {
      game.food.x = Math.floor(Math.random() * gridCount)
      game.food.y = Math.floor(Math.random() * gridCount)
      attempts++
    } while (isFoodOnSnake() && attempts < 100)
  }, [])

  const isFoodOnSnake = () => {
    const game = gameRef.current
    let isOnSnake = false
    game.snake.recorrer(node => {
      if (node.x === game.food.x && node.y === game.food.y) {
        isOnSnake = true
      }
    })
    return isOnSnake
  }

  // Main game loop
  const gameLoop = useCallback(() => {
    const game = gameRef.current
    
    // Update last direction
    game.lastDirection = { ...game.direction }
    
    // Get head position
    const head = game.snake.obtener(0)
    const newX = head.x + game.direction.x
    const newY = head.y + game.direction.y
    
    // Check wall collision
    const gridCount = CONFIG.CANVAS_SIZE / CONFIG.GRID_SIZE
    if (newX < 0 || newX >= gridCount || newY < 0 || newY >= gridCount) {
      endGame()
      return
    }
    
    // Check self collision
    if (game.snake.buscarColision(newX, newY)) {
      endGame()
      return
    }
    
    // Move snake
    game.snake.agregarAlInicio(newX, newY)
    
    // Check food collision
    if (newX === game.food.x && newY === game.food.y) {
      // Don't remove tail (snake grows)
      setScore(prev => {
        const newScore = prev + 10
        
        // Speed up every 50 points
        if (newScore % 50 === 0 && game.speed > CONFIG.MIN_SPEED) {
          game.speed -= CONFIG.SPEED_INCREMENT
          clearInterval(game.intervalId)
          game.intervalId = setInterval(gameLoop, game.speed)
        }
        
        return newScore
      })
      generateFood()
    } else {
      game.snake.eliminarDelFinal()
    }
    
    draw()
  }, [generateFood])

  // Draw everything
  const draw = useCallback(() => {
    const game = gameRef.current
    const ctx = game.ctx
    const size = CONFIG.GRID_SIZE
    
    // Clear canvas
    ctx.fillStyle = '#0a0a0f'
    ctx.fillRect(0, 0, CONFIG.CANVAS_SIZE, CONFIG.CANVAS_SIZE)
    
    // Draw grid (subtle)
    ctx.strokeStyle = '#1a1a2e'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= CONFIG.CANVAS_SIZE; i += size) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, CONFIG.CANVAS_SIZE)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(CONFIG.CANVAS_SIZE, i)
      ctx.stroke()
    }
    
    // Draw food
    ctx.fillStyle = '#fd79a8'
    ctx.shadowColor = '#fd79a8'
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.arc(
      game.food.x * size + size / 2,
      game.food.y * size + size / 2,
      size / 2 - 2,
      0,
      Math.PI * 2
    )
    ctx.fill()
    ctx.shadowBlur = 0
    
    // Draw snake
    let index = 0
    game.snake.recorrer(node => {
      if (index === 0) {
        // Head
        ctx.fillStyle = '#00b894'
        ctx.shadowColor = '#00b894'
        ctx.shadowBlur = 10
      } else {
        // Body
        ctx.fillStyle = '#00cec9'
        ctx.shadowBlur = 0
      }
      
      ctx.beginPath()
      ctx.roundRect(
        node.x * size + 1,
        node.y * size + 1,
        size - 2,
        size - 2,
        4
      )
      ctx.fill()
      
      // Eyes on head
      if (index === 0) {
        ctx.fillStyle = '#000'
        ctx.shadowBlur = 0
        const eyeSize = 3
        const eyeOffset = 5
        ctx.fillRect(node.x * size + eyeOffset, node.y * size + eyeOffset, eyeSize, eyeSize)
        ctx.fillRect(node.x * size + size - eyeOffset - eyeSize, node.y * size + eyeOffset, eyeSize, eyeSize)
      }
      
      index++
    })
    
    ctx.shadowBlur = 0
  }, [])

  // Start game
  const startGame = useCallback(() => {
    const game = gameRef.current
    setGameState('playing')
    game.intervalId = setInterval(gameLoop, game.speed)
  }, [gameLoop])

  // Pause game
  const pauseGame = useCallback(() => {
    const game = gameRef.current
    if (gameState === 'playing') {
      clearInterval(game.intervalId)
      setGameState('paused')
    } else if (gameState === 'paused') {
      game.intervalId = setInterval(gameLoop, game.speed)
      setGameState('playing')
    }
  }, [gameState, gameLoop])

  // End game
  const endGame = useCallback(() => {
    const game = gameRef.current
    clearInterval(game.intervalId)
    setGameState('gameOver')
    
    // Update high score
    setScore(currentScore => {
      if (currentScore > highScore) {
        setHighScore(currentScore)
        localStorage.setItem('snakeHighScore', currentScore.toString())
      }
      return currentScore
    })
  }, [highScore])

  // Restart game
  const restartGame = useCallback(() => {
    const game = gameRef.current
    clearInterval(game.intervalId)
    
    // Reset game state
    game.snake.limpiar()
    game.snake.agregarAlInicio(10, 10)
    game.direction = { x: 1, y: 0 }
    game.lastDirection = { x: 1, y: 0 }
    game.speed = CONFIG.INITIAL_SPEED
    
    setScore(0)
    generateFood()
    draw()
    setGameState('waiting')
  }, [generateFood, draw])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const game = gameRef.current
      if (!game) return

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          if (game.lastDirection.y !== 1) {
            game.direction = { x: 0, y: -1 }
          }
          if (gameState === 'waiting') startGame()
          break
        case 'ArrowDown':
          e.preventDefault()
          if (game.lastDirection.y !== -1) {
            game.direction = { x: 0, y: 1 }
          }
          if (gameState === 'waiting') startGame()
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (game.lastDirection.x !== 1) {
            game.direction = { x: -1, y: 0 }
          }
          if (gameState === 'waiting') startGame()
          break
        case 'ArrowRight':
          e.preventDefault()
          if (game.lastDirection.x !== -1) {
            game.direction = { x: 1, y: 0 }
          }
          if (gameState === 'waiting') startGame()
          break
        case 'p':
        case 'P':
          pauseGame()
          break
        case 'r':
        case 'R':
          restartGame()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, startGame, pauseGame, restartGame])

  // Initialize on mount
  useEffect(() => {
    initGame()
    return () => {
      if (gameRef.current?.intervalId) {
        clearInterval(gameRef.current.intervalId)
      }
    }
  }, [initGame])

  return (
    <div className="page-container">
      <Link to="/" className="back-link">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Volver al Menú
      </Link>

      <div className="game-container snake-container">
        <h1 className="title-arcade">🐍 Snake</h1>
        
        <div className="score-row">
          <div className="score-display">Puntos: {score}</div>
          <div className="high-score">Récord: {highScore}</div>
        </div>

        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={CONFIG.CANVAS_SIZE}
            height={CONFIG.CANVAS_SIZE}
            className="game-canvas"
          />
          
          {gameState === 'waiting' && (
            <div className="game-overlay">
              <div className="overlay-content">
                <span className="overlay-icon">🐍</span>
                <p>Presiona una flecha para comenzar</p>
              </div>
            </div>
          )}
          
          {gameState === 'paused' && (
            <div className="game-overlay">
              <div className="overlay-content">
                <h2>PAUSADO</h2>
                <p>Presiona P para continuar</p>
              </div>
            </div>
          )}
          
          {gameState === 'gameOver' && (
            <div className="game-overlay game-over">
              <div className="overlay-content">
                <h2>GAME OVER</h2>
                <p className="final-score">Puntuación: {score}</p>
                <button onClick={restartGame} className="btn btn-primary">
                  Jugar de Nuevo
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="instructions">
          <p><kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> Mover</p>
          <p><kbd>P</kbd> Pausar | <kbd>R</kbd> Reiniciar</p>
        </div>
      </div>
    </div>
  )
}

export default SnakeGame
