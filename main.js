/**
 * @author Brandon Jared Molina Vazquez
 * @date 25/09/2023
 * @file In this module are the API endpoints.
 */

const { connection } = require("./config/connections");
const { useTreblle } = require("treblle");
const { userRouter } = require("./routes/userRoutes");
const { authRouter } = require("./routes/authRoutes");
const { adminRouter } = require("./routes/adminRoutes");
const { rescuerRouter } = require("./routes/rescuerRoutes");
const { associationRouter } = require("./routes/associationRoutes");
const { HandlerHttpVerbs } = require("./errors/handlerHttpVerbs");
const mainDocs = require("./swagger/mainDocs");
const swaggerUi = require("swagger-ui-express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const  express = require("express");
const { postsRouter, bulletinsRouter, blogsRouter } = require("./routes/guestRoutes");
const { errorsCodes } = require("./utils/codes");
const app = express();


app.use(express.json());

useTreblle(app, {
    apiKey: process.env.API_KEY,
    projectId: process.env.PROJECT_ID
});

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(mainDocs, {
            customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css",
            customCss: ".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }"
        }
    )
);
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
            "🦮🐩🐈🦜 Welcome to the Lost in Tapachula (PET) API v3.1 🦮🐩🐈🦜",
            undefined, {
                url: req.baseUrl,
                verb: req.method
            }
        )
    );
});
/*
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
 */
app.use("/api/v3/users", userRouter);
app.use("/api/v3/auth", authRouter);
app.use("/api/v3/admins", adminRouter);
app.use("/api/v3/rescuers", rescuerRouter);
app.use("/api/v3/posts", postsRouter);
app.use("/api/v3/blogs", blogsRouter);
app.use("/api/v3/bulletins", bulletinsRouter);
app.use("/api/v3/associations", associationRouter);
app.use((req, res) => {
    res.status(404).json(
        HandlerHttpVerbs.notFound(
            "This route not available 🚧",
            errorsCodes.ROUTE_NOT_FOUND,
            {url: req.baseUrl, verb: req.method}
        )
    );
});

app.listen(parseInt(process.env.PORT, 10), () => {
    console.log("Listening requests");
});
