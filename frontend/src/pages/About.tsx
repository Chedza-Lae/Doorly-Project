import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Building2,
  Compass,
  Gem,
  Shield,
  Globe,
  ShieldCheck,
  Sparkles,
  Handshake,
  Rocket
} from "lucide-react";

export default function About() {
  const values = [
    {
      name: "Confiança",
      description: "Criamos relações baseadas em transparência e credibilidade.",
      icon: ShieldCheck
    },
    {
      name: "Qualidade",
      description: "Garantimos padrões elevados em cada serviço.",
      icon: Gem
    },
    {
      name: "Segurança",
      description: "Protegemos utilizadores e processos em toda a plataforma.",
      icon: Shield
    },
    {
      name: "Inovação",
      description: "Desenvolvemos soluções modernas para problemas reais.",
      icon: Sparkles
    },
    {
      name: "Proximidade",
      description: "Ligamos pessoas a profissionais de forma simples.",
      icon: Handshake
    },
    {
      name: "Expansão",
      description: "Pensamos globalmente e crescemos continuamente.",
      icon: Globe
    }
  ];

  const journey = [
    {
      title: "Fundação",
      description:
        "A Doorly nasceu da necessidade de simplificar o acesso a serviços profissionais.",
      icon: Building2
    },
    {
      title: "Estratégia",
      description:
        "Planeámos uma plataforma robusta, intuitiva e escalável.",
      icon: Compass
    },
    {
      title: "Tecnologia",
      description:
        "Desenvolvemos soluções focadas em performance e experiência do utilizador.",
      icon: Rocket
    },
    {
      title: "Crescimento",
      description:
        "Expandimos continuamente para criar novas oportunidades.",
      icon: Globe
    }
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      {/* Hero */}
      <section
        className="relative py-32 px-6 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-[#0B1B46]/85"></div>

        <div className="relative max-w-6xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <Building2 className="w-4 h-4" />
            <span className="text-sm">Sobre a Doorly</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Construímos confiança.
            <br />
            Ligamos soluções.
          </h1>

          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            A Doorly é uma plataforma digital criada para transformar a forma
            como clientes encontram profissionais qualificados, de forma rápida,
            segura e eficiente.
          </p>
        </div>
      </section>

      {/* Quem somos */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white rounded-3xl p-10 shadow-sm">
            <Building2 className="w-12 h-12 text-[#1E3A8A] mb-6" />
            <h2 className="text-3xl font-bold text-[#0B1B46] mb-4">
              Quem Somos
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Somos uma empresa tecnológica focada em aproximar clientes e
              prestadores de serviços através de uma plataforma moderna,
              intuitiva e orientada para confiança e eficiência.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-sm">
            <Compass className="w-12 h-12 text-[#1E3A8A] mb-6" />
            <h2 className="text-3xl font-bold text-[#0B1B46] mb-4">
              A Nossa Direção
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Trabalhamos diariamente para simplificar processos, reduzir tempo
              de procura e melhorar a experiência de contratação de serviços.
            </p>
          </div>
        </div>
      </section>

      {/* Missão e visão */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
          <div className="border rounded-3xl p-10 shadow-sm">
            <Rocket className="w-12 h-12 text-[#1E3A8A] mb-6" />
            <h2 className="text-3xl font-bold text-[#0B1B46] mb-4">
              Missão
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Facilitar a ligação entre clientes e profissionais através de
              tecnologia inteligente e acessível.
            </p>
          </div>

          <div className="border rounded-3xl p-10 shadow-sm">
            <Globe className="w-12 h-12 text-[#1E3A8A] mb-6" />
            <h2 className="text-3xl font-bold text-[#0B1B46] mb-4">
              Visão
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Tornar-nos uma referência internacional no setor digital de
              serviços e contratação profissional.
            </p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-[#0B1B46] mb-14">
          Os Nossos Valores
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition"
              >
                <Icon className="w-10 h-10 text-[#1E3A8A] mb-5" />

                <h3 className="text-xl font-semibold text-[#0B1B46] mb-3">
                  {value.name}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Jornada */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[#0B1B46] mb-14">
            A Nossa Jornada
          </h2>

          <div className="space-y-6">
            {journey.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="bg-[#F9FAFB] rounded-3xl p-8 border border-gray-100"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-[#1E3A8A]" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-semibold text-[#0B1B46] mb-2">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-[#0B1B46] mb-6">
          Construímos o futuro dos serviços digitais
        </h2>

        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
          O nosso compromisso é continuar a inovar, evoluir e criar valor para
          clientes e prestadores, tornando cada ligação mais simples, segura e
          eficiente.
        </p>
      </section>

      <Footer />
    </div>
  );
}