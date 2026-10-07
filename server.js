require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const {
    connectDatabases,
    getWriteClient
} = require('./config/db');

const booksRouter = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function startServer() {
    try {
        await connectDatabases();

        app.use(
            session({
                secret: process.env.SESSION_SECRET,
                resave: false,
                saveUninitialized: false,

                store: MongoStore.create({
                    client: getWriteClient(),
                    dbName: 'DB_23IT119',
                    collectionName: 'sessions',
                    autoRemove: 'disabled'
                }),

                cookie: {
                    maxAge: 1000 * 60 * 60 * 24
                }
            })
        );

        app.get('/', (req, res) => {
            res.redirect('/books');
        });

        app.get('/session', (req, res) => {
            req.session.visits = (req.session.visits || 0) + 1;

            res.json({
                message: 'Session is stored in MongoDB Atlas',
                visits: req.session.visits
            });
        });

        app.use('/books', booksRouter);

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
}

startServer();