import { useEffect, useState } from "react";
import { ChevronDown, CircleHelp, X } from "lucide-react";

type HelpItem = {
  question: string;
  answer: string;
};

const helpItems: HelpItem[] = [
  {
    question: "Como usar o Doorly?",
    answer: "Procura serviços, compara detalhes e escolhe o prestador que melhor combina com o que precisas.",
  },
  {
    question: "Como agendar um serviço?",
    answer: "Abre a página do serviço, escolhe a opção de agendamento e indica uma data e hora futura.",
  },
  {
    question: "Como contactar um prestador?",
    answer: "Na página do serviço podes enviar uma mensagem ou pedir orçamento ao prestador.",
  },
  {
    question: "Como recuperar a palavra-passe?",
    answer: "Vai a Entrar, escolhe recuperar palavra-passe e usa o link enviado para o teu email.",
  },
  {
    question: "Como funcionam os planos?",
    answer: "Os planos definem vantagens e limites para prestadores. Podes consultar as opções disponíveis na área do prestador.",
  },
];

export default function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <div className="fixed bottom-5 right-5 z-[70] sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          className="mb-4 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
          aria-label="Centro de Ajuda"
        >
          <div className="flex items-start justify-between gap-4 bg-[#F3F4F6] px-5 py-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-[#1E3A8A]">
                <CircleHelp className="h-3.5 w-3.5" />
                Ajuda Doorly
              </div>
              <h2 className="mt-3 text-lg font-semibold text-[#0B1B46]">Centro de Ajuda</h2>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-white hover:text-[#0B1B46]"
              aria-label="Fechar Centro de Ajuda"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[60vh] space-y-2 overflow-y-auto p-3">
            {helpItems.map((item, index) => {
              const itemOpen = openIndex === index;
              const contentId = `help-answer-${index}`;

              return (
                <div key={item.question} className="rounded-xl border border-gray-100 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(itemOpen ? null : index)}
                    className="flex w-full items-center gap-3 px-3 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:text-[#1E3A8A]"
                    aria-expanded={itemOpen}
                    aria-controls={contentId}
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className="ml-auto h-4 w-4 shrink-0 text-gray-500 transition-transform"
                      style={{ transform: itemOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>

                  {itemOpen && (
                    <p id={contentId} className="px-3 pb-3 text-sm leading-6 text-gray-500">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1E3A8A] text-2xl font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-[#3B82F6] focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label={isOpen ? "Fechar Centro de Ajuda" : "Abrir Centro de Ajuda"}
        aria-expanded={isOpen}
      >
        ?
      </button>
    </div>
  );
}
