/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file In this module are the API endpoints.
 */

const conn = require('./configurations/connection');
const { useTreblle } = require('treblle');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const petsRouter = require('./routes/postRoutes');
const guestsRouter = require('./routes/guestRoutes');
const adminRouter = require('./routes/adminRoutes');
const collabRouter = require('./routes/collabRoutes');
const bulletinRouter = require("./routes/bulletinRoutes");
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const { app, express } = require('./singlenton/instances');

app.use(express.json());

useTreblle(app, {
    apiKey: process.env.API_KEY,
    projectId: process.env.PROJECT_ID
});

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type,Authorization',
}));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.status(200).json({'message': `Welcome API to lost pets: ${req.ip.substring(7)}`});
});

app.use((req, res, next) => {
    const isConnected = () => {
        if (conn.readyState !== 1) {
            console.log("Waiting connection");
            setTimeout(isConnected, 1);
        } else {
            next();
        }
    }
    isConnected();
});

app.use('/api/v2/users', userRouter);
app.use('/api/v2/auth', authRouter);
app.use('/api/v2/posts', petsRouter);
app.use('/api/v2/guests', guestsRouter);
app.use('/api/v2/admins', adminRouter);
app.use('/api/v2/collabs', collabRouter);
app.use('/api/v2/bulletins', bulletinRouter);

app.use((req, res) => {
    res.status(404).json({'message': 'This route not available'});
});

app.listen(parseInt(process.env.PORT, 10), () => {
    console.log("Listening requests");
});
