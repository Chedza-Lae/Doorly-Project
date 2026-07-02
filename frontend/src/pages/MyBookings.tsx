import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api, getUser, type Booking, type BookingStatus, type PaymentStatus } from "../lib/api";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../lib/date";

const statusOptions: BookingStatus[] = ["aceite", "rejeitado", "concluido", "cancelado"];

const statusStyles: Record<BookingStatus, string> = {
  pendente: "bg-yellow-50 text-yellow-800 border-yellow-200",
  aceite: "bg-blue-50 text-[#1E3A8A] border-blue-200",
  rejeitado: "bg-red-50 text-red-700 border-red-200",
  concluido: "bg-green-50 text-green-700 border-green-200",
  cancelado: "bg-gray-100 text-gray-700 border-gray-200",
};

const paymentLabels: Record<PaymentStatus, string> = {
  aguarda_pagamento: "Aguarda pagamento",
  pago: "Pago",
  pagamento_falhado: "Pagamento falhado",
};

const paymentStyles: Record<PaymentStatus, string> = {
  aguarda_pagamento: "border-yellow-200 bg-yellow-50 text-yellow-800",
  pago: "border-green-200 bg-green-50 text-green-700",
  pagamento_falhado: "border-red-200 bg-red-50 text-red-700",
};

export default function MyBookings() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useMemo(() => getUser(), []);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [payingId, setPayingId] = useState<number | null>(null);
  const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    void loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const state = location.state as { notice?: string } | null;
    if (state?.notice) {
      setNotice(state.notice);
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  async function loadBookings() {
    try {
      setLoading(true);
      setErr(null);
      setBookings(await api.getMyBookings());
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(booking: Booking, estado: BookingStatus) {
    setUpdatingId(booking.id);
    setErr(null);
    setNotice(null);

    try {
      const updated = await api.updateBookingStatus(booking.id, estado);
      setBookings((current) => current.map((item) => (item.id === booking.id ? { ...item, ...updated } : item)));
      setNotice("Estado do agendamento atualizado.");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao atualizar agendamento");
    } finally {
      setUpdatingId(null);
    }
  }

  async function confirmPayment() {
    if (!paymentBooking) return;

    setPayingId(paymentBooking.id);
    setErr(null);
    setNotice(null);

    try {
      const updated = await api.payBooking(paymentBooking.id);
      setBookings((current) => current.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)));
      setPaymentBooking(null);
      setNotice("Pagamento registado com sucesso.");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao registar pagamento");
    } finally {
      setPayingId(null);
    }
  }

  const title = user?.tipo === "prestador" ? "Agendamentos recebidos" : "Meus agendamentos";
  const subtitle =
    user?.tipo === "prestador"
      ? "Pedidos e reservas feitos pelos clientes nos teus serviços."
      : "Pedidos e reservas associados à tua conta.";

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-[#1E3A8A]">Agenda</p>
          <h1 className="text-3xl font-bold text-[#0B1B46] md:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-gray-600">{subtitle}</p>
        </div>

        {err && <Feedback tone="error" message={err} />}
        {notice && <Feedback tone="success" message={notice} />}

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-gray-600">
            <Loader2 className="mr-2 inline-block h-5 w-5 animate-spin" />
            A carregar agendamentos...
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-gray-600">
            <p>Ainda não existem agendamentos para mostrar.</p>
            {user?.tipo === "cliente" && (
              <Link
                to="/services"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1B46] px-4 py-2 text-sm text-white transition-colors hover:bg-[#1E3A8A]"
              >
                Procurar serviços
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                canUpdate={user?.tipo === "prestador"}
                isClient={user?.tipo === "cliente"}
                updating={updatingId === booking.id}
                onStatusChange={updateStatus}
                onPay={setPaymentBooking}
              />
            ))}
          </div>
        )}
      </main>

      {paymentBooking && (
        <PaymentModal
          booking={paymentBooking}
          paying={payingId === paymentBooking.id}
          onClose={() => setPaymentBooking(null)}
          onConfirm={confirmPayment}
        />
      )}

      <Footer />
    </div>
  );
}

function BookingCard({
  booking,
  canUpdate,
  isClient,
  updating,
  onStatusChange,
  onPay,
}: {
  booking: Booking;
  canUpdate: boolean;
  isClient: boolean;
  updating: boolean;
  onStatusChange: (booking: Booking, estado: BookingStatus) => void;
  onPay: (booking: Booking) => void;
}) {
  const serviceName = booking.nome_servico || booking.titulo_servico || "Serviço";
  const date = formatDate(booking.data_agendada);
  const paymentStatus = booking.estado_pagamento || "aguarda_pagamento";
  const canPay = isClient && booking.estado === "aceite" && paymentStatus !== "pago";

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="line-clamp-1 text-lg font-semibold text-gray-900">{serviceName}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-[#1E3A8A]" />
              {date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[#1E3A8A]" />
              {booking.hora_inicio}
              {booking.hora_fim ? ` - ${booking.hora_fim}` : ""}
            </span>
          </div>
        </div>

        <Badge estado={booking.estado} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PaymentBadge estado={paymentStatus} />
        {booking.pagamento_referencia && (
          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
            Ref. {booking.pagamento_referencia}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
        <span className="inline-flex items-center gap-2">
          <UserRound className="h-4 w-4 text-gray-400" />
          Cliente: {booking.nome_cliente || "Cliente"}
        </span>
        <span className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          Prestador: {booking.nome_prestador || "Prestador"}
        </span>
      </div>

      {booking.descricao && <p className="mt-4 line-clamp-3 text-sm text-gray-700">{booking.descricao}</p>}

      {canPay && (
        <div className="mt-5 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => onPay(booking)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1B46] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1E3A8A]"
          >
            <CreditCard className="h-4 w-4" />
            Pagar agora
          </button>
        </div>
      )}

      {canUpdate && (
        <div className="mt-5 flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium text-gray-700">Atualizar estado</span>
          <select
            value={booking.estado}
            disabled={updating}
            onChange={(event) => onStatusChange(booking, event.target.value as BookingStatus)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#3B82F6] disabled:opacity-60"
          >
            <option value={booking.estado}>{booking.estado}</option>
            {statusOptions
              .filter((estado) => estado !== booking.estado)
              .map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
          </select>
        </div>
      )}
    </article>
  );
}

function Badge({ estado }: { estado: BookingStatus }) {
  return (
    <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyles[estado]}`}>
      {estado}
    </span>
  );
}

function PaymentBadge({ estado }: { estado: PaymentStatus }) {
  return (
    <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${paymentStyles[estado]}`}>
      {paymentLabels[estado]}
    </span>
  );
}

function PaymentModal({
  booking,
  paying,
  onClose,
  onConfirm,
}: {
  booking: Booking;
  paying: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const serviceName = booking.nome_servico || booking.titulo_servico || "Serviço";
  const price = booking.preco_servico != null ? Number(booking.preco_servico) : null;
  const formattedPrice = price != null && Number.isFinite(price)
    ? new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(price)
    : "Valor a confirmar";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-4 py-8">
      <section className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#1E3A8A]">Pagamento simulado</p>
            <h2 className="text-2xl font-bold text-[#0B1B46]">Confirmar pagamento</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Fechar pagamento"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
          <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3">
            <span className="text-gray-600">Serviço</span>
            <span className="text-right font-semibold text-gray-900">{serviceName}</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-3">
            <span className="text-gray-600">Total</span>
            <span className="text-right text-xl font-bold text-[#0B1B46]">{formattedPrice}</span>
          </div>
        </div>

        {/* TODO Stripe Checkout: substituir este botão por criação de Checkout Session e redirecionamento para session.url. */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={paying}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1B46] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1E3A8A] disabled:opacity-60"
          >
            {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
            Confirmar pagamento
          </button>
        </div>
      </section>
    </div>
  );
}

function Feedback({ tone, message }: { tone: "error" | "success"; message: string }) {
  const isError = tone === "error";
  return (
    <div
      className={`mb-5 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
        isError ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"
      }`}
    >
      {isError ? <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />}
      <span>{message}</span>
    </div>
  );
}
