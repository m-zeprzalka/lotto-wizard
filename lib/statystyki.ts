import {
  Losowanie,
  CzestotliwoscLiczb,
  GoraceZimne,
  RozkladParzysteNieparzyste,
  StatystykiSum,
} from "@/types"

/**
 * Funkcja 1: Oblicza częstotliwość występowania każdej liczby (1-49)
 * @param wyniki - Tablica wszystkich losowań
 * @returns Obiekt mapujący liczbę na ilość jej wystąpień
 */
export function obliczCzestotliwoscLiczb(
  wyniki: Losowanie[]
): CzestotliwoscLiczb {
  // Inicjalizacja obiektu z wszystkimi liczbami od 1 do 49
  const czestotliwosc: CzestotliwoscLiczb = {}
  for (let i = 1; i <= 49; i++) {
    czestotliwosc[i.toString()] = 0
  }

  // Zliczanie wystąpień każdej liczby we wszystkich losowaniach
  wyniki.forEach((losowanie) => {
    losowanie.liczbyLotto.forEach((liczba) => {
      czestotliwosc[liczba.toString()]++
    })
  })

  return czestotliwosc
}

/**
 * Funkcja 2: Znajduje najczęściej (gorące) i najrzadziej (zimne) losowane liczby
 * @param daneCzestotliwosci - Obiekt z częstotliwościami z funkcji obliczCzestotliwoscLiczb
 * @param ilosc - Ile liczb górących i zimnych zwrócić
 * @returns Obiekt zawierający tablice gorących i zimnych liczb
 */
export function znajdzGoraceIZimne(
  daneCzestotliwosci: CzestotliwoscLiczb,
  ilosc: number = 10
): GoraceZimne {
  // Konwersja obiektu na tablicę par [liczba, częstotliwość]
  const pary = Object.entries(daneCzestotliwosci).map(([liczba, freq]) => ({
    liczba: parseInt(liczba),
    czestotliwosc: freq,
  }))

  // Sortowanie według częstotliwości malejąco
  const posortowane = pary.sort((a, b) => b.czestotliwosc - a.czestotliwosc)

  // Wybór top N najczęstszych (gorące)
  const gorace = posortowane.slice(0, ilosc).map((p) => p.liczba)

  // Wybór top N najrzadszych (zimne)
  const zimne = posortowane
    .slice(-ilosc)
    .map((p) => p.liczba)
    .reverse()

  return { gorace, zimne }
}

/**
 * Funkcja 3: Analizuje rozkład liczb parzystych i nieparzystych w każdym losowaniu
 * @param wyniki - Tablica wszystkich losowań
 * @returns Obiekt z częstotliwością występowania każdej kombinacji parzyste/nieparzyste
 */
export function analizujParzysteNieparzyste(
  wyniki: Losowanie[]
): RozkladParzysteNieparzyste {
  const rozklad: RozkladParzysteNieparzyste = {}

  // Inicjalizacja wszystkich możliwych kombinacji (0/6, 1/5, 2/4, 3/3, 4/2, 5/1, 6/0)
  for (let i = 0; i <= 6; i++) {
    const nieparzyste = i
    const parzyste = 6 - i
    const klucz = `${parzyste}/${nieparzyste}`
    rozklad[klucz] = 0
  }

  // Analiza każdego losowania
  wyniki.forEach((losowanie) => {
    const parzyste = losowanie.liczbyLotto.filter((l) => l % 2 === 0).length
    const nieparzyste = 6 - parzyste
    const klucz = `${parzyste}/${nieparzyste}`
    rozklad[klucz]++
  })

  return rozklad
}

/**
 * Funkcja 4: Oblicza statystyki sum wszystkich losowań
 * @param wyniki - Tablica wszystkich losowań
 * @returns Obiekt ze statystykami: min, max, średnia, mediana
 */
export function analizujSumyLosowan(wyniki: Losowanie[]): StatystykiSum {
  // Obliczanie sum dla każdego losowania
  const sumy = wyniki.map((losowanie) =>
    losowanie.liczbyLotto.reduce((acc, num) => acc + num, 0)
  )

  // Sortowanie sum do obliczenia mediany
  const posortowaneSumy = [...sumy].sort((a, b) => a - b)

  // Obliczanie statystyk
  const min = Math.min(...sumy)
  const max = Math.max(...sumy)
  const srednia = sumy.reduce((acc, s) => acc + s, 0) / sumy.length

  // Obliczanie mediany
  let mediana: number
  const srodek = Math.floor(posortowaneSumy.length / 2)
  if (posortowaneSumy.length % 2 === 0) {
    mediana = (posortowaneSumy[srodek - 1] + posortowaneSumy[srodek]) / 2
  } else {
    mediana = posortowaneSumy[srodek]
  }

  return {
    min,
    max,
    srednia: Math.round(srednia * 100) / 100, // Zaokrąglenie do 2 miejsc po przecinku
    mediana,
  }
}

/**
 * Algorytm 1: Generuje zestaw oparty na najczęściej występujących liczbach
 * @param czestotliwosci - Obiekt z częstotliwościami
 * @returns Tablica 6 losowo wybranych liczb z top 15 najczęstszych
 */
export function generujNaPodstawieCzestych(
  czestotliwosci: CzestotliwoscLiczb
): number[] {
  const top15 = znajdzGoraceIZimne(czestotliwosci, 15).gorace
  const wynik = new Set<number>()

  // Losowo wybierz 6 liczb z top 15
  while (wynik.size < 6) {
    const losowyIndeks = Math.floor(Math.random() * top15.length)
    wynik.add(top15[losowyIndeks])
  }

  return Array.from(wynik).sort((a, b) => a - b)
}

/**
 * Algorytm 2: Generuje zestaw oparty na najrzadziej występujących liczbach
 * Teoria: "zimne" liczby są "wymagalne"
 * @param czestotliwosci - Obiekt z częstotliwościami
 * @returns Tablica 6 losowo wybranych liczb z top 15 najrzadszych
 */
export function generujNaPodstawieZimnych(
  czestotliwosci: CzestotliwoscLiczb
): number[] {
  const top15zimnych = znajdzGoraceIZimne(czestotliwosci, 15).zimne
  const wynik = new Set<number>()

  // Losowo wybierz 6 liczb z 15 najrzadszych
  while (wynik.size < 6) {
    const losowyIndeks = Math.floor(Math.random() * top15zimnych.length)
    wynik.add(top15zimnych[losowyIndeks])
  }

  return Array.from(wynik).sort((a, b) => a - b)
}

/**
 * Algorytm 3: Generuje zestaw mieszany (gorące + zimne)
 * @param czestotliwosci - Obiekt z częstotliwościami
 * @returns Tablica 6 liczb: 3 z gorących, 3 z zimnych
 */
export function generujMieszany(czestotliwosci: CzestotliwoscLiczb): number[] {
  const { gorace, zimne } = znajdzGoraceIZimne(czestotliwosci, 10)
  const wynik = new Set<number>()

  // Wybierz 3 gorące
  while (wynik.size < 3) {
    const losowyIndeks = Math.floor(Math.random() * gorace.length)
    wynik.add(gorace[losowyIndeks])
  }

  // Wybierz 3 zimne
  while (wynik.size < 6) {
    const losowyIndeks = Math.floor(Math.random() * zimne.length)
    wynik.add(zimne[losowyIndeks])
  }

  return Array.from(wynik).sort((a, b) => a - b)
}

/**
 * Algorytm 4: Generuje zestaw z balansem parzystych/nieparzystych
 * Preferuje najbardziej popularny rozkład 3/3
 * @returns Tablica 6 liczb: 3 parzyste, 3 nieparzyste
 */
export function generujZBalansem(): number[] {
  const wynik: number[] = []

  // Generuj 3 parzyste liczby
  const parzyste = new Set<number>()
  while (parzyste.size < 3) {
    const liczba = (Math.floor(Math.random() * 24) + 1) * 2 // Liczby parzyste: 2, 4, ..., 48
    if (liczba <= 49) parzyste.add(liczba)
  }

  // Generuj 3 nieparzyste liczby
  const nieparzyste = new Set<number>()
  while (nieparzyste.size < 3) {
    const liczba = Math.floor(Math.random() * 25) * 2 + 1 // Liczby nieparzyste: 1, 3, ..., 49
    nieparzyste.add(liczba)
  }

  return [...Array.from(parzyste), ...Array.from(nieparzyste)].sort(
    (a, b) => a - b
  )
}

/**
 * Funkcja pomocnicza: Formatuje datę do polskiego formatu
 */
export function formatujDate(data: string): string {
  const [rok, miesiac, dzien] = data.split("-")
  return `${dzien}.${miesiac}.${rok}`
}

/**
 * Funkcja pomocnicza: Sortuje losowania według daty (od najnowszych)
 */
export function sortujLosowaniaPoDatech(
  wyniki: Losowanie[],
  malejaco: boolean = true
): Losowanie[] {
  return [...wyniki].sort((a, b) => {
    const dataA = new Date(a.dataLosowania).getTime()
    const dataB = new Date(b.dataLosowania).getTime()
    return malejaco ? dataB - dataA : dataA - dataB
  })
}
