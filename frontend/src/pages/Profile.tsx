import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api, getUser, setUser, type ApiUser, type UpdateMePayload } from "../lib/api";
import {
  AlertCircle,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const fieldClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#3B82F6]";
const MAX_PROFILE_IMAGE_BYTES = 2 * 1024 * 1024;
const PROFILE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const emptyProfile: UpdateMePayload = {
  nome: "",
  telefone: "",
  localizacao: "",
  profissao: "",
  descricao: "",
  foto_perfil: "",
};

export default function Profile() {
  const navigate = useNavigate();
  const storedUser = getUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profile, setProfile] = useState<ApiUser | null>(storedUser);
  const [form, setForm] = useState<UpdateMePayload>(emptyProfile);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!storedUser) {
      navigate("/login");
      return;
    }

    void loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  async function loadProfile() {
    try {
      setLoading(true);
      setErr(null);
      const data = await api.getMe();
      applyProfile(data);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  }

  function applyProfile(data: ApiUser) {
    const normalized = { ...data, id: data.id ?? data.id_utilizador };
    if (!normalized.id) return;

    setProfile(normalized);
    setUser(normalized);
    setForm({
      nome: normalized.nome || "",
      telefone: normalized.telefone || "",
      localizacao: normalized.localizacao || "",
      profissao: normalized.profissao || "",
      descricao: normalized.descricao || "",
      foto_perfil: normalized.foto_perfil || "",
    });
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErr(null);
    setNotice(null);

    try {
      let photoUrl = form.foto_perfil?.trim() || null;

      if (selectedImage) {
        const photoProfile = await api.uploadProfilePhoto(selectedImage);
        photoUrl = photoProfile.foto_perfil || null;
      }

      const updated = await api.updateMe({
        nome: form.nome.trim(),
        telefone: form.telefone?.trim() || null,
        localizacao: form.localizacao?.trim() || null,
        profissao: form.profissao?.trim() || null,
        descricao: form.descricao?.trim() || null,
        foto_perfil: photoUrl,
      });
      applyProfile(updated);
      setSelectedImage(null);
      setImagePreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setNotice("Perfil atualizado com sucesso.");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao guardar perfil");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChangingPassword(true);
    setPasswordErr(null);
    setPasswordNotice(null);

    if (newPassword !== confirmPassword) {
      setPasswordErr("As passwords não coincidem.");
      setChangingPassword(false);
      return;
    }

    try {
      await api.updatePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordNotice("Password alterada com sucesso.");
    } catch (e: unknown) {
      setPasswordErr(e instanceof Error ? e.message : "Erro ao alterar password");
    } finally {
      setChangingPassword(false);
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!PROFILE_IMAGE_TYPES.includes(file.type) || !["jpg", "jpeg", "png", "webp"].includes(extension || "")) {
      setErr("Formato inválido. Usa JPG, PNG ou WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_BYTES) {
      setErr("A imagem deve ter no máximo 2MB.");
      event.target.value = "";
      return;
    }

    setErr(null);
    setNotice(null);
    setSelectedImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  }

  const initial = profile?.nome?.slice(0, 1).toUpperCase() || "U";
  const profileImage = imagePreviewUrl || form.foto_perfil;

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-[#1E3A8A]">Conta</p>
          <h1 className="text-3xl font-bold text-[#0B1B46] md:text-4xl">O meu perfil</h1>
        </div>

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-gray-600">
            <Loader2 className="mr-2 inline-block h-5 w-5 animate-spin" />
            A carregar perfil...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full bg-blue-100 text-[#1E3A8A]">
                    {profileImage ? (
                      <img src={profileImage} alt={form.nome} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-5xl font-semibold">
                        {initial}
                      </div>
                    )}
                  </div>

                  <h2 className="mt-5 text-xl font-semibold text-[#0B1B46]">{profile?.nome}</h2>
                  <p className="mt-1 text-sm text-gray-500">{profile?.email}</p>
                  <span className="mt-4 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium capitalize text-[#1E3A8A]">
                    {profile?.tipo}
                  </span>
                </div>

                <div className="mt-6 space-y-3 border-t border-gray-100 pt-6 text-sm text-gray-600">
                  <Info icon={<Mail className="h-4 w-4" />} value={profile?.email || "Sem email"} />
                  <Info icon={<Phone className="h-4 w-4" />} value={form.telefone || "Sem telefone"} />
                  <Info icon={<MapPin className="h-4 w-4" />} value={form.localizacao || "Sem localização"} />
                  <Info icon={<BriefcaseBusiness className="h-4 w-4" />} value={form.profissao || "Sem profissão"} />
                </div>
              </div>
            </aside>

            <section className="space-y-8 lg:col-span-8">
              <form onSubmit={handleProfileSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Dados pessoais</h2>
                    <p className="mt-1 text-sm text-gray-500">Mantém a tua informação atualizada.</p>
                  </div>
                  <User className="h-6 w-6 text-[#1E3A8A]" />
                </div>

                {err && <Feedback tone="error" message={err} />}
                {notice && <Feedback tone="success" message={notice} />}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="Nome">
                    <input
                      value={form.nome}
                      onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
                      className={fieldClass}
                      required
                    />
                  </Field>

                  <Field label="Email">
                    <input value={profile?.email || ""} className={`${fieldClass} bg-gray-50 text-gray-500`} disabled />
                  </Field>

                  <Field label="Telefone">
                    <input
                      value={form.telefone || ""}
                      onChange={(event) => setForm((current) => ({ ...current, telefone: event.target.value }))}
                      className={fieldClass}
                    />
                  </Field>

                  <Field label="Localização">
                    <input
                      value={form.localizacao || ""}
                      onChange={(event) => setForm((current) => ({ ...current, localizacao: event.target.value }))}
                      className={fieldClass}
                    />
                  </Field>

                  <Field label="Profissão">
                    <input
                      value={form.profissao || ""}
                      onChange={(event) => setForm((current) => ({ ...current, profissao: event.target.value }))}
                      className={fieldClass}
                    />
                  </Field>

                  <Field label="Imagem de perfil">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <Camera className="h-4 w-4" />
                      Escolher imagem
                    </button>
                    {selectedImage && (
                      <p className="mt-2 truncate text-sm text-gray-500">{selectedImage.name}</p>
                    )}
                  </Field>
                </div>

                <Field label="Descrição / bio">
                  <textarea
                    value={form.descricao || ""}
                    onChange={(event) => setForm((current) => ({ ...current, descricao: event.target.value }))}
                    className={`${fieldClass} min-h-32 resize-y`}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0B1B46] px-5 py-3 text-white transition-colors hover:bg-[#1E3A8A] disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  Guardar alterações
                </button>
              </form>

              <form onSubmit={handlePasswordSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Alterar password</h2>
                    <p className="mt-1 text-sm text-gray-500">Usa a password atual para confirmar a alteração.</p>
                  </div>
                  <Lock className="h-6 w-6 text-[#1E3A8A]" />
                </div>

                {passwordErr && <Feedback tone="error" message={passwordErr} />}
                {passwordNotice && <Feedback tone="success" message={passwordNotice} />}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <Field label="Password atual">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      className={fieldClass}
                      required
                    />
                  </Field>

                  <Field label="Nova password">
                    <input
                      type="password"
                      minLength={6}
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      className={fieldClass}
                      required
                    />
                  </Field>

                  <Field label="Confirmar password">
                    <input
                      type="password"
                      minLength={6}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className={fieldClass}
                      required
                    />
                  </Field>
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-[#1E3A8A] px-5 py-3 text-[#1E3A8A] transition-colors hover:bg-blue-50 disabled:opacity-60"
                >
                  {changingPassword ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
                  Alterar password
                </button>
              </form>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function Info({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#1E3A8A]">{icon}</span>
      <span className="min-w-0 truncate">{value}</span>
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
