import { Solver24 } from './solver24'

interface Card {
  value: number
  expression: string
  isResult: boolean
  position: number // Track original position
}

interface GameHistory {
  cards: Card[]
  selectedCard: number | null
  pendingOperation: string | null
}

export class Game24 {
  private numbers: number[] = []
  private cards: Card[] = []
  private selectedCard: number | null = null
  private pendingOperation: string | null = null
  private score: number = 0
  private level: number = 1
  private totalTimeElapsed: number = 0
  private roundTimeElapsed: number = 0
  private gameStartTime: number = 0
  private roundStartTime: number = 0
  private isGameActive: boolean = false
  private solver: Solver24
  private gameHistory: GameHistory[] = []

  constructor() {
    this.solver = new Solver24()
  }

  init(): void {
    this.createUI()
    this.newGame()
    this.startTimer()
  }

  private createUI(): void {
    const root = document.getElementById('root')
    if (!root) return

    root.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div class="max-w-md mx-auto">
          <!-- Header Section -->
          <div class="flex items-center justify-between mb-6">
            <!-- Left Icons -->
            <div class="flex flex-col gap-2">
              <button class="header-icon">🏠</button>
              <button class="header-icon">🏁</button>
            </div>
            
            <!-- Center - Streak -->
            <div class="text-center">
              <div class="text-white text-lg font-semibold">Streak</div>
              <div class="bg-gray-800 rounded-lg px-4 py-2 mt-1">
                <div class="text-white text-2xl font-bold">${this.score}</div>
                <div class="flex justify-center mt-1">
                  <span class="star">⭐</span>
                  <span class="star">⭐</span>
                  <span class="star">⭐</span>
                </div>
              </div>
            </div>
            
            <!-- Right - Undo Button -->
            <button id="undo-btn" class="header-icon text-2xl">↶</button>
          </div>

          <!-- Game Board Section - Fixed 2x2 grid -->
          <div class="game-board mb-6" id="cards-container">
            <!-- Cards will be inserted here in fixed positions -->
          </div>

          <!-- Operator Section -->
          <div class="flex justify-center gap-4" id="operators-container">
            <button class="operator-btn plus" data-op="+">+</button>
            <button class="operator-btn minus" data-op="-">−</button>
            <button class="operator-btn multiply" data-op="*">×</button>
            <button class="operator-btn divide" data-op="/">÷</button>
          </div>

          <!-- Timer Section -->
          <div class="flex justify-between items-center mt-6 text-white">
            <div class="text-center">
              <div class="text-sm opacity-80">Total Time</div>
              <div id="total-timer" class="text-lg font-bold">0:00</div>
            </div>
            <div class="text-center">
              <div class="text-sm opacity-80">Round Time</div>
              <div id="round-timer" class="text-lg font-bold">0:00</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mt-6">
            <button id="new-game-btn" class="action-btn danger">
              <span>🔄 New Game</span>
            </button>
            <button id="hint-btn" class="action-btn primary">
              <span>💡 Hint</span>
            </button>
          </div>
        </div>
      </div>
    `

    this.attachEventListeners()
  }

  private attachEventListeners(): void {
    // Operator buttons
    document.querySelectorAll('[data-op]').forEach(button => {
      button.addEventListener('click', (e) => {
        const op = (e.target as HTMLElement).getAttribute('data-op')
        if (op) this.addOperator(op)
      })
    })

    // Action buttons
    document.getElementById('undo-btn')?.addEventListener('click', () => this.undoLastOperation())
    document.getElementById('new-game-btn')?.addEventListener('click', () => this.newGame())
    document.getElementById('hint-btn')?.addEventListener('click', () => this.showHint())
  }

  private newGame(): void {
    this.generateNumbers()
    this.isGameActive = true
    this.gameStartTime = Date.now()
    this.roundStartTime = Date.now()
    this.selectedCard = null
    this.pendingOperation = null
    this.gameHistory = []
    this.updateUI()
  }

  private generateNumbers(): void {
    // Generate 4 random numbers (1-9) that have a solution
    let attempts = 0
    do {
      this.numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9) + 1)
      attempts++
    } while (!this.solver.hasSolution(this.numbers) && attempts < 100)

    // If we can't find a solvable set, use a known solvable one
    if (!this.solver.hasSolution(this.numbers)) {
      this.numbers = [4, 6, 8, 1] // Known solvable
    }

    // Initialize cards with positions
    this.cards = this.numbers.map((num, index) => ({
      value: num,
      expression: num.toString(),
      isResult: false,
      position: index
    }))
  }

  private saveGameState(): void {
    this.gameHistory.push({
      cards: JSON.parse(JSON.stringify(this.cards)),
      selectedCard: this.selectedCard,
      pendingOperation: this.pendingOperation
    })
  }

  private undoLastOperation(): void {
    if (this.gameHistory.length === 0) return
    
    const lastState = this.gameHistory.pop()
    if (lastState) {
      this.cards = lastState.cards
      this.selectedCard = lastState.selectedCard
      this.pendingOperation = lastState.pendingOperation
      this.updateUI()
    }
  }

  private selectCard(index: number): void {
    // If clicking the same card that's already selected, deselect it
    if (this.selectedCard === index && this.pendingOperation === null) {
      this.selectedCard = null
      this.updateUI()
      return
    }
    
    // If we have a pending operation, this is the second number
    if (this.pendingOperation !== null) {
      this.performOperation(index)
      return
    }
    
    // Otherwise, this is the first number selection
    this.selectedCard = index
    this.updateUI()
  }

  private addOperator(op: string): void {
    if (this.selectedCard === null) return
    
    this.pendingOperation = op
    this.updateUI()
  }

  private performOperation(secondCardIndex: number): void {
    if (this.selectedCard === null || this.pendingOperation === null) return
    
    // Save state before operation
    this.saveGameState()
    
    const firstCard = this.cards[this.selectedCard]
    const secondCard = this.cards[secondCardIndex]
    
    try {
      let result: number
      let expression: string
      
      switch (this.pendingOperation) {
        case '+':
          result = firstCard.value + secondCard.value
          expression = `(${firstCard.expression} + ${secondCard.expression})`
          break
        case '-':
          result = firstCard.value - secondCard.value
          expression = `(${firstCard.expression} - ${secondCard.expression})`
          break
        case '*':
          result = firstCard.value * secondCard.value
          expression = `(${firstCard.expression} × ${secondCard.expression})`
          break
        case '/':
          if (secondCard.value === 0) {
            this.showResult('❌ Cannot divide by zero!', 'error')
            this.resetSelection()
            return
          }
          result = firstCard.value / secondCard.value
          expression = `(${firstCard.expression} ÷ ${secondCard.expression})`
          break
        default:
          return
      }
      
      // Create new result card with the position of the second card
      const resultCard: Card = {
        value: result,
        expression: expression,
        isResult: true,
        position: secondCard.position
      }
      
      // Remove the two selected cards and add the result
      this.cards = this.cards.filter((_, i) => i !== this.selectedCard && i !== secondCardIndex)
      this.cards.push(resultCard)
      
      // Keep the result card selected
      this.selectedCard = this.cards.length - 1
      this.pendingOperation = null
      
      // Check for win condition
      if (this.cards.length === 1 && Math.abs(this.cards[0].value - 24) < 0.001) {
        this.handleWin()
      } else if (this.cards.length === 1 && Math.abs(this.cards[0].value - 24) >= 0.001) {
        this.handleLoss()
      }
      
      this.updateUI()
      
    } catch (error) {
      this.showResult('❌ Invalid operation', 'error')
      this.resetSelection()
    }
  }

  private handleWin(): void {
    this.score += 100
    this.level = Math.floor(this.score / 100) + 1
    this.updateStars()
    // Auto-start new game after a brief delay
    setTimeout(() => this.newGame(), 1000)
  }

  private handleLoss(): void {
    // Reset score on loss (streak-based scoring)
    this.score = 0
    this.level = 1
    this.updateStars()
    // Auto-start new game after a brief delay
    setTimeout(() => this.newGame(), 1000)
  }

  private updateStars(): void {
    const stars = document.querySelectorAll('.star')
    const starCount = Math.min(3, Math.floor(this.score / 100))
    
    stars.forEach((star, index) => {
      if (index < starCount) {
        star.textContent = '⭐'
        star.classList.add('text-yellow-400')
      } else {
        star.textContent = '☆'
        star.classList.remove('text-yellow-400')
      }
    })
  }

  private resetSelection(): void {
    this.selectedCard = null
    this.pendingOperation = null
    this.updateUI()
  }

  private showHint(): void {
    const solution = this.solver.getSolution(this.numbers)
    if (solution) {
      // Show hint as a temporary overlay
      this.showTemporaryMessage(`💡 Hint: ${solution}`)
    } else {
      this.showTemporaryMessage('💡 No hint available')
    }
  }

  private showTemporaryMessage(message: string): void {
    // Create temporary message element
    const messageEl = document.createElement('div')
    messageEl.textContent = message
    messageEl.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg z-50'
    document.body.appendChild(messageEl)
    
    // Remove after 3 seconds
    setTimeout(() => {
      document.body.removeChild(messageEl)
    }, 3000)
  }

  private showResult(message: string, type: 'success' | 'error' | 'hint'): void {
    this.showTemporaryMessage(message)
  }

  private updateUI(): void {
    // Update cards display with fixed positions
    const cardsContainer = document.getElementById('cards-container')
    if (cardsContainer) {
      // Create a fixed 2x2 grid with 4 positions
      const positions = [0, 1, 2, 3] // top-left, top-right, bottom-left, bottom-right
      
      cardsContainer.innerHTML = positions.map(pos => {
        // Find card at this position
        const cardIndex = this.cards.findIndex(card => card.position === pos)
        
        if (cardIndex === -1) {
          // Empty position
          return `<div class="game-card empty"></div>`
        }
        
        const card = this.cards[cardIndex]
        const isSelected = this.selectedCard === cardIndex
        const isResult = card.isResult
        const isPending = this.pendingOperation !== null && this.selectedCard === cardIndex
        
        let cardClass = 'game-card'
        if (isSelected) cardClass += ' selected'
        if (isResult) cardClass += ' result'
        if (isPending) cardClass += ' pending'
        
        return `
          <button class="${cardClass}" 
                  onclick="window.game24.selectCard(${cardIndex})">
            <div class="card-content">
              <span class="card-number">${card.value}</span>
              ${isResult ? '<div class="card-expression">' + card.expression + '</div>' : ''}
            </div>
          </button>
        `
      }).join('')
    }

    // Update operator buttons
    document.querySelectorAll('[data-op]').forEach(button => {
      const op = (button as HTMLElement).getAttribute('data-op')
      if (this.pendingOperation === op) {
        button.classList.add('selected')
      } else {
        button.classList.remove('selected')
      }
    })

    // Update score display
    const scoreDisplay = document.querySelector('.text-2xl')
    if (scoreDisplay) {
      scoreDisplay.textContent = this.score.toString()
    }

    // Update undo button state
    const undoBtn = document.getElementById('undo-btn')
    if (undoBtn) {
      undoBtn.classList.toggle('disabled', this.gameHistory.length === 0)
    }
  }

  private startTimer(): void {
    setInterval(() => {
      if (this.isGameActive) {
        this.totalTimeElapsed = Math.floor((Date.now() - this.gameStartTime) / 1000)
        this.roundTimeElapsed = Math.floor((Date.now() - this.roundStartTime) / 1000)
        
        const totalMinutes = Math.floor(this.totalTimeElapsed / 60)
        const totalSeconds = this.totalTimeElapsed % 60
        const roundMinutes = Math.floor(this.roundTimeElapsed / 60)
        const roundSeconds = this.roundTimeElapsed % 60
        
        const totalTimerEl = document.getElementById('total-timer')
        const roundTimerEl = document.getElementById('round-timer')
        
        if (totalTimerEl) {
          totalTimerEl.textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`
        }
        if (roundTimerEl) {
          roundTimerEl.textContent = `${roundMinutes}:${roundSeconds.toString().padStart(2, '0')}`
        }
      }
    }, 1000)
  }
}

// Make the game instance globally accessible for HTML onclick handlers
declare global {
  interface Window {
    game24: Game24
  }
}
