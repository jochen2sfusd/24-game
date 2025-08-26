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
      <div class="min-h-screen flex items-center justify-center p-4">
        <div class="game-card max-w-md w-full">
          <!-- Header -->
          <div class="text-center mb-6">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">24 Game</h1>
            <p class="text-gray-600">Use all 4 numbers and basic arithmetic to make 24</p>
          </div>

          <!-- Stats -->
          <div class="flex justify-between items-center mb-6 text-sm text-gray-600">
            <div>Score: <span id="score" class="font-semibold">0</span></div>
            <div>Time: <span id="timer" class="font-semibold">0:00</span></div>
          </div>

          <!-- Numbers Display -->
          <div class="grid grid-cols-4 gap-3 mb-6" id="numbers-container">
            <!-- Numbers will be inserted here -->
          </div>

          <!-- Expression Display -->
          <div class="bg-gray-100 rounded-lg p-4 mb-6 min-h-[60px] flex items-center">
            <span id="expression" class="text-xl font-mono text-gray-800">Click numbers to start</span>
          </div>

          <!-- Operators -->
          <div class="grid grid-cols-4 gap-2 mb-6" id="operators-container">
            <button class="operator-button" data-op="+">+</button>
            <button class="operator-button" data-op="-">−</button>
            <button class="operator-button" data-op="*">×</button>
            <button class="operator-button" data-op="/">÷</button>
          </div>

          <!-- Action Buttons -->
          <div class="grid grid-cols-2 gap-3">
            <button id="clear-btn" class="danger-button">Clear</button>
            <button id="new-game-btn" class="primary-button">New Game</button>
          </div>

          <!-- Result Message -->
          <div id="result-message" class="mt-4 text-center font-semibold hidden"></div>
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
    this.updateUI()
    this.hideResult()
  }

  private addOperator(op: string): void {
    if (this.selectedNumbers.length === 0) return
    
    this.operators.push(op)
    this.expression += ` ${op} `
    this.updateUI()
  }

  private selectNumber(index: number): void {
    if (this.selectedNumbers.length >= 4) return
    
    const number = this.numbers[index]
    this.selectedNumbers.push(number)
    this.expression += number
    
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
        this.showResult('🎉 Correct! You found 24!', 'success')
        this.score += 100
        setTimeout(() => this.newGame(), 2000)
      } else {
        this.showResult(`❌ ${this.expression} = ${result}, not 24`, 'error')
      }
    } catch (error) {
      this.showResult('❌ Invalid expression', 'error')
    }
  }

  private showResult(message: string, type: 'success' | 'error'): void {
    const resultEl = document.getElementById('result-message')
    if (resultEl) {
      resultEl.textContent = message
      resultEl.className = `mt-4 text-center font-semibold ${type === 'success' ? 'text-green-600' : 'text-red-600'}`
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
    // Update numbers display
    const numbersContainer = document.getElementById('numbers-container')
    if (numbersContainer) {
      numbersContainer.innerHTML = this.numbers.map((num, index) => `
        <button class="number-button ${this.selectedNumbers.includes(num) ? 'opacity-50 cursor-not-allowed' : ''}" 
                onclick="window.game24.selectNumber(${index})" 
                ${this.selectedNumbers.includes(num) ? 'disabled' : ''}>
          ${num}
        </button>
      `).join('')
    }

    // Update expression
    const expressionEl = document.getElementById('expression')
    if (expressionEl) {
      expressionEl.textContent = this.expression || 'Click numbers to start'
    }

    // Update score
    const scoreEl = document.getElementById('score')
    if (scoreEl) {
      scoreEl.textContent = this.score.toString()
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

  // Public method for number selection (called from HTML)
  selectNumber(index: number): void {
    this.selectNumber(index)
  }
}

// Make the game instance globally accessible for HTML onclick handlers
declare global {
  interface Window {
    game24: Game24
  }
}
