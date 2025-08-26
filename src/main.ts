import './style.css'
import { Game24 } from './game24'

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game24()
  game.init()
  // Make the game instance globally accessible
  window.game24 = game
})
