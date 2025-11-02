/**
 * Interfejs reprezentujący pojedyncze losowanie Lotto
 */
export interface Losowanie {
  numerLosowania: number
  dataLosowania: string // Format: YYYY-MM-DD
  liczbyLotto: number[] // Tablica 6 liczb z zakresu 1-49
}

/**
 * Statystyki częstotliwości występowania liczb
 */
export interface CzestotliwoscLiczb {
  [liczba: string]: number
}

/**
 * Gorące i zimne liczby
 */
export interface GoraceZimne {
  gorace: number[]
  zimne: number[]
}

/**
 * Rozkład parzystych i nieparzystych liczb
 */
export interface RozkladParzysteNieparzyste {
  [klucz: string]: number // np. "3/3": 150
}

/**
 * Statystyki sum losowań
 */
export interface StatystykiSum {
  min: number
  max: number
  srednia: number
  mediana: number
}

/**
 * Kompletne statystyki dla dashboardu
 */
export interface StatystykiDashboard {
  czestotliwosci: CzestotliwoscLiczb
  goraceZimne: GoraceZimne
  rozkladParzysteNieparzyste: RozkladParzysteNieparzyste
  statystykiSum: StatystykiSum
  liczbaLosowan: number
  zakresData: {
    od: string
    do: string
  }
}
