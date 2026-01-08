import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SnakeGame from './pages/SnakeGame'
import TicTacToe from './pages/TicTacToe'
import MemoryGame from './pages/MemoryGame'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/snake" element={<SnakeGame />} />
      <Route path="/tictactoe" element={<TicTacToe />} />
      <Route path="/memory" element={<MemoryGame />} />
    </Routes>
  )
}

export default App
