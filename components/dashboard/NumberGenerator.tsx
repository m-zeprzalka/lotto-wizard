"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CzestotliwoscLiczb } from "@/types"
import {
  generujNaPodstawieCzestych,
  generujNaPodstawieZimnych,
  generujMieszany,
  generujZBalansem,
} from "@/lib/statystyki"
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  BarChart2,
  RefreshCw,
  Copy,
  Check,
  Trash2,
} from "lucide-react"

interface NumberGeneratorProps {
  czestotliwosci: CzestotliwoscLiczb
}

type Algorytm = "czeste" | "zimne" | "mieszany" | "balans"

interface WygenerowanyZestaw {
  id: string
  liczby: number[]
  algorytm: Algorytm
  timestamp: Date
}

export default function NumberGenerator({
  czestotliwosci,
}: NumberGeneratorProps) {
  const [wybranyAlgorytm, setWybranyAlgorytm] = useState<Algorytm>("mieszany")
  const [wygenerowaneZestawy, setWygenerowaneZestawy] = useState<
    WygenerowanyZestaw[]
  >([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const algorytmy = [
    {
      id: "czeste" as Algorytm,
      nazwa: "Gorące",
      opis: "Najczęściej występujące",
      ikona: TrendingUp,
      badgeVariant: "default" as const,
    },
    {
      id: "zimne" as Algorytm,
      nazwa: "Zimne",
      opis: "Najrzadziej występujące",
      ikona: TrendingDown,
      badgeVariant: "secondary" as const,
    },
    {
      id: "mieszany" as Algorytm,
      nazwa: "Mieszane",
      opis: "3 gorące + 3 zimne",
      ikona: BarChart2,
      badgeVariant: "default" as const,
    },
    {
      id: "balans" as Algorytm,
      nazwa: "Balans P/N",
      opis: "3 parzyste + 3 nieparzyste",
      ikona: Sparkles,
      badgeVariant: "outline" as const,
    },
  ]

  const generujZestaw = () => {
    let nowyZestaw: number[]

    switch (wybranyAlgorytm) {
      case "czeste":
        nowyZestaw = generujNaPodstawieCzestych(czestotliwosci)
        break
      case "zimne":
        nowyZestaw = generujNaPodstawieZimnych(czestotliwosci)
        break
      case "mieszany":
        nowyZestaw = generujMieszany(czestotliwosci)
        break
      case "balans":
        nowyZestaw = generujZBalansem()
        break
      default:
        nowyZestaw = generujMieszany(czestotliwosci)
    }

    const nowyElement: WygenerowanyZestaw = {
      id: Date.now().toString(),
      liczby: nowyZestaw,
      algorytm: wybranyAlgorytm,
      timestamp: new Date(),
    }

    setWygenerowaneZestawy([nowyElement, ...wygenerowaneZestawy.slice(0, 4)])
  }

  const handleCopy = async (liczby: number[], id: string) => {
    const textToCopy = liczby.join(", ")
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Nie udało się skopiować:", err)
    }
  }

  const handleDelete = (id: string) => {
    setWygenerowaneZestawy(wygenerowaneZestawy.filter((z) => z.id !== id))
  }

  const handleClearAll = () => {
    setWygenerowaneZestawy([])
  }

  const wybranyAlgorytmData = algorytmy.find((a) => a.id === wybranyAlgorytm)!
  const IkonaAlgorytmu = wybranyAlgorytmData.ikona

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="w-6 h-6" />
          Generator Zestawów Liczb
        </CardTitle>
        <CardDescription className="text-base">
          Wybierz algorytm i eksperymentuj z różnymi zestawami liczb
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wybór algorytmu */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Wybierz Algorytm:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {algorytmy.map((alg) => {
              const Ikona = alg.ikona
              const isSelected = wybranyAlgorytm === alg.id

              return (
                <button
                  key={alg.id}
                  onClick={() => setWybranyAlgorytm(alg.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`w-12 h-12 mx-auto mb-2 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-background"
                    }`}
                  >
                    <Ikona className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-center mb-1">
                    {alg.nazwa}
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    {alg.opis}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Przycisk generowania */}
        <div className="flex justify-center">
          <Button onClick={generujZestaw} size="lg" className="px-8 gap-2">
            <IkonaAlgorytmu className="w-5 h-5" />
            Generuj Nowy Zestaw
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>

        {/* Wyświetlanie wygenerowanych zestawów - KARTY JAK W HERO */}
        {wygenerowaneZestawy.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Historia Wygenerowanych Zestawów:
              </h3>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs text-muted-foreground hover:text-destructive gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Wyczyść wszystkie
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wygenerowaneZestawy.map((zestaw, index) => {
                const algorytmInfo = algorytmy.find(
                  (a) => a.id === zestaw.algorytm
                )!
                const IkonaZestawu = algorytmInfo.ikona
                const isCopied = copiedId === zestaw.id

                return (
                  <Card
                    key={zestaw.id}
                    className={`relative overflow-hidden transition-shadow ${
                      index === 0
                        ? "border-primary shadow-md"
                        : "hover:shadow-md"
                    }`}
                  >
                    <CardHeader className="space-y-3 pb-4">
                      <div className="flex items-start justify-between">
                        <Badge
                          variant={
                            index === 0 ? "default" : algorytmInfo.badgeVariant
                          }
                        >
                          {index === 0 ? "🆕 Najnowszy" : `Zestaw ${index + 1}`}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {zestaw.timestamp.toLocaleTimeString("pl-PL", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <IkonaZestawu className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-1">
                          {algorytmInfo.nazwa}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {algorytmInfo.opis}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Liczby - grid 6 kolumn jak w HERO */}
                      <div className="grid grid-cols-6 gap-2">
                        {zestaw.liczby.map((liczba) => (
                          <div
                            key={liczba}
                            className="aspect-square rounded-full border-2 border-primary bg-background flex items-center justify-center font-bold text-sm md:text-base hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                          >
                            {liczba}
                          </div>
                        ))}
                      </div>

                      {/* Przyciski akcji */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant={isCopied ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleCopy(zestaw.liczby, zestaw.id)}
                          className="flex-1 gap-2"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-4 h-4" />
                              Skopiowano!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Kopiuj numery
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(zestaw.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="p-4 bg-muted/50 rounded-lg border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">⚠️ Uwaga:</strong> Generator
            służy do eksperymentowania z różnymi algorytmami. Każde losowanie
            Lotto jest niezależne i całkowicie losowe — analiza statystyczna nie
            gwarantuje wygranej. Traktuj to jako narzędzie edukacyjne i zabawę
            matematyczną!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
