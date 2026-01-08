import { Link } from 'react-router-dom'
import './Home.css'

const games = [
  {
    id: 'snake',
    title: 'Snake',
    subtitle: 'Culebrita Clásica',
    description: 'El clásico juego de la serpiente. ¡Come y crece sin chocar!',
    path: '/snake',
    icon: '🐍',
    color: '#00b894',
    tech: ['Canvas API', 'Game Loop', 'Collision Detection']
  },
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    subtitle: 'Triki con IA',
    description: 'Desafía a una IA inteligente usando el algoritmo Minimax.',
    path: '/tictactoe',
    icon: '⭕',
    color: '#6c5ce7',
    tech: ['Minimax Algorithm', 'AI Logic', 'State Management']
  },
  {
    id: 'memory',
    title: 'Memory Game',
    subtitle: 'Juego de Memoria',
    description: 'Encuentra todos los pares de cartas. ¡Pon a prueba tu memoria!',
    path: '/memory',
    icon: '🧠',
    color: '#fd79a8',
    tech: ['React Hooks', 'CSS Animations', 'Array Shuffle']
  }
]

function Home() {
  return (
    <div className="home-container">
      {/* Background animated elements */}
      <div className="bg-decoration">
        <div className="floating-shape shape-1">🎮</div>
        <div className="floating-shape shape-2">🕹️</div>
        <div className="floating-shape shape-3">👾</div>
        <div className="floating-shape shape-4">🎯</div>
      </div>

      {/* Header */}
      <header className="home-header">
        <h1 className="main-title">
          <span className="title-icon">🎮</span>
          Mini Arcade
        </h1>
        <p className="main-subtitle">
          Juegos Clasicos para tu diversion
        </p>
        <div className="tech-badges">
         
        </div>
      </header>

      {/* Games Grid */}
      <main className="games-grid">
        {games.map((game, index) => (
          <Link 
            to={game.path} 
            key={game.id} 
            className="game-card"
            style={{ 
              '--card-color': game.color,
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="card-glow"></div>
            <div className="card-content">
              <div className="card-icon">{game.icon}</div>
              <h2 className="card-title">{game.title}</h2>
              <span className="card-subtitle">{game.subtitle}</span>
              <p className="card-description">{game.description}</p>
              <div className="card-tech">
                {game.tech.map((t, i) => (
                  <span key={i} className="tech-tag">{t}</span>
                ))}
              </div>
              <div className="play-button">
                <span>JUGAR</span>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>Desarrollado por Juan Luligo</p>
        <p className="footer-note">2025</p>
      </footer>
    </div>
  )
}

export default Home
