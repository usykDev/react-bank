class UserNotification {
  constructor(text, type) {
    this.text = text
    this.type = type
    this.date = new Date()
  }
}

module.exports = {
  UserNotification,
}
