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
} from "lucide-react"

interface NumberGeneratorProps {
  czestotliwosci: CzestotliwoscLiczb
}

type Algorytm = "czeste" | "zimne" | "mieszany" | "balans"

export default function NumberGenerator({
  czestotliwosci,
}: NumberGeneratorProps) {
  const [wybranyAlgorytm, setWybranyAlgorytm] = useState<Algorytm>("mieszany")
  const [wygenerowaneZestawy, setWygenerowaneZestawy] = useState<number[][]>([])

  const algorytmy = [
    {
      id: "czeste" as Algorytm,
      nazwa: "Gorące",
      opis: "Najczęściej występujące",
      ikona: TrendingUp,
    },
    {
      id: "zimne" as Algorytm,
      nazwa: "Zimne",
      opis: "Najrzadziej występujące",
      ikona: TrendingDown,
    },
    {
      id: "mieszany" as Algorytm,
      nazwa: "Mieszane",
      opis: "3 gorące + 3 zimne",
      ikona: BarChart2,
    },
    {
      id: "balans" as Algorytm,
      nazwa: "Balans P/N",
      opis: "3 parzyste + 3 nieparzyste",
      ikona: Sparkles,
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

    setWygenerowaneZestawy([nowyZestaw, ...wygenerowaneZestawy.slice(0, 4)])
  }

  const wybranyAlgorytmData = algorytmy.find((a) => a.id === wybranyAlgorytm)!
  const IkonaAlgorytmu = wybranyAlgorytmData.ikona

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          🎲 Generator Zestawów Liczb
        </CardTitle>
        <CardDescription>
          Wybierz algorytm i wygeneruj propozycje zestawów na podstawie analizy
          historycznej
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wybór algorytmu */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Wybierz Algorytm:</h3>
          <div className="grid md:grid-cols-4 gap-3">
            {algorytmy.map((alg) => {
              const Ikona = alg.ikona
              return (
                <button
                  key={alg.id}
                  onClick={() => setWybranyAlgorytm(alg.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    wybranyAlgorytm === alg.id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-gray-200 hover:border-primary/50 hover:shadow"
                  }`}
                >
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full border-2 border-muted flex items-center justify-center">
                    <Ikona className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-semibold text-center mb-1">
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
          <Button onClick={generujZestaw} size="lg" className="px-8">
            <IkonaAlgorytmu className="w-5 h-5 mr-2" />
            Generuj Zestaw
            <RefreshCw className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Wyświetlanie wygenerowanych zestawów */}
        {wygenerowaneZestawy.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Wygenerowane Zestawy:</h3>
            {wygenerowaneZestawy.map((zestaw, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  index === 0
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={index === 0 ? "default" : "outline"}>
                    {index === 0 ? "Najnowszy" : `Zestaw ${index + 1}`}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date().toLocaleTimeString("pl-PL")}
                  </span>
                </div>
                <div className="flex gap-2 justify-center">
                  {zestaw.map((liczba) => (
                    <div
                      key={liczba}
                      className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center font-bold"
                    >
                      {liczba}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-muted rounded-lg border">
          <p className="text-sm text-muted-foreground">
            ⚠️ <strong>Uwaga:</strong> Generator działa na podstawie analizy
            statystycznej danych historycznych. Nie gwarantuje wygranej - każde
            losowanie Lotto jest niezależne i całkowicie losowe. Traktuj to jako
            narzędzie analityczne i zabawę matematyczną!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
