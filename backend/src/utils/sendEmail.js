import nodemailer from "nodemailer";

export async function sendResetEmail(to, link) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Configuração de email incompleta");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Doorly" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Recuperação de Password",
    html: `
      <div style="font-family:Arial;padding:20px;">
        <h2>Recuperação de Password</h2>

        <p>
          Recebemos um pedido para redefinir a tua password.
        </p>

        <a href="${link}"
          style="
            background:#0B1B46;
            color:white;
            padding:12px 20px;
            border-radius:8px;
            text-decoration:none;
            display:inline-block;
            margin-top:10px;
          ">
          Redefinir Password
        </a>

        <p style="margin-top:20px;">
          Este link expira em 1 hora.
        </p>
      </div>
    `
  });
}
