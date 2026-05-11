export const company = {
  name: "IJ Santos",
  legalName: "Irmãos J. Santos, Lda.",
  nipc: "503 534 633",
  tagline: "Construção e Limpezas Exteriores",

  // Primary phone (used as default CTA)
  phone: "+351 926 051 178",
  phoneHref: "tel:+351926051178",
  phoneNote: "(chamada para rede móvel nacional)",

  phones: [
    { label: "Geral", value: "+351 926 051 178", href: "tel:+351926051178" },
    { label: "José Santos", value: "+351 917 510 722", href: "tel:+351917510722" },
    { label: "João Santos", value: "+351 917 550 646", href: "tel:+351917550646" },
  ],

  // Primary email
  email: "jpsantos@ijsantos.com",
  emailHref: "mailto:jpsantos@ijsantos.com",

  emails: [
    { label: "JP Santos", value: "jpsantos@ijsantos.com", href: "mailto:jpsantos@ijsantos.com" },
    { label: "José Santos", value: "josesantos@ijsantos.com", href: "mailto:josesantos@ijsantos.com" },
    { label: "João Santos", value: "joaosantos@ijsantos.com", href: "mailto:joaosantos@ijsantos.com" },
  ],

  whatsapp: "https://wa.me/351926051178",

  // Primary address
  address: "Rua da Shell, nº 13, 3520-074 Nelas",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Rua+da+Shell,+n%C2%BA+13,+3520-074+Nelas",
  mapEmbedUrl: "https://www.google.com/maps?q=Rua+da+Shell,+n%C2%BA+13,+3520-074+Nelas&output=embed",

  addresses: [
    { label: "Sede", value: "Rua da Shell, nº 13, 3520-074 Nelas" },
    { label: "Armazém", value: "Zona Industrial de Nelas, lote 13, 3520-095 Nelas" },
  ],

  hours: "Seg–Sáb · 08h00 — 19h00",

  areas: [
    "Nelas",
    "Viseu",
    "Mangualde",
    "Tondela",
    "Carregal do Sal",
    "Seia",
    "Gouveia",
    "Coimbra",
  ],

  // Canonical site URL (override after first publish if custom domain set)
  siteUrl: "https://ijsantos.pt",

  // Geographic coordinates (Nelas, sede)
  geo: { lat: 40.5311, lng: -7.853 },

  livroReclamacoes: "https://www.livroreclamacoes.pt/Inicio/",
  odrEU: "https://webgate.ec.europa.eu/odr/main/?event=main.home.show",

  stats: [
    { value: "15+", label: "Anos de experiência" },
    { value: "500+", label: "Obras concluídas" },
    { value: "<24h", label: "Resposta a pedidos" },
    { value: "4.9/5", label: "Avaliação dos clientes" },
  ],
};
