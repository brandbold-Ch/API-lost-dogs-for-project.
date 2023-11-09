/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file In this module are the API endpoints.
 */

const connection = require('./configurations/connection');
const { useTreblle } = require('treblle');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRotes');
const petsRouter = require('./routes/petsRoutes');
const guestsRouter = require('./routes/guestsRoutes');
const adminRouter = require('./routes/adminRoutes');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const { app, express } = require('./singlenton/uniqueInstances');

//app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type,Authorization',
}));
app.use(morgan('dev'));

/*
useTreblle(app, {
    apiKey: process.env.API_KEY,
    projectId: process.env.PROJECT_ID
});
 */

app.get('/', (req, res) => {
    res.status(200).json({'message': `Welcome API to lost pets: ${req.ip.substring(7)}`});
});
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', petsRouter);
app.use('/api/v1/guests', guestsRouter);
app.use('/api/v1/admin', adminRouter);
app.use((req, res) => {
    res.status(404).json({'message': 'This route not available'});
});

app.listen(parseInt(process.env.PORT, 10), () => {
    console.log("Listening requests");
});
