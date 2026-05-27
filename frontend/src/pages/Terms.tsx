import { ShieldCheck } from "lucide-react";
import LegalLayout from "../components/LegalLayout";

export default function Terms() {
  return (
    <LegalLayout
      title="Termos e Condições"
      subtitle="Regras básicas para utilização da plataforma Doorly."
      icon={<ShieldCheck className="w-8 h-8" />}
    >

      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <h2 className="text-2xl text-gray-900 mb-4">
          Utilização da Plataforma
        </h2>

        <p className="text-gray-600 leading-relaxed">
          A Doorly ajuda clientes a encontrar prestadores
          de serviços de forma simples e rápida.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl text-gray-900 mb-4">
            Segurança da Conta
          </h2>

          <p className="text-gray-600 leading-relaxed">
            És responsável pela segurança da tua conta
            e da tua palavra-passe.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl text-gray-900 mb-4">
            Conduta
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Conteúdo ofensivo, enganoso ou ilegal
            poderá ser removido.
          </p>
        </div>

      </div>

    </LegalLayout>
  );
}