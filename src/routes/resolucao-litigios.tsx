import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { company } from "@/data/company";

export const Route = createFileRoute("/resolucao-litigios")({
  head: () => ({
    meta: [
      { title: "Resolução de Litígios · IJ Santos" },
      { name: "description", content: "Informação sobre resolução alternativa de litígios de consumo, conforme Lei n.º 144/2015." },
      { property: "og:title", content: "Resolução de Litígios · IJ Santos" },
      { property: "og:description", content: "Resolução alternativa de litígios de consumo." },
    ],
  }),
  component: Page,
});

const entidades = [
  { nome: "CNIACC – Centro Nacional de Informação e Arbitragem de Conflitos de Consumo", url: "http://www.arbitragemdeconsumo.org/" },
  { nome: "CACCL – Centro de Arbitragem de Conflitos de Consumo de Lisboa", url: "http://www.centroarbitragemlisboa.pt/" },
  { nome: "CACCVA – Centro de Arbitragem de Conflitos de Consumo do Vale do Ave / Tribunal Arbitral", url: "http://www.triave.pt/" },
  { nome: "CICAP – Centro de Informação de Consumo e Arbitragem do Porto", url: "http://www.cicap.pt/" },
  { nome: "CIMAAL – Centro de Informação, Mediação e Arbitragem de Conflitos de Consumo do Algarve", url: "http://www.ciab.pt/pt/" },
  { nome: "CIAB – Centro de Informação, Mediação e Arbitragem de Consumo", url: "http://www.ciab.pt/pt/" },
  { nome: "CIMPAS – Centro de Informação, Mediação e Provedoria de Seguros", url: "https://www.cimpas.pt/" },
];

function Page() {
  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl container-px py-20 md:py-24">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Informação ao consumidor</span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight text-balance">
            Resolução de Litígios
          </h1>
          <p className="mt-5 text-primary-foreground/75 max-w-2xl">
            Conforme Lei n.º 144/2015, disponibilizamos a informação necessária para que possa
            exercer o seu direito de reclamação junto de uma entidade oficial e imparcial.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl container-px prose-content space-y-8 text-foreground">
          <p>
            A União Europeia criou um site para apoiar os consumidores a apresentarem as suas
            reclamações sobre qualquer litígio em que estejam envolvidos. Se ficou insatisfeito
            com a aquisição de um bem ou serviço, ou com a solução por nós apresentada, pode
            aceder ao site oficial da UE e expor a sua contestação:
          </p>
          <p>
            <a
              href={company.odrEU}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand font-semibold hover:underline break-all"
            >
              {company.odrEU} <ExternalLink className="h-4 w-4 shrink-0" />
            </a>
          </p>

          <div>
            <h2 className="font-display text-2xl font-bold mt-10">O que é a resolução alternativa de litígios?</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              A resolução alternativa de litígios é a possibilidade que todos os consumidores
              têm ao seu dispor de recorrer a entidades oficiais que os ajudem na resolução,
              ou orientação, de algum conflito antes de abrirem processos litigiosos nos
              Tribunais.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Regra geral, o procedimento é o seguinte: o cliente pede a um terceiro imparcial
              que intervenha como intermediário entre si e o comerciante alvo da reclamação. O
              intermediário pode sugerir uma solução, impor uma solução a ambas as partes ou
              reunir as partes para encontrar uma solução. É também conhecida como
              «mediação», «conciliação» ou «arbitragem».
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              A resolução alternativa de litígios é, por norma, menos dispendiosa, menos formal
              e mais rápida do que a via judicial.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mt-10">Entidades de resolução alternativa de litígios</h2>
            <p className="mt-4 text-muted-foreground">
              Em caso de litígio de consumo, o consumidor pode recorrer às seguintes entidades:
            </p>
            <ul className="mt-6 space-y-3">
              {entidades.map((e) => (
                <li
                  key={e.nome}
                  className="rounded-xl border border-border bg-card p-4 hover:border-brand/40 transition"
                >
                  <div className="font-semibold text-foreground">{e.nome}</div>
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1.5 text-sm text-brand hover:underline break-all"
                  >
                    {e.url} <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-surface border border-border p-6 md:p-8 mt-10">
            <h3 className="font-display text-lg font-bold">Contacto direto — CNIACC</h3>
            <p className="mt-2 text-muted-foreground text-sm">Conforme Lei n.º 144/2015 para resolução de litígios:</p>
            <ul className="mt-4 space-y-1.5 text-sm">
              <li><span className="text-muted-foreground">Telefone:</span> <a className="font-medium hover:text-brand" href="tel:+351213847484">21 384 7484</a></li>
              <li><span className="text-muted-foreground">Email:</span> <a className="font-medium hover:text-brand" href="mailto:cniacc@fd.unl.pt">cniacc@fd.unl.pt</a></li>
              <li><span className="text-muted-foreground">Site:</span> <a className="font-medium hover:text-brand" href="http://www.arbitragemdeconsumo.org" target="_blank" rel="noopener noreferrer">www.arbitragemdeconsumo.org</a></li>
            </ul>
          </div>

          <div className="rounded-2xl bg-primary text-primary-foreground p-6 md:p-8 mt-6">
            <h3 className="font-display text-lg font-bold">Livro de Reclamações</h3>
            <p className="mt-2 text-primary-foreground/75 text-sm">Pode também apresentar uma reclamação no Livro de Reclamações eletrónico:</p>
            <a
              href={company.livroReclamacoes}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-brand text-brand-foreground px-4 py-2.5 text-sm font-semibold"
            >
              Aceder ao Livro de Reclamações <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
