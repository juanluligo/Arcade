import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './TicTacToe.css'

// ========================================
// TIC TAC TOE - CON IA MINIMAX
// ========================================

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [gameMode, setGameMode] = useState(null) // 'pvp' | 'ai'
  const [difficulty, setDifficulty] = useState('hard') // 'easy' | 'medium' | 'hard'
  const [scores, setScores] = useState({ x: 0, o: 0, ties: 0 })
  const [winLine, setWinLine] = useState(null)

  // Winning combinations
  const WINNING_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ]

  // Check for winner
  const calculateWinner = useCallback((squares) => {
    for (let i = 0; i < WINNING_LINES.length; i++) {
      const [a, b, c] = WINNING_LINES[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: WINNING_LINES[i] }
      }
    }
    return null
  }, [])

  // Check if board is full
  const isBoardFull = (squares) => squares.every(square => square !== null)

  // Minimax Algorithm for AI
  const minimax = useCallback((squares, depth, isMaximizing, alpha, beta) => {
    const result = calculateWinner(squares)
    
    // Terminal states
    if (result?.winner === 'O') return 10 - depth
    if (result?.winner === 'X') return depth - 10
    if (isBoardFull(squares)) return 0
    
    // Depth limit for easier difficulties
    const maxDepth = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 9
    if (depth >= maxDepth) return 0

    if (isMaximizing) {
      let maxEval = -Infinity
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          squares[i] = 'O'
          const evalScore = minimax(squares, depth + 1, false, alpha, beta)
          squares[i] = null
          maxEval = Math.max(maxEval, evalScore)
          alpha = Math.max(alpha, evalScore)
          if (beta <= alpha) break
        }
      }
      return maxEval
    } else {
      let minEval = Infinity
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          squares[i] = 'X'
          const evalScore = minimax(squares, depth + 1, true, alpha, beta)
          squares[i] = null
          minEval = Math.min(minEval, evalScore)
          beta = Math.min(beta, evalScore)
          if (beta <= alpha) break
        }
      }
      return minEval
    }
  }, [calculateWinner, difficulty])

  // Get AI move
  const getAIMove = useCallback((squares) => {
    // Add randomness for easier modes
    if (difficulty === 'easy' && Math.random() < 0.4) {
      const emptySquares = squares.map((s, i) => s === null ? i : null).filter(i => i !== null)
      return emptySquares[Math.floor(Math.random() * emptySquares.length)]
    }

    let bestScore = -Infinity
    let bestMove = null
    
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = 'O'
        const score = minimax(squares, 0, false, -Infinity, Infinity)
        squares[i] = null
        
        if (score > bestScore) {
          bestScore = score
          bestMove = i
        }
      }
    }
    
    return bestMove
  }, [minimax, difficulty])

  // Handle cell click
  const handleClick = useCallback((index) => {
    if (board[index] || calculateWinner(board) || (!isXNext && gameMode === 'ai')) {
      return
    }

    const newBoard = [...board]
    newBoard[index] = isXNext ? 'X' : 'O'
    setBoard(newBoard)

    const result = calculateWinner(newBoard)
    if (result) {
      setWinLine(result.line)
      setScores(prev => ({
        ...prev,
        [result.winner.toLowerCase()]: prev[result.winner.toLowerCase()] + 1
      }))
      return
    }

    if (isBoardFull(newBoard)) {
      setScores(prev => ({ ...prev, ties: prev.ties + 1 }))
      return
    }

    setIsXNext(!isXNext)

    // AI move
    if (gameMode === 'ai' && isXNext) {
      setTimeout(() => {
        const aiMove = getAIMove(newBoard)
        if (aiMove !== null) {
          const aiBoard = [...newBoard]
          aiBoard[aiMove] = 'O'
          setBoard(aiBoard)

          const aiResult = calculateWinner(aiBoard)
          if (aiResult) {
            setWinLine(aiResult.line)
            setScores(prev => ({
              ...prev,
              [aiResult.winner.toLowerCase()]: prev[aiResult.winner.toLowerCase()] + 1
            }))
          } else if (isBoardFull(aiBoard)) {
            setScores(prev => ({ ...prev, ties: prev.ties + 1 }))
          }

          setIsXNext(true)
        }
      }, 500)
    }
  }, [board, isXNext, gameMode, calculateWinner, getAIMove])

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinLine(null)
  }

  // Reset all
  const resetAll = () => {
    resetGame()
    setScores({ x: 0, o: 0, ties: 0 })
    setGameMode(null)
  }

  // Get game status
  const getStatus = () => {
    const result = calculateWinner(board)
    if (result) {
      return `¡${result.winner} Gana! 🎉`
    }
    if (isBoardFull(board)) {
      return '¡Empate! 🤝'
    }
    if (gameMode === 'ai' && !isXNext) {
      return 'IA pensando...'
    }
    return `Turno de: ${isXNext ? 'X' : 'O'}`
  }

  // Mode selection screen
  if (!gameMode) {
    return (
      <div className="page-container">
        <Link to="/" className="back-link">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Volver al Menú
        </Link>

        <div className="game-container ttt-container">
          <h1 className="title-arcade">⭕ Tic Tac Toe</h1>
          <p className="subtitle">Selecciona el modo de juego</p>

          <div className="mode-selection">
            <button 
              className="mode-btn"
              onClick={() => setGameMode('pvp')}
            >
              <span className="mode-icon">👥</span>
              <span className="mode-title">2 Jugadores</span>
              <span className="mode-desc">Juega con un amigo</span>
            </button>

            <button 
              className="mode-btn ai-mode"
              onClick={() => setGameMode('ai')}
            >
              <span className="mode-icon">🤖</span>
              <span className="mode-title">vs IA</span>
              <span className="mode-desc">Desafía al algoritmo Minimax</span>
            </button>
          </div>

          {gameMode === null && (
            <div className="difficulty-note">
              <p>La IA usa el algoritmo <strong>Minimax</strong> con poda Alpha-Beta</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <Link to="/" className="back-link">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Volver al Menú
      </Link>

      <div className="game-container ttt-container">
        <h1 className="title-arcade">⭕ Tic Tac Toe</h1>

        {/* Difficulty selector for AI mode */}
        {gameMode === 'ai' && (
          <div className="difficulty-selector">
            <span>Dificultad:</span>
            <div className="difficulty-buttons">
              {['easy', 'medium', 'hard'].map(diff => (
                <button
                  key={diff}
                  className={`diff-btn ${difficulty === diff ? 'active' : ''}`}
                  onClick={() => { setDifficulty(diff); resetGame(); }}
                >
                  {diff === 'easy' ? 'Fácil' : diff === 'medium' ? 'Media' : 'Difícil'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Scoreboard */}
        <div className="scoreboard">
          <div className="score-item x-score">
            <span className="player-label">X {gameMode === 'ai' ? '(Tú)' : ''}</span>
            <span className="player-score">{scores.x}</span>
          </div>
          <div className="score-item tie-score">
            <span className="player-label">Empates</span>
            <span className="player-score">{scores.ties}</span>
          </div>
          <div className="score-item o-score">
            <span className="player-label">O {gameMode === 'ai' ? '(IA)' : ''}</span>
            <span className="player-score">{scores.o}</span>
          </div>
        </div>

        {/* Status */}
        <div className={`game-status ${calculateWinner(board) ? 'winner' : ''}`}>
          {getStatus()}
        </div>

        {/* Board */}
        <div className="ttt-board">
          {board.map((cell, index) => (
            <button
              key={index}
              className={`ttt-cell ${cell ? `cell-${cell.toLowerCase()}` : ''} ${winLine?.includes(index) ? 'winning-cell' : ''}`}
              onClick={() => handleClick(index)}
              disabled={cell !== null || calculateWinner(board) !== null}
            >
              {cell && (
                <span className="cell-content">{cell}</span>
              )}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="ttt-controls">
          <button onClick={resetGame} className="btn btn-secondary">
            Nueva Partida
          </button>
          <button onClick={resetAll} className="btn btn-primary">
            Cambiar Modo
          </button>
        </div>

        {/* Algorithm info */}
        {gameMode === 'ai' && (
          <div className="algo-info">
           
          </div>
        )}
      </div>
    </div>
  )
}

export default TicTacToe
