import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CzestotliwoscLiczb } from "@/types"

interface FrequencyChartProps {
  czestotliwosci: CzestotliwoscLiczb
}

export default function FrequencyChart({
  czestotliwosci,
}: FrequencyChartProps) {
  // Konwersja do tablicy i sortowanie według częstotliwości
  const dane = Object.entries(czestotliwosci)
    .map(([liczba, freq]) => ({
      liczba: parseInt(liczba),
      czestotliwosc: freq,
    }))
    .sort((a, b) => b.czestotliwosc - a.czestotliwosc)

  // Znajdź maksymalną częstotliwość dla skalowania
  const maxFreq = Math.max(...dane.map((d) => d.czestotliwosc))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Częstotliwość Występowania Liczb</CardTitle>
        <CardDescription>
          Liczby posortowane według częstości występowania w losowaniach
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 max-h-[600px] overflow-y-auto">
          {dane.map(({ liczba, czestotliwosc }) => {
            const wysokosc = (czestotliwosc / maxFreq) * 100

            return (
              <div
                key={liczba}
                className="flex flex-col items-center space-y-1"
                title={`Liczba ${liczba}: ${czestotliwosc} wystąpień`}
              >
                <div className="relative w-full h-32 bg-muted rounded-t flex items-end justify-center">
                  <div
                    className="bg-foreground w-full rounded-t transition-all flex items-end justify-center pb-1"
                    style={{ height: `${wysokosc}%` }}
                  >
                    <span className="text-xs font-bold text-background">
                      {czestotliwosc}
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center font-bold">
                  {liczba}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg border">
          <p className="text-sm text-muted-foreground">
            <strong>Wskazówka:</strong> Wysokość słupka pokazuje częstość
            występowania liczby w historycznych losowaniach.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
