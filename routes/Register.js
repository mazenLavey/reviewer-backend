import express from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';

const router = express.Router();
const salt = bcrypt.genSaltSync(10);

router.post('/', async (req, res) => {
    const { userName, userEmail, userPassword } = req.body;
    try {
        const userDoc = await User.create({
            userName,
            userEmail,
            userPassword: bcrypt.hashSync(userPassword, salt)
        })
        
        res.json({data: {
            userId: userDoc._id,
            userName: userDoc.userName,
            userEmail: userDoc.userEmail,
        }});

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
})

export default router;