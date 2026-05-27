import { Shield } from "lucide-react";
import LegalLayout from "../components/LegalLayout";

export default function Privacy() {
  return (
    <LegalLayout
      title="Política de Privacidade"
      subtitle="Como utilizamos e protegemos os teus dados."
      icon={<Shield className="w-8 h-8" />}
    >

      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <h2 className="text-2xl text-gray-900 mb-4">
          Dados Recolhidos
        </h2>

        <p className="text-gray-600 leading-relaxed">
          Podemos recolher nome, email e informações
          necessárias para funcionamento da plataforma.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl text-gray-900 mb-4">
            Utilização dos Dados
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Utilizamos os teus dados para login,
            mensagens e gestão da conta.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl text-gray-900 mb-4">
            Segurança
          </h2>

          <p className="text-gray-600 leading-relaxed">
            As palavras-passe são armazenadas
            de forma segura e encriptada.
          </p>
        </div>

      </div>

    </LegalLayout>
  );
}