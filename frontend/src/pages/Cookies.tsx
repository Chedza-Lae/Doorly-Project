import { Cookie } from "lucide-react";
import LegalLayout from "../components/LegalLayout";

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Política de Cookies"
      subtitle="Informação sobre cookies e tecnologias semelhantes."
      icon={<Cookie className="w-8 h-8" />}
    >

      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <h2 className="text-2xl text-gray-900 mb-4">
          Cookies
        </h2>

        <p className="text-gray-600 leading-relaxed">
          Utilizamos cookies e tecnologias semelhantes
          para melhorar a experiência no site.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl text-gray-900 mb-4">
            Sessões
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Alguns cookies ajudam a manter
            sessões iniciadas.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl text-gray-900 mb-4">
            Preferências
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Também podemos guardar preferências
            para melhorar a utilização da plataforma.
          </p>
        </div>

      </div>

    </LegalLayout>
  );
}