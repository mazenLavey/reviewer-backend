import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import registerRoute from './routes/Register';
import loginRoute from './routes/Login';
import PostRoute from './routes/Post';
import cookieParser from 'cookie-parser';
import { Server } from "socket.io";
import { createServer } from 'http';

const PORT = 4000;
const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//     cors: {
//         origin: process.env.FRONTEND_URL,
//         credentials: true,
//     }
// });

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(cors({ credentials: true, origin: allowedOrigin }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL);

// io.on('connection', (socket) => {
//     socket.on("send_like", (val) => {
//         socket.broadcast.emit("receive_like", { data: "test" })
//     });
// });

app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/post", PostRoute);

app.listen(PORT)