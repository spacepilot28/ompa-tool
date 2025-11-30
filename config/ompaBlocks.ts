// config/ompaBlocks.ts

export type OmpaBlockId =
  | "block_1"
  | "block_2"
  | "block_3"
  | "block_4"
  | "block_5"
  | "block_6"
  | "block_7"
  | "block_8"
  | "block_9"
  | "block_10";

export interface OmpaQuestion {
  nr: number;
  text: string;
  defaultPriority: 1 | 2 | 3 | 4;
}

export interface OmpaBlock {
  id: OmpaBlockId;
  index: number;
  title: string;
  questions: OmpaQuestion[];
}

export const OMPA_BLOCKS: OmpaBlock[] = [
  {
    id: "block_1",
    index: 1,
    title: "Ausrichtung / Online-Marketingstrategie",
    questions: [
      { nr: 1, text: "Wir haben eine klare Vision/Ausrichtung", defaultPriority: 1 },
      { nr: 2, text: "Allen Mitarbeitern ist die Vision bekannt", defaultPriority: 1 },
      { nr: 3, text: "Unsere Vision/Ausrichtung berücksichtigt zukünftige Veränderungen von Märkten |Kunden | Digitalisierung", defaultPriority: 1 },
      { nr: 4, text: "Wir haben eine klares Online-Marketing-Measurement-Modell", defaultPriority: 1 },
      { nr: 5, text: "Unser Produktportfolio ist auch für die Zukunft bestens aufgestellt", defaultPriority: 1 },
      { nr: 6, text: "Wir kennen unsere USP (Unique Selling Proposition) bzw. unsere Wettbewerbsvorteile", defaultPriority: 1 },
      { nr: 7, text: "Wir haben Entwicklungen und Innovationen in unserem Markt im Blick", defaultPriority: 1 },
      { nr: 8, text: "Wir kennen unsere Stärken und Schwächen sowie Chancen und Risiken", defaultPriority: 1 },
      { nr: 9, text: "Es gibt eine klare Zielgruppenanalyse", defaultPriority: 1 },
      { nr: 10, text: "Wir haben eine auf Buyer Persona/Kundensegmente ausgerichtete Online-Strategie", defaultPriority: 1 },
    ],
  },
  {
    id: "block_2",
    index: 2,
    title: "„Content & Inbound-Marketing“",
    questions: [
      { nr: 11, text: "Wir haben eine dokumentierte Content-Strategie.", defaultPriority: 1 },
      { nr: 12, text: "Unsere Inhalte sind klar auf definierte Themencluster ausgerichtet.", defaultPriority: 1 },
      { nr: 13, text: "Wir produzieren regelmäßig Content für unsere Zielgruppen (Blog, Video, Podcast etc.).", defaultPriority: 1 },
      { nr: 14, text: "Wir erstellen Inhalte für alle Phasen der Customer Journey.", defaultPriority: 1 },
      { nr: 15, text: "Unsere Inhalte generieren organisch neue Besucher und Leads.", defaultPriority: 1 },
      { nr: 16, text: "Wir nutzen Content zur Positionierung als Experte.", defaultPriority: 1 },
      { nr: 17, text: "Unsere Inhalte werden aktiv distribuiert.", defaultPriority: 1 },
      { nr: 18, text: "Wir messen die Performance unserer Inhalte.", defaultPriority: 1 },
      { nr: 19, text: "Wir aktualisieren und recyceln bestehende Inhalte regelmäßig.", defaultPriority: 1 },
      { nr: 20, text: "Unser Content ist klar auf unsere USP abgestimmt.", defaultPriority: 1 },
    ],
  },
  {
    id: "block_3",
    index: 3,
    title: "Kundenpotenzial / Marktausschöpfung",
    questions: [
      { nr: 21, text: "Das Potenzial unserer bestehenden Kunden wird optimal ausgeschöpft", defaultPriority: 1 },
      { nr: 22, text: "Wir haben eine hohe Kundenbindung", defaultPriority: 1 },
      { nr: 23, text: "Wir haben für strategisch wichtige Kunden Kundenentwicklungspläne", defaultPriority: 1 },
      { nr: 24, text: "Unsere Kunden nutzen mehrere unserer Produkte/Dienstleistungen", defaultPriority: 1 },
      { nr: 25, text: "Es ist schwierig/aufwändig/kostenintensiv für unsere Kunden, uns als Lieferanten/ Dienstleister auszutauschen", defaultPriority: 1 },
      { nr: 26, text: "Das Marktpotenzial der Zielmärkte der möglichen Kunden wird optimal ausgeschöpft", defaultPriority: 1 },
      { nr: 27, text: "Wir haben eine gute räumliche Abdeckung im Zielmarkt", defaultPriority: 1 },
      { nr: 28, text: "Wir kennen den Engpass / die Probleme unserer Kunden heute und in der Zukunft", defaultPriority: 1 },
      { nr: 29, text: "Wir wachsen in unseren Kernmärkten (relativ im Vergleich zur Marktentwicklung insgesamt)", defaultPriority: 1 },
      { nr: 30, text: "Unser Bekanntheitsgrad bei unseren Zielkundenmärkten ist:", defaultPriority: 1 },
    ],
  },
  {
    id: "block_4",
    index: 4,
    title: "Marketing",
    questions: [
      { nr: 31, text: "Leadgenerierung Anzahl", defaultPriority: 1 },
      { nr: 32, text: "Leadgenerierung Qualität", defaultPriority: 1 },
      { nr: 33, text: "Messeauftritte", defaultPriority: 1 },
      { nr: 34, text: "Vertriebsaktionen", defaultPriority: 1 },
      { nr: 35, text: "Prospektmaterial", defaultPriority: 1 },
      { nr: 36, text: "Webseite", defaultPriority: 1 },
      { nr: 37, text: "Suchmaschinenoptimierung", defaultPriority: 1 },
      { nr: 38, text: "Automatisierter Leadgenerierungsprozess", defaultPriority: 1 },
      { nr: 39, text: "Ausgearbeiteter Marketing-/Kampagenplan", defaultPriority: 1 },
      { nr: 40, text: "Berücksichtigung moderner Medien (Social Media, etc.)", defaultPriority: 1 },
    ],
  },
  {
    id: "block_5",
    index: 5,
    title: "Akquisitionsweg / Neukundengewinnung",
    questions: [
      { nr: 41, text: "Anfragen von Kunden/Neukunden", defaultPriority: 1 },
      { nr: 42, text: "Kaltakquisition durch Verkäufer", defaultPriority: 1 },
      { nr: 43, text: "Terminierte Außendienstbesuche", defaultPriority: 1 },
      { nr: 44, text: "Call-Mail-Call-Aktionen", defaultPriority: 1 },
      { nr: 45, text: "Empfehlungen", defaultPriority: 1 },
      { nr: 46, text: "Callcenter legt Termine", defaultPriority: 1 },
      { nr: 47, text: "Telefonakquisition durch Verkäufer", defaultPriority: 1 },
      { nr: 48, text: "Mailingaktionen", defaultPriority: 1 },
      { nr: 49, text: "Angebote gezielt nachfassen", defaultPriority: 1 },
      { nr: 50, text: "Auf Messen", defaultPriority: 1 },
    ],
  },
  {
    id: "block_6",
    index: 6,
    title: "E-Mail-Marketing & Automation",
    questions: [
      { nr: 51, text: "Wir nutzen E-Mail-Marketing aktiv.", defaultPriority: 1 },
      { nr: 52, text: "Unsere Verteiler sind segmentiert.", defaultPriority: 1 },
      { nr: 53, text: "Wir haben automatisierte Sequenzen.", defaultPriority: 1 },
      { nr: 54, text: "E-Mail-Kampagnen haben klare Ziele.", defaultPriority: 1 },
      { nr: 55, text: "Wir messen Öffnungsraten/Klicks.", defaultPriority: 1 },
      { nr: 56, text: "Wir nutzen Lead-Magnete.", defaultPriority: 1 },
      { nr: 57, text: "Wir setzen Trigger-basierte Kommunikation ein.", defaultPriority: 1 },
      { nr: 58, text: "Opt-in & Datenschutz sind korrekt.", defaultPriority: 1 },
      { nr: 59, text: "E-Mail-Marketing ist ans CRM angebunden.", defaultPriority: 1 },
      { nr: 60, text: "Wir testen und optimieren Inhalte.", defaultPriority: 1 },
    ],
  },
  {
    id: "block_7",
    index: 7,
    title: "Analytics, Systeme & Funnel",
    questions: [
      { nr: 61, text: "Unsere Online-Marketing-Kanäle sind messbar.", defaultPriority: 1 },
      { nr: 62, text: "Wir haben definierte Conversions.", defaultPriority: 1 },
      { nr: 63, text: "Wir nutzen KPI-Dashboards.", defaultPriority: 1 },
      { nr: 64, text: "KPIs werden regelmäßig besprochen.", defaultPriority: 1 },
      { nr: 65, text: "Wir kennen CPL/CAC/ROI.", defaultPriority: 1 },
      { nr: 66, text: "CRM ist verknüpft mit Website/Kampagnen.", defaultPriority: 1 },
      { nr: 67, text: "Wir haben definierte Funnel.", defaultPriority: 1 },
      { nr: 68, text: "Wir kennen Funnel-Abbruchstellen.", defaultPriority: 1 },
      { nr: 69, text: "Wir nutzen A/B-Tests.", defaultPriority: 1 },
      { nr: 70, text: "Unser Marketing-Stack ist integriert.", defaultPriority: 1 },
    ],
  },
  {
    id: "block_8",
    index: 8,
    title: "Verkaufskompetenzen",
    questions: [
      { nr: 71, text: "Zwichenmenschliche Beziehungen", defaultPriority: 1 },
      { nr: 72, text: "Beim Interessenten Interesse wecken", defaultPriority: 1 },
      { nr: 73, text: "Sichere Bedarfsanalysen", defaultPriority: 1 },
      { nr: 74, text: "Kaufwunsch emotional wecken", defaultPriority: 1 },
      { nr: 75, text: "Überzeugende Produktpräsentationen", defaultPriority: 1 },
      { nr: 76, text: "Sichere Einwandbehandlungen", defaultPriority: 1 },
      { nr: 77, text: "Beweis und Begründung im Verkauf", defaultPriority: 1 },
      { nr: 78, text: "„Zu teuer“ – wie wird reagiert?", defaultPriority: 1 },
      { nr: 79, text: "Begeisterung übertragen können", defaultPriority: 1 },
      { nr: 80, text: "Sicher abschließen", defaultPriority: 1 },
    ],
  },
  {
    id: "block_9",
    index: 9,
    title: "Ergänzende Vertriebskompetenzen",
    questions: [
      { nr: 81, text: "Kreative Ideen umsetzen", defaultPriority: 1 },
      { nr: 82, text: "Eigenmotivation und Begeisterung", defaultPriority: 1 },
      { nr: 83, text: "Interessenten zu Käufern machen", defaultPriority: 1 },
      { nr: 84, text: "Ziele setzen und erreichen", defaultPriority: 1 },
      { nr: 85, text: "Empfehlungsgeschäft nutzen", defaultPriority: 1 },
      { nr: 86, text: "Kundenorientiert handeln", defaultPriority: 1 },
      { nr: 87, text: "Umgang mit Reklamationen/Beschwerden", defaultPriority: 1 },
      { nr: 88, text: "Jahres-Konditionsgespräche führen", defaultPriority: 1 },
      { nr: 89, text: "Strukturiert Verkaufen", defaultPriority: 1 },
      { nr: 90, text: "Identifikation mit der Rolle Verkäufer", defaultPriority: 1 },
    ],
  },
  {
    id: "block_10",
    index: 10,
    title: "Vertriebsengpaß",
    questions: [
      { nr: 91, text: "Ausreichend Kundentermine", defaultPriority: 1 },
      { nr: 92, text: "Ausreichend Neukunden", defaultPriority: 1 },
      { nr: 93, text: "Sehr gute Margen", defaultPriority: 1 },
      { nr: 94, text: "Keine Preisnachlässe", defaultPriority: 1 },
      { nr: 95, text: "Optimale Abschlussquote aus Verkaufsgesprächen", defaultPriority: 1 },
      { nr: 96, text: "Umsatzpotenzial bei bestehenden Kunden wird optimal ausgeschöpft", defaultPriority: 1 },
      { nr: 97, text: "Wir wissen anhand von Rückmeldungen unserer Kunden exakt die aktuellen Erwartungen an unsere Produkte", defaultPriority: 1 },
      { nr: 98, text: "Optimale Nutzung der zeitlichen Ressourcen der Vertriebsmitarbeiter", defaultPriority: 1 },
      { nr: 99, text: "Optimale Nutzung technischer Ressourcen (Vertrieb 4.0 | Digitalisierung | CRM )", defaultPriority: 1 },
    ],
  },
];
