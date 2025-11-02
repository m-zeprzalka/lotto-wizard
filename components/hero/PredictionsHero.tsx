import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, BarChart2 } from "lucide-react"

interface PredictionsHeroProps {
  mieszanyZestaw: number[]
  goraceZestaw: number[]
  balansZestaw: number[]
}

export default function PredictionsHero({
  mieszanyZestaw,
  goraceZestaw,
  balansZestaw,
}: PredictionsHeroProps) {
  const predictions = [
    {
      id: 1,
      nazwa: "Analiza Mieszana",
      opis: "3 gorące + 3 zimne liczby",
      liczby: mieszanyZestaw,
      ikona: BarChart2,
      badge: "Rekomendowane",
    },
    {
      id: 2,
      nazwa: "Gorące Liczby",
      opis: "Najczęściej losowane",
      liczby: goraceZestaw,
      ikona: TrendingUp,
      badge: "Popularne",
    },
    {
      id: 3,
      nazwa: "Balans P/N",
      opis: "3 parzyste + 3 nieparzyste",
      liczby: balansZestaw,
      ikona: Sparkles,
      badge: "Zbalansowane",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Twoje Predykcje na Następne Losowanie
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Zestawy liczb wygenerowane przez algorytmy analizy statystycznej
        </p>
      </div>

      {/* Predictions Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {predictions.map((prediction) => {
          const Ikona = prediction.ikona
          return (
            <Card key={prediction.id} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Ikona className="w-5 h-5" />
                    <CardTitle className="text-lg">
                      {prediction.nazwa}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary">{prediction.badge}</Badge>
                </div>
                <CardDescription>{prediction.opis}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 justify-center flex-wrap">
                  {prediction.liczby.map((liczba) => (
                    <div
                      key={liczba}
                      className="w-12 h-12 rounded-full border-2 border-foreground flex items-center justify-center font-bold text-lg"
                    >
                      {liczba}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Info */}
      <div className="p-4 bg-muted rounded-lg border text-center">
        <p className="text-sm text-muted-foreground">
          <strong>Wygenerowano na podstawie analizy</strong> historycznych
          danych losowań Lotto
        </p>
      </div>
    </div>
  )
}
