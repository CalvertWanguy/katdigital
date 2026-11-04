// Modèl mesaj selon òtograf ofisyèl Akademi Kreyòl Ayisyen (AKA)
export const PRESET_MESSAGES = [
  {
    id: 'fanmi',
    category: 'Fanmi',
    label: 'Pou Fanmi / Manman ak Papa',
    text: 'Se ak tout kè m m ap voye bèl swè sa yo pou ou. Se pou sezon fèt sa a pote lapè, lanmou ak anpil benediksyon nan lavi w. Mèsi dèske w toujou la pou mwen !'
  },
  {
    id: 'mennaj',
    category: 'Mennaj',
    label: 'Pou Moun Mwen Renmen an',
    text: 'Pase yon bèl fèt Nwèl ak yon bòn ane 2027, cheri. Pi bèl kado mwen genyen ane sa a se prezans ou nan lavi m. Mwen renmen w anpil !'
  },
  {
    id: 'zanmi',
    category: 'Zanmi',
    label: 'Pou yon Bon Zanmi',
    text: 'Zanmi pa m, mwen pa t ka kite ane a fini san m pa voye yon gwo kout chapo pou ou. Se pou ane 2027 la louvri tout pòt siksè, lasante ak lajwa pou ou !'
  },
  {
    id: 'soup_joumou',
    category: 'Tradisyon',
    label: '1ye Janvye & Soup Joumou',
    text: 'Bòn Fèt Endepandans ak Bòn Ane 2027 ! Se pou soup joumou ane sa a pote lasante, kouraj ak tèt ansanm nan kè tout ayisyen kèlkeswa kote yo ye sou latè.'
  },
  {
    id: 'benediksyon',
    category: 'Lafwa',
    label: 'Benediksyon & Lafwa',
    text: 'Se pou gras Granmèt la ak lapè Li kouvri kay ou pandan tout sezon fèt sa a. Se pou nouvo ane a debòde ak mirak, lasante ak lajwa pou tout fanmi an !'
  }
];

export const TEMPLATES = [
  {
    id: 'noel-bordeaux',
    title: 'Nwèl Vlou Bòdo',
    subtitle: 'Koleksyon Prestij',
    category: 'noel',
    badge: 'Popilè',
    envelopeColor: '#7A1F2D',
    pocketColors: {
      left: '#6E1A27',
      right: '#631622',
      bottom: '#7A1F2D'
    },
    flapColor: '#8B2535',
    accentColor: '#C39D5E',
    heading: 'Jwaye Nwèl & Bòn Ane 2027',
    defaultMessage: 'Se ak tout kè m m ap voye bèl swè sa yo pou ou. Se pou sezon fèt sa a pote lapè, lanmou ak anpil benediksyon nan lavi w. Mèsi dèske w toujou la pou mwen !',
    priceHTG: 100,
    priceUSD: 2.99,
    stampText: 'AYITI',
    stampColor: '#A69279',
    confettiColors: ['#ECC880', '#C39D5E', '#FFFFFF', '#7A1F2D']
  },
  {
    id: 'sapin-emeraude',
    title: 'Pye Sapen & Zétwal An Lò',
    subtitle: 'Koleksyon Bòn Ane',
    category: 'nouvel-an',
    badge: 'Nouvo',
    envelopeColor: '#2B4736',
    pocketColors: {
      left: '#243C2E',
      right: '#1F3427',
      bottom: '#2B4736'
    },
    flapColor: '#345541',
    accentColor: '#D4AF37',
    heading: 'Bòn Ane 2027 & Siksè',
    defaultMessage: 'Se pou nouvo ane 2027 sa a louvri tout pòt siksè, lajwa ak lasante pou ou menm ansanm ak tout fanmi w. Pase yon bèl fèt fen dane !',
    priceHTG: 100,
    priceUSD: 2.99,
    stampText: '2027',
    stampColor: '#2B4736',
    confettiColors: ['#ECC880', '#D4AF37', '#FFFFFF', '#2B4736']
  },
  {
    id: 'soup-joumou-1804',
    title: 'Onè & Tradisyon 1804',
    subtitle: '1ye Janvye & Soup Joumou',
    category: 'tradition',
    badge: 'Kiltirèl',
    envelopeColor: '#3D2F20',
    pocketColors: {
      left: '#322619',
      right: '#2A1F13',
      bottom: '#3D2F20'
    },
    flapColor: '#4A3B29',
    accentColor: '#E6A122',
    heading: '1ye Janvye • Soup Joumou & Libète',
    defaultMessage: 'Ann fete fèt endepandans nou ak anpil fyète nan kè nou. Se pou soup joumou ane sa a pote chalè, lasante ak tèt ansanm pou nou tout !',
    priceHTG: 100,
    priceUSD: 2.99,
    stampText: 'AYITI',
    stampColor: '#E6A122',
    confettiColors: ['#E6A122', '#F7C948', '#FFFFFF', '#3D2F20']
  },
  {
    id: 'amour-douceur',
    title: 'Lanmou & Dousè Fèt',
    subtitle: 'Koleksyon Pou Koup',
    category: 'mennaj',
    badge: 'Romantik',
    envelopeColor: '#6B3045',
    pocketColors: {
      left: '#5C283B',
      right: '#4F2131',
      bottom: '#6B3045'
    },
    flapColor: '#7A384F',
    accentColor: '#F2A7B5',
    heading: 'Pase yon Bèl Fèt Cheri',
    defaultMessage: 'Pase yon bèl fèt Nwèl ak yon bòn ane, cheri. Pi bèl kado mwen genyen ane sa a se prezans ou nan lavi m. Mwen renmen w anpil !',
    priceHTG: 100,
    priceUSD: 2.99,
    stampText: 'LANMOU',
    stampColor: '#F2A7B5',
    confettiColors: ['#F2A7B5', '#ECC880', '#FFFFFF', '#6B3045']
  }
];
