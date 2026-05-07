import { createFileRoute } from "@tanstack/react-router";
import { company } from "@/data/company";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade e Cookies · IJ Santos" },
      { name: "description", content: "Política de privacidade, tratamento de dados pessoais e utilização de cookies da IJ Santos." },
      { property: "og:title", content: "Política de Privacidade e Cookies · IJ Santos" },
      { property: "og:description", content: "Como tratamos os seus dados pessoais e utilizamos cookies." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl container-px py-20 md:py-24">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Legal</span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight text-balance">
            Política de Privacidade e Cookies
          </h1>
          <p className="mt-5 text-primary-foreground/75 max-w-2xl">
            A {company.legalName} cumpre com as obrigações decorrentes da Lei de Proteção de
            Dados e da Lei do tratamento de dados pessoais e proteção da privacidade no setor
            das comunicações eletrónicas.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl container-px space-y-10 text-foreground">
          <Block title="Recolha e Registo de Dados">
            <p>
              A {company.legalName} está empenhada em proteger a privacidade dos utilizadores do seu
              site e, como tal, recolhe apenas as informações pessoais daqueles que as facultem
              voluntariamente, e apenas as utiliza para os fins para os quais foram fornecidas.
            </p>
            <p>
              Os dados pessoais recolhidos são processados automaticamente e destinam-se à
              gestão da ficha do cliente, dos seus serviços e dos seus pedidos de apoio e
              suporte. A recolha e tratamento têm ainda como finalidade o seu uso para
              contactos por parte da {company.legalName} para efeitos de:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Garantir o normal funcionamento do serviço contratado, fornecendo dados para a sua gestão e faturação;</li>
              <li>Comunicar intervenções programadas, reportar problemas e/ou outras situações de relevância para os seus serviços;</li>
              <li>Promover a comunicação exigida contratualmente, usando a via estipulada (Condições Gerais de prestação de serviço);</li>
              <li>Envio de informações de âmbito generalista e publicitário relativas à {company.legalName} e aos serviços por ela prestados.</li>
            </ul>
            <p>
              Os dados fornecidos estão integrados numa base de dados, sendo o seu tratamento
              automatizado, organizado e mantido diretamente pela {company.legalName}, de acordo com a
              Lei 67/98 de 26 de outubro. Os menores de 18 anos deverão obter autorização dos
              pais ou tutores antes de acederem ou disponibilizarem dados pessoais no site.
            </p>
          </Block>

          <Block title="Retificação ou eliminação dos dados fornecidos">
            <h3 className="font-display font-semibold">Fornecimento de dados e retificação</h3>
            <p>
              Nos termos da legislação aplicável, assiste ao utilizador o direito de acesso e
              retificação dos seus dados. A {company.legalName} oferece ao cliente o acesso permanente
              aos seus dados, viabilizando, assim, a sua retificação a todo o tempo.
            </p>
            <h3 className="font-display font-semibold">Livre fornecimento de dados</h3>
            <p>
              Qualquer utilizador poderá livremente optar por fornecer ou não os seus dados.
              O preenchimento de formulários (ficha de cliente, contacto, pedido de orçamento
              ou subscrição de newsletter) é entendido como declaração de aceitação da presente
              política, bem como do tratamento e armazenagem desses dados pela {company.legalName} para
              os fins comerciais a que se destinam.
            </p>
            <p>
              A {company.legalName} reserva-se no direito de armazenar e usar os dados fornecidos pelo
              cliente até declaração expressa deste a solicitar a sua eliminação.
            </p>
          </Block>

          <Block title="Eliminação dos dados">
            <p>
              Se for do interesse do cliente não ser mais contactado pela {company.legalName} e que
              esta não guarde mais os seus dados, deverá solicitar por forma expressa a sua
              eliminação. Para questões relacionadas com o tratamento dos seus dados pessoais
              poderá contactar-nos através de:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Telefone: <a href={company.phoneHref} className="text-brand hover:underline">{company.phone}</a> {company.phoneNote}</li>
              <li>Carta registada: {company.legalName}, {company.addresses[0].value}</li>
              <li>Email: <a href={company.emailHref} className="text-brand hover:underline">{company.email}</a></li>
            </ul>
          </Block>

          <Block title="Segurança e utilização da sua informação">
            <p>
              A {company.legalName} compromete-se a não vender, alugar ou transmitir, sob qualquer
              título, a terceiros quaisquer dados pessoais enviados pelos utilizadores do nosso
              site, sem prejuízo de o fazer mediante autorização do utilizador ou quando seja
              legalmente obrigada. Foram adotadas medidas técnicas adequadas para proteger os
              dados pessoais contra a destruição, alteração e/ou difusão acidental ou ilícita.
            </p>
          </Block>

          <Block title="Conservação da informação pessoal">
            <p>
              A {company.legalName} conserva a informação pessoal pelo período necessário à
              finalidade do seu tratamento, até instruções em contrário ou até que a lei exija a
              respetiva eliminação.
            </p>
          </Block>

          <Block title="Entidade responsável">
            <p>
              A entidade responsável pelo tratamento da Base de Dados é a {company.legalName}, com
              sede em {company.addresses[0].value}, pessoa coletiva nº {company.nipc}.
            </p>
          </Block>

          <hr className="border-border" />

          <Block title="Política de Cookies">
            <h3 className="font-display font-semibold">O que são cookies?</h3>
            <p>
              «Cookies» são pequenas etiquetas de software (ficheiros de texto) armazenadas no
              seu computador através do seu browser, e que retêm apenas informação relacionada
              com as suas preferências, não incluindo quaisquer dados pessoais.
            </p>
            <h3 className="font-display font-semibold">Para que servem os cookies?</h3>
            <p>
              Têm como único objetivo simplificar a navegação e tornar o site mais útil para si.
              Estes ficheiros não podem conter vírus nem ser executados.
            </p>
            <h3 className="font-display font-semibold">Tipos de cookies</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Estritamente necessários</strong> — essenciais para o funcionamento do site.</li>
              <li><strong>Analíticos</strong> — utilizados anonimamente para criação e análise de estatísticas.</li>
              <li><strong>Funcionalidade</strong> — guardam as preferências do utilizador.</li>
              <li><strong>Permanentes</strong> — ficam armazenados nos dispositivos de acesso e usados em visitas futuras.</li>
              <li><strong>Sessão</strong> — temporários, disponíveis até encerrar a sessão.</li>
            </ul>
            <p>
              Para mais informações sobre cookies visite{" "}
              <a className="text-brand hover:underline" href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">
                www.allaboutcookies.org
              </a>
              . Se não quiser que as suas visitas sejam detetadas pelo Google Analytics, vá a{" "}
              <a className="text-brand hover:underline" href="http://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                tools.google.com/dlpage/gaoptout
              </a>
              .
            </p>
            <h3 className="font-display font-semibold">Como gerir cookies</h3>
            <p>
              Pode gerir as suas preferências a qualquer momento clicando no botão abaixo:
            </p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-cookie-preferences"))}
              className="inline-flex items-center justify-center rounded-md bg-brand text-brand-foreground px-4 py-2.5 text-sm font-semibold"
            >
              Gerir preferências de cookies
            </button>
          </Block>
        </div>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 leading-relaxed text-muted-foreground">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
      {children}
    </section>
  );
}
