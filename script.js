const SUPABASE_URL = "https://nyejprqlgzybrraudcz.supabase.co";
const SUPABASE_KEY = "sb_publishable_iOGy9PawDNtRKdKyAQRhhA_03YNGm4T";
let supabaseClient = null;

// Fallback: Falls Supabase nicht lädt, funktioniert das Spiel trotzdem lokal.
const fallbackAkten = [
  {
    "type": "mc",
    "title": "Der emotionale Koeder",
    "dialog": "Nova: \"Dieser Post klingt absichtlich laut und panisch. Wenn du so etwas siehst, frag dich immer zuerst: Soll ich informiert werden - oder nur aufgeregt?\"",
    "evidenceType": "html",
    "evidence": "\n      <div class=\"inline-graphic clue-scene\">\n        <div class=\"clue-card alert\">Eilmeldung</div>\n        <div class=\"clue-card\">Kommentarspalte</div>\n        <div class=\"clue-card muted-card\">Teilen?</div>\n      </div>\n    ",
    "question": "Was ist hier das deutlichste Warnsignal?",
    "options": [
      {
        "text": "Die Sprache arbeitet mit Druck, Panik und dem Aufruf zum sofortigen Teilen.",
        "correct": true
      },
      {
        "text": "Die Meldung ist automatisch glaubwuerdig, weil sie sehr entschlossen klingt.",
        "correct": false
      }
    ],
    "learningTitle": "Gelernt: Emotionen als Trick",
    "learningText": "Fake News wollen dich oft nicht informieren, sondern in Sekunden zu Wut, Angst oder hektischem Teilen treiben."
  },
  {
    "type": "mc",
    "title": "Die URL-Falle",
    "dialog": "Nova: \"Viele Falschmeldungen sehen auf den ersten Blick serioes aus. Aber die Adresse verraet oft mehr als die Schlagzeile.\"",
    "evidenceType": "html",
    "evidence": "\n      <div class=\"inline-graphic browser-clue\">\n        <div class=\"browser-top\"><span></span><span></span><span></span></div>\n        <div class=\"url-placeholder\">https://... / ...</div>\n        <div class=\"clue-lines\"><i></i><i></i><i></i></div>\n      </div>\n    ",
    "question": "Worauf solltest du bei verdaechtigen Links besonders achten?",
    "options": [
      {
        "text": "Auf ungewoehnliche Endungen, zusammengesetzte Fantasienamen und nachgemachte bekannte Marken.",
        "correct": true
      },
      {
        "text": "Nur darauf, ob irgendwo das Wort \"offiziell\" im Link vorkommt.",
        "correct": false
      }
    ],
    "learningTitle": "Gelernt: Links genau lesen",
    "learningText": "Dubiose Seiten kopieren oft Namen bekannter Medien. Schau auf die komplette Domain, nicht nur auf ein bekanntes Wort darin."
  },
  {
    "type": "hotspot",
    "title": "Die Bildersuche",
    "dialog": "Nova: \"Hier liegt ein angeblicher Nachrichtenartikel auf meinem Tisch. Irgendetwas daran ist faul. Finde drei Hinweise, die gegen die Glaubwuerdigkeit sprechen.\"",
    "evidenceType": "hotspot",
    "image": "akte3-bildersuche.png",
    "question": "Klicke auf drei auffaellige Stellen im Bild.",
    "hotspots": [
      {
        "id": 1,
        "top": "41.5%",
        "left": "28%",
        "width": "31%",
        "height": "7%",
        "title": "Reisserische Ueberschrift",
        "explanation": "Die Schlagzeile ist sehr dramatisch formuliert und soll sofort Aufmerksamkeit ausloesen."
      },
      {
        "id": 2,
        "top": "49%",
        "left": "30%",
        "width": "28%",
        "height": "7%",
        "title": "Quelle und Autor pruefen",
        "explanation": "Autor, Datum und Webseite sollten nachvollziehbar sein. Hier wirkt die Quelle wenig vertrauenswuerdig."
      },
      {
        "id": 3,
        "top": "65%",
        "left": "39%",
        "width": "43%",
        "height": "18%",
        "title": "Aufforderung zum Teilen",
        "explanation": "Der rote Kasten draengt zum schnellen Teilen. Solcher Druck ist ein typischer Warnhinweis."
      }
    ],
    "learningTitle": "Gelernt: Hinweise im Gesamtbild lesen",
    "learningText": "Nicht nur Texte, auch Aufbau und Tonfall liefern Hinweise: Schock-Schlagzeilen, dubiose Quellen und Teil-Aufrufe sind starke Warnzeichen."
  },
  {
    "type": "dragdrop",
    "title": "Wie sich Fake News verbreiten",
    "dialog": "Nova: \"Eine Luege wird selten einfach nur gepostet. Meist gibt es einen typischen Weg, wie sie gross wird.\"",
    "evidenceType": "html",
    "evidence": "\n      <div class=\"inline-graphic spread-graphic\">\n        <div class=\"fake-post\">\n          <span class=\"post-label\">unbestätigte Behauptung</span>\n          <div class=\"post-lines\"><i></i><i></i><i></i></div>\n        </div>\n        <div class=\"reaction-cloud\">\n          <span>!</span><span>?</span><span>↗</span><span>❤</span>\n        </div>\n        <div class=\"share-path\"><i></i><i></i><i></i></div>\n      </div>\n    ",
    "question": "Bringe die Verbreitung in eine sinnvolle Reihenfolge.",
    "items": [
      "Menschen teilen die Meldung weiter",
      "Jemand erfindet oder verdreht eine Behauptung",
      "Plattformen zeigen die Meldung mehr Leuten",
      "Die Meldung bekommt viele emotionale Reaktionen"
    ],
    "correctOrder": [
      "Jemand erfindet oder verdreht eine Behauptung",
      "Die Meldung bekommt viele emotionale Reaktionen",
      "Plattformen zeigen die Meldung mehr Leuten",
      "Menschen teilen die Meldung weiter"
    ],
    "learningTitle": "Gelernt: Reichweite entsteht in Schritten",
    "learningText": "Viele Falschmeldungen werden erst durch starke Reaktionen gross. Algorithmen verstaerken, was viel Aufmerksamkeit bekommt."
  },
  {
    "type": "mc",
    "title": "Wem nuetzt die Luege?",
    "dialog": "Nova: \"Ermittler fragen oft: Wer profitiert davon? Genau diese Frage hilft auch bei Fake News.\"",
    "evidenceType": "html",
    "evidence": "\n      <div class=\"inline-graphic motive-board-graphic\">\n        <div class=\"motive-desk\">\n          <div class=\"motive-laptop\"></div>\n          <div class=\"motive-news-card card-one\"></div>\n          <div class=\"motive-news-card card-two\"></div>\n          <div class=\"motive-shadow-person\"></div>\n          <div class=\"motive-arrow arrow-one\"></div>\n          <div class=\"motive-arrow arrow-two\"></div>\n          <div class=\"motive-crowd\"><span></span><span></span><span></span></div>\n        </div>\n      </div>\n    ",
    "question": "Warum werden Fake News oft absichtlich verbreitet?",
    "options": [
      {
        "text": "Um Geld, Aufmerksamkeit oder politischen Einfluss zu gewinnen.",
        "correct": true
      },
      {
        "text": "Weil die meisten Menschen aus Versehen komplette Artikel erfinden.",
        "correct": false
      }
    ],
    "learningTitle": "Gelernt: Hinter Fake News steckt oft ein Ziel",
    "learningText": "Falschmeldungen entstehen nicht immer zufaellig. Oft geht es um Reichweite, Geld, Stimmungsmache oder Einfluss."
  },
  {
    "type": "mc",
    "title": "Fakt oder Meinung?",
    "dialog": "Nova: \"Eine gute Detektivin trennt immer sauber zwischen messbaren Fakten und persoenlichen Bewertungen.\"",
    "evidenceType": "html",
    "evidence": "\n      <div class=\"inline-graphic\">\n        <div class=\"mini-card\">\n          <strong>Beispiel:</strong>\n          <p>\"Die Temperaturen sind heute 4 Grad hoeher als gestern. Das ist eine Katastrophe!\"</p>\n        </div>\n      </div>\n    ",
    "question": "Welcher Teil ist ein pruefbarer Fakt?",
    "options": [
      {
        "text": "Dass es heute 4 Grad waermer ist als gestern.",
        "correct": true
      },
      {
        "text": "Dass die Lage deshalb automatisch eine Katastrophe ist.",
        "correct": false
      }
    ],
    "learningTitle": "Gelernt: Fakten sind pruefbar",
    "learningText": "Zahlen, Daten und konkrete Messwerte kann man nachpruefen. Wertungen wie \"katastrophal\" sind Meinungen oder Framings."
  },
  {
    "type": "mc",
    "title": "Deepfake oder echt?",
    "dialog": "Nova: \"Nicht jedes Bild oder Video zeigt die Wirklichkeit. Gerade bei KI-Inhalten lohnt sich ein zweiter Blick.\"",
    "evidenceType": "html",
    "evidence": "\n      <div class=\"inline-graphic ai-check-graphic\">\n        <div class=\"photo-frame soft-photo-frame\">\n          <div class=\"portrait-circle\"></div>\n          <div class=\"image-detail-dots\"><span></span><span></span><span></span></div>\n        </div>\n        <div class=\"magnifier-card\">\n          <div class=\"mini-lens\"></div>\n          <div class=\"clue-lines\"><i></i><i></i><i></i></div>\n        </div>\n      </div>\n    ",
    "question": "Welcher Hinweis passt am besten zu einem KI-generierten Fake-Bild?",
    "options": [
      {
        "text": "Unlogische Details wie seltsame Haende, schiefe Objekte oder unleserlicher Text im Hintergrund.",
        "correct": true
      },
      {
        "text": "Dass das Bild automatisch alt aussieht oder in Schwarzweiss ist.",
        "correct": false
      }
    ],
    "learningTitle": "Gelernt: KI-Bilder haben oft kleine Brueche",
    "learningText": "Viele manipulierte Bilder fallen nicht sofort auf. Achte auf Details, die in der echten Welt unlogisch wirken."
  },
  {
    "type": "mc",
    "title": "Der Kettenbrief im Chat",
    "dialog": "Nova: \"Viele Falschmeldungen verbreiten sich nicht ueber grosse Nachrichtenseiten, sondern ganz privat im Familienchat.\"",
    "evidenceType": "html",
    "evidence": "\n      <div class=\"inline-graphic\">\n        <div class=\"chat-bubble-demo\">Bitte sofort an alle Kontakte weiterleiten! Das wird bald geloescht!</div>\n      </div>\n    ",
    "question": "Wie reagierst du am besten auf so einen Kettenbrief?",
    "options": [
      {
        "text": "Nicht einfach weiterleiten, sondern erst pruefen und gegebenenfalls ruhig widersprechen.",
        "correct": true
      },
      {
        "text": "Lieber schnell weiterschicken - sicher ist sicher.",
        "correct": false
      }
    ],
    "learningTitle": "Gelernt: Nicht jeder Hinweis ist hilfreich",
    "learningText": "Gerade private Nachrichten wirken vertraulich. Das macht sie aber nicht automatisch wahr."
  },
  {
    "type": "mc",
    "title": "Wie schuetzt du dich?",
    "dialog": "Nova: \"Fake News komplett zu verhindern ist schwer. Aber du kannst viel tun, damit sie dich nicht so leicht erwischen.\"",
    "evidenceType": "html",
    "evidence": "\n      <div class=\"inline-graphic safety-scene-graphic\">\n        <div class=\"phone-warning\">\n          <div class=\"phone-top\"></div>\n          <div class=\"phone-lines\"><span></span><span></span><span></span></div>\n        </div>\n        <div class=\"pause-bubble\">Ⅱ</div>\n        <div class=\"detective-tools\">\n          <div class=\"tool-lens\"></div>\n          <div class=\"tool-paper\"><span></span><span></span></div>\n        </div>\n      </div>\n    ",
    "question": "Welche Strategie hilft am meisten?",
    "options": [
      {
        "text": "Nicht sofort reagieren, sondern Quelle, Datum und Kontext kurz pruefen.",
        "correct": true
      },
      {
        "text": "Nur Schlagzeilen lesen und auf das eigene Bauchgefuehl vertrauen.",
        "correct": false
      }
    ],
    "learningTitle": "Gelernt: Schutz beginnt mit einer Pause",
    "learningText": "Schon wenige Sekunden Nachdenken koennen verhindern, dass du auf eine Falschmeldung hereinfällst oder sie weiterverbreitest."
  },
  {
    "type": "imageCompare",
    "title": "Bildmanipulation: Vorher oder Nachher?",
    "dialog": "Nova: \"Bilder koennen veraendert werden, ohne dass man es sofort merkt. Zieh den Regler und untersuche, was sich veraendert hat.\"",
    "evidenceType": "imageCompare",
    "question": "Welche Manipulation wurde im Nachher-Bild eingebaut?",
    "options": [
      {
        "text": "Rauch wurde hinzugefuegt, eine Person entfernt, die Farbe dramatischer gemacht und Text eingefuegt.",
        "correct": true
      },
      {
        "text": "Es wurde nur ein anderer Bildausschnitt gewaehlt, sonst ist nichts veraendert.",
        "correct": false
      },
      {
        "text": "Das Bild ist nur heller geworden, inhaltlich bleibt alles gleich.",
        "correct": false
      }
    ],
    "learningTitle": "Gelernt: Bilder koennen Stimmung machen",
    "learningText": "Manipulationen muessen nicht gross sein: Rauch, entfernte Personen, veraenderte Farben oder eingefuegter Text koennen die Wirkung stark veraendern."
  },
  {
    "type": "feedSelect",
    "title": "Der Fake-News-Feed",
    "dialog": "Nova: \"In echten Feeds stehen serioese Posts und zweifelhafte Meldungen oft direkt nebeneinander. Scrolle durch den Feed und markiere die zwei verdaechtigen Beitraege.\"",
    "evidenceType": "feedSelect",
    "question": "Welche zwei Feed-Beitraege sind verdaechtig?",
    "requiredCorrect": 2,
    "posts": [
      {
        "title": "Stadt informiert ueber neue Buszeiten",
        "meta": "stadt-wuerzburg.de · heute · offizielle Mitteilung",
        "text": "Ab Montag gelten neue Fahrplaene. Alle Details stehen auf der offiziellen Webseite der Stadt.",
        "correct": false,
        "hint": "Unauffaellig: offizielle Quelle, klares Datum und nachvollziehbarer Link."
      },
      {
        "title": "SCHOCK: Das wird euch verheimlicht!!!",
        "meta": "wahrheit-jetzt24.co · kein Autor · kein Datum",
        "text": "Teile diesen Beitrag sofort, bevor er geloescht wird. Alle Medien schweigen angeblich!",
        "correct": true,
        "hint": "Fake-News-Muster: extreme Sprache, kein Autor, kein Datum und Druck zum Teilen."
      },
      {
        "title": "Interview mit Medienexpertin",
        "meta": "regionalzeitung.de · gestern · Autorin sichtbar",
        "text": "Eine Expertin erklaert, warum Quellenpruefung im Netz wichtig ist und welche Fehler haeufig passieren.",
        "correct": false,
        "hint": "Unauffaellig: Quelle, Zeitpunkt und Autorin sind sichtbar."
      },
      {
        "title": "Unglaubliches Video beweist alles!",
        "meta": "viral-news-club.net · Screenshot · Quelle unbekannt",
        "text": "Das Video soll angeblich eine geheime Entscheidung zeigen. Einen Original-Link gibt es aber nicht.",
        "correct": true,
        "hint": "Fake-News-Muster: unklare Herkunft, kein Original-Link und sehr grosse Behauptung."
      },
      {
        "title": "Faktencheck: Altes Bild kursiert erneut",
        "meta": "faktencheck.org · heute · Quellen im Artikel",
        "text": "Der Beitrag ordnet ein altes Foto ein und zeigt, aus welchem Jahr es wirklich stammt.",
        "correct": false,
        "hint": "Unauffaellig: Der Beitrag erklaert Quellen und Kontext transparent."
      }
    ],
    "learningTitle": "Gelernt: Im Feed genau hinschauen",
    "learningText": "Fake News tarnen sich zwischen normalen Posts. Besonders verdaechtig sind fehlende Quellen, extreme Sprache, Druck zum Teilen, unbekannte Webseiten und fehlende Originalbelege."
  },
  {
    "type": "ampel",
    "title": "Fake-News-Ampel",
    "dialog": "Nova: \"Manchmal ist eine Meldung nicht sofort eindeutig. Die Ampel hilft dir: gruen heisst okay, gelb heisst pruefen, rot heisst sehr verdaechtig.\"",
    "evidenceType": "ampel",
    "question": "Wie wuerdest du diese Meldung einschaetzen?",
    "postTitle": "Unglaublich: Schule verbietet ab morgen alle Handys!",
    "postMeta": "Screenshot aus einem Gruppenchat · keine Quelle · keine offizielle Meldung",
    "postText": "Alle sollen das sofort weiterleiten. Angeblich wurde es gerade beschlossen.",
    "choices": [
      {
        "color": "green",
        "label": "Gruen: wirkt glaubwuerdig",
        "correct": false
      },
      {
        "color": "yellow",
        "label": "Gelb: erst pruefen",
        "correct": false
      },
      {
        "color": "red",
        "label": "Rot: stark verdaechtig",
        "correct": true
      }
    ],
    "learningTitle": "Gelernt: Rot bei Druck und fehlender Quelle",
    "learningText": "Wenn Quelle, Datum und offizielle Bestaetigung fehlen und gleichzeitig zum Weiterleiten gedraengt wird, ist die Meldung stark verdaechtig."
  },
  {
    "type": "mc",
    "title": "Der letzte Faktencheck",
    "dialog": "Nova: \"Zum Abschluss bekommst du eine neue Behauptung. Jetzt zaehlt nicht Auswendiglernen, sondern dein Vorgehen: Wie pruefst du sauber weiter?\"",
    "evidenceType": "html",
    "evidence": "\n      <div class=\"inline-graphic final-check-graphic\">\n        <div class=\"claim-card\">\n          <strong>Behauptung</strong>\n          <p>Eine Nachricht klingt krass, nennt aber keine klare Quelle.</p>\n        </div>\n        <div class=\"search-beam\"></div>\n        <div class=\"source-stack\">\n          <span></span><span></span><span></span>\n        </div>\n      </div>\n    ",
    "question": "Was ist der sinnvollste naechste Schritt?",
    "options": [
      {
        "text": "Die Behauptung mit mehreren serioesen Quellen oder Faktencheck-Seiten abgleichen.",
        "correct": true
      },
      {
        "text": "Nur den Screenshot speichern und ihn sofort weiterleiten, damit andere auch Bescheid wissen.",
        "correct": false
      }
    ],
    "learningTitle": "Gelernt: Erst pruefen, dann teilen",
    "learningText": "Ein guter Faktencheck vergleicht mehrere verlaessliche Quellen. Erst wenn Quelle, Datum und Kontext stimmen, sollte man eine Meldung weitergeben."
  }
];

function getSupabaseClient() {
  if (!supabaseClient && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return supabaseClient;
}

function parseCorrectLetter(letter) {
  const value = (letter || "").trim().toUpperCase();
  if (value.startsWith("A")) return 0;
  if (value.startsWith("B")) return 1;
  if (value.startsWith("C")) return 2;
  if (value.startsWith("D")) return 3;
  return 0;
}

function dbRowToAkte(row) {
  const fallback = fallbackAkten.find(a => a.title === row.titel) || fallbackAkten.find(a => a.id === row.id) || {};
  const typ = row.typ || fallback.type || "mc";
  const answers = [row.antwort_a, row.antwort_b, row.antwort_c, row.antwort_d]
    .filter(answer => answer !== null && answer !== undefined && String(answer).trim() !== "");

  let akte = { ...fallback };
  akte.id = row.id;
  akte.title = row.titel || fallback.title;
  akte.type = typ;
  akte.dialog = row.nova_dialog || fallback.dialog || "";
  akte.evidenceType = row.evidence_type || fallback.evidenceType || "html";
  akte.question = row.frage || fallback.question || "";
  akte.learningTitle = fallback.learningTitle || "Gelernt";
  akte.learningText = row.erklaerung || fallback.learningText || "";
  akte.image = row.bild_datei || fallback.image || "";

  if (typ === "mc" || typ === "imageCompare") {
    const correctIndex = parseCorrectLetter(row.richtige_antwort);
    akte.options = answers.map((text, index) => ({
      text,
      correct: index === correctIndex
    }));
  }

  if (typ === "ampel") {
    akte.choices = answers.map((text, index) => ({
      label: text,
      color: index === 0 ? "green" : index === 1 ? "yellow" : "red",
      correct:
        String(row.richtige_antwort || "").toLowerCase().includes(String(text).toLowerCase()) ||
        String(row.richtige_antwort || "").toUpperCase().startsWith(["A", "B", "C", "D"][index])
    }));
  }

  return akte;
}

async function loadAktenFromDatabase() {
  const client = getSupabaseClient();

  if (!client) {
    console.warn("Supabase konnte nicht geladen werden. Fallback-Akten werden genutzt.");
    return fallbackAkten;
  }

  const { data, error } = await client
    .from("quiz_cases")
    .select("*")
    .eq("aktiv", true);

  if (error) {
    console.error("Akten konnten nicht aus Supabase geladen werden:", error);
    return fallbackAkten;
  }

  if (!data || data.length === 0) {
    console.warn("Keine Akten in Supabase gefunden. Fallback-Akten werden genutzt.");
    return fallbackAkten;
  }

  return data.map(dbRowToAkte);
}


;

const startBtn = document.getElementById('start-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const quizSection = document.getElementById('quiz-section');
const definitionSection = document.getElementById('definition-section');
const whySection = document.getElementById('why-important');
const introExtraSections = document.querySelectorAll('.intro-extra');
const profileSection = document.querySelector('.nova-profile');
const startArea = document.querySelector('.start-area');
const mainContainer = document.getElementById('main-container');
const hero = document.getElementById('hero');
const resultSection = document.getElementById('result-section');
const akteNumber = document.getElementById('akte-number');
const akteTitle = document.getElementById('akte-title');
const novaDialog = document.getElementById('nova-dialog');
const evidenceContainer = document.getElementById('evidence-container');
const questionText = document.getElementById('question-text');
const interactionContainer = document.getElementById('interaction-container');
const learningBlock = document.getElementById('learning-block');
const learningTitle = document.getElementById('learning-title');
const learningText = document.getElementById('learning-text');
const progressFill = document.getElementById('progress-fill');
const progressIcon = document.getElementById('progress-icon');
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const introVideoSection = document.getElementById('intro-video-section');
const introVideo = document.getElementById('intro-video');
const firstCaseBtn = document.getElementById('first-case-btn');

let currentAkte = 0;
let quizAkten = [];
const maxFaelleProRunde = 10;
let musicRunning = false;
let correctAnswers = 0;
let wrongAnswers = 0;
let answerLog = [];

bgMusic.loop = true;

startBtn.addEventListener('click', () => {
  definitionSection.classList.add('hidden');
  whySection.classList.add('hidden');
  introExtraSections.forEach(section => section.classList.add('hidden'));
  profileSection.classList.add('hidden');
  startArea.classList.add('hidden');
  introVideoSection.classList.remove('hidden');
  introVideoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (introVideo) {
    introVideo.currentTime = 0;
    introVideo.play().catch(() => {});
  }

  bgMusic.volume = 0.12;
  bgMusic.play().then(() => {
    musicRunning = true;
  }).catch(() => {});
});

firstCaseBtn.addEventListener('click', () => {
  startMissionAfterIntro();
});

if (introVideo) {
  introVideo.addEventListener('ended', () => {
    firstCaseBtn.classList.add('pulse-ready');
    firstCaseBtn.focus();
  });
}

async function startMissionAfterIntro() {
  await prepareRandomQuiz();
  introVideoSection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  loadAkte();
  quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (introVideo) introVideo.pause();
}

musicToggle.addEventListener('click', () => {
  if (musicRunning) {
    bgMusic.pause();
    musicRunning = false;
    musicToggle.style.color = '#b9584d';
  } else {
    bgMusic.play().then(() => {
      musicRunning = true;
      musicToggle.style.color = '';
    }).catch(() => {});
  }
});

prevBtn.addEventListener('click', () => {
  if (currentAkte > 0) {
    currentAkte -= 1;
    loadAkte();
  }
});

nextBtn.addEventListener('click', () => {
  currentAkte += 1;
  if (currentAkte < quizAkten.length) {
    loadAkte();
  } else {
    progressFill.style.width = '100%';
    progressIcon.style.left = '100%';
    setTimeout(() => {
      hero.classList.add('hidden');
      mainContainer.classList.add('hidden');
      resultSection.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 250);
  }
});


async function prepareRandomQuiz() {
  currentAkte = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  answerLog = [];

  const loadedAkten = await loadAktenFromDatabase();

  // Aus Supabase werden zufällig 10 Akten gezogen.
  quizAkten = shuffleArray(loadedAkten).slice(0, Math.min(maxFaelleProRunde, loadedAkten.length));
}

function loadAkte() {
  const akte = quizAkten[currentAkte];

  learningBlock.classList.add('hidden');
  interactionContainer.innerHTML = '';
  evidenceContainer.innerHTML = '';

  prevBtn.classList.toggle('hidden', currentAkte === 0);
  akteNumber.textContent = `${currentAkte + 1}/${quizAkten.length}`;
  akteTitle.textContent = akte.title;
  novaDialog.textContent = akte.dialog;
  questionText.textContent = akte.question;

  const progress = (currentAkte / quizAkten.length) * 100;
  progressFill.style.width = `${progress}%`;
  progressIcon.style.left = `${progress}%`;

  renderEvidence(akte);

  if (akte.type === 'mc') renderMC(akte);
  if (akte.type === 'dragdrop') renderDragdrop(akte);
  if (akte.type === 'hotspot') renderHotspot(akte);
  if (akte.type === 'imageCompare') renderImageCompare(akte);
  if (akte.type === 'feedSelect') renderFeedSelect(akte);
  if (akte.type === 'ampel') renderAmpel(akte);
}

function renderEvidence(akte) {
  if (akte.evidenceType === 'html') {
    evidenceContainer.innerHTML = akte.evidence;
    return;
  }

  if (akte.evidenceType === 'imageCompare') {
    evidenceContainer.innerHTML = `
      <div class="compare-widget">
        <div class="compare-help">Ziehe den Regler nach links und rechts.</div>
        <div class="compare-stage" id="compare-stage">
          <div class="compare-image compare-before">
            <div class="sky"></div><div class="sun"></div><div class="building"></div><div class="tree"></div><div class="person-one"></div><div class="person-two"></div>
            <span class="compare-label before-label">Original</span>
          </div>
          <div class="compare-image compare-after" id="compare-after">
            <div class="sky dramatic"></div><div class="smoke smoke-one"></div><div class="smoke smoke-two"></div><div class="building"></div><div class="tree muted-tree"></div><div class="person-one hidden-person"></div><div class="fake-text">EILMELDUNG</div>
            <span class="compare-label after-label">Manipuliert</span>
          </div>
          <div class="compare-handle" id="compare-handle"></div>
        </div>
        <input class="compare-slider" id="compare-slider" type="range" min="0" max="100" value="52" aria-label="Vorher Nachher Regler" />
      </div>`;
    return;
  }

  if (akte.evidenceType === 'feedSelect') {
    evidenceContainer.innerHTML = `<div class="feed-phone" id="feed-phone"></div>`;
    return;
  }

  if (akte.evidenceType === 'ampel') {
    evidenceContainer.innerHTML = `
      <div class="ampel-card">
        <div class="ampel-lights"><span></span><span></span><span></span></div>
        <div class="ampel-post">
          <strong>${akte.postTitle}</strong>
          <small>${akte.postMeta}</small>
          <p>${akte.postText}</p>
        </div>
      </div>`;
    return;
  }

  if (akte.evidenceType === 'hotspot') {
    const wrapper = document.createElement('div');
    wrapper.className = 'hotspot-wrapper';
    wrapper.innerHTML = `
      <div class="hotspot-stage" id="hotspot-stage">
        <img src="${akte.image}" alt="Hinweisbild fuer Akte 3" />
      </div>
      <div class="hotspot-status" id="hotspot-status">0 / ${akte.hotspots.length} Hinweise gefunden</div>
      <div class="hint-list" id="hint-list"></div>
    `;
    evidenceContainer.appendChild(wrapper);
  }
}

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function renderMC(akte) {
  const randomizedOptions = shuffleArray(akte.options);
  randomizedOptions.forEach(option => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = option.text;
    button.addEventListener('click', () => {
      const buttons = interactionContainer.querySelectorAll('.option-btn');
      buttons.forEach(btn => btn.disabled = true);

      if (option.correct) {
        button.classList.add('correct');
      } else {
        button.classList.add('wrong');
        const correctButton = Array.from(buttons).find(btn => btn.textContent === akte.options.find(opt => opt.correct).text);
        if (correctButton) correctButton.classList.add('correct');
      }
      showLearning(akte);
    });
    interactionContainer.appendChild(button);
  });
}

function renderDragdrop(akte) {
  const list = document.createElement('div');
  list.className = 'interaction-container';
  const items = [...akte.items].sort(() => Math.random() - 0.5);

  items.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'option-btn draggable-row';
    row.draggable = true;
    row.innerHTML = `<strong>${index + 1}.</strong> <span>${item}</span>`;

    row.addEventListener('dragstart', () => row.classList.add('dragging'));
    row.addEventListener('dragend', () => {
      row.classList.remove('dragging');
      renumber(list);
    });

    list.appendChild(row);
  });

  list.addEventListener('dragover', event => {
    event.preventDefault();
    const after = getAfterElement(list, event.clientY);
    const dragging = list.querySelector('.dragging');
    if (!dragging) return;
    if (!after) list.appendChild(dragging);
    else list.insertBefore(dragging, after);
  });

  const checkBtn = document.createElement('button');
  checkBtn.className = 'btn btn-primary';
  checkBtn.textContent = 'Reihenfolge pruefen';
  checkBtn.addEventListener('click', () => {
    const current = Array.from(list.querySelectorAll('span')).map(el => el.textContent);
    if (JSON.stringify(current) === JSON.stringify(akte.correctOrder)) {
      showLearning(akte);
      checkBtn.textContent = 'Richtig geloest';
      checkBtn.disabled = true;
    } else {
      checkBtn.textContent = 'Noch nicht ganz - versuch es nochmal';
      setTimeout(() => { checkBtn.textContent = 'Reihenfolge pruefen'; }, 1600);
    }
  });

  interactionContainer.appendChild(list);
  interactionContainer.appendChild(checkBtn);
}

function getAfterElement(container, y) {
  const rows = [...container.querySelectorAll('.draggable-row:not(.dragging)')];
  return rows.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function renumber(container) {
  [...container.querySelectorAll('.draggable-row')].forEach((row, index) => {
    const strong = row.querySelector('strong');
    if (strong) strong.textContent = `${index + 1}.`;
  });
}

function renderHotspot(akte) {
  const stage = document.getElementById('hotspot-stage');
  const status = document.getElementById('hotspot-status');
  const hintList = document.getElementById('hint-list');

  let found = 0;

  akte.hotspots.forEach((spot, index) => {
    const hit = document.createElement('button');
    hit.type = 'button';
    hit.className = 'hotspot-hit';
    hit.style.top = spot.top;
    hit.style.left = spot.left;
    hit.style.width = spot.width;
    hit.style.height = spot.height;
    hit.setAttribute('aria-label', spot.title);
    hit.innerHTML = `<span class="hotspot-badge">✓</span>`;

    hit.addEventListener('click', () => {
      if (hit.classList.contains('found')) return;
      hit.classList.add('found');
      found += 1;
      status.textContent = `${found} / ${akte.hotspots.length} Hinweise gefunden`;

      const item = document.createElement('div');
      item.className = 'hint-item';
      item.innerHTML = `<strong>${spot.title}:</strong> ${spot.explanation}`;
      hintList.appendChild(item);

      if (found === akte.hotspots.length) {
        status.textContent = `Alle ${akte.hotspots.length} Hinweise gefunden`;
        showLearning(akte);
      }
    });

    stage.appendChild(hit);
  });

  interactionContainer.innerHTML = '<div class="hint-item"><strong>Tipp:</strong> Suche nach uebertriebener Sprache, einer fragwuerdigen Quelle und einer manipulativen Aufforderung.</div>';
}


function renderImageCompare(akte) {
  const slider = document.getElementById('compare-slider');
  const after = document.getElementById('compare-after');
  const handle = document.getElementById('compare-handle');

  function updateCompare(value) {
    after.style.clipPath = `inset(0 0 0 ${value}%)`;
    handle.style.left = `${value}%`;
  }

  updateCompare(slider.value);
  slider.addEventListener('input', () => updateCompare(slider.value));
  renderMC(akte);
}

function renderFeedSelect(akte) {
  const phone = document.getElementById('feed-phone');
  const needed = akte.requiredCorrect || akte.posts.filter(post => post.correct).length;
  let foundCorrect = 0;
  let clickedWrong = false;

  phone.innerHTML = `
    <div class="feed-topbar">Nova Social</div>
    <div class="feed-instruction">Scrolle durch den Feed und markiere ${needed} verdaechtige Beitraege.</div>
  `;

  akte.posts.forEach((post, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'feed-post';
    card.innerHTML = `
      <span class="feed-post-number">Post ${index + 1}</span>
      <strong>${post.title}</strong>
      <small>${post.meta}</small>
      <p>${post.text}</p>
      <em class="feed-hint hidden">${post.hint}</em>
    `;

    card.addEventListener('click', () => {
      if (card.classList.contains('selected')) return;
      card.classList.add('selected');

      const hint = card.querySelector('.feed-hint');
      if (hint) hint.classList.remove('hidden');

      if (post.correct) {
        card.classList.add('correct');
        foundCorrect += 1;
      } else {
        card.classList.add('wrong');
        clickedWrong = true;
      }

      const status = document.getElementById('feed-status');
      if (status) {
        status.textContent = `${foundCorrect} / ${needed} verdaechtige Beitraege gefunden`;
      }

      if (foundCorrect === needed) {
        phone.querySelectorAll('.feed-post').forEach((item, idx) => {
          item.disabled = true;
          const matchingPost = akte.posts[idx];
          const itemHint = item.querySelector('.feed-hint');
          if (itemHint) itemHint.classList.remove('hidden');
          if (matchingPost.correct) item.classList.add('correct');
        });
        if (status) {
          status.textContent = clickedWrong
            ? `Alle ${needed} Fake-Posts gefunden - schau dir die Hinweise nochmal genau an.`
            : `Perfekt: Alle ${needed} Fake-Posts gefunden.`;
        }
        showLearning(akte);
      }
    });

    phone.appendChild(card);
  });

  interactionContainer.innerHTML = `<div class="hint-item" id="feed-status"><strong>Aufgabe:</strong> 0 / ${needed} verdaechtige Beitraege gefunden</div>`;
}

function renderAmpel(akte) {
  akte.choices.forEach(choice => {
    const button = document.createElement('button');
    button.className = `option-btn ampel-choice ${choice.color}`;
    button.textContent = choice.label;
    button.addEventListener('click', () => {
      const buttons = interactionContainer.querySelectorAll('.option-btn');
      buttons.forEach(btn => btn.disabled = true);
      if (choice.correct) {
        button.classList.add('correct');
      } else {
        button.classList.add('wrong');
        const correct = Array.from(buttons).find(btn => btn.textContent === akte.choices.find(c => c.correct).label);
        if (correct) correct.classList.add('correct');
      }
      showLearning(akte);
    });
    interactionContainer.appendChild(button);
  });
}


function recordCaseResult(akte, isCorrect, selectedAnswer) {
  const alreadyRecorded = answerLog.some(entry => entry.title === akte.title);
  if (alreadyRecorded) return;

  if (isCorrect) correctAnswers += 1;
  else wrongAnswers += 1;

  answerLog.push({
    title: akte.title,
    type: akte.type,
    correct: isCorrect,
    selected_answer: selectedAnswer || null
  });
}

function calculateRank(scorePercent) {
  if (scorePercent >= 90) return "Meister-Detektiv";
  if (scorePercent >= 75) return "Profi-Ermittler";
  if (scorePercent >= 50) return "Spurensucher";
  return "Detektiv-Anwärter";
}

function showScoreOverview() {
  const totalCases = quizAkten.length;
  const scorePercent = totalCases > 0 ? Math.round((correctAnswers / totalCases) * 100) : 0;
  const rank = calculateRank(scorePercent);

  if (scoreBig) scoreBig.textContent = `${correctAnswers} / ${totalCases} richtig`;
  if (scoreRank) scoreRank.textContent = `Rang: ${rank}`;
  if (scoreBarFill) scoreBarFill.style.width = `${scorePercent}%`;

  if (scoreDetails) {
    scoreDetails.innerHTML = answerLog.map((entry, index) => `
      <div class="score-detail-item ${entry.correct ? 'is-correct' : 'is-wrong'}">
        <span>${index + 1}</span>
        <strong>${entry.title}</strong>
        <em>${entry.correct ? 'richtig' : 'nicht ganz richtig'}</em>
      </div>
    `).join('');
  }

  if (databaseStatus) {
    databaseStatus.textContent = "Die Fragen wurden aus Supabase geladen. Dein Ergebnis wird nur angezeigt und nicht gespeichert.";
  }

  if (scoreOverviewSection) {
    scoreOverviewSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    resultSection.classList.remove('hidden');
  }
}


function showLearning(akte) {
  learningTitle.textContent = akte.learningTitle;
  learningText.textContent = akte.learningText;
  learningBlock.classList.remove('hidden');
  learningBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
