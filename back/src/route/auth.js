const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Confirm } = require('../class/confirm')
const { Session } = require('../class/session')

User.create({
  email: 'test@mail.com',
  password: 123,
})

// ================================================================

router.post('/signup', function (req, res) {
  const { email, password } = req.body

  console.log(req.body)

  if (!email || !password) {
    return res.status(400).json({
      message: 'Required fields are missing',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message: 'User with this email already exists',
      })
    }

    const newUser = User.create({ email, password })

    const session = Session.create(newUser)

    Confirm.create(newUser.email)

    return res.status(200).json({
      message: 'User has been successfully registered',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: 'Error creating a user',
    })
  }
})

// ====================================================

router.get('/signup-confirm', function (req, res) {
  const { renew, email } = req.query

  try {
    if (renew) {
      const confirm = Confirm.create(email)
      return res.status(200).json({
        confirm: confirm,
      })
    } else {
      return res.status(400).json({
        message: 'Confirmation failed',
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
})

router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body

  if (!code || !token) {
    return res.status(400).json({
      message: 'Required fields are missing',
    })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message:
          'Error. You are not signed in to your account',
      })
    }

    const email = Confirm.getData(code)

    if (!email) {
      return res.status(400).json({
        message: 'Code does not exist',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: 'Code is not valid',
      })
    }

    const user = User.getByEmail(session.user.email)

    user.isConfirm = true
    session.user.isConfirm = true

    return res.status(200).json({
      message: 'You have confirmed your email',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ====================================================

router.post('/signin', function (req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: 'Required fields are missing',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'User with this email does not exist',
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Password does not match',
      })
    }

    const session = Session.create(user)

    const notification = user.createNotification(
      'New login',
      'Warning',
    )

    return res.status(200).json({
      message: 'You are logged in',
      notification,
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})
// ====================================================

router.post('/recovery', function (req, res) {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({
      message: 'Required field is missing',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'User with this email does not exist',
      })
    }

    Confirm.create(email)

    return res.status(200).json({
      message: 'Password recovery code has been sent',
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ====================================================

router.get('/recovery-confirm', function (req, res) {
  const { renew, email } = req.query

  try {
    if (renew) {
      const confirm = Confirm.create(email)
      return res.status(200).json({
        confirm: confirm,
      })
    } else {
      return res.status(400).json({
        message: 'Recovery failed',
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
})

router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body

  console.log(password, code)

  if (!code || !password) {
    return res.status(400).json({
      message: 'Required fields are missing',
    })
  }

  try {
    const email = Confirm.getData(Number(code))

    if (!email) {
      return res.status(400).json({
        message: 'Code does not exist',
      })
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'User with this email does not exist',
      })
    }

    user.password = password

    console.log(user)

    const session = Session.create(user)

    return res.status(200).json({
      message: 'Password has been successfully changed',
      session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ====================================================

router.post('/change-email', function (req, res) {
  const { password, email, token } = req.body

  if (!password || !email || !token) {
    return res.status(400).json({
      message: 'Required fields are missing',
    })
  }

  const emailRegex =
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: 'Invalid email format',
    })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: 'Invalid session token',
      })
    }

    const user = User.getByEmail(session.user.email)

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      })
    }

    if (user.email === email) {
      return res.status(400).json({
        message: 'You already have this email',
      })
    }

    const newEmail = User.getByEmail(email)

    if (newEmail) {
      return res.status(400).json({
        message: 'User with this email already exists',
      })
    }

    if (password !== user.password) {
      return res.status(400).json({
        message: 'Invalid password',
      })
    }

    const oldEmail = user.email
    user.email = String(email)

    const newSession = Session.create(user)

    const notification = user.createNotification(
      'New email',
      'Warning',
    )

    User.changeEmailInTransactions(oldEmail, user.email)

    return res.status(200).json({
      message: 'Email updated successfully',
      notification,
      session: newSession,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.post('/change-password', function (req, res) {
  const { passwordOld, passwordNew, token } = req.body

  if (!passwordOld || !passwordNew || !token) {
    return res.status(400).json({
      message: 'Required fields are missing',
    })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: 'Invalid session token',
      })
    }

    const user = User.getByEmail(session.user.email)

    if (!user) {
      return res.status(400).json({
        message: 'User not found with the provided email',
      })
    }

    if (user.password !== passwordOld) {
      return res.status(400).json({
        message: 'Incorrect password',
      })
    }

    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
    if (!passwordRegex.test(passwordNew)) {
      return res.status(400).json({
        message: 'Invalid password format',
      })
    }

    user.password = String(passwordNew)

    const newSession = Session.create(user)

    const notification = user.createNotification(
      'New password',
      'Warning',
    )

    return res.status(200).json({
      message: 'Password updated successfully',
      notification,
      session: newSession,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ==================================

module.exports = router
