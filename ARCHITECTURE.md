# 🏗️ Architektura LottoWizard - Proste Wyjaśnienie

## 📚 Spis treści

1. [Jak działa cały system?](#jak-działa-cały-system)
2. [Przepływ danych](#przepływ-danych)
3. [Dlaczego tak, a nie inaczej?](#dlaczego-tak-a-nie-inaczej)
4. [Co się dzieje gdy otworzysz stronę?](#co-się-dzieje-gdy-otworzysz-stronę)

---

## 🎯 Jak działa cały system?

### Wyobraź sobie że to FABRYKA:

```
┌─────────────────────────────────────────────────────────┐
│                      FABRYKA LOTOWIZARD                 │
└─────────────────────────────────────────────────────────┘

📦 SUROWCE (Input):
   └── wyniki_lotto.json (333 losowania)

🏭 LINIA PRODUKCYJNA (Processing):
   ├── 1. Załaduj dane z JSON
   ├── 2. Policz statystyki (lib/statystyki.ts)
   ├── 3. Wygeneruj zestawy (algorytmy)
   └── 4. Przygotuj wszystko do wyświetlenia

🎁 GOTOWE PRODUKTY (Output):
   ├── Hero Section (3 gotowe zestawy)
   ├── Statystyki (gorące/zimne)
   ├── Wykresy
   └── Tabele

👤 KLIENT (User):
   └── Otwiera stronę i widzi gotowe dane!
```

---

## 🔄 Przepływ danych (krok po kroku)

### KROK 1: Użytkownik wchodzi na stronę

```
http://localhost:3000
         ↓
    Next.js Router
         ↓
    pages/index.tsx
```

### KROK 2: Next.js buduje stronę (SSG - Static Site Generation)

```javascript
// pages/index.tsx

export async function getStaticProps() {
  // 📂 1. Załaduj dane z JSON
  const dane = await fs.readFile("wyniki_lotto.json")
  const losowania = JSON.parse(dane)

  // 📊 2. Oblicz statystyki
  const czestotliwosci = obliczCzestotliwoscLiczb(losowania)
  const { gorace, zimne } = znajdzGoraceIZimne(czestotliwosci)

  // 🎲 3. Wygeneruj zestawy dla HERO
  const heroPredictions = {
    mieszany: generujMieszany(czestotliwosci), // np. [5, 9, 17, 25, 36, 49]
    gorace: generujNaPodstawieCzestych(czestotliwosci), // np. [2, 12, 17, 20, 36, 49]
    balans: generujZBalansem(), // np. [3, 15, 27, 10, 22, 48]
  }

  // 📦 4. Zwróć wszystko jako props
  return {
    props: {
      losowania,
      czestotliwosci,
      gorace,
      zimne,
      heroPredictions, // ← TO JEST KLUCZOWE!
    },
  }
}
```

**⚡ WAŻNE:** Ten kod wykonuje się **NA SERWERZE** przy budowaniu (`npm run build`), NIE w przeglądarce!

### KROK 3: Strona otrzymuje dane i renderuje komponenty

```javascript
// pages/index.tsx

export default function HomePage({
  losowania,
  czestotliwosci,
  gorace,
  zimne,
  heroPredictions, // ← Gotowe zestawy z serwera!
}) {
  return (
    <>
      {/* 1. HERO - pokazuje gotowe zestawy */}
      <PredictionsHero
        mieszanyZestaw={heroPredictions.mieszany}
        goraceZestaw={heroPredictions.gorace}
        balansZestaw={heroPredictions.balans}
      />

      {/* 2. Generator - użytkownik może generować więcej */}
      <NumberGenerator czestotliwosci={czestotliwosci} />

      {/* 3. Statystyki - wykres, panele */}
      <HotColdPanel gorace={gorace} zimne={zimne} />
      <FrequencyChart czestotliwosci={czestotliwosci} />
    </>
  )
}
```

### KROK 4: Komponenty wyświetlają dane

```javascript
// components/hero/PredictionsHero.tsx

export default function PredictionsHero({
  mieszanyZestaw, // [5, 9, 17, 25, 36, 49]
  goraceZestaw, // [2, 12, 17, 20, 36, 49]
  balansZestaw, // [3, 15, 27, 10, 22, 48]
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <h3>Analiza Mieszana (Rekomendowane)</h3>
        {mieszanyZestaw.map((liczba) => (
          <span>{liczba}</span>
        ))}
      </Card>

      <Card>
        <h3>Gorące Liczby</h3>
        {goraceZestaw.map((liczba) => (
          <span>{liczba}</span>
        ))}
      </Card>

      <Card>
        <h3>Balans P/N</h3>
        {balansZestaw.map((liczba) => (
          <span>{liczba}</span>
        ))}
      </Card>
    </div>
  )
}
```

---

## 🧠 Dlaczego tak, a nie inaczej?

### ❓ Dlaczego generujemy liczby w `getStaticProps`, a nie w komponencie?

**PROBLEM (stare podejście):**

```javascript
// ❌ ŹLE - generowanie w komponencie

function PredictionsHero({ czestotliwosci }) {
  const mieszany = generujMieszany(czestotliwosci)  // ← PROBLEM!

  return <div>{mieszany.map(...)}</div>
}
```

**Co się dzieje?**

1. Serwer renderuje komponent → generuje liczby → np. `[1, 2, 3, 4, 5, 6]`
2. Wysyła HTML do przeglądarki
3. Przeglądarka renderuje komponent PONOWNIE → generuje **INNE** liczby → np. `[7, 8, 9, 10, 11, 12]`
4. **💥 HYDRATION ERROR!** - serwer i przeglądarka mają różne dane!

**ROZWIĄZANIE (nowe podejście):**

```javascript
// ✅ DOBRZE - generowanie na serwerze

export async function getStaticProps() {
  const mieszany = generujMieszany(czestotliwosci)  // ← Raz, na serwerze
  return { props: { heroPredictions: { mieszany } } }
}

function PredictionsHero({ mieszanyZestaw }) {  // ← Tylko wyświetla
  return <div>{mieszanyZestaw.map(...)}</div>
}
```

**Teraz:**

1. Serwer generuje liczby → `[1, 2, 3, 4, 5, 6]`
2. Wysyła do przeglądarki
3. Przeglądarka **NIE GENERUJE** ponownie, tylko wyświetla to samo
4. ✅ Działa!

---

### ❓ Dlaczego używamy SSG (Static Site Generation)?

**Alternatywy:**

| Metoda                           | Kiedy się wykonuje     | Zalety                  | Wady                                |
| -------------------------------- | ---------------------- | ----------------------- | ----------------------------------- |
| **SSR** (Server-Side Rendering)  | Przy każdym requestcie | Zawsze aktualne dane    | Wolne, obciąża serwer               |
| **CSR** (Client-Side Rendering)  | W przeglądarce         | Szybkie dla użytkownika | Wolne pierwsze ładowanie            |
| **SSG** (Static Site Generation) | Raz przy build         | SZYBKIE ⚡, tanie 💰    | Trzeba rebuild gdy dane się zmienią |

**Dlaczego wybraliśmy SSG?**

✅ Dane się NIE ZMIENIAJĄ często (dodajemy nowe losowania raz na kilka dni)
✅ Strona jest MEGA SZYBKA (HTML gotowy z góry)
✅ Można hostować za darmo (Vercel, Netlify)
✅ Nie trzeba serwera Node.js 24/7

---

### ❓ Dlaczego shadcn/ui, a nie zwykły CSS?

**shadcn/ui:**

- ✅ Gotowe komponenty (Card, Button, Badge)
- ✅ Accessibility (dostępność dla niepełnosprawnych)
- ✅ Spójny design system
- ✅ Łatwy dark mode
- ✅ Możesz edytować kod komponentu (nie black box)

**Zwykły CSS:**

- ❌ Musisz wszystko pisać od zera
- ❌ Brak accessibility
- ❌ Trudne utrzymanie
- ❌ Każdy przycisk może wyglądać inaczej

---

## 🎬 Co się dzieje gdy otworzysz stronę?

### Scenariusz A: Pierwszy raz (po `npm run build`)

```
1. Next.js czyta wyniki_lotto.json
2. Wywołuje wszystkie funkcje w lib/statystyki.ts
3. Generuje 3 zestawy dla HERO
4. Tworzy statyczny plik HTML
5. Zapisuje go w folderze .next/

Czas: ~3 sekundy
```

### Scenariusz B: Użytkownik otwiera stronę

```
1. Serwer wysyła gotowy HTML (z folderu .next/)
2. Przeglądarka wyświetla stronę

Czas: ~100ms ⚡ MEGA SZYBKO!
```

### Scenariusz C: Użytkownik klika "Generuj" w NumberGenerator

```
1. Komponent wywołuje generujMieszany() w przeglądarce
2. Generuje nowy zestaw [3, 7, 15, 22, 35, 49]
3. Aktualizuje state React
4. Przeglądarka renderuje nowe liczby

Czas: ~10ms (natychmiastowo)
```

---

## 📁 Struktura katalogów - DIAGRAM

```
lotto-wizard/
│
├── 📄 pages/                  ← STRONY (routing Next.js)
│   ├── index.tsx              ← "/" - strona główna
│   │   ├── getStaticProps()   ← Generuje dane na serwerze
│   │   └── HomePage()         ← Renderuje komponenty
│   │
│   └── archiwum.tsx           ← "/archiwum" - tabela losowań
│
├── 🧩 components/             ← KOMPONENTY (kawałki UI)
│   ├── hero/
│   │   └── PredictionsHero    ← TYLKO WYŚWIETLA (nie generuje!)
│   │
│   ├── dashboard/
│   │   ├── NumberGenerator    ← Generuje interaktywnie (client-side)
│   │   ├── HotColdPanel       ← Wyświetla gorące/zimne
│   │   ├── FrequencyChart     ← Wykres słupkowy
│   │   └── AnalyticsPanels    ← Panele z analizami
│   │
│   ├── layout/
│   │   └── Header             ← Menu (mobile hamburger)
│   │
│   └── ui/                    ← shadcn/ui (Card, Button, Badge...)
│
├── 🧠 lib/                    ← LOGIKA BIZNESOWA (matematyka!)
│   └── statystyki.ts          ← WSZYSTKIE ALGORYTMY
│       ├── obliczCzestotliwoscLiczb()
│       ├── znajdzGoraceIZimne()
│       ├── generujMieszany()         ← 3 gorące + 3 zimne
│       ├── generujNaPodstawieCzestych() ← 6 gorących
│       ├── generujZBalansem()        ← 3P + 3N
│       ├── analizujParzysteNieparzyste()
│       └── analizujSumyLosowan()
│
├── 📦 public/data/            ← DANE (input!)
│   └── wyniki_lotto.json      ← 333 losowania
│
└── 🎨 styles/                 ← WYGLĄD
    └── globals.css            ← Tailwind + shadcn tokens
```

---

## 🔧 Jak dodać nową funkcję? (przykład)

### Przykład: Chcesz dodać "Statystyka Różnic" między liczbami

#### 1️⃣ Dodaj funkcję do `lib/statystyki.ts`

```typescript
// lib/statystyki.ts

export function analizujRoznice(losowania: Losowanie[]) {
  const roznice: number[] = []

  losowania.forEach((losowanie) => {
    const liczby = losowanie.liczby.sort((a, b) => a - b)

    // Policz różnice między kolejnymi liczbami
    for (let i = 0; i < liczby.length - 1; i++) {
      const roznica = liczby[i + 1] - liczby[i]
      roznice.push(roznica)
    }
  })

  // Oblicz średnią różnicę
  const sredniaRoznica = roznice.reduce((a, b) => a + b, 0) / roznice.length

  return {
    wszystkieRoznice: roznice,
    srednia: Math.round(sredniaRoznica * 10) / 10,
  }
}
```

#### 2️⃣ Użyj w `getStaticProps`

```typescript
// pages/index.tsx

export async function getStaticProps() {
  // ... istniejący kod ...

  const roznice = analizujRoznice(losowania) // ← Nowa funkcja!

  return {
    props: {
      // ... istniejące props ...
      roznice, // ← Nowy prop!
    },
  }
}
```

#### 3️⃣ Stwórz komponent

```typescript
// components/dashboard/DifferencesPanel.tsx

interface DifferencesPanelProps {
  roznice: {
    wszystkieRoznice: number[]
    srednia: number
  }
}

export default function DifferencesPanel({ roznice }: DifferencesPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statystyka Różnic</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Średnia różnica między liczbami: {roznice.srednia}</p>
      </CardContent>
    </Card>
  )
}
```

#### 4️⃣ Dodaj do strony głównej

```typescript
// pages/index.tsx

export default function HomePage({ roznice, ...rest }) {
  return (
    <>
      {/* ... istniejące komponenty ... */}
      <DifferencesPanel roznice={roznice} /> {/* ← Nowy panel! */}
    </>
  )
}
```

#### 5️⃣ Restart serwera

```bash
# Zatrzymaj serwer (Ctrl+C)
# Usuń cache
Remove-Item -Recurse -Force .next
# Uruchom ponownie
npm run dev
```

**GOTOWE!** 🎉

---

## 🎓 Kluczowe zasady

### ✅ CO JEST GDZIE:

| Typ kodu                | Gdzie               | Przykład                    |
| ----------------------- | ------------------- | --------------------------- |
| **Logika matematyczna** | `lib/statystyki.ts` | `generujMieszany()`         |
| **Routing/Strony**      | `pages/`            | `index.tsx`, `archiwum.tsx` |
| **Komponenty UI**       | `components/`       | `PredictionsHero.tsx`       |
| **Dane statyczne**      | `public/data/`      | `wyniki_lotto.json`         |
| **Typy TypeScript**     | `types/`            | `interface Losowanie`       |
| **Style**               | `styles/`           | `globals.css`               |

### ✅ PRZEPŁYW DANYCH:

```
JSON → getStaticProps → Strona → Komponenty → UI
```

### ✅ GENEROWANIE LOSOWE:

- **W getStaticProps** → dla HERO (jeden raz, na serwerze)
- **W komponencie** → dla NumberGenerator (interaktywnie, na żądanie)

### ✅ KOMPONENTY:

- **"Głupie"** (Dumb) → tylko wyświetlają dane (np. PredictionsHero)
- **"Mądre"** (Smart) → mają state, generują dane (np. NumberGenerator)

---

## 🚀 Podsumowanie

1. **Dane** są w `wyniki_lotto.json`
2. **Funkcje** są w `lib/statystyki.ts`
3. **Strony** są w `pages/`
4. **Komponenty** są w `components/`
5. **Next.js** generuje statyczny HTML przy build
6. **shadcn/ui** dostarcza komponenty

**To tyle!** Masz pytania? Czytaj FAQ w README.md! 🎉
