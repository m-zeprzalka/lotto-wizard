import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RozkladParzysteNieparzyste, StatystykiSum } from "@/types"
import { Calculator, PieChart } from "lucide-react"

interface AnalyticsPanelsProps {
  rozkladParzysteNieparzyste: RozkladParzysteNieparzyste
  statystykiSum: StatystykiSum
}

export default function AnalyticsPanels({
  rozkladParzysteNieparzyste,
  statystykiSum,
}: AnalyticsPanelsProps) {
  // Konwersja rozkładu na tablicę i sortowanie
  const rozkladArray = Object.entries(rozkladParzysteNieparzyste)
    .map(([klucz, wartosc]) => ({ klucz, wartosc }))
    .sort((a, b) => b.wartosc - a.wartosc)

  const maxWartosc = Math.max(...rozkladArray.map((r) => r.wartosc))

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Panel Rozkładu Parzystych/Nieparzystych */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Rozkład Parzystych/Nieparzystych
          </CardTitle>
          <CardDescription>
            Analiza kombinacji liczb parzystych i nieparzystych (P/N)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rozkladArray.map(({ klucz, wartosc }) => {
              const procent = ((wartosc / maxWartosc) * 100).toFixed(1)
              const [parzyste, nieparzyste] = klucz.split("/")

              return (
                <div key={klucz} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">
                      {parzyste}P / {nieparzyste}N
                    </span>
                    <span className="text-muted-foreground">
                      {wartosc} wystąpień ({procent}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-foreground h-full flex items-center justify-end pr-2 text-background text-xs font-bold transition-all"
                      style={{ width: `${procent}%` }}
                    >
                      {parseFloat(procent) > 10 && `${procent}%`}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg border">
            <p className="text-sm text-muted-foreground">
              <strong>Najbardziej popularna kombinacja:</strong>{" "}
              {rozkladArray[0].klucz} ({rozkladArray[0].wartosc} wystąpień)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Panel Statystyk Sum */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Statystyki Sum Losowań
          </CardTitle>
          <CardDescription>
            Analiza sum wszystkich 6 liczb w każdym losowaniu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg border">
              <div className="text-sm text-muted-foreground mb-1">
                Minimalna Suma
              </div>
              <div className="text-3xl font-bold">{statystykiSum.min}</div>
            </div>

            <div className="p-4 bg-muted rounded-lg border">
              <div className="text-sm text-muted-foreground mb-1">
                Maksymalna Suma
              </div>
              <div className="text-3xl font-bold">{statystykiSum.max}</div>
            </div>

            <div className="p-4 bg-muted rounded-lg border">
              <div className="text-sm text-muted-foreground mb-1">
                Średnia Suma
              </div>
              <div className="text-3xl font-bold">{statystykiSum.srednia}</div>
            </div>

            <div className="p-4 bg-muted rounded-lg border">
              <div className="text-sm text-muted-foreground mb-1">
                Mediana Sum
              </div>
              <div className="text-3xl font-bold">{statystykiSum.mediana}</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg border">
            <p className="text-sm text-muted-foreground">
              <strong>Zakres sum:</strong> Suma 6 losowanych liczb mieści się
              między {statystykiSum.min} a {statystykiSum.max}. Średnia suma
              wynosi {statystykiSum.srednia}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
