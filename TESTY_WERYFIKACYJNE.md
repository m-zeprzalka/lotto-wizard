# 🧪 TESTY WERYFIKACYJNE - Sprawdź czy wszystko działa!

## 🎯 Cel

Ten plik zawiera **proste testy** które możesz samodzielnie przeprowadzić, aby upewnić się że:

1. Aplikacja faktycznie analizuje dane z JSON
2. Algorytmy używają prawdziwych częstotliwości
3. Komponenty są poprawnie wpięte

---

## TEST 1: Czy częstotliwości są obliczane z danych?

### Jak przetestować:

1. Otwórz `public/data/wyniki_lotto.json`
2. Znajdź kilka losowań i policz ręcznie ile razy wypadła liczba **17**

**Przykład ręcznego liczenia:**

```json
Losowanie #7268: [3, 10, 15, 30, 31, 49]  → 17? NIE
Losowanie #7267: [7, 14, 18, 24, 38, 47]  → 17? NIE
Losowanie #7266: [5, 17, 20, 27, 39, 42]  → 17? TAK! (+1)
...
```

3. Otwórz przeglądarkę i wejdź na `http://localhost:3000`
4. Otwórz **Developer Tools** (F12)
5. W konsoli wpisz:

```javascript
// To pokaże częstotliwość liczby 17 na wykresie
document.querySelectorAll(".frequency-bar").forEach((bar) => {
  if (bar.textContent.includes("17")) {
    console.log("Liczba 17 wystąpiła:", bar.dataset.frequency, "razy")
  }
})
```

### Oczekiwany wynik:

✅ Liczba wystąpień powinna zgadzać się z twoim ręcznym liczeniem (±0, dokładnie!)

---

## TEST 2: Czy "Gorące Liczby" są faktycznie najczęstsze?

### Jak przetestować:

1. Otwórz `http://localhost:3000`
2. Przewiń do sekcji **"Gorące i Zimne Liczby"**
3. Zobacz pierwszą liczbę w "Gorące" (np. **17**)
4. Przewiń do sekcji **"Wykres Częstotliwości"**
5. Sprawdź czy liczba **17** ma najwyższy słupek

### Oczekiwany wynik:

✅ Pierwsza liczba w "Gorące" powinna mieć najwyższy słupek na wykresie!

### Dodatkowy test w konsoli:

```javascript
// Otwórz DevTools (F12) i wpisz:
fetch("/data/wyniki_lotto.json")
  .then((r) => r.json())
  .then((wyniki) => {
    const czestotliwosc = {}

    // Policz częstotliwości
    wyniki.forEach((losowanie) => {
      losowanie.liczbyLotto.forEach((liczba) => {
        czestotliwosc[liczba] = (czestotliwosc[liczba] || 0) + 1
      })
    })

    // Posortuj i pokaż top 5
    const top5 = Object.entries(czestotliwosc)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    console.log("TOP 5 NAJCZĘSTSZYCH:", top5)
  })
```

### Oczekiwany wynik:

✅ Top 5 z konsoli powinno zgadzać się z pierwszymi 5 liczbami w sekcji "Gorące"!

---

## TEST 3: Czy PredictionsHero używa gorących/zimnych?

### Jak przetestować:

1. Otwórz `http://localhost:3000`
2. Zobacz sekcję **HERO** na górze strony
3. Zanotuj liczby z karty **"Analiza Mieszana"** (np. `[5, 9, 17, 25, 36, 49]`)
4. Przewiń do sekcji **"Gorące i Zimne Liczby"**
5. Sprawdź:
   - Czy około 3 liczby z HERO są w **"Gorące"**?
   - Czy około 3 liczby z HERO są w **"Zimne"**?

### Przykład:

```
HERO - Analiza Mieszana: [5, 9, 17, 25, 36, 49]

Gorące (na stronie): [17, 49, 2, 36, 20, 30, 12, 21, 5, 13]
                      ↑   ↑      ↑               ↑
                      17, 49, 36, 5 są w HERO! → 4 gorące ✅

Zimne (na stronie): [16, 9, 33, 29, 25, 8, 1, 35, 41, 3]
                         ↑          ↑
                         9, 25 są w HERO! → 2 zimne ✅
```

### Oczekiwany wynik:

✅ Mniej więcej 3 liczby z HERO powinny być w "Gorące", a 3 w "Zimne"!

**UWAGA:** Algorytm bierze z TOP 10, więc może być 4/2 lub 2/4 - to normalne! Ważne żeby NIE było 6/0 lub 0/6!

---

## TEST 4: Czy NumberGenerator generuje różne zestawy?

### Jak przetestować:

1. Otwórz `http://localhost:3000`
2. Przewiń do sekcji **"Generator Zestawów Liczb"**
3. Wybierz algorytm **"Mieszane"**
4. Kliknij **"Generuj Zestaw"** 5 razy
5. Zanotuj wszystkie 5 wygenerowanych zestawów

### Oczekiwany wynik:

✅ Wszystkie 5 zestawów powinny być **RÓŻNE**!
✅ Każdy zestaw powinien mieć około 3 gorące + 3 zimne

### Dodatkowy test - sprawdź kod w konsoli:

```javascript
// Otwórz DevTools (F12) i przetestuj funkcję:
fetch("/data/wyniki_lotto.json")
  .then((r) => r.json())
  .then((wyniki) => {
    // Policz częstotliwości (skopiuj kod z lib/statystyki.ts)
    const czestotliwosc = {}
    for (let i = 1; i <= 49; i++) {
      czestotliwosc[i.toString()] = 0
    }
    wyniki.forEach((losowanie) => {
      losowanie.liczbyLotto.forEach((liczba) => {
        czestotliwosc[liczba.toString()]++
      })
    })

    // Znajdź gorące i zimne
    const pary = Object.entries(czestotliwosc).map(([l, f]) => ({
      liczba: parseInt(l),
      freq: f,
    }))
    const posortowane = pary.sort((a, b) => b.freq - a.freq)
    const gorace = posortowane.slice(0, 10).map((p) => p.liczba)
    const zimne = posortowane.slice(-10).map((p) => p.liczba)

    console.log("GORĄCE:", gorace)
    console.log("ZIMNE:", zimne)

    // Generuj zestaw mieszany 5 razy
    for (let i = 1; i <= 5; i++) {
      const wynik = new Set()

      // 3 gorące
      while (wynik.size < 3) {
        const idx = Math.floor(Math.random() * gorace.length)
        wynik.add(gorace[idx])
      }

      // 3 zimne
      while (wynik.size < 6) {
        const idx = Math.floor(Math.random() * zimne.length)
        wynik.add(zimne[idx])
      }

      console.log(
        `Zestaw ${i}:`,
        Array.from(wynik).sort((a, b) => a - b)
      )
    }
  })
```

### Oczekiwany wynik:

✅ 5 różnych zestawów!
✅ Każdy zestaw ma liczby z list GORĄCE i ZIMNE!

---

## TEST 5: Czy rebuild zmienia liczby w HERO?

### Jak przetestować:

1. Otwórz `http://localhost:3000`
2. Zanotuj liczby z HERO - Analiza Mieszana (np. `[5, 9, 17, 25, 36, 49]`)
3. Zatrzymaj serwer (Ctrl+C w terminalu)
4. Usuń cache:
   ```powershell
   Remove-Item -Recurse -Force .next
   ```
5. Uruchom ponownie:
   ```powershell
   npm run dev
   ```
6. Otwórz `http://localhost:3000` ponownie
7. Sprawdź liczby w HERO

### Oczekiwany wynik:

✅ Liczby w HERO są **INNE** niż przed rebuild!
✅ Nadal są to około 3 gorące + 3 zimne

**DLACZEGO?** Bo funkcja `generujMieszany()` używa `Math.random()`, więc za każdym buildem generuje inne zestawy!

---

## TEST 6: Czy odświeżenie strony (F5) NIE zmienia HERO?

### Jak przetestować:

1. Otwórz `http://localhost:3000`
2. Zanotuj liczby z HERO - Analiza Mieszana
3. Naciśnij **F5** (odśwież stronę)
4. Sprawdź liczby w HERO ponownie
5. Powtórz 5 razy

### Oczekiwany wynik:

✅ Liczby w HERO są **IDENTYCZNE** po każdym odświeżeniu!

**DLACZEGO?** Bo są wygenerowane w `getStaticProps()` (na serwerze), nie w komponencie!

**GDYBY były generowane w komponencie:**
❌ Liczby zmieniałyby się po każdym F5
❌ Dostawałbyś błąd hydration

---

## TEST 7: Czy "Gorące Liczby" w HERO są faktycznie gorące?

### Jak przetestować:

1. Otwórz `http://localhost:3000`
2. Zanotuj liczby z HERO - **"Gorące Liczby"** (druga karta)
3. Przewiń do sekcji **"Gorące i Zimne Liczby"**
4. Sprawdź czy WSZYSTKIE 6 liczb z HERO są w liście "Gorące" (top 10)

### Oczekiwany wynik:

✅ Wszystkie 6 liczb z karty "Gorące Liczby" powinny być w liście "Gorące"!

**UWAGA:** Mogą być z top 15 (nie top 10), bo funkcja `generujNaPodstawieCzestych()` bierze z top 15!

---

## TEST 8: Czy "Balans P/N" faktycznie ma 3P + 3N?

### Jak przetestować:

1. Otwórz `http://localhost:3000`
2. Zanotuj liczby z HERO - **"Balans P/N"** (trzecia karta)
3. Policz parzyste (2, 4, 6, ..., 48) i nieparzyste (1, 3, 5, ..., 49)

### Przykład:

```
HERO - Balans P/N: [3, 10, 15, 22, 27, 48]
                    ↑   ↑   ↑   ↑   ↑   ↑
                    N   P   N   P   N   P

Parzyste: 10, 22, 48 → 3 ✅
Nieparzyste: 3, 15, 27 → 3 ✅
```

### Oczekiwany wynik:

✅ Dokładnie 3 parzyste i 3 nieparzyste!

---

## 📊 TABELA WYNIKÓW TESTÓW

Zaznacz ✅ gdy test przejdzie:

| Test   | Opis                             | Status |
| ------ | -------------------------------- | ------ |
| Test 1 | Częstotliwości z danych          | ☐      |
| Test 2 | Gorące to najczęstsze            | ☐      |
| Test 3 | HERO używa gorących/zimnych      | ☐      |
| Test 4 | Generator generuje różne zestawy | ☐      |
| Test 5 | Rebuild zmienia HERO             | ☐      |
| Test 6 | F5 NIE zmienia HERO              | ☐      |
| Test 7 | "Gorące Liczby" są gorące        | ☐      |
| Test 8 | "Balans P/N" to 3P + 3N          | ☐      |

---

## 🎯 KOŃCOWA WERYFIKACJA

Jeśli **wszystkie 8 testów** przeszły ✅, to:

✅ **Twoje komponenty są 100% poprawnie wpięte z algorytmami analizy danych!**
✅ **Aplikacja faktycznie analizuje dane z wyniki_lotto.json!**
✅ **Algorytmy działają zgodnie z założeniami!**

---

## 🐛 Co jeśli test NIE przeszedł?

### Test 1 nie działa:

- Problem: Funkcja `obliczCzestotliwoscLiczb()` źle liczy
- Rozwiązanie: Sprawdź czy w pętli dodajesz `++` do właściwej liczby

### Test 2 nie działa:

- Problem: Sortowanie w `znajdzGoraceIZimne()` jest złe
- Rozwiązanie: Sprawdź czy sortujesz `b.freq - a.freq` (malejąco!)

### Test 3 nie działa:

- Problem: `generujMieszany()` nie bierze z gorących/zimnych
- Rozwiązanie: Sprawdź czy wywołujesz `znajdzGoraceIZimne()` wewnątrz funkcji

### Test 6 nie działa (liczby zmieniają się po F5):

- Problem: Generujesz w komponencie zamiast w `getStaticProps()`
- Rozwiązanie: Przenieś generowanie do `getStaticProps()` (już zrobione!)

---

**Powodzenia z testami! 🚀**
