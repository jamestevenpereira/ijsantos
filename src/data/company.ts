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
  address: "Zona industrial de Nelas Lote 13, 3520-095 Nelas, Portugal",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Irm%C3%A3os+J.+Santos+Lda%2C+Nelas",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1071.9226637845288!2d-7.836070011860571!3d40.54478949499528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd23336f51e99895%3A0x9594f2d9959253d0!2sIrm%C3%A3os%20J.%20Santos%20Lda!5e0!3m2!1spt-PT!2spt!4v1779895642746!5m2!1spt-PT!2spt",

  addresses: [
    { label: "Sede", value: "Zona industrial de Nelas Lote 13, 3520-095 Nelas" },
  ],

  hours: "Seg–Sex · 08h00 — 17h00",

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
  siteUrl: "https://ijsantos.com",

  // Geographic coordinates (Nelas, sede)
  geo: { lat: 40.5311, lng: -7.853 },

  livroReclamacoes: "https://www.livroreclamacoes.pt/Inicio/",
  odrEU: "https://webgate.ec.europa.eu/odr/main/?event=main.home.show",

  stats: [
    { value: "30+", label: "stats.yearsExperience" },
    { value: "500+", label: "stats.completedWorks" },
    { value: "<24h", label: "stats.responseTime" },
    { value: "4.9/5", label: "stats.clientRating" },
  ],
};
