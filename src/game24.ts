import { Solver24 } from './solver24'

interface Card {
  value: number
  expression: string
  isResult: boolean
}

export class Game24 {
  private numbers: number[] = []
  private cards: Card[] = []
  private selectedCard: number | null = null
  private pendingOperation: string | null = null
  private score: number = 0
  private timeElapsed: number = 0
  private gameStartTime: number = 0
  private isGameActive: boolean = false
  private solver: Solver24

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
      <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div class="game-card max-w-2xl w-full bg-white/95 backdrop-blur-sm">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">Number Solver</h1>
            <p class="text-gray-600 text-lg">Combine cards to make 24</p>
          </div>

          <!-- Stats Bar -->
          <div class="flex justify-between items-center mb-8 text-sm">
            <div class="bg-blue-100 px-4 py-2 rounded-lg">
              <span class="font-semibold text-blue-800">Score: </span>
              <span id="score" class="text-blue-600 font-bold text-lg">0</span>
            </div>
            <div class="bg-green-100 px-4 py-2 rounded-lg">
              <span class="font-semibold text-green-800">Time: </span>
              <span id="timer" class="text-green-600 font-bold text-lg">0:00</span>
            </div>
            <div class="bg-purple-100 px-4 py-2 rounded-lg">
              <span class="font-semibold text-purple-800">Level: </span>
              <span id="level" class="text-purple-600 font-bold text-lg">1</span>
            </div>
          </div>

          <!-- Cards Display -->
          <div class="flex flex-wrap justify-center gap-4 mb-8" id="cards-container">
            <!-- Cards will be inserted here -->
          </div>

          <!-- Operators (Card Format) -->
          <div class="grid grid-cols-4 gap-3 mb-8" id="operators-container">
            <button class="operator-card" data-op="+">+</button>
            <button class="operator-card" data-op="-">−</button>
            <button class="operator-card" data-op="*">×</button>
            <button class="operator-card" data-op="/">÷</button>
          </div>

          <!-- Action Buttons -->
          <div class="grid grid-cols-2 gap-4">
            <button id="clear-btn" class="action-button danger-button">
              <span class="text-lg">🔄 New Game</span>
            </button>
            <button id="hint-btn" class="action-button primary-button">
              <span class="text-lg">💡 Hint</span>
            </button>
          </div>

          <!-- Result Message -->
          <div id="result-message" class="mt-6 text-center font-semibold hidden"></div>

          <!-- Instructions -->
          <div class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 class="font-semibold text-blue-800 mb-2">How to Play:</h3>
            <p class="text-blue-700 text-sm">
              Click a number, then an operator, then another number to combine them. Keep combining until you have one card with value 24!
            </p>
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
    document.getElementById('clear-btn')?.addEventListener('click', () => this.newGame())
    document.getElementById('hint-btn')?.addEventListener('click', () => this.showHint())
  }

  private newGame(): void {
    this.generateNumbers()
    this.isGameActive = true
    this.gameStartTime = Date.now()
    this.selectedCard = null
    this.pendingOperation = null
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

    // Initialize cards
    this.cards = this.numbers.map(num => ({
      value: num,
      expression: num.toString(),
      isResult: false
    }))
  }

  private selectCard(index: number): void {
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
      
      // Create new result card
      const resultCard: Card = {
        value: result,
        expression: expression,
        isResult: true
      }
      
      // Remove the two selected cards and add the result
      this.cards = this.cards.filter((_, i) => i !== this.selectedCard && i !== secondCardIndex)
      this.cards.push(resultCard)
      
      // Keep the result card selected
      this.selectedCard = this.cards.length - 1
      this.pendingOperation = null
      
      // Check for win condition
      if (this.cards.length === 1 && Math.abs(this.cards[0].value - 24) < 0.001) {
        this.showResult('🎉 GOLD CARD! You solved it! 🏆', 'success')
        this.score += 100
        setTimeout(() => this.newGame(), 3000)
      } else if (this.cards.length === 1 && Math.abs(this.cards[0].value - 24) >= 0.001) {
        this.showResult(`❌ Final result: ${this.cards[0].value}, not 24`, 'error')
        setTimeout(() => this.newGame(), 2000)
      }
      
      this.updateUI()
      
    } catch (error) {
      this.showResult('❌ Invalid operation', 'error')
      this.resetSelection()
    }
  }

  private resetSelection(): void {
    this.selectedCard = null
    this.pendingOperation = null
    this.updateUI()
  }

  private showHint(): void {
    const solution = this.solver.getSolution(this.numbers)
    if (solution) {
      this.showResult(`💡 Hint: ${solution}`, 'hint')
    } else {
      this.showResult('💡 No hint available', 'hint')
    }
  }

  private showResult(message: string, type: 'success' | 'error' | 'hint'): void {
    const resultEl = document.getElementById('result-message')
    if (resultEl) {
      resultEl.textContent = message
      let bgColor = 'bg-blue-100'
      let textColor = 'text-blue-600'
      
      if (type === 'success') {
        bgColor = 'bg-green-100'
        textColor = 'text-green-600'
      } else if (type === 'error') {
        bgColor = 'bg-red-100'
        textColor = 'text-red-600'
      }
      
      resultEl.className = `mt-6 text-center font-semibold text-lg ${textColor} ${bgColor} p-4 rounded-lg`
      resultEl.classList.remove('hidden')
    }
  }

  private updateUI(): void {
    // Update cards display
    const cardsContainer = document.getElementById('cards-container')
    if (cardsContainer) {
      cardsContainer.innerHTML = this.cards.map((card, index) => {
        const isSelected = this.selectedCard === index
        const isResult = card.isResult
        const isPending = this.pendingOperation !== null && this.selectedCard === index
        
        let cardClass = 'number-card'
        if (isSelected) cardClass += ' selected'
        if (isResult) cardClass += ' result'
        if (isPending) cardClass += ' pending'
        
        return `
          <button class="${cardClass}" 
                  onclick="window.game24.selectCard(${index})">
            <div class="card-inner">
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

    // Update score
    const scoreEl = document.getElementById('score')
    if (scoreEl) {
      scoreEl.textContent = this.score.toString()
    }

    // Update level (based on score)
    const levelEl = document.getElementById('level')
    if (levelEl) {
      const level = Math.floor(this.score / 100) + 1
      levelEl.textContent = level.toString()
    }
  }

  private startTimer(): void {
    setInterval(() => {
      if (this.isGameActive) {
        this.timeElapsed = Math.floor((Date.now() - this.gameStartTime) / 1000)
        const minutes = Math.floor(this.timeElapsed / 60)
        const seconds = this.timeElapsed % 60
        const timerEl = document.getElementById('timer')
        if (timerEl) {
          timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`
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
