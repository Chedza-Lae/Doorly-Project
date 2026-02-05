import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

// rotas
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import servicosRoutes from "./routes/servicos.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middleware
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

// ---- SERVIR FRONTEND ----
// agora podes abrir qualquer HTML via http://localhost:3001/frontend/ficheiro.html
app.use("/frontend", express.static(path.join(__dirname, "../../frontend")));

// ---- ROTAS ----
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/servicos", servicosRoutes);

// rota teste
app.get("/", (req, res) => {
  res.send("Backend Doorly a correr! 🚀");
});

app.listen(3001, () => {
  console.log("🚀 Backend a correr em http://localhost:3001");
});
