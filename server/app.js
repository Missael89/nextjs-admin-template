//Variables de entorno
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

const port = process.env.PORT || 3001;

const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

//Procesar datos enviados desde el Frontend
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: "userId",
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24
    }
}));

//Llamar a Routes
app.use('/', require('./routes/router'));



app.listen(port, (err) => {
    if (err)
        throw err;
    console.log(`Listening on PORT ${port}`);
});



