# 💡 Przykłady Użycia API i Funkcji

## 🎯 Jak korzystać z lib/statystyki.ts

### 1. Obliczanie Częstotliwości Liczb

```typescript
import { obliczCzestotliwoscLiczb } from "@/lib/statystyki"
import { Losowanie } from "@/types"

// Przykładowe dane
const wyniki: Losowanie[] = [
  {
    numerLosowania: 1,
    dataLosowania: "2025-01-01",
    liczbyLotto: [1, 5, 12, 23, 34, 45],
  },
  {
    numerLosowania: 2,
    dataLosowania: "2025-01-04",
    liczbyLotto: [5, 7, 12, 15, 23, 49],
  },
  // ... więcej losowań
]

// Użycie
const czestotliwosci = obliczCzestotliwoscLiczb(wyniki)

console.log(czestotliwosci)
// Output: { "1": 1, "2": 0, "3": 0, "4": 0, "5": 2, ..., "49": 1 }

// Sprawdź ile razy wystąpiła liczba 5
console.log(`Liczba 5 wystąpiła ${czestotliwosci["5"]} razy`)
// Output: "Liczba 5 wystąpiła 2 razy"
```

---

### 2. Znajdowanie Gorących i Zimnych Liczb

```typescript
import { obliczCzestotliwoscLiczb, znajdzGoraceIZimne } from "@/lib/statystyki"

const wyniki: Losowanie[] = [
  /* ... */
]

// Najpierw oblicz częstotliwości
const czestotliwosci = obliczCzestotliwoscLiczb(wyniki)

// Znajdź top 10 gorących i zimnych
const { gorace, zimne } = znajdzGoraceIZimne(czestotliwosci, 10)

console.log("Gorące liczby:", gorace)
// Output: [23, 5, 12, 34, 7, 15, 1, 45, 49, ...]

console.log("Zimne liczby:", zimne)
// Output: [2, 3, 4, 6, 8, 9, 10, 11, 13, ...]

// Lub tylko top 5
const top5 = znajdzGoraceIZimne(czestotliwosci, 5)
console.log("Top 5 gorących:", top5.gorace)
// Output: [23, 5, 12, 34, 7]
```

---

### 3. Analiza Rozkładu Parzystych/Nieparzystych

```typescript
import { analizujParzysteNieparzyste } from "@/lib/statystyki"

const wyniki: Losowanie[] = [
  /* ... */
]

const rozklad = analizujParzysteNieparzyste(wyniki)

console.log(rozklad)
// Output:
// {
//   "0/6": 2,   // 0 parzystych, 6 nieparzystych - 2 razy
//   "1/5": 15,  // 1 parzysta, 5 nieparzystych - 15 razy
//   "2/4": 45,  // itd.
//   "3/3": 120, // najbardziej popularna kombinacja
//   "4/2": 80,
//   "5/1": 30,
//   "6/0": 8
// }

// Znajdź najpopularniejszą kombinację
const entries = Object.entries(rozklad)
const najpopularniejsza = entries.reduce((max, current) =>
  current[1] > max[1] ? current : max
)

console.log(
  `Najpopularniejsza: ${najpopularniejsza[0]} (${najpopularniejsza[1]} wystąpień)`
)
// Output: "Najpopularniejsza: 3/3 (120 wystąpień)"
```

---

### 4. Statystyki Sum Losowań

```typescript
import { analizujSumyLosowan } from "@/lib/statystyki"

const wyniki: Losowanie[] = [
  /* ... */
]

const statystyki = analizujSumyLosowan(wyniki)

console.log(statystyki)
// Output:
// {
//   min: 48,
//   max: 235,
//   srednia: 147.32,
//   mediana: 149
// }

// Użycie w praktyce
if (mojaLiczba < statystyki.min || mojaLiczba > statystyki.max) {
  console.log("Twoja suma jest poza zakresem historycznym!")
}

if (
  mojaLiczba >= statystyki.srednia - 10 &&
  mojaLiczba <= statystyki.srednia + 10
) {
  console.log("Twoja suma jest blisko średniej!")
}
```

---

### 5. Generowanie Zestawów - Gorące Liczby

```typescript
import {
  obliczCzestotliwoscLiczb,
  generujNaPodstawieCzestych,
} from "@/lib/statystyki"

const wyniki: Losowanie[] = [
  /* ... */
]
const czestotliwosci = obliczCzestotliwoscLiczb(wyniki)

// Generuj zestaw oparty na gorących liczbach
const zestaw = generujNaPodstawieCzestych(czestotliwosci)

console.log("Wygenerowany zestaw:", zestaw)
// Output: [5, 12, 15, 23, 34, 45] (posortowane, z top 15 gorących)
```

---

### 6. Generowanie Zestawów - Zimne Liczby

```typescript
import {
  obliczCzestotliwoscLiczb,
  generujNaPodstawieZimnych,
} from "@/lib/statystyki"

const wyniki: Losowanie[] = [
  /* ... */
]
const czestotliwosci = obliczCzestotliwoscLiczb(wyniki)

// Generuj zestaw oparty na zimnych liczbach (teoria "wymagalności")
const zestaw = generujNaPodstawieZimnych(czestotliwosci)

console.log("Wygenerowany zestaw (zimne):", zestaw)
// Output: [2, 3, 6, 8, 11, 13] (z top 15 zimnych)
```

---

### 7. Generowanie Zestawów - Mieszany

```typescript
import { obliczCzestotliwoscLiczb, generujMieszany } from "@/lib/statystyki"

const wyniki: Losowanie[] = [
  /* ... */
]
const czestotliwosci = obliczCzestotliwoscLiczb(wyniki)

// 3 gorące + 3 zimne
const zestaw = generujMieszany(czestotliwosci)

console.log("Zestaw mieszany:", zestaw)
// Output: [3, 6, 11, 23, 34, 45] (3 z zimnych + 3 z gorących, posortowane)
```

---

### 8. Generowanie Zestawów - Balans P/N

```typescript
import { generujZBalansem } from "@/lib/statystyki"

// Nie potrzebuje danych historycznych - generuje losowo z balansem
const zestaw = generujZBalansem()

console.log("Zestaw z balansem P/N:", zestaw)
// Output: [4, 12, 28, 7, 15, 33] (3 parzyste + 3 nieparzyste)

// Weryfikacja
const parzyste = zestaw.filter((n) => n % 2 === 0)
const nieparzyste = zestaw.filter((n) => n % 2 !== 0)

console.log(`Parzyste: ${parzyste.length}, Nieparzyste: ${nieparzyste.length}`)
// Output: "Parzyste: 3, Nieparzyste: 3"
```

---

### 9. Generowanie Zestawów - Losowy

```typescript
import { generujLosowyZestaw } from "@/lib/statystyki"

// Całkowicie losowy zestaw - bez żadnej analizy
const zestaw = generujLosowyZestaw()

console.log("Losowy zestaw:", zestaw)
// Output: [7, 14, 22, 31, 38, 47] (6 losowych liczb 1-49, posortowane)
```

---

### 10. Formatowanie Daty

```typescript
import { formatujDate } from "@/lib/statystyki"

const data1 = "2025-10-30"
const data2 = "2024-01-15"

console.log(formatujDate(data1)) // "30.10.2025"
console.log(formatujDate(data2)) // "15.01.2024"

// Użycie w komponencie
const losowanie: Losowanie = {
  /* ... */
}
const wyswietlanaData = formatujDate(losowanie.dataLosowania)
```

---

### 11. Sortowanie Losowań

```typescript
import { sortujLosowaniaPoDatech } from "@/lib/statystyki"

const wyniki: Losowanie[] = [
  {
    numerLosowania: 100,
    dataLosowania: "2025-03-15",
    liczbyLotto: [
      /*...*/
    ],
  },
  {
    numerLosowania: 101,
    dataLosowania: "2025-01-10",
    liczbyLotto: [
      /*...*/
    ],
  },
  {
    numerLosowania: 102,
    dataLosowania: "2025-05-20",
    liczbyLotto: [
      /*...*/
    ],
  },
]

// Od najnowszych (domyślnie)
const odNajnowszych = sortujLosowaniaPoDatech(wyniki)
console.log(odNajnowszych.map((w) => w.dataLosowania))
// Output: ["2025-05-20", "2025-03-15", "2025-01-10"]

// Od najstarszych
const odNajstarszych = sortujLosowaniaPoDatech(wyniki, false)
console.log(odNajstarszych.map((w) => w.dataLosowania))
// Output: ["2025-01-10", "2025-03-15", "2025-05-20"]
```

---

## 🎨 Przykłady w Komponentach React

### 12. Wykorzystanie w Komponencie

```typescript
import { useState, useEffect } from "react"
import { Losowanie, CzestotliwoscLiczb } from "@/types"
import {
  obliczCzestotliwoscLiczb,
  generujNaPodstawieCzestych,
} from "@/lib/statystyki"

function MojGenerator({ wyniki }: { wyniki: Losowanie[] }) {
  const [czestotliwosci, setCzestotliwosci] = useState<CzestotliwoscLiczb>({})
  const [zestaw, setZestaw] = useState<number[]>([])

  useEffect(() => {
    // Oblicz częstotliwości raz przy mount
    const freq = obliczCzestotliwoscLiczb(wyniki)
    setCzestotliwosci(freq)
  }, [wyniki])

  const handleGeneruj = () => {
    const nowyZestaw = generujNaPodstawieCzestych(czestotliwosci)
    setZestaw(nowyZestaw)
  }

  return (
    <div>
      <button onClick={handleGeneruj}>Generuj</button>
      <div>
        {zestaw.map((liczba) => (
          <span key={liczba}>{liczba} </span>
        ))}
      </div>
    </div>
  )
}
```

---

### 13. getStaticProps Example

```typescript
import { GetStaticProps } from "next"
import fs from "fs"
import path from "path"
import { Losowanie, StatystykiDashboard } from "@/types"
import {
  obliczCzestotliwoscLiczb,
  znajdzGoraceIZimne,
  analizujParzysteNieparzyste,
  analizujSumyLosowan,
} from "@/lib/statystyki"

interface Props {
  statystyki: StatystykiDashboard
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  // Wczytaj dane
  const filePath = path.join(process.cwd(), "public/data/wyniki_lotto.json")
  const fileContents = fs.readFileSync(filePath, "utf8")
  const wyniki: Losowanie[] = JSON.parse(fileContents)

  // Oblicz wszystkie statystyki
  const czestotliwosci = obliczCzestotliwoscLiczb(wyniki)
  const goraceZimne = znajdzGoraceIZimne(czestotliwosci, 10)
  const rozkladParzysteNieparzyste = analizujParzysteNieparzyste(wyniki)
  const statystykiSum = analizujSumyLosowan(wyniki)

  // Zwróć jako props
  return {
    props: {
      statystyki: {
        czestotliwosci,
        goraceZimne,
        rozkladParzysteNieparzyste,
        statystykiSum,
        liczbaLosowan: wyniki.length,
        zakresData: {
          od: wyniki[wyniki.length - 1].dataLosowania,
          do: wyniki[0].dataLosowania,
        },
      },
    },
  }
}
```

---

## 🧪 Przykłady Testów (Potencjalne)

### 14. Test obliczCzestotliwoscLiczb

```typescript
import { obliczCzestotliwoscLiczb } from "@/lib/statystyki"
import { Losowanie } from "@/types"

describe("obliczCzestotliwoscLiczb", () => {
  it("powinno policzyć wystąpienia każdej liczby", () => {
    const wyniki: Losowanie[] = [
      {
        numerLosowania: 1,
        dataLosowania: "2025-01-01",
        liczbyLotto: [1, 2, 3, 4, 5, 6],
      },
      {
        numerLosowania: 2,
        dataLosowania: "2025-01-04",
        liczbyLotto: [1, 2, 3, 7, 8, 9],
      },
    ]

    const czestotliwosci = obliczCzestotliwoscLiczb(wyniki)

    expect(czestotliwosci["1"]).toBe(2) // wystąpiła 2 razy
    expect(czestotliwosci["2"]).toBe(2) // wystąpiła 2 razy
    expect(czestotliwosci["3"]).toBe(2) // wystąpiła 2 razy
    expect(czestotliwosci["4"]).toBe(1) // wystąpiła 1 raz
    expect(czestotliwosci["10"]).toBe(0) // nie wystąpiła
  })

  it("powinno zwrócić obiekt z wszystkimi liczbami 1-49", () => {
    const wyniki: Losowanie[] = []
    const czestotliwosci = obliczCzestotliwoscLiczb(wyniki)

    expect(Object.keys(czestotliwosci).length).toBe(49)
    expect(czestotliwosci["1"]).toBe(0)
    expect(czestotliwosci["49"]).toBe(0)
  })
})
```

---

### 15. Test generujZBalansem

```typescript
import { generujZBalansem } from "@/lib/statystyki"

describe("generujZBalansem", () => {
  it("powinno wygenerować 6 liczb", () => {
    const zestaw = generujZBalansem()
    expect(zestaw.length).toBe(6)
  })

  it("powinno zawierać 3 parzyste i 3 nieparzyste", () => {
    const zestaw = generujZBalansem()
    const parzyste = zestaw.filter((n) => n % 2 === 0)
    const nieparzyste = zestaw.filter((n) => n % 2 !== 0)

    expect(parzyste.length).toBe(3)
    expect(nieparzyste.length).toBe(3)
  })

  it("powinno zawierać unikalne liczby", () => {
    const zestaw = generujZBalansem()
    const unikalne = new Set(zestaw)
    expect(unikalne.size).toBe(6)
  })

  it("wszystkie liczby powinny być w zakresie 1-49", () => {
    const zestaw = generujZBalansem()
    zestaw.forEach((liczba) => {
      expect(liczba).toBeGreaterThanOrEqual(1)
      expect(liczba).toBeLessThanOrEqual(49)
    })
  })

  it("powinno być posortowane rosnąco", () => {
    const zestaw = generujZBalansem()
    for (let i = 0; i < zestaw.length - 1; i++) {
      expect(zestaw[i]).toBeLessThan(zestaw[i + 1])
    }
  })
})
```

---

## 📊 Zaawansowane Przykłady

### 16. Analiza Częstotliwości w Okresie Czasu

```typescript
import { obliczCzestotliwoscLiczb } from "@/lib/statystyki"

function analizujOkres(wyniki: Losowanie[], odDaty: string, doDaty: string) {
  // Filtruj losowania z okresu
  const wynikiOkresu = wyniki.filter((losowanie) => {
    const data = new Date(losowanie.dataLosowania)
    return data >= new Date(odDaty) && data <= new Date(doDaty)
  })

  // Oblicz częstotliwości dla tego okresu
  const czestotliwosci = obliczCzestotliwoscLiczb(wynikiOkresu)

  return {
    okres: `${odDaty} - ${doDaty}`,
    liczbaLosowan: wynikiOkresu.length,
    czestotliwosci,
  }
}

// Użycie
const analiza2024 = analizujOkres(wyniki, "2024-01-01", "2024-12-31")
console.log(`W 2024 było ${analiza2024.liczbaLosowan} losowań`)
```

---

### 17. Porównanie Strategii Generowania

```typescript
import {
  obliczCzestotliwoscLiczb,
  generujNaPodstawieCzestych,
  generujNaPodstawieZimnych,
  generujMieszany,
  generujZBalansem,
  generujLosowyZestaw,
} from "@/lib/statystyki"

function porownajStrategie(wyniki: Losowanie[], ilosc: number = 10) {
  const czestotliwosci = obliczCzestotliwoscLiczb(wyniki)
  const zestawy: Record<string, number[][]> = {
    gorace: [],
    zimne: [],
    mieszany: [],
    balans: [],
    losowy: [],
  }

  // Generuj po 'ilosc' zestawów każdym algorytmem
  for (let i = 0; i < ilosc; i++) {
    zestawy.gorace.push(generujNaPodstawieCzestych(czestotliwosci))
    zestawy.zimne.push(generujNaPodstawieZimnych(czestotliwosci))
    zestawy.mieszany.push(generujMieszany(czestotliwosci))
    zestawy.balans.push(generujZBalansem())
    zestawy.losowy.push(generujLosowyZestaw())
  }

  return zestawy
}

// Użycie
const porownanie = porownajStrategie(wyniki, 5)
console.log("Gorące:", porownanie.gorace)
console.log("Zimne:", porownanie.zimne)
// itd.
```

---

### 18. Analiza Własnego Zestawu

```typescript
import { obliczCzestotliwoscLiczb, znajdzGoraceIZimne } from "@/lib/statystyki"

function analizujWlasnyZestaw(
  mojZestaw: number[],
  wyniki: Losowanie[]
): {
  goraceWZestawie: number[]
  zimneWZestawie: number[]
  suma: number
  parzystych: number
  nieparzystych: number
} {
  const czestotliwosci = obliczCzestotliwoscLiczb(wyniki)
  const { gorace, zimne } = znajdzGoraceIZimne(czestotliwosci, 10)

  return {
    goraceWZestawie: mojZestaw.filter((n) => gorace.includes(n)),
    zimneWZestawie: mojZestaw.filter((n) => zimne.includes(n)),
    suma: mojZestaw.reduce((acc, n) => acc + n, 0),
    parzystych: mojZestaw.filter((n) => n % 2 === 0).length,
    nieparzystych: mojZestaw.filter((n) => n % 2 !== 0).length,
  }
}

// Użycie
const mojZestaw = [5, 12, 23, 34, 41, 47]
const analiza = analizujWlasnyZestaw(mojZestaw, wyniki)

console.log(
  `Masz ${analiza.goraceWZestawie.length} gorących liczb:`,
  analiza.goraceWZestawie
)
console.log(`Suma: ${analiza.suma}`)
console.log(`Rozkład P/N: ${analiza.parzystych}/${analiza.nieparzystych}`)
```

---

## 🎉 Podsumowanie

Teraz masz kompletny zestaw przykładów:

- ✅ Podstawowe użycie każdej funkcji
- ✅ Integracja w komponentach React
- ✅ getStaticProps w Next.js
- ✅ Przykłady testów
- ✅ Zaawansowane analizy

**Korzystaj z tych przykładów jako reference podczas rozwoju aplikacji!** 🚀
