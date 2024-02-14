const { UserNotification } = require('./notification')
const { UserTransaction } = require('./transaction')

class User {
  static #list = []
  static #count = 1

  listNotifications = []
  listTransactions = []
  balance = 0

  constructor({ email, password }) {
    this.id = User.#count++

    this.email = String(email).toLocaleLowerCase()
    this.password = String(password)
    this.isConfirm = false
  }

  static create(data) {
    const user = new User(data)

    this.#list.push(user)

    console.log(this.#list)

    return user
  }

  receive(amount) {
    if (!isNaN(amount)) {
      this.balance += Number(amount)

      return this.balance
    }
  }

  send(amount) {
    if (!isNaN(amount)) {
      if (amount % 1 !== 0) {
        amount = Math.round(amount * 100) / 100
      }

      this.balance -= Number(amount)

      return this.balance
    }
  }

  createTransaction(sender, recipient, type, amount) {
    const transaction = new UserTransaction(
      sender,
      recipient,
      type,
      amount,
    )

    this.listTransactions.push(transaction)

    return transaction
  }

  getTransactionById(transactionId) {
    const transaction = this.listTransactions.find(
      (transaction) => transaction.id === transactionId,
    )

    return transaction || null
  }

  createNotification(text, type) {
    const notification = new UserNotification(text, type)

    this.listNotifications.push(notification)

    return notification
  }

  getNotifications() {
    return this.listNotifications
  }

  getTransactions() {
    return this.listTransactions
  }

  static updatePassword(password, passwordNew) {
    const user = this.getByPassword(password)

    if (user) {
      user.password = String(passwordNew)
      console.log('Password updated successfully:', user)
    } else {
      console.log(
        'User not found with the provided old password.',
      )
    }
  }

  static changeEmailInTransactions(email, toEmail) {
    this.#list.forEach((user) => {
      user.listTransactions.forEach((tx) => {
        if (tx.recipient === email) tx.recipient = toEmail
        if (tx.sender === email) tx.sender = toEmail
      })
    })
  }

  static getByEmail(email) {
    return (
      this.#list.find(
        (user) =>
          user.email === String(email).toLocaleLowerCase(),
      ) || null
    )
  }

  static getByPassword(password) {
    return (
      this.#list.find(
        (user) => user.password === String(password),
      ) || null
    )
  }
}

module.exports = {
  User,
}
