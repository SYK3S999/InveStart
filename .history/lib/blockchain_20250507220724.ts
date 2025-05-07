// Simulated Blockchain functionality

interface Transaction {
    id: string
    from: string
    to: string
    amount: number
    timestamp: number
  }
  
  const transactions: Transaction[] = []
  
  export function recordTransaction(from: string, to: string, amount: number): Transaction {
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      from,
      to,
      amount,
      timestamp: Date.now(),
    }
    transactions.push(transaction)
    return transaction
  }
  
  export function getTransactions(): Transaction[] {
    return transactions
  }
  
  export function verifyTransaction(transactionId: string): boolean {
    return transactions.some((t) => t.id === transactionId)
  }
  