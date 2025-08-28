export class Solver24 {
  private operators = ['+', '-', '*', '/']
  private target = 24

  hasSolution(numbers: number[]): boolean {
    if (numbers.length !== 4) return false
    
    // Generate all permutations of the numbers
    const permutations = this.getPermutations(numbers)
    
    // Try all possible combinations of operators and parentheses
    for (const perm of permutations) {
      if (this.canMakeTarget(perm)) {
        return true
      }
    }
    
    return false
  }

  private getPermutations(arr: number[]): number[][] {
    if (arr.length <= 1) return [arr]
    
    const result: number[][] = []
    
    for (let i = 0; i < arr.length; i++) {
      const current = arr[i]
      const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)]
      const perms = this.getPermutations(remaining)
      
      for (const perm of perms) {
        result.push([current, ...perm])
      }
    }
    
    return result
  }

  private canMakeTarget(numbers: number[]): boolean {
    // Try different ways to group the operations
    const expressions = [
      // ((a op b) op c) op d
      (a: number, b: number, c: number, d: number, op1: string, op2: string, op3: string) => {
        try {
          const step1 = this.applyOperator(a, b, op1)
          const step2 = this.applyOperator(step1, c, op2)
          const step3 = this.applyOperator(step2, d, op3)
          return Math.abs(step3 - this.target) < 0.001
        } catch {
          return false
        }
      },
      // (a op b) op (c op d)
      (a: number, b: number, c: number, d: number, op1: string, op2: string, op3: string) => {
        try {
          const step1 = this.applyOperator(a, b, op1)
          const step2 = this.applyOperator(c, d, op3)
          const step3 = this.applyOperator(step1, step2, op2)
          return Math.abs(step3 - this.target) < 0.001
        } catch {
          return false
        }
      }
    ]

    // Try all operator combinations
    for (const op1 of this.operators) {
      for (const op2 of this.operators) {
        for (const op3 of this.operators) {
          for (const expr of expressions) {
            if (expr(numbers[0], numbers[1], numbers[2], numbers[3], op1, op2, op3)) {
              return true
            }
          }
        }
      }
    }
    
    return false
  }

  private applyOperator(a: number, b: number, op: string): number {
    switch (op) {
      case '+':
        return a + b
      case '-':
        return a - b
      case '*':
        return a * b
      case '/':
        if (b === 0) throw new Error('Division by zero')
        return a / b
      default:
        throw new Error(`Unknown operator: ${op}`)
    }
  }

  // Get a solution (for hints or verification)
  getSolution(numbers: number[]): string | null {
    if (numbers.length !== 4) return null
    
    const permutations = this.getPermutations(numbers)
    
    for (const perm of permutations) {
      const solution = this.findSolution(perm)
      if (solution) {
        return solution
      }
    }
    
    return null
  }

  private findSolution(numbers: number[]): string | null {
    const expressions = [
      // ((a op b) op c) op d
      (a: number, b: number, c: number, d: number, op1: string, op2: string, op3: string) => {
        try {
          const step1 = this.applyOperator(a, b, op1)
          const step2 = this.applyOperator(step1, c, op2)
          const step3 = this.applyOperator(step2, d, op3)
          if (Math.abs(step3 - this.target) < 0.001) {
            return `((${a} ${op1} ${b}) ${op2} ${c}) ${op3} ${d}`
          }
        } catch {
          return null
        }
        return null
      },
      // (a op b) op (c op d)
      (a: number, b: number, c: number, d: number, op1: string, op2: string, op3: string) => {
        try {
          const step1 = this.applyOperator(a, b, op1)
          const step2 = this.applyOperator(c, d, op3)
          const step3 = this.applyOperator(step1, step2, op2)
          if (Math.abs(step3 - this.target) < 0.001) {
            return `(${a} ${op1} ${b}) ${op2} (${c} ${op3} ${d})`
          }
        } catch {
          return null
        }
        return null
      }
    ]

    for (const op1 of this.operators) {
      for (const op2 of this.operators) {
        for (const op3 of this.operators) {
          for (const expr of expressions) {
            const solution = expr(numbers[0], numbers[1], numbers[2], numbers[3], op1, op2, op3)
            if (solution) {
              return solution
            }
          }
        }
      }
    }
    
    return null
  }
}
