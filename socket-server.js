import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
app.use(express.json());


const io = new Server(httpServer, {
    path: "/api/socket/io",
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("✅ A client connected:", socket.id);

    socket.on("message", (data) => {
        console.log("💬 Message from client:", data);
        io.emit("message", data);
    });

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});

app.post("/api/emit", (req, res) => {
    console.log("Requestt: ", req.body)
    const { event, data } = req.body;

    if (!event || !data) {
        return res.status(400).json({ error: "Missing event or data" });
    }
    io.emit(event, data); // Or io.to(data.channelId).emit(event, data)
    res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
