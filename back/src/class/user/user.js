class User {
  static #list = []

  constructor({ email, password }) {
    this.email = email
    this.password = password
  }

  static create(data) {
    const user = new User(data)

    this.#list.push(user)
  }
}

module.exports = {
  User,
}
