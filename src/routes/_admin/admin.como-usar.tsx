import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  ChevronRight,
  Images,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

export const Route = createFileRoute("/_admin/admin/como-usar")({
  head: () => ({
    meta: [
      { title: "Como usar · Admin · IJ Santos" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminManualPage,
});

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl bg-[#1A1A1A] border border-white/5 p-6 md:p-8">
      <h2 className="text-lg font-semibold mb-4 text-white">{title}</h2>
      <div className="space-y-3 text-sm text-white/70 leading-relaxed">{children}</div>
    </section>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="shrink-0 h-6 w-6 rounded-full bg-[#DC2626]/20 text-[#DC2626] text-xs font-bold grid place-items-center mt-0.5">
        {n}
      </span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Tip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg bg-white/3 border border-white/8 px-4 py-3 text-white/60 text-xs leading-relaxed ${className}`}>
      {children}
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center gap-1 rounded bg-white/10 border border-white/15 px-1.5 py-0.5 text-[11px] font-mono text-white/70">
      {children}
    </kbd>
  );
}

function AdminManualPage() {
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Como usar</h1>
        <p className="mt-1 text-sm text-white/60">
          Manual de utilizador do backoffice IJ Santos.
        </p>
      </div>

      {/* Overview */}
      <Section title="Visão geral">
        <p>
          O backoffice está organizado em duas secções principais, acessíveis pelo menu lateral:
        </p>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/3 px-4 py-3">
            <Building2 className="h-4 w-4 text-[#DC2626] shrink-0" />
            <div>
              <div className="font-medium text-white">Obras</div>
              <div className="text-xs text-white/50 mt-0.5">
                Registo de projetos — nome, categoria, local, ano, cliente
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/3 px-4 py-3">
            <Images className="h-4 w-4 text-[#DC2626] shrink-0" />
            <div>
              <div className="font-medium text-white">Portefólio</div>
              <div className="text-xs text-white/50 mt-0.5">
                Gestão de fotografias — carregar, reordenar, remover
              </div>
            </div>
          </div>
        </div>
        <p className="mt-3">
          O fluxo recomendado é: <strong className="text-white">criar a obra primeiro</strong>, depois
          carregar as fotografias associadas no Portefólio. As obras com fotos ficam visíveis como
          álbuns no website público em{" "}
          <span className="font-mono text-white/80 text-xs">/portefolio</span> e{" "}
          <span className="font-mono text-white/80 text-xs">/obras</span>.
        </p>
      </Section>

      {/* Tab Obras */}
      <Section title="Tab — Obras">
        <p>
          Cada obra é um registo de um projeto executado. Uma obra pode existir sem fotos —
          nesse caso aparece na listagem pública mas sem álbum associado.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 font-medium text-white mb-2">
              <Plus className="h-3.5 w-3.5 text-[#DC2626]" />
              Criar uma obra
            </div>
            <div className="pl-5 space-y-2">
              <Step n={1}>Clicar no botão <strong className="text-white">Nova Obra</strong> (canto superior direito).</Step>
              <Step n={2}>
                Preencher os campos:
                <ul className="mt-2 ml-2 space-y-1 list-none">
                  <li><ChevronRight className="inline h-3 w-3 mr-1" /><strong className="text-white">Nome</strong> — designação do projeto (obrigatório)</li>
                  <li><ChevronRight className="inline h-3 w-3 mr-1" /><strong className="text-white">Categoria</strong> — tipo de obra (obrigatório)</li>
                  <li><ChevronRight className="inline h-3 w-3 mr-1" /><strong className="text-white">Local</strong> — município ou localidade (obrigatório)</li>
                  <li><ChevronRight className="inline h-3 w-3 mr-1" /><strong className="text-white">Ano</strong> — ano de conclusão (obrigatório)</li>
                  <li><ChevronRight className="inline h-3 w-3 mr-1" /><strong className="text-white">Cliente</strong> — nome do cliente (opcional, privado)</li>
                </ul>
              </Step>
              <Step n={3}>Clicar em <strong className="text-white">Criar Obra</strong>.</Step>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 font-medium text-white mb-2">
              <Pencil className="h-3.5 w-3.5 text-[#DC2626]" />
              Editar uma obra
            </div>
            <p className="pl-5">
              Clicar no ícone de lápis <Pencil className="inline h-3 w-3" /> na linha da obra. O
              formulário abre pré-preenchido — alterar o que for necessário e guardar.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 font-medium text-white mb-2">
              <Images className="h-3.5 w-3.5 text-[#DC2626]" />
              Ver fotos de uma obra
            </div>
            <p className="pl-5">
              Se a obra tiver fotografias carregadas, o ícone de galeria{" "}
              <Images className="inline h-3 w-3" /> fica visível na linha. Clicar navega para o
              Portefólio já filtrado por essa obra.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 font-medium text-white mb-2">
              <Trash2 className="h-3.5 w-3.5 text-[#DC2626]" />
              Apagar uma obra
            </div>
            <p className="pl-5">
              Clicar no ícone de lixo <Trash2 className="inline h-3 w-3" /> e confirmar. As
              fotografias associadas <strong className="text-white">não são eliminadas</strong> —
              ficam sem álbum mas continuam na base de dados e no Portefólio.
            </p>
          </div>
        </div>
      </Section>

      {/* Tab Portfolio */}
      <Section title="Tab — Portefólio">
        <p>
          Nesta secção gerem-se todas as fotografias do website público. Cada fotografia está
          ligada a uma obra, que define automaticamente a sua categoria.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 font-medium text-white mb-2">
              <Upload className="h-3.5 w-3.5 text-[#DC2626]" />
              Carregar fotografias
            </div>
            <div className="pl-5 space-y-2">
              <Step n={1}>Na secção <strong className="text-white">Carregar fotos</strong>, clicar na área pontilhada ou arrastar ficheiros.</Step>
              <Step n={2}>Selecionar a <strong className="text-white">obra</strong> à qual as fotos pertencem. A categoria é preenchida automaticamente.</Step>
              <Step n={3}>Opcionalmente, adicionar um <strong className="text-white">título</strong> partilhado (aplicado a todas as fotos do lote).</Step>
              <Step n={4}>Clicar em <strong className="text-white">Carregar</strong>. As fotos são otimizadas no browser antes de serem enviadas.</Step>
            </div>
            <Tip className="mt-3">
              Formatos aceites: JPG, PNG, WebP. Máximo <strong>10 MB</strong> por ficheiro. Para
              carregar várias fotos de uma vez, selecionar múltiplos ficheiros no passo 1.
            </Tip>
          </div>

          <div>
            <div className="flex items-center gap-2 font-medium text-white mb-2">
              Reordenar fotografias
            </div>
            <p className="pl-5">
              Selecionar uma <strong className="text-white">categoria específica</strong> nos filtros
              de topo (não funciona em "Todas"). Depois arrastar as fotos para a posição desejada. A
              ordem é guardada automaticamente.
            </p>
            <Tip className="mt-2">
              Quando se navega para o Portefólio a partir de uma obra (via ícone{" "}
              <Images className="inline h-3 w-3" />), a reordenação fica desativada — limpar o
              filtro de obra para voltar a arrastar.
            </Tip>
          </div>

          <div>
            <div className="flex items-center gap-2 font-medium text-white mb-2">
              <Trash2 className="h-3.5 w-3.5 text-[#DC2626]" />
              Remover uma fotografia
            </div>
            <p className="pl-5">
              Clicar no ícone de lixo <Trash2 className="inline h-3 w-3" /> na miniatura da foto e
              confirmar. A fotografia é removida da base de dados e do storage de forma permanente.
            </p>
          </div>
        </div>
      </Section>

      {/* Fluxo recomendado */}
      <Section title="Fluxo recomendado — passo a passo">
        <div className="space-y-3">
          <Step n={1}>
            Ir à tab <strong className="text-white">Obras</strong> e criar um registo para o projeto
            (nome, categoria, local, ano).
          </Step>
          <Step n={2}>
            Ir à tab <strong className="text-white">Portefólio</strong>, selecionar a obra criada no
            selector e escolher as fotografias a carregar.
          </Step>
          <Step n={3}>
            Clicar em <strong className="text-white">Carregar</strong>. As fotos ficam visíveis no
            website em <span className="font-mono text-white/80 text-xs">/portefolio</span> e{" "}
            <span className="font-mono text-white/80 text-xs">/obras</span>.
          </Step>
          <Step n={4}>
            Voltar à tab Obras e usar o ícone{" "}
            <Images className="inline h-3 w-3 text-[#DC2626]" /> para confirmar que as fotos
            aparecem corretamente no álbum.
          </Step>
        </div>
      </Section>

      {/* Dicas */}
      <Section title="Dicas e notas">
        <ul className="space-y-2">
          {[
            "As fotografias são redimensionadas e otimizadas automaticamente no browser antes de serem enviadas — não é necessário redimensionar manualmente.",
            "A ordem das fotos dentro de um álbum é definida no Portefólio por categoria. Reordenar numa categoria afeta a ordem de todas as fotos dessa categoria, incluindo em outros álbuns.",
            "Apagar uma obra não apaga as fotos — apenas desliga a ligação. As fotos ficam visíveis no Portefólio sem álbum, mas não aparecem na página /obras.",
            "O website público atualiza em tempo real — as alterações ficam visíveis de imediato após guardar.",
            "Em caso de dúvida ou problema técnico, contactar o desenvolvimento.",
          ].map((tip, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="shrink-0 mt-1 h-1.5 w-1.5 rounded-full bg-[#DC2626]/60" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
