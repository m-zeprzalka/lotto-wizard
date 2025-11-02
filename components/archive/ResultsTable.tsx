import { useState } from "react"
import { Losowanie } from "@/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatujDate } from "@/lib/statystyki"
import { Calendar, Hash } from "lucide-react"

interface ResultsTableProps {
  wyniki: Losowanie[]
}

export default function ResultsTable({ wyniki }: ResultsTableProps) {
  const [strona, setStrona] = useState(1)
  const wynikiNaStrone = 20

  // Sortowanie wyników od najnowszych
  const posortowaneWyniki = [...wyniki].sort((a, b) => {
    return (
      new Date(b.dataLosowania).getTime() - new Date(a.dataLosowania).getTime()
    )
  })

  // Paginacja
  const indeksStartowy = (strona - 1) * wynikiNaStrone
  const indeksKoncowy = indeksStartowy + wynikiNaStrone
  const wynikiDoWyswietlenia = posortowaneWyniki.slice(
    indeksStartowy,
    indeksKoncowy
  )
  const liczbStron = Math.ceil(posortowaneWyniki.length / wynikiNaStrone)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Archiwum Wszystkich Losowań
        </CardTitle>
        <CardDescription>
          Kompletna historia losowań Lotto ({wyniki.length} losowań)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Nr Losowania
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Data
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  Wylosowane Liczby
                </th>
                <th className="text-center py-3 px-4 font-semibold">Suma</th>
              </tr>
            </thead>
            <tbody>
              {wynikiDoWyswietlenia.map((losowanie, index) => {
                const suma = losowanie.liczbyLotto.reduce(
                  (acc, num) => acc + num,
                  0
                )
                const parzyste = losowanie.liczbyLotto.filter(
                  (n) => n % 2 === 0
                ).length
                const nieparzyste = 6 - parzyste

                return (
                  <tr
                    key={losowanie.numerLosowania}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-muted/30" : ""
                    } hover:bg-muted/50 transition-colors`}
                  >
                    <td className="py-3 px-4 font-mono text-sm">
                      #{losowanie.numerLosowania}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatujDate(losowanie.dataLosowania)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {losowanie.liczbyLotto.map((liczba) => (
                          <div
                            key={liczba}
                            className="w-9 h-9 rounded-full border-2 border-foreground flex items-center justify-center font-bold text-sm"
                          >
                            {liczba}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {parzyste}P / {nieparzyste}N
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-lg">
                      {suma}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Paginacja */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Strona {strona} z {liczbStron} (wyświetlono{" "}
            {wynikiDoWyswietlenia.length} z {wyniki.length} losowań)
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setStrona(Math.max(1, strona - 1))}
              disabled={strona === 1}
              variant="outline"
            >
              ← Poprzednia
            </Button>
            <Button
              onClick={() => setStrona(Math.min(liczbStron, strona + 1))}
              disabled={strona === liczbStron}
              variant="outline"
            >
              Następna →
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
