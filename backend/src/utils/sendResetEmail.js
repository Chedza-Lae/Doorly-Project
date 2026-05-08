import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendResetEmail(to, link) {
  await transporter.sendMail({
    from: `"Doorly" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Recuperação de password",
    html: `
      <div style="font-family:Arial;padding:20px;">
        <h2>Recuperação de Password</h2>
        <p>Clica no botão abaixo para redefinir a tua password.</p>

        <a href="${link}"
           style="
             background:#0B1B46;
             color:white;
             padding:12px 20px;
             text-decoration:none;
             border-radius:8px;
             display:inline-block;
           ">
           Redefinir Password
        </a>
      </div>
    `
  });
}