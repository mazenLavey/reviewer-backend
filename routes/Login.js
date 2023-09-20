import express from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const router = express.Router();
const salt = bcrypt.genSaltSync(10);

router.post('/', async (req, res) => {
    const { userEmail, userPassword } = req.body;
    try {
        const userDoc = await User.findOne({ userEmail })
        const isPassword = bcrypt.compareSync(userPassword, userDoc.userPassword);

        if (!userDoc) {
            return res.status(400).json({ message: "User does not exist" })
        } else if (!isPassword) {
            return res.status(400).json({ message: "Password is not correct" })
        } else {
            jwt.sign({
                id: userDoc._id,
                userName: userDoc.userName
            }, salt, {}, (error, token) => {
                if (error) throw error;

                res.json({
                    message: "Welcome back!",
                    token, 
                    userId: userDoc._id,
                    userName: userDoc.userName,
                    userEmail
                });
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
})

export default router;