// Modèl mesaj selon òtograf ofisyèl Akademi Kreyòl Ayisyen (AKA)
// Tèks otantik, pwofon, plen afeksyon ak respè kiltirèl ayisyen
export const PRESET_MESSAGES = [
  {
    id: 'fanmi',
    category: 'Fanmi',
    label: 'Pou Fanmi / Manman ak Papa',
    text: 'Mèsi pou tout sakrifis, tout lanmou ak tout benediksyon ou toujou simen sou lavi m. Pandan ane a ap fini, mwen mande Bondye pou l kontinye kouvri w ak lasante, lapè nan lespri w ak kè poze. Pase yon bèl fèt Nwèl ak yon Nouvèl Ane 2027 kote tout kè kontan ap jwenn ou lakay ou.'
  },
  {
    id: 'mennaj',
    category: 'Mennaj',
    label: 'Pou Moun Mwen Renmen an',
    text: 'Chak jou ki pase bò kote w se yon kado presye, men nan sezon fèt sa a, kè m debòde ak plis rekonesans toujou pou prezans ou nan lavi m. Se pou Nwèl sa a pote plis dousè nan relasyon nou, e se pou ane 2027 la wè tout rèv nou reyalize men nan men. Mwen renmen w ak tout nanm mwen.'
  },
  {
    id: 'zanmi',
    category: 'Zanmi',
    label: 'Pou yon Bon Zanmi',
    text: 'Zanmi tankou w se yon kokennchenn trezò. Mèsi dèske w te la nan tout monte desann ane sa a, pou chak ri ak chak moman nou pataje. Mwen swete ane 2027 la pote gwo viktwa pou ou, kote chak pòt ou frape louvri gran batan pou tout pwojè w mache djanm.'
  },
  {
    id: 'soup_joumou',
    category: 'Tradisyon',
    label: '1ye Janvye & Soup Joumou',
    text: '1ye Janvye se fyète nou, se san zansèt nou yo, se senbòl libète ak diyite. Pandan n ap pataje cho soup joumou tradisyonèl nou an, se pou chalè sa a ini tout ayisyen kote nou ye sou latè, pou lapè ak lespwa tounen nan peyi nou. Bòn Fèt Nasyonal e Bòn Ane 2027 ! Konsa n ap mache tèt dwat.'
  },
  {
    id: 'benediksyon',
    category: 'Lafwa',
    label: 'Benediksyon & Lafwa',
    text: 'Se pou gras Granmèt la ak lapè Li kouvri fanmi w ak tout kay ou pandan tout sezon fèt sa a. Se pou nouvo ane 2027 la debòde ak favè Li, gerizon pou moun ki malad, fòs pou moun ki fatige, ak lajwa ki pap janm fini.'
  }
];

export const TEMPLATES = [
  {
    id: 'noel-bordeaux',
    title: 'Nwèl Vlou Bòdo',
    subtitle: 'Anvlòp De Liks ak Sèl an Lò',
    category: 'noel',
    badge: 'Popilè',
    format: 'envelope',
    ambientAnimation: 'snow',
    defaultMusic: 'jingle_bells',
    envelopeColor: '#7A1F2D',
    pocketColors: {
      left: '#6E1A27',
      right: '#631622',
      bottom: '#7A1F2D'
    },
    flapColor: '#8B2535',
    accentColor: '#C39D5E',
    heading: 'Jwaye Nwèl & Bòn Ane 2027',
    defaultMessage: 'Mèsi dèske w toujou yon sous rekonfò ak lapè nan lavi m. Pandan Nwèl sa a ap klere, mwen voye tout afeksyon mwen pou ou menm ak tout fanmi w. Se pou nouvo ane a louvri tout bèl pòt lasante, pwoteksyon ak lajwa pou nou.',
    priceHTG: 100,
    priceUSD: 2.99,
    stampText: 'AYITI',
    stampColor: '#A69279',
    confettiColors: ['#ECC880', '#C39D5E', '#FFFFFF', '#7A1F2D']
  },
  {
    id: 'parchemin-1804',
    title: 'Pachemen Libète 1804',
    subtitle: 'Woule Pachemen Wayal ak Ribann',
    category: 'tradition',
    badge: 'Kiltirèl',
    format: 'parchment',
    ambientAnimation: 'stars',
    defaultMusic: 'haitian_tradition',
    envelopeColor: '#3A2714',
    rodColor: '#855A25',
    parchmentBg: '#F5E6CA',
    accentColor: '#C99726',
    heading: '1ye Janvye • Soup Joumou & Libète',
    defaultMessage: 'Se ak anpil fyète n ap fete eritaj zansèt nou yo. Pandan bon sant soup joumou an ap monte nan chak kay ayisyen, se pou fòs 1804 la renouvle lespwa nan kè nou, epi pote tèt ansanm, kouraj ak siksè pou tout ane 2027 la.',
    priceHTG: 100,
    priceUSD: 2.99,
    stampText: '1804',
    stampColor: '#C99726',
    confettiColors: ['#C99726', '#E5B246', '#FFFFFF', '#3A2714']
  },
  {
    id: 'bifold-sapin',
    title: 'Folio Pye Sapen & Zétwal',
    subtitle: 'Liv Papetri Fèy Pliyet ki Ouvri',
    category: 'nouvel-an',
    badge: 'Nouvo',
    format: 'bifold',
    ambientAnimation: 'snow',
    defaultMusic: 'bon_ane',
    envelopeColor: '#2B4736',
    coverColor: '#1E3326',
    accentColor: '#D4AF37',
    heading: 'Bòn Ane 2027 & Siksè',
    defaultMessage: 'Pandan ane 2026 la ap fè plas pou 2027, mwen swete w yon nouvo depa ki chaje ak benediksyon, reyalizasyon ak bonè. Se pou chak pwojè w gen nan kè w jwenn siksè, e se pou kay ou toujou rete plen ak lajwa.',
    priceHTG: 100,
    priceUSD: 2.99,
    stampText: '2027',
    stampColor: '#2B4736',
    confettiColors: ['#ECC880', '#D4AF37', '#FFFFFF', '#2B4736']
  },
  {
    id: 'kraft-lanmou',
    title: 'Lèt Damou Sou Papye Kraft',
    subtitle: 'Fèy Pliye ak Kè k ap Flote',
    category: 'mennaj',
    badge: 'Romantik',
    format: 'kraft_sheet',
    ambientAnimation: 'hearts',
    defaultMusic: 'romance',
    envelopeColor: '#6B3045',
    kraftColor: '#E8D5B7',
    accentColor: '#F2A7B5',
    heading: 'Pase yon Bèl Fèt Cheri',
    defaultMessage: 'Chak segonn mwen pase avè w se yon bèl paj lavi nou k ap ekri. Mèsi pou lanmou w, pasyans ou ak tout souri ou pote nan kè m. Pase yon bèl fèt fen dane, cheri. Mwen pwomèt pou m renmen w pi fò toujou nan nouvo ane k ap vini an.',
    priceHTG: 100,
    priceUSD: 2.99,
    stampText: 'LANMOU',
    stampColor: '#F2A7B5',
    confettiColors: ['#F2A7B5', '#ECC880', '#FFFFFF', '#6B3045']
  },
  {
    id: 'parchemin-nouvel-an',
    title: 'Dekrè Wayal Bòn Ane 2027',
    subtitle: 'Pachemen Ansyen ak Sèl an Lò',
    category: 'nouvel-an',
    badge: 'Élégans',
    format: 'parchment',
    ambientAnimation: 'stars',
    defaultMusic: 'bon_ane',
    envelopeColor: '#1B2A4A',
    rodColor: '#966B12',
    parchmentBg: '#F7EDD8',
    accentColor: '#D4AF37',
    heading: 'Dekrè Bòn Ane 2027 & Pwosperite',
    defaultMessage: 'Nan okazyon nouvo ane a, mwen deklare ane 2027 la ap yon ane viktwa, kwasans ak gerizon pou ou. Se pou tout kote w pase rankontre favè, se pou tout eprèv tounen temwayaj, e se pou siksè kouvri tout travay men w.',
    priceHTG: 100,
    priceUSD: 2.99,
    stampText: '2027',
    stampColor: '#D4AF37',
    confettiColors: ['#D4AF37', '#ECC880', '#1B2A4A', '#FFFFFF']
  },
  {
    id: 'noel-bleu-nuit',
    title: 'Nwèl Ble Nwi & Poud Zétwal',
    subtitle: 'Anvlòp Ble Wayal ak Zétwal',
    category: 'noel',
    badge: 'Prestij',
    format: 'envelope',
    ambientAnimation: 'snow',
    defaultMusic: 'jingle_bells',
    envelopeColor: '#16233B',
    pocketColors: {
      left: '#101B2E',
      right: '#0E1727',
      bottom: '#16233B'
    },
    flapColor: '#1D2E4D',
    accentColor: '#E5C478',
    heading: 'Lapè & Lajwa Nwèl 2026',
    defaultMessage: 'Se pou limyè zetwal Nwèl la klere chemen w nan tout nwit ki fè nwa yo. Mwen swete w yon fèt ki plen ak lapè nan kè w, lanmou bò kote moun ki renmen w, ak lasante pou w byen jwi bèl moman sa yo.',
    priceHTG: 100,
    priceUSD: 2.99,
    stampText: 'NWÈL',
    stampColor: '#E5C478',
    confettiColors: ['#E5C478', '#FFFFFF', '#16233B', '#8DA9D4']
  }
];
