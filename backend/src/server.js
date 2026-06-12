import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import servicosRoutes from "./routes/servicos.js";
import messagesRoutes from "./routes/message.js";
import adminRoutes from "./routes/admin.js";
import favoritesRoutes from "./routes/favorites.js";
import propostasRoutes from "./routes/propostas.js";
import avaliacoesRoutes from "./routes/avaliacoes.js";
import historicoRoutes from "./routes/historico.js";
import agendamentosRoutes from "./routes/agendamentos.js";
import { getFrontendUrl } from "./config/frontend.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CLEAN ARCHITECTURE: middleware global de parsing/CORS antes das rotas.
app.use(cors({
  origin: getFrontendUrl()
}));
app.use(express.json({ limit: "4mb" }));

// CLEAN ARCHITECTURE: routes ficam centralizadas no server.
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/servicos", servicosRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/propostas", propostasRoutes);
app.use("/api/avaliacoes", avaliacoesRoutes);
// NEW FEATURE: novas rotas completas.
app.use("/api/historico", historicoRoutes);
app.use("/api/agendamentos", agendamentosRoutes);

// CLEAN ARCHITECTURE: health check simples para monitorização.
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend Doorly a correr!" });
});

// =============================
// PRODUCAO (descomentar no deploy)
// Serve o frontend buildado (dist)
// =============================

// app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// app.get(/.*/, (req, res) => {
//   res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
// });

// CLEAN ARCHITECTURE: middleware global de erros depois das rotas.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend a correr em http://localhost:${PORT}`);
});
