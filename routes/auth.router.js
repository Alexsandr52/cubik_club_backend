const Router = require('express')
const router = new Router()
const userController = require('../controllers/user.controller')

router.post('/registration', userController.createUser)
router.post('/login', userController.createUser)
router.get('/users', userController.createUser)


module.exports = router