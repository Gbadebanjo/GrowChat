const express = require('express');
const dotenv = require('dotenv');
const  cookieParser = require('cookie-parser');
const UserModel = require('./model/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const connectDB = require('./config/Db.config');
const bcrypt = require('bcryptjs');

dotenv.config();
connectDB();

const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use(express.json()); // for parsing application/json
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.get('/test', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.get('/profile', (req, res) => {
   const token = req.cookies?.token;
   if (!token) {
       return res.status(401).json({ message: 'Unauthorized' });
   }
   else {
       jwt.verify(token, jwtSecret, {}, (err, decodedData) => {
           if (err) throw err;
           res.json(decodedData);
       });
   }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const newUser = await UserModel.findOne({username});
    if (newUser) {
        const isPasswordCorrect = bcrypt.compareSync(password, newUser.password);
        if (isPasswordCorrect) {
            jwt.sign({ userId: newUser._id, username }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).status(200).json({
                    id: newUser._id,
                    // username,
                });
            });
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    }
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const newUser = await UserModel.create({ 
            username: username, 
            password:  hashedPassword
        });
        jwt.sign({ userId: newUser._id, username }, jwtSecret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).status(201).json({
                userId: newUser._id,
                username,
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json('Internal Server error');
    }
});



app.listen(3003, () => {
    console.log('Server running on port 3003');
});



