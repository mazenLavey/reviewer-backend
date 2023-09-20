import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import registerRoute from './routes/Register';
import loginRoute from './routes/Login';
import PostRoute from './routes/Post';
import cookieParser from 'cookie-parser';
import { Server } from "socket.io";
import { createServer } from 'http';
import dotenv from 'dotenv';

const PORT = 4000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
});

app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL);

io.on('connection', (socket) => {
    socket.on("send_like", (val) => {
        socket.broadcast.emit("receive_like", { data: "hghghg" })
    });
});

app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/post", PostRoute);

httpServer.listen(PORT)