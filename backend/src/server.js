import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";


// rotas
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import servicosRoutes from "./routes/servicos.js";
import messagesRoutes from "./routes/message.js";
import adminRoutes from "./routes/admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

// ---- ROTAS ----
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/servicos", servicosRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/admin", adminRoutes);

// health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend Doorly a correr! 🚀" });
});

// servir frontend buildado
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend a correr em http://0.0.0.0:${PORT}`);
});