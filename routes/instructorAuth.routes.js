import express from 'express'
import * as controllers from '../controllers/instructorsAuth.controllers.js'
import { AdminProtect, Protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', controllers.registerUser )
router.post('/login', controllers.login )
router.post('/forgotPassword', controllers.forgotPassword )
router.post('/resetPassword/:resetToken', controllers.resetPassword )
router.post('/updateProfile', Protect, controllers.updateProfile )
router.post('/toggleblock', AdminProtect, controllers.toggleblock)

//GET ROUTES
router.get('/getAllInstructor', AdminProtect, controllers.getAllInstructor)
router.get('/getInstructor/:_id', AdminProtect, controllers.getInstructor)

//PUT ROUTES

export default router