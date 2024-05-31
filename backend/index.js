import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js"
import ToolRoute from "./routes/ToolRoute.js"
import ClientRoute from "./routes/ClientRoute.js"
import OrderRoute from "./routes/OrderRoute.js"
import AuthRoute from "./routes/AuthRoute.js";
import SearchRoute from "./routes/SearchRoute.js"
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

(async()=>{
    await db.sync();
})();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(UserRoute);
app.use(ToolRoute);
app.use(ClientRoute);
app.use(OrderRoute);
app.use(AuthRoute);
app.use(SearchRoute);

store.sync();

app.listen(process.env.APP_PORT, ()=> {
    console.log('Server up and run');
});