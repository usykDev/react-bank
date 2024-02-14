class UserTransaction {
  static count = 1

  constructor(sender, recipient, type, amount) {
    this.id = UserTransaction.count++

    this.sender = sender
    this.recipient = recipient
    this.type = type
    this.amount = amount
    this.date = new Date()
  }
}

module.exports = {
  UserTransaction,
}
