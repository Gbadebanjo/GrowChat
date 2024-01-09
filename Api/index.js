const express = require('express');
const dotenv = require('dotenv');
// const mongoose = require('mongoose');
const UserModel = require('./model/User');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const connectDB = require('./config/Db.config');

dotenv.config();
connectDB();

// const options = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     ssl: true,
// };

// mongoose.connect(process.env.MONGO_URL).catch(err => {
//     console.error('Error connecting to MongoDB:', err);
// });

// mongoose.connection.on('error', err => {
//     console.error('MongoDB connection error:', err);
// });

const jwtSecret = process.env.JWT_SECRET;

const app = express();
app.use(express.json()); // for parsing application/json
app.use(cors({ origin: process.env.CLIENT_URL , credentials: true }));
app.get('/test', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.post("/register", async (req, res) => {
const { username, password } = req.body;
try{
    const newUser = await UserModel.create({ username, password });
jwt.sign({ userId: newUser, id}, jwtSecret, {}, (err, token) => {
    if (err) throw err;
    res.cookie('token', token).status(201).json('User created successfully');
});
} catch (err) {
    console.log(err);
    res.status(500).json('Internal Server error');
}
});



app.listen(3003, () => {
    console.log('Server running on port 3003');
});



