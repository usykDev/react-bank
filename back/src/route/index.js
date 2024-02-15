const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.render('index', {
    name: 'index',

    component: [''],

    title: 'Index page',

    data: {},
  })
})

// ==================================

router.get('/logout', function (req, res) {
  res.render('logout', {
    name: 'logout',

    component: [''],

    title: 'Logout page',

    data: {},
  })
})

const auth = require('./auth')
router.use('/', auth)

const account = require('./account')
router.use('/', account)

module.exports = router
