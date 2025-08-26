import { Solver24 } from './solver24'

export class Game24 {
  private numbers: number[] = []
  private selectedNumbers: number[] = []
  private operators: string[] = []
  private expression: string = ''
  private score: number = 0
  private timeElapsed: number = 0
  private gameStartTime: number = 0
  private isGameActive: boolean = false
  private solver: Solver24
  private currentStep: 'number' | 'operator' = 'number'
  private lastSelectedNumber: number | null = null

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
            <p class="text-gray-600 text-lg">Use all 4 numbers to make 24</p>
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

          <!-- Numbers Display (Card Format) -->
          <div class="grid grid-cols-4 gap-4 mb-8" id="numbers-container">
            <!-- Numbers will be inserted here as cards -->
          </div>

          <!-- Expression Display -->
          <div class="bg-gray-100 rounded-xl p-6 mb-8 min-h-[80px] flex items-center justify-center border-2 border-gray-200">
            <span id="expression" class="text-2xl font-mono text-gray-800">Click a number to start</span>
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
              <span class="text-lg">🔄 Clear</span>
            </button>
            <button id="new-game-btn" class="action-button primary-button">
              <span class="text-lg">🎯 New Game</span>
            </button>
          </div>

          <!-- Result Message -->
          <div id="result-message" class="mt-6 text-center font-semibold hidden"></div>

          <!-- Instructions -->
          <div class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 class="font-semibold text-blue-800 mb-2">How to Play:</h3>
            <p class="text-blue-700 text-sm">
              Click a number, then an operator, then another number to perform calculations. 
              Use all four numbers exactly once to make 24 and earn the gold card!
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
    document.getElementById('clear-btn')?.addEventListener('click', () => this.clearExpression())
    document.getElementById('new-game-btn')?.addEventListener('click', () => this.newGame())
  }

  private newGame(): void {
    this.generateNumbers()
    this.clearExpression()
    this.isGameActive = true
    this.gameStartTime = Date.now()
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
  }

  private clearExpression(): void {
    this.selectedNumbers = []
    this.operators = []
    this.expression = ''
    this.currentStep = 'number'
    this.lastSelectedNumber = null
    this.updateUI()
    this.hideResult()
  }

  private addOperator(op: string): void {
    if (this.currentStep !== 'operator' || this.selectedNumbers.length === 0) return
    
    this.operators.push(op)
    this.expression += ` ${op} `
    this.currentStep = 'number'
    this.updateUI()
  }

  selectNumber(index: number): void {
    if (this.currentStep !== 'number' || this.selectedNumbers.length >= 4) return
    
    const number = this.numbers[index]
    
    // Check if this number was already used
    if (this.selectedNumbers.includes(number)) return
    
    this.selectedNumbers.push(number)
    this.expression += number
    this.lastSelectedNumber = index
    this.currentStep = 'operator'
    
    // Check if we have a complete expression
    if (this.selectedNumbers.length === 4 && this.operators.length === 3) {
      this.evaluateExpression()
    }
    
    this.updateUI()
  }

  private evaluateExpression(): void {
    try {
      const result = eval(this.expression)
      if (Math.abs(result - 24) < 0.001) {
        this.showResult('🎉 GOLD CARD! You solved it! 🏆', 'success')
        this.score += 100
        setTimeout(() => this.newGame(), 3000)
      } else {
        this.showResult(`❌ ${this.expression} = ${result}, not 24`, 'error')
        setTimeout(() => this.clearExpression(), 2000)
      }
    } catch (error) {
      this.showResult('❌ Invalid expression', 'error')
      setTimeout(() => this.clearExpression(), 2000)
    }
  }

  private showResult(message: string, type: 'success' | 'error'): void {
    const resultEl = document.getElementById('result-message')
    if (resultEl) {
      resultEl.textContent = message
      resultEl.className = `mt-6 text-center font-semibold text-lg ${type === 'success' ? 'text-green-600 bg-green-100 p-4 rounded-lg' : 'text-red-600 bg-red-100 p-4 rounded-lg'}`
      resultEl.classList.remove('hidden')
    }
  }

  private hideResult(): void {
    const resultEl = document.getElementById('result-message')
    if (resultEl) {
      resultEl.classList.add('hidden')
    }
  }

  private updateUI(): void {
    // Update numbers display as cards
    const numbersContainer = document.getElementById('numbers-container')
    if (numbersContainer) {
      numbersContainer.innerHTML = this.numbers.map((num, index) => {
        const isUsed = this.selectedNumbers.includes(num)
        const isSelected = this.lastSelectedNumber === index
        const isNext = this.currentStep === 'number' && !isUsed
        
        let cardClass = 'number-card'
        if (isUsed) cardClass += ' used'
        if (isSelected) cardClass += ' selected'
        if (isNext) cardClass += ' next'
        
        return `
          <button class="${cardClass}" 
                  onclick="window.game24.selectNumber(${index})" 
                  ${isUsed ? 'disabled' : ''}>
            <div class="card-inner">
              <span class="card-number">${num}</span>
              ${isUsed ? '<div class="card-used">✓</div>' : ''}
            </div>
          </button>
        `
      }).join('')
    }

    // Update expression
    const expressionEl = document.getElementById('expression')
    if (expressionEl) {
      expressionEl.textContent = this.expression || 'Click a number to start'
    }

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
