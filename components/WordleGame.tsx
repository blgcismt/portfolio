"use client";

export const WORDS_EN = [
  "apple","beach","beard","birth","black","blade","blame","blood","bloom","board",
  "bonus","bored","bound","brain","brave","break","brick","bride","brief","bring",
  "brush","buddy","burst","candy","catch","cause","chain","charm","chase","cheap",
  "check","chess","chest","child","chill","claim","clean","clear","cliff","climb",
  "clock","cloth","cloud","coach","coast","comic","count","court","cover","crack",
  "craft","crane","crash","crazy","crowd","crown","cruel","crush","curve","cycle",
  "dance","depth","dirty","doubt","drain","drama","dread","drink","drive","drunk",
  "eagle","early","earth","eight","empty","enemy","enjoy","enter","equal","error",
  "event","every","exact","extra","faint","fairy","faith","false","fancy","feast",
  "fence","field","first","flame","flash","flesh","flood","floor","focus","force",
  "forge","frame","fresh","ghost","given","glass","glide","gloom","gloss","glove",
  "grace","grain","grasp","grass","grave","great","greed","green","greet","grief",
  "group","guard","guide","habit","happy","harsh","heart","heavy","honey","honor",
  "house","human","ideal","judge","juice","karma","knife","knock","known","label",
  "laser","laugh","layer","learn","leave","level","light","limit","lives","logic",
  "lover","lower","lucky","magic","major","maker","match","medal","merit","mercy",
  "metal","might","minor","mixed","money","month","moral","mount","mouse","mouth",
  "nerve","night","noble","noise","north","novel","ocean","offer","often","olive",
  "orbit","order","outer","paint","panic","paste","pause","peace","pitch","place",
  "plain","plane","plant","plate","point","pound","power","press","price","pride",
  "print","prize","proof","proud","pulse","queen","quest","quick","quiet","quote",
  "rally","ranch","range","rapid","reach","rebel","reply","rider","right","rival",
  "river","rocky","rough","round","royal","ruler","sauce","scale","scene","scout",
  "sense","serve","seven","shake","shame","shape","shark","sharp","shelf","shell",
  "shift","shine","shirt","shout","sight","skill","skull","slash","slate","slave",
  "sleep","slice","slide","smile","snake","sneak","solar","solve","sorry","south",
  "spark","spawn","speak","spear","spend","spite","split","spray","stare","stark",
  "start","steak","steam","steel","stern","stick","stiff","still","stomp","stood",
  "storm","sunny","super","surge","swamp","swear","sweat","sweep","sweet","swift",
  "swing","sword","table","taste","tense","thank","thick","thing","think","thorn",
  "three","tiger","tired","toast","today","touch","tough","track","trade","trail",
  "train","trend","trial","tribe","trick","truck","trust","truth","twice","twist",
  "under","union","until","upper","upset","usual","value","vault","verse","video",
  "vital","vivid","voice","watch","water","weary","weave","weird","wheat","wheel",
  "while","white","whole","woman","worry","worse","worst","worth","write","young",
];

export const WORDS_TR = [
  "kitap","kalem","araba","deniz","haber","resim","yemek","bilgi","nehir","uzman",
  "orman","insan","hayat","sabah","erkek","paket","fikir","dergi","kural","yazar",
  "şehir","müzik","güzel","köpek","çocuk","büyük","küçük","çanta","balık","doğru",
  "bölüm","yüzük","köprü","yarış","akşam","şeker","çiçek","şarkı","sınıf","fırın",
  "tabak","kanat","simit","asker","temel","sebze","meyve","takım","geçit","keman",
  "beyin","sevgi","tablo","müdür","özgür","başka","ekmek","zaman","kadın","bebek",
  "mutlu","korku","siyah","beyaz","yeşil","hafta","fiyat","hesap","kahve","güneş",
  "bulut","pembe","altın","bakır","demir","dünya","şapka","çorap","tatlı","börek",
  "pilav","dolma","çorba","bahçe","armut","kiraz","kavun","çilek","soğan","biber",
  "havuç","nohut","tavuk","koyun","aslan","tilki","karga","böcek","yunus","bacak",
  "boyun","burun","kulak","dudak","sıcak","soğuk","radyo","tenis","saray","roman",
];

export type Color = "green" | "yellow" | "gray" | "empty";
export interface GuessRow { letters: string[]; colors: Color[]; }

export function getColors(guess: string[], answer: string[]): Color[] {
  const colors: Color[] = Array(answer.length).fill("gray");
  const remaining = [...answer];
  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) { colors[i] = "green"; remaining[i] = ""; }
  }
  for (let i = 0; i < answer.length; i++) {
    if (colors[i] === "green") continue;
    const idx = remaining.indexOf(guess[i]);
    if (idx !== -1) { colors[i] = "yellow"; remaining[idx] = ""; }
  }
  return colors;
}

const BG: Record<Color, string> = { green: "#538d4e", yellow: "#b59f3b", gray: "#3a3a3c", empty: "transparent" };
const BORDER_C: Record<Color, string> = { green: "#538d4e", yellow: "#b59f3b", gray: "#3a3a3c", empty: "var(--border)" };
const TEXT_C: Record<Color, string> = { green: "#fff", yellow: "#fff", gray: "#fff", empty: "var(--text)" };

interface Props {
  lang: "en" | "tr";
  answer: string;
  guesses: GuessRow[];
  currentInput: string;
  gameOver: boolean;
  won: boolean;
  error: string;
  streak: number;
}

export default function WordleGame({ lang, answer, guesses, currentInput, gameOver, won, error, streak }: Props) {
  const wordLen = Array.from(answer).length;
  const MAX = 6;

  return (
    <div style={{ fontFamily: "monospace" }}>
      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
        wordle <span style={{ color: "var(--accent)" }}>[{lang === "en" ? "english" : "turkish"}]</span>
        <span style={{ opacity: 0.5, marginLeft: "1rem" }}>
          daily word · same for everyone · 6 attempts · q quit
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        {Array.from({ length: MAX }, (_, i) => {
          const submitted = guesses[i];
          const isCurrent = i === guesses.length && !gameOver;
          const curChars = Array.from(currentInput).slice(0, wordLen);
          const letters: string[] = submitted
            ? submitted.letters
            : isCurrent
            ? Array.from({ length: wordLen }, (_, j) => curChars[j] ?? "")
            : Array(wordLen).fill("");
          const colors: Color[] = submitted ? submitted.colors : Array(wordLen).fill("empty");

          return (
            <div key={i} style={{ display: "flex", gap: "0.3rem" }}>
              {Array.from({ length: wordLen }, (_, j) => (
                <div
                  key={j}
                  style={{
                    width: "2rem", height: "2rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase",
                    border: `1px solid ${BORDER_C[colors[j]]}`,
                    background: BG[colors[j]],
                    color: TEXT_C[colors[j]],
                    transition: "background 0.15s",
                  }}
                >
                  {letters[j]}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {error && (
        <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#ef4444" }}>{error}</div>
      )}

      {gameOver ? (
        <div style={{ marginTop: "0.75rem", fontSize: "0.8rem" }}>
          {won ? (
            <>
              <span style={{ color: "#34d399" }}>✓ correct in {guesses.length}/{MAX}!</span>
              <span style={{ color: "var(--text-muted)" }}>  streak: </span>
              <span style={{ color: "var(--accent)" }}>{streak}</span>
              {streak > 0 && <span style={{ color: "var(--accent)", opacity: 0.7 }}>  ·  s save streak</span>}
              <span style={{ color: "var(--text-muted)" }}>  ·  q quit</span>
            </>
          ) : (
            <>
              <span style={{ color: "#ef4444" }}>the word was </span>
              <span style={{ color: "var(--accent)" }}>{answer}</span>
              <span style={{ color: "var(--text-muted)" }}>  ·  streak reset  ·  q quit</span>
            </>
          )}
        </div>
      ) : (
        <div style={{ marginTop: "0.5rem", fontSize: "0.7rem", color: "var(--text-muted)", opacity: 0.6 }}>
          type your guess below ↓ and press enter
        </div>
      )}
    </div>
  );
}
