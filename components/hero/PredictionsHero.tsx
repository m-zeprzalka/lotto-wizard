"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, BarChart2, Copy, Check } from "lucide-react"

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
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const predictions = [
    {
      id: 1,
      nazwa: "Analiza Mieszana",
      opis: "3 gorące + 3 zimne liczby",
      liczby: mieszanyZestaw,
      ikona: BarChart2,
      badge: "Rekomendowane",
      badgeVariant: "default" as const,
    },
    {
      id: 2,
      nazwa: "Gorące Liczby",
      opis: "Najczęściej losowane",
      liczby: goraceZestaw,
      ikona: TrendingUp,
      badge: "Popularne",
      badgeVariant: "secondary" as const,
    },
    {
      id: 3,
      nazwa: "Balans P/N",
      opis: "3 parzyste + 3 nieparzyste",
      liczby: balansZestaw,
      ikona: Sparkles,
      badge: "Zbalansowane",
      badgeVariant: "outline" as const,
    },
  ]

  const handleCopy = async (liczby: number[], id: number) => {
    const textToCopy = liczby.join(", ")
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Nie udało się skopiować:", err)
    }
  }

  return (
    <div className="space-y-8 md:py-12 lg:py-16 xl:py-32">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-sm px-3 py-1">
          🎯 Rekomendacje LottoWizard
        </Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
          Twoje Predykcje na Następne Losowanie
        </h1>
        <p className="text-base md:text-lg xl:text-2xl text-muted-foreground max-w-4xl mx-auto">
          Stałe zestawy liczb przygotowane przez algorytmy analizy statystycznej
        </p>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {predictions.map((prediction) => {
          const Ikona = prediction.ikona
          const isCopied = copiedId === prediction.id

          return (
            <Card
              key={prediction.id}
              className="relative overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <Badge variant={prediction.badgeVariant}>
                    {prediction.badge}
                  </Badge>
                  <Ikona className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl mb-1">
                    {prediction.nazwa}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {prediction.opis}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Liczby */}
                <div className="grid grid-cols-6 gap-2">
                  {prediction.liczby.map((liczba) => (
                    <div
                      key={liczba}
                      className="aspect-square rounded-full border-2 border-primary bg-background flex items-center justify-center font-bold text-base lg:text-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {liczba}
                    </div>
                  ))}
                </div>

                {/* Przycisk kopiowania */}
                <Button
                  onClick={() => handleCopy(prediction.liczby, prediction.id)}
                  variant={isCopied ? "secondary" : "outline"}
                  className="w-full"
                  size="sm"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Skopiowano!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Kopiuj numery
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Info */}

      <p className="text-center text-sm md:text-base text-muted-foreground">
        <strong className="text-foreground">
          Numery stałe dla aktualnego losowania
        </strong>
        <br className="md:hidden" />
        <span className="hidden md:inline"> — </span>
        Przygotowane na podstawie analizy 333 historycznych losowań Lotto
      </p>
    </div>
  )
}
