import express from "express";
import sql from "mssql";

const router = express.Router();

router.get("/:id_cliente", async (req, res) => {
  const { id_cliente } = req.params;

  try {
    const pool = await sql.connect();

    const result = await pool.request()
      .input("id_cliente", sql.Int, id_cliente)
      .query(`
        SELECT s.*
        FROM Favoritos f
        JOIN Servico s ON f.id_servico = s.id_servico
        WHERE f.id_cliente = @id_cliente
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar favoritos" });
  }
});


// ➕ adicionar favorito
router.post("/", async (req, res) => {
  const { id_cliente, id_servico } = req.body;

  try {
    const pool = await sql.connect();

    await pool.request()
      .input("id_cliente", sql.Int, id_cliente)
      .input("id_servico", sql.Int, id_servico)
      .query(`
        INSERT INTO Favoritos (id_cliente, id_servico)
        VALUES (@id_cliente, @id_servico)
      `);

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Já existe ou erro" });
  }
});


// ❌ remover favorito
router.delete("/", async (req, res) => {
  const { id_cliente, id_servico } = req.body;

  try {
    const pool = await sql.connect();

    await pool.request()
      .input("id_cliente", sql.Int, id_cliente)
      .input("id_servico", sql.Int, id_servico)
      .query(`
        DELETE FROM Favoritos
        WHERE id_cliente = @id_cliente AND id_servico = @id_servico
      `);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover" });
  }
});

export default router;