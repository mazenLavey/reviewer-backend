import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import registerRoute from './routes/Register';
import loginRoute from './routes/Login';
import PostRoute from './routes/Post';
import cookieParser from 'cookie-parser';

const PORT = 4000;
const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use(express.json({
    limit: "900kb"
}));

mongoose.connect("mongodb+srv://mazenfp:JipRIoBf2A7hu0bq@reviewer.qwcbmxs.mongodb.net/")

app.use("/api/register", registerRoute)
app.use("/api/login", loginRoute)
app.use("/api/post", PostRoute)


app.listen(PORT)