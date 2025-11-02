# LottoWizard 🎲

**Prosta aplikacja do analizy losowań Lotto i generowania zestawów liczb**

Wersja 1.0 MVP | Next.js + TypeScript + shadcn/ui

---

## 🤔 Co to jest?

**LottoWizard** to strona internetowa, która:

1. **Analizuje** historyczne losowania Lotto (333 losowania z 2 lat)
2. **Pokazuje** statystyki (jakie liczby najczęściej wypadają)
3. **Generuje** zestawy 6 liczb na podstawie matematycznych algorytmów

### ⚠️ WAŻNE

To **NIE** jest aplikacja która zagwarantuje wygraną! To narzędzie analityczne do zabawy i nauki statystyki. Każde losowanie Lotto jest losowe i niezależne.

---

## 📖 Jak to działa? (dla laika)

### 1️⃣ **Masz dane historyczne**

W folderze `public/data/wyniki_lotto.json` są zapisane 333 losowania Lotto.

Każde losowanie to:

```
Losowanie #7268 z dnia 2025-10-30
Wylosowane liczby: 3, 10, 15, 30, 31, 49
```

### 2️⃣ **Aplikacja liczy statystyki**

Plik `lib/statystyki.ts` zawiera funkcje które:

- **Zliczają** ile razy każda liczba (1-49) została wylosowana
- **Znajdują** "gorące" liczby (najczęstsze) i "zimne" (najrzadsze)
- **Analizują** czy częściej wypadają parzyste czy nieparzyste
- **Obliczają** średnie sumy 6 liczb

**Przykład:**

```
Liczba 17 wypadła 58 razy (najczęstsza) = "GORĄCA"
Liczba 16 wypadła 29 razy (najrzadsza) = "ZIMNA"
```

### 3️⃣ **Generuje zestawy używając 4 algorytmów**

#### 🔥 **Algorytm 1: Gorące Liczby**

- Bierze 6 liczb z najczęściej losowanych (z top 15)
- Logika: "Skoro często wypadały, może znowu wypadną"

#### ❄️ **Algorytm 2: Zimne Liczby**

- Bierze 6 liczb z najrzadziej losowanych (z bottom 15)
- Logika: "Są wymagalne, powinny w końcu wypaść"

#### 📊 **Algorytm 3: Mieszany** (REKOMENDOWANY)

- Bierze 3 gorące + 3 zimne
- Logika: "Złoty środek - balans między częstymi a rzadkimi"

#### ⚖️ **Algorytm 4: Balans P/N**

- Bierze 3 parzyste + 3 nieparzyste
- Logika: "Statystycznie najczęstszy rozkład w historii"

### 4️⃣ **Wyświetla wszystko na stronie**

Strona główna pokazuje:

- **HERO SECTION** - 3 gotowe zestawy (Mieszany, Gorące, Balans)
- **Statystyki ogólne** - liczba losowań, okres, średnie
- **Generator** - możesz sam generować więcej zestawów
- **Gorące i Zimne liczby** - wizualizacja z rankingami 1,2,3
- **Wykres częstotliwości** - słupki pokazujące jak często każda liczba wypadała
- **Analityka** - rozkłady parzystych/nieparzystych, sumy

---

## 🚀 Jak uruchomić? (SUPER PROSTO)

### Krok 1: Zainstaluj programy (jednorazowo)

1. Pobierz **Node.js** ze strony: https://nodejs.org/ (wersja 18 lub nowsza)
2. Zainstaluj (klikaj "Next, Next, Next")

### Krok 2: Otwórz terminal w folderze projektu

**Windows:**

- Wejdź do folderu `lotto-wizard`
- Kliknij prawym na pustym miejscu → "Otwórz w terminalu" lub "Open PowerShell window here"

**Mac/Linux:**

- Otwórz Terminal
- Wpisz: `cd /ścieżka/do/lotto-wizard`

### Krok 3: Zainstaluj zależności (jednorazowo)

W terminalu wpisz:

```bash
npm install
```

Poczekaj 1-2 minuty (pobiera biblioteki z internetu)

### Krok 4: Uruchom aplikację

W terminalu wpisz:

```bash
npm run dev
```

Zobaczysz coś takiego:

```
▲ Next.js 14.0.4
- Local: http://localhost:3000
✓ Ready in 2.1s
```

### Krok 5: Otwórz w przeglądarce

Wpisz w pasek adresu:

```
http://localhost:3000
```

**GOTOWE!** 🎉 Aplikacja działa!

---

## � Struktura plików (co gdzie jest)

```
lotto-wizard/
│
├── 📁 components/          ← Kawałki strony (przyciski, karty, tabele)
│   ├── hero/
│   │   └── PredictionsHero.tsx    ← HERO - 3 zestawy na górze strony
│   ├── dashboard/
│   │   ├── FrequencyChart.tsx     ← Wykres słupkowy z częstotliwościami
│   │   ├── HotColdPanel.tsx       ← Gorące i zimne liczby
│   │   ├── NumberGenerator.tsx    ← Generator z 4 algorytmami
│   │   └── AnalyticsPanels.tsx    ← Panele z analizami P/N i sum
│   ├── archive/
│   │   └── ResultsTable.tsx       ← Tabela wszystkich losowań
│   ├── layout/
│   │   └── Header.tsx             ← Menu górne (logo + nawigacja)
│   └── ui/                         ← Komponenty shadcn/ui (Button, Card, etc.)
│
├── 📁 lib/                 ← NAJWAŻNIEJSZE! Tutaj jest cała matematyka
│   └── statystyki.ts              ← Wszystkie algorytmy i obliczenia
│
├── 📁 pages/               ← Strony aplikacji
│   ├── index.tsx                  ← Strona główna (/)
│   └── archiwum.tsx               ← Strona archiwum (/archiwum)
│
├── 📁 public/              ← Pliki publiczne
│   └── data/
│       └── wyniki_lotto.json      ← 333 losowania w formacie JSON
│
├── 📁 types/               ← Definicje TypeScript (co to jest Losowanie, itp.)
│   └── index.ts
│
└── 📁 styles/              ← Wygląd (kolory, czcionki)
    └── globals.css
```

---

## 🧠 Jak działa plik `lib/statystyki.ts`? (NAJWAŻNIEJSZY!)

Ten plik to "mózg" aplikacji. Zawiera wszystkie funkcje matematyczne.

### 📊 **Funkcja 1: `obliczCzestotliwoscLiczb`**

**Co robi:** Zlicza ile razy każda liczba (1-49) wypadła

**Jak działa:**

```javascript
// Dla każdego losowania
// Dla każdej liczby w losowaniu
//    Dodaj +1 do licznika tej liczby

Wynik: { 1: 150, 2: 143, 3: 134, ..., 49: 139 }
//      ↑        ↑
//   liczba   ile razy wypadła
```

### 🔥 **Funkcja 2: `znajdzGoraceIZimne`**

**Co robi:** Znajduje top 10 najczęstszych i najrzadszych liczb

**Jak działa:**

```javascript
// Weź częstotliwości
// Posortuj od największej do najmniejszej
// Weź 10 pierwszych = GORĄCE
// Weź 10 ostatnich = ZIMNE

Wynik: {
  gorace: [17, 49, 2, 36, 20, 30, 12, 21, 5, 13],
  zimne: [16, 9, 33, 29, 25, 8, 1, 35, 41, 3]
}
```

### 🎲 **Funkcja 3: `generujMieszany`** (NAJLEPSZA!)

**Co robi:** Generuje zestaw 3 gorące + 3 zimne

**Jak działa:**

```javascript
// Weź top 15 najczęstszych liczb
// Losowo wybierz 3 z nich → dodaj do zestawu
// Weź bottom 15 najrzadszych liczb
// Losowo wybierz 3 z nich → dodaj do zestawu
// Posortuj 6 liczb rosnąco

Przykładowy wynik: [5, 9, 17, 25, 36, 49]
//                 ↑zimne↑  ↑  gorące ↑
```

### ⚖️ **Funkcja 4: `generujZBalansem`**

**Co robi:** Generuje 3 parzyste + 3 nieparzyste

**Jak działa:**

```javascript
// Losuj liczby z zakresu 1-49
//    Jeśli parzysta (np. 2,4,6...) → dodaj do grupy parzystych
//    Jeśli nieparzysta (np. 1,3,5...) → dodaj do grupy nieparzystych
// Zatrzymaj się gdy masz 3 parzyste i 3 nieparzyste

Przykładowy wynik: [5, 17, 33, 22, 38, 44]
//                 ↑nieparzyste↑ ↑ parzyste↑
```

---

## 🎨 Design System (jak wygląda)

### Wersja 1.0 = MINIMALISTYCZNA

- **Brak kolorowych gradientów** ❌ (były w MVP)
- **Tylko czarno-białe** (wireframe style) ✅
- **shadcn/ui tokens:**
  - `bg-background` - tło strony
  - `bg-muted` - przyciemnienie
  - `border` - obramowania
  - `text-foreground` - tekst główny
  - `text-muted-foreground` - tekst drugorzędny

### Komponenty shadcn/ui używane:

- ✅ **Card** - karty z informacjami
- ✅ **Button** - przyciski
- ✅ **Badge** - odznaki (Rekomendowane, Popularne, etc.)
- ✅ **Sheet** - menu mobilne (hamburger)
- ✅ **Table** - tabele w archiwum

---

## 📱 Strony aplikacji

### 1️⃣ **Strona Główna** (`/` lub `http://localhost:3000`)

**Kolejność sekcji (od góry):**

1. **HERO SECTION** 🎯

   - 3 gotowe zestawy predykcji (Mieszany, Gorące, Balans)
   - To jest "mięso" - natychmiastowa wartość dla użytkownika!

2. **Statystyki ogólne** 📊

   - 3 karty: Liczba losowań, Okres analizy, Średnia suma

3. **Generator zestawów** 🎲

   - Możesz sam wybierać algorytm i generować zestawy
   - 4 algorytmy do wyboru

4. **Gorące i Zimne liczby** 🔥❄️

   - Wizualizacja najczęstszych i najrzadszych
   - Ranking 1,2,3 przy liczbach

5. **Wykres częstotliwości** 📈

   - Słupki pokazują jak często każda liczba wypadała

6. **Panele analityczne** 📊

   - Rozkład Parzystych/Nieparzystych
   - Statystyki sum (min, max, średnia, mediana)

7. **Disclaimer** ⚠️
   - Przypomnienie że to narzędzie analityczne, nie gwarancja wygranej

### 2️⃣ **Strona Archiwum** (`/archiwum`)

- Tabela wszystkich 333 losowań
- Paginacja (20 na stronę)
- Sortowanie od najnowszych
- Pokazuje: numer losowania, datę, 6 liczb, sumę, rozkład P/N

---

## 🔧 Komendy w terminalu

```bash
# Zainstaluj zależności (pierwsze uruchomienie)
npm install

# Uruchom aplikację (tryb deweloperski)
npm run dev

# Zbuduj aplikację (produkcja)
npm run build

# Uruchom aplikację produkcyjną
npm start

# Usuń cache (gdy coś nie działa)
rm -rf .next
# lub na Windows:
Remove-Item -Recurse -Force .next
```

---

## ❓ FAQ (Często Zadawane Pytania)

### Q: Czy ta aplikacja pomoże mi wygrać w Lotto?

**A:** NIE! To narzędzie **edukacyjne i analityczne**. Każde losowanie Lotto jest całkowicie losowe i niezależne od poprzednich. Aplikacja tylko pokazuje co się działo w przeszłości.

### Q: Dlaczego tylko 4 algorytmy a nie 5?

**A:** W wersji 1.0 usunęliśmy "Całkowicie losowy" algorytm, bo nie ma sensu - nie opiera się na żadnej analizie. Zostały tylko algorytmy analityczne.

### Q: Skąd są dane losowań?

**A:** Z pliku `public/data/wyniki_lotto.json` - 333 losowania z okresu ~2 lata (2023-09-16 do 2025-10-30).

### Q: Czy mogę dodać więcej danych?

**A:** Tak! Edytuj plik `wyniki_lotto.json` i dodaj więcej losowań w tym samym formacie. Po zapisaniu odśwież stronę.

### Q: Dlaczego liczby w HERO się nie zmieniają?

**A:** To celowe! Liczby generują się **jeden raz** po stronie serwera (przy build time), aby uniknąć błędów hydration. Możesz generować nowe w sekcji "Generator zestawów".

### Q: Co to jest "hydration error"?

**A:** To błąd w Next.js gdy serwer i przeglądarka mają różne dane. Naprawiliśmy to generując liczby w `getStaticProps`.

### Q: Jak zmienić wygląd (kolory)?

**A:** Edytuj plik `styles/globals.css` - tam są definicje kolorów shadcn/ui (`:root` i `.dark`).

### Q: Aplikacja nie działa, co robić?

**A:**

1. Usuń folder `.next`: `rm -rf .next`
2. Zainstaluj ponownie: `npm install`
3. Uruchom: `npm run dev`
4. Sprawdź czy masz Node.js 18+

---

## 🎓 Nauka z projektu

### Co możesz się nauczyć:

1. **Next.js** - jak działa SSG (Static Site Generation)
2. **TypeScript** - typy, interfejsy, bezpieczeństwo
3. **React** - komponenty, props, state
4. **shadcn/ui** - gotowe, profesjonalne komponenty
5. **Statystyka** - częstotliwości, średnie, mediany
6. **Algorytmy** - jak pisać funkcje analityczne
7. **Responsive design** - mobile-first

### Następne kroki:

- 📊 Dodaj wykresy (recharts, chart.js)
- 🗄️ Połącz z bazą danych (PostgreSQL)
- 🔐 Dodaj logowanie użytkowników
- 💾 Pozwól zapisywać ulubione zestawy
- 🤖 Dodaj Machine Learning
- 📧 Powiadomienia email o nowych losowaniach

---

## 🙏 Credits

- **shadcn/ui** - komponenty UI
- **Next.js** - framework
- **Tailwind CSS** - styling
- **lucide-react** - ikony

---

**Made with ❤️ for learning and fun!**

**Graj odpowiedzialnie! 🎲**

## 🚀 Stos Technologiczny

- **Frontend Framework**: Next.js 14 (Pages Router)
- **Język**: TypeScript
- **Styling**: Tailwind CSS
- **Komponenty UI**: shadcn/ui (Button, Card)
- **Ikony**: lucide-react
- **Data Source**: Statyczny plik JSON

## 📁 Struktura Projektu

```
lotto-wizard/
├── components/
│   ├── layout/
│   │   └── Header.tsx              # Nagłówek aplikacji z nawigacją
│   ├── dashboard/
│   │   ├── FrequencyChart.tsx      # Wykres częstotliwości liczb
│   │   ├── HotColdPanel.tsx        # Panel gorących i zimnych liczb
│   │   ├── NumberGenerator.tsx     # Generator zestawów z algorytmami
│   │   └── AnalyticsPanels.tsx     # Panele analityczne (P/N, sumy)
│   ├── archive/
│   │   └── ResultsTable.tsx        # Tabela archiwum z paginacją
│   └── ui/
│       ├── button.tsx              # Komponent Button (shadcn/ui)
│       └── card.tsx                # Komponent Card (shadcn/ui)
├── lib/
│   ├── statystyki.ts               # ⭐ Kluczowa logika algorytmów
│   └── utils.ts                    # Utility functions (cn)
├── pages/
│   ├── api/
│   │   └── wyniki.ts               # API endpoint dla danych JSON
│   ├── _app.tsx                    # Root aplikacji Next.js
│   ├── index.tsx                   # 🏠 Strona główna (Dashboard)
│   └── archiwum.tsx                # 📋 Strona archiwum
├── public/
│   └── data/
│       └── wyniki_lotto.json       # Dane historyczne (skonwertowane)
├── scripts/
│   └── convertData.js              # Skrypt konwersji danych
├── types/
│   └── index.ts                    # Definicje typów TypeScript
└── styles/
    └── globals.css                 # Style globalne z Tailwind
```

## 🎯 Kluczowe Funkcje (lib/statystyki.ts)

### 1. `obliczCzestotliwoscLiczb(wyniki: Losowanie[])`

Oblicza częstotliwość występowania każdej liczby (1-49) we wszystkich losowaniach.

**Wyjście**: `{ "1": 150, "2": 143, ..., "49": 139 }`

### 2. `znajdzGoraceIZimne(daneCzestotliwosci, ilosc)`

Identyfikuje top N najczęściej (gorące) i najrzadziej (zimne) losowanych liczb.

**Wyjście**: `{ gorace: [5, 12, 23, ...], zimne: [2, 7, 18, ...] }`

### 3. `analizujParzysteNieparzyste(wyniki: Losowanie[])`

Analizuje rozkład liczb parzystych/nieparzystych w każdym losowaniu.

**Wyjście**: `{ "6/0": 10, "5/1": 50, "4/2": 150, "3/3": 200, ... }`

### 4. `analizujSumyLosowan(wyniki: Losowanie[])`

Oblicza statystyki sum wszystkich 6 liczb w każdym losowaniu.

**Wyjście**: `{ min: 21, max: 279, srednia: 147.5, mediana: 149 }`

## 🎲 Algorytmy Generowania Zestawów

Aplikacja oferuje 5 różnych strategii generowania:

1. **Gorące Liczby** (`generujNaPodstawieCzestych`)

   - Wybiera 6 liczb z top 15 najczęstszych

2. **Zimne Liczby** (`generujNaPodstawieZimnych`)

   - Teoria "wymagalności" - wybiera z najrzadszych

3. **Mieszany** (`generujMieszany`)

   - Kombinacja 3 gorące + 3 zimne

4. **Balans P/N** (`generujZBalansem`)

   - Zbalansowany rozkład 3 parzyste + 3 nieparzyste

5. **Całkowicie Losowy** (`generujLosowyZestaw`)
   - Czysto losowy bez analizy

## 🔧 Instalacja i Uruchomienie

### Wymagania

- Node.js 18+
- npm lub yarn

### Kroki instalacji

1. **Zainstaluj zależności**

```bash
npm install
```

2. **Konwertuj dane** (jeśli używasz oryginalnego formatu)

```bash
node scripts/convertData.js
```

3. **Uruchom serwer deweloperski**

```bash
npm run dev
```

4. **Otwórz w przeglądarce**

```
http://localhost:3000
```

### Produkcja

```bash
# Build
npm run build

# Start
npm start
```

## 📊 Schemat Danych

### Format Pojedynczego Losowania

```typescript
interface Losowanie {
  numerLosowania: number // np. 7268
  dataLosowania: string // Format: "YYYY-MM-DD"
  liczbyLotto: number[] // Tablica 6 liczb [3, 10, 15, 30, 31, 49]
}
```

### Przykład JSON

```json
{
  "numerLosowania": 7268,
  "dataLosowania": "2025-10-30",
  "liczbyLotto": [3, 10, 15, 30, 31, 49]
}
```

## 🎨 Komponenty UI

### shadcn/ui

Projekt wykorzystuje komponenty z biblioteki shadcn/ui:

- **Button** - Przyciski z różnymi wariantami
- **Card** - Karty do prezentacji danych

### Kolory i Styling

- Gradient niebiesko-fioletowy dla branding
- Gorące liczby: czerwono-pomarańczowy gradient
- Zimne liczby: niebiesko-cyjanowy gradient
- Responsywny design (mobile-first)

## 📱 Strony Aplikacji

### 1. Dashboard (/)

- Statystyki ogólne (liczba losowań, okres, średnia suma)
- Generator zestawów z 5 algorytmami
- Panel gorących i zimnych liczb
- Wykres częstotliwości wszystkich liczb
- Analiza parzystych/nieparzystych
- Statystyki sum

### 2. Archiwum (/archiwum)

- Tabela wszystkich losowań
- Paginacja (20 wyników na stronę)
- Sortowanie od najnowszych
- Wyświetlanie sum i rozkładów P/N

## 🔄 Rozbudowa i Skalowanie

Aplikacja jest zaprojektowana z myślą o przyszłej rozbudowie:

✅ **Gotowe do obsługi 5+ lat danych** (obecnie 333 losowania, ~1.5 roku)
✅ Czyste, pure functions - łatwe testowanie
✅ TypeScript - bezpieczeństwo typów
✅ Modularna architektura komponentów
✅ API Route gotowe do podmiany na bazę danych

### Możliwe rozszerzenia:

- 📊 Wykresy z biblioteki charts (recharts, chart.js)
- 🗄️ Migracja do bazy danych (PostgreSQL, MongoDB)
- 🔐 Autoryzacja użytkowników
- 💾 Zapisywanie ulubionych zestawów
- 📧 Powiadomienia o nowych losowaniach
- 🤖 Machine Learning do predykcji trendów
- 📱 Progressive Web App (PWA)

## 🧪 Testowanie

```bash
# Dodaj w przyszłości
npm run test
```

## 📄 Licencja

Projekt edukacyjny - MIT License

## 👨‍💻 Autor

Aplikacja stworzona jako MVP demonstracyjne.

## 🙏 Podziękowania

- Dane historyczne Lotto
- shadcn/ui za świetne komponenty
- Next.js team za doskonały framework

---

**⚠️ Grasz na własną odpowiedzialność. Aplikacja nie gwarantuje wygranej!** 🎲
