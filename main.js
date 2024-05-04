/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file In this module are the API endpoints.
 */

const { connection } = require("./configurations/connections");
const { useTreblle } = require("treblle");
const { userRouter } = require("./routes/userRoutes");
const { authRouter } = require("./routes/authRoutes");
const { postsRouter, bulletinsRouter } = require("./routes/guestRoutes");
const { adminRouter } = require("./routes/adminRoutes");
const { rescuerRouter } = require("./routes/rescuerRoutes");
const {HandlerHttpVerbs} = require("./errors/handlerHttpVerbs");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const  express = require("express");
const app = express();


const customCss ="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css";

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PET (Perdidos en Tapachula)',
            version: '2.0',
            description: 'API pets lost',
        },
        servers: [
            {
                url: 'http://localhost:5000'
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                },
            },
        }
    },
    apis: ['./routes/*.js']
}

app.use(express.json());

useTreblle(app, {
    apiKey: process.env.API_KEY,
    projectId: process.env.PROJECT_ID
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(options), {customCssUrl: customCss}));

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type,Authorization',
}));
app.use(morgan('dev'));

app.get("/", (req, res) => {
    res.status(200).json(
        HandlerHttpVerbs.ok(
            "🦮🐩🐈🦜 Welcome to the Lost in Tapachula (PET) API 🦮🐩🐈🦜", {
                url: req.baseUrl,
                verb: req.method
            }
        )
    );
});

app.use((req, res, next) => {
    const isConnected = () => {
        if (connection.readyState !== 1) {
            setTimeout(isConnected, 1);
        } else {
            next();
        }
    }
    isConnected();
});

app.use("/api/v2/users", userRouter);
app.use("/api/v2/auth", authRouter);
app.use("/api/v2/bulletins", bulletinsRouter);
app.use("/api/v2/posts", postsRouter);
app.use("/api/v2/admins", adminRouter);
app.use("/api/v2/rescuers", rescuerRouter);

app.use((req, res) => {
    res.status(404).json(
        HandlerHttpVerbs.notFound(
            "This route not available 🚧",
            {url: req.baseUrl, verb: req.method}
        )
    );
});

app.listen(parseInt(process.env.PORT, 10), () => {
    console.log("Listening requests");
});
