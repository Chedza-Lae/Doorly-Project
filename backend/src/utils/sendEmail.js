import nodemailer from "nodemailer";

let transporter;

function buildFrontendUrl(path = "/") {
  const baseUrl = `${process.env.FRONTEND_URL || ""}`.replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error("FRONTEND_URL não configurado");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER ou EMAIL_PASS não configurado");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  return transporter;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) return "Data a confirmar";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function scheduleRows(schedule) {
  return `
    <tr>
      <td style="padding:8px 0;color:#64748b;">Serviço</td>
      <td style="padding:8px 0;text-align:right;font-weight:600;color:#0f172a;">${escapeHtml(schedule.nome_servico || schedule.titulo_servico)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;color:#64748b;">Data</td>
      <td style="padding:8px 0;text-align:right;font-weight:600;color:#0f172a;">${escapeHtml(formatDate(schedule.data_agendada))}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;color:#64748b;">Horário</td>
      <td style="padding:8px 0;text-align:right;font-weight:600;color:#0f172a;">${escapeHtml(schedule.hora_inicio)} - ${escapeHtml(schedule.hora_fim)}</td>
    </tr>
  `;
}

function baseTemplate({ title, intro, body = "", actionLabel, actionUrl }) {
  const actionHtml = actionLabel && actionUrl
    ? `
        <p style="margin:28px 0 10px;">
          <a href="${escapeHtml(actionUrl)}"
            style="background:#0B1B46;color:#ffffff;padding:12px 18px;border-radius:6px;text-decoration:none;display:inline-block;font-weight:700;">
            ${escapeHtml(actionLabel)}
          </a>
        </p>
      `
    : "";

  return `
    <div style="margin:0;padding:0;background:#f6f8fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:620px;margin:0 auto;padding:28px 16px;">
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
          <div style="padding:20px 24px;background:#0B1B46;color:#ffffff;">
            <div style="font-size:18px;font-weight:700;">Doorly</div>
          </div>

          <div style="padding:28px 24px;">
            <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:#0f172a;">${escapeHtml(title)}</h1>
            <p style="margin:0 0 18px;font-size:15px;line-height:1.65;color:#334155;">${intro}</p>
            ${body}
            ${actionHtml}
          </div>

          <div style="padding:16px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;line-height:1.5;color:#64748b;">
              Este email foi enviado automaticamente pela Doorly.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function sendEmail({ to, subject, html }) {
  try {
    await getTransporter().sendMail({
      from: `"Doorly" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error("[email] Falha ao enviar email:", error);
  }
}

async function sendSafely(context, callback) {
  try {
    await callback();
  } catch (error) {
    console.error(`[email] Falha ao preparar email (${context}):`, error);
  }
}

export async function sendResetEmail(to, link) {
  await sendSafely("recuperação de password", async () => {
    await sendEmail({
      to,
      subject: "Recuperação de password - Doorly",
      html: baseTemplate({
        title: "Recuperação de password",
        intro: "Recebemos um pedido para redefinir a tua password. Usa o botão abaixo para escolher uma nova password.",
        body: `<p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#475569;">Este link expira em 1 hora. Se não fizeste este pedido, podes ignorar este email.</p>`,
        actionLabel: "Redefinir password",
        actionUrl: link
      })
    });
  });
}

export async function sendWelcomeEmail(user) {
  await sendSafely("boas-vindas", async () => {
    await sendEmail({
      to: user.email,
      subject: "Bem-vindo a Doorly",
      html: baseTemplate({
        title: `Bem-vindo, ${user.nome}`,
        intro: "A tua conta foi criada com sucesso. Já podes iniciar sessão e usar a Doorly para encontrar ou prestar serviços.",
        actionLabel: "Entrar na Doorly",
        actionUrl: buildFrontendUrl("/login")
      })
    });
  });
}

export async function sendScheduleCreatedEmailToClient(schedule) {
  await sendSafely("agendamento cliente", async () => {
    await sendEmail({
      to: schedule.email_cliente,
      subject: "Agendamento recebido - Doorly",
      html: baseTemplate({
        title: "Recebemos o teu agendamento",
        intro: `Olá ${escapeHtml(schedule.nome_cliente)}, o teu pedido foi registado e está pendente de resposta do prestador.`,
        body: `
          <table role="presentation" style="width:100%;border-collapse:collapse;margin:18px 0;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;">
            ${scheduleRows(schedule)}
          </table>
        `,
        actionLabel: "Ver agendamentos",
        actionUrl: buildFrontendUrl("/agendamentos")
      })
    });
  });
}

export async function sendNewScheduleEmailToProvider(schedule) {
  await sendSafely("agendamento prestador", async () => {
    await sendEmail({
      to: schedule.email_prestador,
      subject: "Novo agendamento recebido - Doorly",
      html: baseTemplate({
        title: "Novo pedido de agendamento",
        intro: `O cliente ${escapeHtml(schedule.nome_cliente)} criou um novo pedido para um dos teus serviços.`,
        body: `
          <table role="presentation" style="width:100%;border-collapse:collapse;margin:18px 0;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;">
            ${scheduleRows(schedule)}
          </table>
        `,
        actionLabel: "Gerir pedido",
        actionUrl: buildFrontendUrl("/prestador/dashboard")
      })
    });
  });
}

export async function sendScheduleStatusEmailToClient(schedule) {
  await sendSafely("estado agendamento", async () => {
    const statusLabels = {
      aceite: "aceite",
      rejeitado: "rejeitado",
      concluido: "concluído",
      cancelado: "cancelado"
    };
    const status = statusLabels[schedule.estado] || schedule.estado;

    await sendEmail({
      to: schedule.email_cliente,
      subject: `Agendamento ${status} - Doorly`,
      html: baseTemplate({
        title: `Agendamento ${status}`,
        intro: `Olá ${escapeHtml(schedule.nome_cliente)}, o estado do teu agendamento foi atualizado pelo prestador.`,
        body: `
          <table role="presentation" style="width:100%;border-collapse:collapse;margin:18px 0;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;">
            ${scheduleRows(schedule)}
            <tr>
              <td style="padding:8px 0;color:#64748b;">Estado</td>
              <td style="padding:8px 0;text-align:right;font-weight:700;color:#0B1B46;">${escapeHtml(status)}</td>
            </tr>
          </table>
        `,
        actionLabel: "Ver agendamentos",
        actionUrl: buildFrontendUrl("/agendamentos")
      })
    });
  });
}

export { buildFrontendUrl };
