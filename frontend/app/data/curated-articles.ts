export interface CuratedArticle {
  _id: string
  title: string
  slug: string
  category: string
  readTime: string
  date: string
  excerpt: string
  tag: string
  highlight: string
  author: {
    name: string
    role: string
    avatar?: string
  }
  stats?: {label: string; value: string}[]
  content: {
    heading?: string
    paragraphs: string[]
    quote?: string
    specs?: {label: string; value: string}[]
  }[]
}

export const CURATED_ARTICLES: CuratedArticle[] = [
  {
    _id: 'draft-1',
    title: 'Essai Longue Durée : 5 000 km au guidon de la Yamaha XSR 900',
    slug: 'essai-longue-duree-yamaha-xsr-900',
    category: 'ESSAIS & TESTS',
    readTime: '8 min de lecture',
    date: '2026-10-05',
    excerpt:
      'Que vaut le roadster néo-rétro japonais sur le réseau secondaire et les trajets quotidiens ? Retour d’expérience sans concession sur la rigidité du châssis Deltabox, la position de conduite et la consommation réelle du 3-cylindres CP3.',
    tag: 'ESSAI ROUTIER',
    highlight: '119 CH SUR LE BANC',
    author: {
      name: 'Alexandre Mercier',
      role: 'Chef des Essais Moto',
    },
    stats: [
      {label: 'Kilométrage total', value: '5 240 km'},
      {label: 'Conso moyenne', value: '5.1 L / 100km'},
      {label: 'Vmax circuit', value: '232 km/h'},
      {label: 'Pneus d’origine', value: 'Bridgestone S22'},
    ],
    content: [
      {
        heading: '1. Une posture radicalisée face à la génération précédente',
        paragraphs: [
          'Dès les premiers kilomètres, la rupture avec la première XSR 900 saute aux yeux. Yamaha a abaissé la colonne de direction de 30 mm et allongé le bras oscillant de 55 mm par rapport à la MT-09. Fini l’assise surélevée façon supermotard : le pilote est désormais posé dans la moto, le buste légèrement basculé vers l’avant, enserrant un réservoir athlétique aux échancrures prononcées.',
          'Cette position d’attaque procure une sensation de connexion immédiate avec le train avant. La selle sculptée avec ses surpiqûres rétro cale parfaitement le bas du dos lors des accélérations franches.',
        ],
        quote:
          '« Le châssis Deltabox coulé sous pression CF offre une rigidité torsionnelle digne d’une vraie sportive moderne, habillée d’une élégance intemporelle. »',
      },
      {
        heading: '2. Le 3-cylindres CP3 890 cm³ : Un chef-d’œuvre d’allonge et de couple',
        paragraphs: [
          'Le bloc CP3 Euro 5+ est sans conteste l’une des plus belles réussites mécaniques de cette décennie. Son calage de vilebrequin à 120° génère une motricité constante et un couple velouté de 93 Nm disponible dès 7 000 tr/min.',
          'En mode D-Mode 1 (réponse la plus vive), la commande d’accélérateur ride-by-wire APSG issue de l’YZF-R1 répond instantanément. Le shifter bidirectionnel QSS de 3e génération permet de monter les rapports gaz ouverts en pleine charge, accompagné d’une détonation sourde dans la boîte à air spécifique à conduits acoustiques accordés.',
        ],
        specs: [
          {label: 'Alésage x Course', value: '78.0 x 62.1 mm'},
          {label: 'Rapport volumétrique', value: '11.5 : 1'},
          {label: 'Puissance maximale', value: '119 ch (87.5 kW) @ 10 000 tr/min'},
          {label: 'Couple maximal', value: '93.0 Nm @ 7 000 tr/min'},
        ],
      },
      {
        heading: '3. Tenue de route, suspensions KYB et freinage Brembo',
        paragraphs: [
          'La fourche inversée KYB de 41 mm dorée est entièrement réglable en précharge, compression et détente. Sur routes bosselées, les réglages d’usine peuvent sembler fermes, mais un assouplissement de 2 clics en compression détend le comportement sans rien perdre en précision de guidage.',
          'À l’avant, le maître-cylindre radial Brembo avec piston de 16 mm commande des étriers 4 pistons sur disques de 298 mm. Le mordant initial est dosable au millimètre, relayé par l’ABS de virage asservi par la centrale inertielle IMU 6 axes.',
        ],
      },
      {
        heading: '4. Verdict après 5 000 kilomètres : Le bilan d’usage',
        paragraphs: [
          'Avec une consommation moyenne mesurée à 5,1 L/100 km, le réservoir de 14 litres autorise des étapes de 240 à 260 km avant réserve. L’usure des Bridgestone Battlax Hypersport S22 reste très homogène grâce à la régulation fine de l’anti-patinage TCS.',
          'La Yamaha XSR 900 s’impose comme l’un des roadsters les plus complets et charismatiques du marché : elle réunit le tempérament explosif d’une sportive moderne et le charme indémodable des Grands Prix moto des années 1980.',
        ],
      },
    ],
  },
  {
    _id: 'draft-2',
    title: 'Top 5 des Lignes d’Échappement pour magnifier le Moteur CP3',
    slug: 'meilleurs-echappements-yamaha-xsr-900',
    category: 'ACCESSOIRES & SON',
    readTime: '6 min de lecture',
    date: '2026-10-04',
    excerpt:
      'Comparatif des systèmes d’échappement complets pour la XSR 900 : Akrapovič Titane homologué Euro 5+, SC-Project S1, Spark 3-en-1 et Arrow. Mesures au sonomètre, courbes de couple et gains de poids.',
    tag: 'ÉCHAPPEMENT CP3',
    highlight: 'SONORITÉ RACING',
    author: {
      name: 'Julien Rivoire',
      role: 'Ingénieur Préparateur Échappement',
    },
    stats: [
      {label: 'Gain moyen de poids', value: '-2.8 à -4.5 kg'},
      {label: 'Gain de puissance', value: '+3.2 à +5.8 ch'},
      {label: 'Niveau sonore Euro 5+', value: '94 dB à 5 000 tr/min'},
      {label: 'Type de montage', value: 'Ligne complète 3-en-1'},
    ],
    content: [
      {
        heading: '1. Pourquoi remplacer la ligne d’origine sur la XSR 900 ?',
        paragraphs: [
          'Sur la XSR 900, le silencieux et le catalyseur forment une chambre de tranquillisation d’un seul tenant sous le moteur. Pour changer de silencieux, il est indispensable de remplacer la ligne complète 3-en-1.',
          'Outre un gain de poids spectaculaire (souvent plus de 3 kg gagnés au ras du sol), une ligne de qualité libère les fréquences harmoniques uniques du 3-cylindres calé à 120°, tout en optimisant le balayage des gaz à mi-régime.',
        ],
        quote:
          '« Le vilebrequin crossplane possède une régularité d’explosion qui confère au CP3 un son rauque et envoûtant, à mi-chemin entre un V8 et une Formule 1 atmosphérique. »',
      },
      {
        heading: '2. Le Top 4 des lignes passées au banc',
        paragraphs: [
          '• Akrapovič Titanium Racing Line (Homologué Euro 5+) : L’option officielle du catalogue Yamaha. Finition titane irréprochable avec embout carbone. Elle conserve le catalyseur optionnel, garantit le respect des normes sans remapping et offre un gain de 3,3 ch à 9 800 tr/min.',
          '• SC-Project S1 Titane & Carbone : Développé en championnat du monde Moto2. Silencieux conique ultra-compact, sonorité agressive et gain de 4,2 kg par rapport à l’échappement d’origine.',
          '• Spark 3-en-1 Grid-O Titane : Le choix des puristes café racer. Grille pare-flamme racing en sortie, corps titane satiné et courbe de couple renforcée entre 4 500 et 7 000 tr/min.',
          '• Arrow Pro-Race Nichrom Dark : Silencieux trompette inspiré des motos de GP des années 80 avec tubulure inox. Un excellent rapport qualité-prix pour accentuer le look rétro.',
        ],
        specs: [
          {label: 'Akrapovič Titane', value: '-3.1 kg | +3.3 ch | Euro 5+'},
          {label: 'SC-Project S1', value: '-4.2 kg | +4.9 ch | Racing'},
          {label: 'Spark Grid-O', value: '-3.8 kg | +4.2 ch | Racing / Homol.'},
          {label: 'Arrow Pro-Race', value: '-2.9 kg | +3.0 ch | Homologué'},
        ],
      },
      {
        heading: '3. Cartographie moteur et précautions techniques',
        paragraphs: [
          'L’ECU de la XSR 900 s’adapte automatiquement aux lignes catalysées homologuées grâce à la sonde lambda large bande. En revanche, pour les lignes décatalysées, un flash ECU sur banc de puissance est vivement recommandé pour éviter un mélange trop pauvre en ouverture rapide des gaz.',
        ],
      },
    ],
  },
  {
    _id: 'draft-3',
    title: 'Prépa Café Racer : Transformer sa XSR 900 en bête de Grand Prix 80s',
    slug: 'prepa-cafe-racer-yamaha-xsr-900',
    category: 'CUSTOM & ATELIER',
    readTime: '7 min de lecture',
    date: '2026-10-03',
    excerpt:
      'Guide pas à pas pour radicaliser votre roadster : installation du kit carénage Faster Sons, demi-guidons bracelets, commandes reculées Gilles Tooling et support de plaque court taillé dans la masse.',
    tag: 'PERSONNALISATION',
    highlight: 'STYLE TZ GRAND PRIX',
    author: {
      name: 'Marc Delattre',
      role: 'Designer Atelier Custom',
    },
    stats: [
      {label: 'Temps de montage', value: '6 heures atelier'},
      {label: 'Pièces maîtresses', value: 'Bulle, Bracelets, Dosseret'},
      {label: 'Réversibilité', value: '100% plug & play'},
      {label: 'Inspiration', value: 'Yamaha YZR500 Sonauto'},
    ],
    content: [
      {
        heading: '1. La philosophie Faster Sons : L’esprit des TZ de Grand Prix',
        paragraphs: [
          'La XSR 900 possède des proportions d’origine idéales pour une transformation racing rétro. Ses volumes évoquent les Yamaha YZR500 de Christian Sarron et Wayne Rainey avec son réservoir taillé à facettes et son arrière tronqué.',
          'Avec quelques modifications ciblées, il est possible de transformer ce roadster urbain en une machine de course échappée des paddocks de 1985.',
        ],
        quote:
          '« L’objectif n’est pas d’alourdir la moto d’artifices, mais de révéler les lignes de course de son cadre en aluminium coulé. »',
      },
      {
        heading: '2. Les 4 étapes clés de la préparation',
        paragraphs: [
          '• Le tête de fourche vintage : La bulle profilée en acrylique teinté s’installe directement sur les fixations du phare LED rond d’origine via des pattes découpées au laser.',
          '• Les demi-guidons bracelets sous le té : En remplaçant le guidon plat d’origine par des bracelets Gilles Tooling inclinés à 7°, on bascule le centre de gravité vers l’avant et on retrouve la posture authentique des café racers.',
          '• Commandes reculées taillées masse : Usinées en aluminium aéronautique CNC, elles reculent les repose-pieds de 25 mm et les rehaussent de 15 mm pour maximiser la garde au sol en prise d’angle.',
          '• Le dosseret de selle monoplace et rétroviseurs embout de guidon : La touche finale qui affine la boucle arrière et épure la silhouette.',
        ],
        specs: [
          {label: 'Tête de fourche', value: 'Faster Sons ABS injecté'},
          {label: 'Guidons bracelets', value: 'Gilles Tooling 50 mm'},
          {label: 'Commandes reculées', value: 'Aluminium CNC 8 positions'},
          {label: 'Support de plaque', value: 'Court taillé masse sous feu'},
        ],
      },
    ],
  },
  {
    _id: 'draft-4',
    title: 'Guide d’Entretien CP3 : Vidange, Tendeur de Distribution et Révisions',
    slug: 'guide-entretien-moteur-cp3-yamaha',
    category: 'MOTEUR & TECHNIQUE',
    readTime: '10 min de lecture',
    date: '2026-10-02',
    excerpt:
      'Tout ce qu’il faut savoir pour préserver la santé mécanique de votre bloc 890 cm³. Choix de l’huile moteur Yamalube 10W40, contrôle du jeu aux soupapes à 40 000 km et surveillance du tendeur de chaîne hydraulique.',
    tag: 'MÉCANIQUE',
    highlight: 'INTERVALLES CONSTRUCTEUR',
    author: {
      name: 'Thomas Vauthier',
      role: 'Chef d’Atelier Yamaha Agréé',
    },
    stats: [
      {label: 'Intervalle vidange', value: '10 000 km ou 12 mois'},
      {label: 'Jeu aux soupapes', value: 'Contrôle à 40 000 km'},
      {label: 'Capacité d’huile', value: '2.8 L (avec filtre)'},
      {label: 'Type de bougies', value: 'NGK CPR9EA-9'},
    ],
    content: [
      {
        heading: '1. Les fondamentaux de la lubrification du bloc CP3',
        paragraphs: [
          'Le moteur 3-cylindres Yamaha CP3 bénéficie de pistons forgés en aluminium et de cylindres sans chemise avec traitement composite céramique. Pour garantir leur longévité, l’huile moteur joue un rôle crucial de refroidissement et de lubrification sous fortes contraintes.',
          'La préconisation constructeur officielle est la Yamalube RS4GP 10W40 100% synthèse pour un usage sportif, ou la Yamalube 4-S 10W40 semi-synthèse pour un usage urbain et balade.',
        ],
        quote:
          '« Respecter les temps de chauffe et effectuer la vidange tous les 10 000 km avec filtre à huile neuf assure une durée de vie supérieure à 150 000 km sans ouvrir le bas moteur. »',
      },
      {
        heading: '2. Procédure de vidange pas à pas & Couples de serrage',
        paragraphs: [
          '• Bouchon de vidange carter inférieur : Clé de 17 mm, couple de serrage impératif de 43 Nm. Pensez à remplacer la rondelle d’écrasement en cuivre à chaque vidange.',
          '• Filtre à huile à cartouche : Clé à filtre 64 mm, serrage à 17 Nm (ou 3/4 de tour après contact du joint préalablement huilé).',
          '• Quantité d’huile : 2,8 litres avec remplacement du filtre, 2,6 litres sans filtre.',
        ],
        specs: [
          {label: 'Bouchon de vidange', value: '43 Nm (Joint cuivre 14 mm)'},
          {label: 'Filtre à huile', value: '17 Nm (Réf Yamaha 5GH-13440-60)'},
          {label: 'Bougies d’allumage', value: '13 Nm (Écartement 0.8 - 0.9 mm)'},
          {label: 'Axe de roue arrière', value: '105 Nm (Goupille neuve)'},
        ],
      },
      {
        heading: '3. Les points de contrôle périodiques essentiels',
        paragraphs: [
          '• Tendeur de chaîne de distribution hydraulique : Surveiller l’absence de cliquetis métallique prononcé à froid vers 3 000 tr/min.',
          '• Tension et graissage de la chaîne secondaire : Garde recommandée entre 35 et 45 mm sur béquille latérale.',
          '• Liquide de frein DOT 4 : Remplacement tous les 2 ans pour préserver les pistons de l’étrier radial Brembo et de la centrale ABS.',
        ],
      },
    ],
  },
]
