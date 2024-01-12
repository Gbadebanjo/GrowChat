const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const UserModel = require('./model/User');
const Message = require('./model/Message');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const connectDB = require('./config/Db.config');
const bcrypt = require('bcryptjs');
const ws = require('ws');
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

async function getuserFromrequest(req) {
    return new Promise((resolve, reject) => {
        const token = req.cookies?.token;
        if (token) {
            jwt.verify(token, jwtSecret, {}, (err, decodedData) => {
                if (err) throw err;
                resolve(decodedData);
            });
        } else {
            reject('Unauthorized');
        }
    });
    }


app.get('/messages/:userId', async (req, res) => {
    const { userId } = req.params;
const userData = await getuserFromrequest(req);
const ourUserId = userData.userId;
const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] },
}).sort({createdAt: -1});
res.json(messages);
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
    const newUser = await UserModel.findOne({ username });
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

app.post('/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out' });
}
);

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const newUser = await UserModel.create({
            username: username,
            password: hashedPassword
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



const server = app.listen(3003, () => {
    console.log('Server running on port 3003');
});

const wss = new ws.Server({ server });
wss.on('connection', (connection, req) => {
    // read username & userId from cookies
    const cookies = req.headers.cookie;
    if (cookies) {
        const tokenCookieString = cookies.split('; ').find(str => str.startsWith('token='));
        if (tokenCookieString) {
            const token = tokenCookieString.split('=')[1];
            if (token) {
                jwt.verify(token, jwtSecret, {}, (err, decodedData) => {
                    if (err) throw err;
                    const { userId, username } = decodedData;
                    connection.userId = userId;
                    connection.username = username;
                });
            }
        }
    }

    connection.on('message', async (message) => {
        const messageData = JSON.parse(message.toString());
        const { recipient, text } = messageData;
        if (recipient && text) {
            const messageDoc = await Message.create({ sender: connection.userId, recipient, text, });
            [...wss.clients].filter(client => client.userId === recipient).forEach(client => client.send(JSON.stringify({ text, sender: connection.userId, recipient, id: messageDoc._id })))
        }
    });

    // notify everyone about online users
    [...wss.clients].forEach(client => {
        client.send(JSON.stringify({
            online: [...wss.clients].map(client => ({ userId: client.userId, username: client.username }))
        }
        ));
    });
});


