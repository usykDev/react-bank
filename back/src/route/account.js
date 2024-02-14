// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const { User } = require('../class/user')
const { Session } = require('../class/session')

// ================================================================

router.get('/balance', function (req, res) {
  try {
    const token = req.query.token
    const session = Session.get(token)
    const transactions = session.user.getTransactions()
    const transactionsCopy = []

    transactions.forEach((element) => {
      const convertTime = (date) => {
        let hours = date.getHours()
        let minutes = date.getMinutes()
        minutes = minutes < 10 ? '0' + minutes : minutes
        return `${hours}:${minutes}`
      }
      const elementCopy = {
        ...element,
        date: convertTime(element.date),
      }
      transactionsCopy.push(elementCopy)
    })

    transactionsCopy.reverse()

    res.status(200).json({
      balance: session.user.balance,
      transactions: transactionsCopy || [],
    })
  } catch (error) {
    console.error('Error fetching balance data:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ================================================================

router.get('/notifications', function (req, res) {
  try {
    const token = req.query.token

    if (!token) {
      return res
        .status(400)
        .json({ error: 'Token is required' })
    }

    const session = Session.get(token)

    if (!session || !session.user) {
      return res
        .status(401)
        .json({ error: 'Invalid token' })
    }

    const notifications = session.user.getNotifications()
    const notificationsCopy = []

    const now = new Date()

    notifications.forEach((element) => {
      const timeDifferenceInSeconds = Math.floor(
        (now - new Date(element.date)) / 1000,
      )

      let displayTime

      if (timeDifferenceInSeconds === 0) {
        displayTime = 'Just now'
      } else if (timeDifferenceInSeconds < 60) {
        displayTime = `${timeDifferenceInSeconds} ${
          timeDifferenceInSeconds === 1
            ? 'second'
            : 'seconds'
        } ago`
      } else if (timeDifferenceInSeconds < 3600) {
        const minutes = Math.floor(
          timeDifferenceInSeconds / 60,
        )
        displayTime = `${minutes} ${
          minutes === 1 ? 'minute' : 'minutes'
        } ago`
      } else {
        const hours = Math.floor(
          timeDifferenceInSeconds / 3600,
        )
        const remainingMinutes = Math.floor(
          (timeDifferenceInSeconds % 3600) / 60,
        )
        displayTime = `${hours} ${
          hours === 1 ? 'hour' : 'hours'
        } and ${remainingMinutes} ${
          remainingMinutes === 1 ? 'minute' : 'minutes'
        } ago`
      }

      const elementCopy = {
        ...element,
        date: displayTime,
      }

      notificationsCopy.push(elementCopy)
    })

    notificationsCopy.reverse()

    res.status(200).json({
      notifications: notificationsCopy || [],
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ==================================

router.get('/receive', function (req, res) {
  res.render('receive', {
    name: 'receive',

    component: ['back-button', 'field-num', 'divider'],

    title: 'Receive page',

    data: {},
  })
})

router.post('/receive-stripe', function (req, res) {
  const { amount, token } = req.body

  if (!token) {
    return res.status(400).json({
      message: 'Token is missing',
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

    const numericAmount = Number(amount)

    if (
      isNaN(numericAmount) ||
      numericAmount <= 0 ||
      (String(amount).startsWith('0') &&
        !String(amount).includes('.')) ||
      (String(numericAmount).includes('.') &&
        String(numericAmount).split('.')[1].length > 2)
    ) {
      return res.status(400).json({
        message: 'Balance update failed',
      })
    } else {
      const updatedBalance = user.receive(numericAmount)

      user.balance = updatedBalance
      session.user.balance = updatedBalance
    }

    const notification = user.createNotification(
      'New reward system',
      'Announcement',
    )

    const transaction = user.createTransaction(
      'Stripe',
      user.email,
      'Receipt',
      amount,
    )

    return res.status(200).json({
      message: 'Transaction was successful',
      transaction,
      notification,
      session: session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

router.post('/receive-coin', function (req, res) {
  const { amount, token } = req.body

  if (!token) {
    return res.status(400).json({
      message: 'Token is missing',
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

    const numericAmount = Number(amount)

    if (
      isNaN(numericAmount) ||
      numericAmount <= 0 ||
      (String(amount).startsWith('0') &&
        !String(amount).includes('.')) ||
      (String(numericAmount).includes('.') &&
        String(numericAmount).split('.')[1].length > 2)
    ) {
      return res.status(400).json({
        message: 'Balance update failed',
      })
    } else {
      const updatedBalance = user.receive(numericAmount)

      user.balance = updatedBalance
      session.user.balance = updatedBalance
    }

    const notification = user.createNotification(
      'New reward system',
      'Announcement',
    )

    const transaction = user.createTransaction(
      'Coin',
      user.email,
      'Receipt',
      amount,
    )

    return res.status(200).json({
      message: 'Transaction was successful',
      transaction,
      notification,
      session: session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

// ==================================

router.get('/transaction', function (req, res) {
  try {
    const token = req.query.token
    const transactionId = req.query.transactionId

    const session = Session.get(token)

    if (!session || !session.user || !session.user.email) {
      return res.status(400).json({
        message: 'Invalid session or user data',
      })
    }

    const user = User.getByEmail(session.user.email)

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      })
    }

    const transaction = user.getTransactionById(
      Number(transactionId),
    )

    if (!transaction) {
      return res.status(400).json({
        message: 'Transaction not found',
      })
    }

    const convertDate = (date) => {
      if (!date) {
        return 'N/A'
      }

      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]

      const day = date.getDate().toString()
      const month = months[date.getMonth()]
      const hours = date.getHours().toString()
      const minutes = date.getMinutes().toString()

      return `${day} ${month}, ${hours}:${minutes}`
    }

    const formattedDate = convertDate(transaction.date)

    res.status(200).json({
      recipient: transaction.recipient,
      transaction: { ...transaction, date: formattedDate },
    })
  } catch (error) {
    console.error(
      `Error fetching transaction: ${error.message}`,
    )
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ==================================

router.get('/send', function (req, res) {
  res.render('send', {
    name: 'send',

    component: ['back-button', 'field-num', 'field'],

    title: 'Send page',

    data: {},
  })
})

router.post('/send', function (req, res) {
  const { email, amount, token } = req.body

  if (!amount || !email) {
    return res.status(400).json({
      message: 'Required fields are missing',
    })
  }

  if (!token) {
    return res.status(400).json({
      message: 'Token is missing',
    })
  }

  const recipient = User.getByEmail(email)

  if (!recipient) {
    return res.status(400).json({
      message: 'Recipient is not found',
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

    if (user.email === recipient.email) {
      return res.status(400).json({
        message: 'Error. You cannot send funds to yourself',
      })
    }

    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      })
    }

    const numericAmount = Number(amount)

    if (user.balance < numericAmount) {
      return res.status(400).json({
        message: 'Insufficient amount of funds',
      })
    }

    if (
      isNaN(numericAmount) ||
      numericAmount <= 0 ||
      (String(amount).startsWith('0') &&
        !String(amount).includes('.')) ||
      (String(numericAmount).includes('.') &&
        String(numericAmount).split('.')[1].length > 2)
    ) {
      return res.status(400).json({
        message: 'Balance update failed',
      })
    } else {
      const updatedBalance = user.send(numericAmount)

      const updatedRecipientBalance =
        recipient.receive(numericAmount)

      recipient.balance = updatedRecipientBalance

      if (isNaN(updatedBalance)) {
        return res.status(400).json({
          message:
            'Enter a valid numeric value for the amount',
        })
      }

      if (updatedBalance < 0) {
        return res.status(400).json({
          message: 'Balance update failed',
        })
      }

      user.balance = updatedBalance
      session.user.balance = updatedBalance
    }

    const notificationRecipient =
      recipient.createNotification(
        'Receiving funds',
        'Announcement',
      )

    const transactionRecipient =
      recipient.createTransaction(
        user.email,
        recipient.email,
        'Receipt',
        amount,
      )

    const notification = user.createNotification(
      'Debiting funds',
      'Warning',
    )

    const transaction = user.createTransaction(
      recipient.email,
      recipient.email,
      'Sending',
      amount,
    )

    return res.status(200).json({
      message: 'Transaction was successful',
      transaction,
      notification,
      notificationRecipient,
      transactionRecipient,
      session: session,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

module.exports = router
