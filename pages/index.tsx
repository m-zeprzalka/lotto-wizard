import { GetStaticProps } from "next"
import Head from "next/head"
import Header from "@/components/layout/Header"
import PredictionsHero from "@/components/hero/PredictionsHero"
import FrequencyChart from "@/components/dashboard/FrequencyChart"
import HotColdPanel from "@/components/dashboard/HotColdPanel"
import NumberGenerator from "@/components/dashboard/NumberGenerator"
import AnalyticsPanels from "@/components/dashboard/AnalyticsPanels"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Losowanie, StatystykiDashboard } from "@/types"
import {
  obliczCzestotliwoscLiczb,
  znajdzGoraceIZimne,
  analizujParzysteNieparzyste,
  analizujSumyLosowan,
  sortujLosowaniaPoDatech,
  generujMieszany,
  generujNaPodstawieCzestych,
  generujZBalansem,
} from "@/lib/statystyki"
import fs from "fs"
import path from "path"
import { BarChart2, TrendingUp, Calendar } from "lucide-react"

interface HomeProps {
  statystyki: StatystykiDashboard
  heroPredictions: {
    mieszany: number[]
    gorace: number[]
    balans: number[]
  }
}

export default function Home({ statystyki, heroPredictions }: HomeProps) {
  return (
    <>
      <Head>
        <title>LottoWizard - Predykcje Lotto</title>
        <meta
          name="description"
          content="Predykcje liczb Lotto oparte na analizie statystycznej historycznych losowań"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8 space-y-12">
          {/* HERO SECTION - Natychmiastowe predykcje */}
          <section>
            <PredictionsHero
              mieszanyZestaw={heroPredictions.mieszany}
              goraceZestaw={heroPredictions.gorace}
              balansZestaw={heroPredictions.balans}
            />
          </section>

          {/* Statystyki ogólne */}
          <section>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Liczba Losowań
                  </CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statystyki.liczbaLosowan}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Analizowanych losowań
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Okres Analizy
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.ceil(
                      (new Date(statystyki.zakresData.do).getTime() -
                        new Date(statystyki.zakresData.od).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    dni
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {statystyki.zakresData.od} - {statystyki.zakresData.do}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Średnia Suma
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statystyki.statystykiSum.srednia}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Średnia suma 6 liczb
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Generator liczb */}
          <section>
            <NumberGenerator czestotliwosci={statystyki.czestotliwosci} />
          </section>

          {/* Gorące i zimne liczby */}
          <section>
            <HotColdPanel goraceZimne={statystyki.goraceZimne} />
          </section>

          {/* Wykres częstotliwości */}
          <section>
            <FrequencyChart czestotliwosci={statystyki.czestotliwosci} />
          </section>

          {/* Panele analityczne */}
          <section>
            <AnalyticsPanels
              rozkladParzysteNieparzyste={statystyki.rozkladParzysteNieparzyste}
              statystykiSum={statystyki.statystykiSum}
            />
          </section>

          {/* Disclaimer */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Ważne zastrzeżenie</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong>LottoWizard</strong> jest narzędziem analitycznym i
                  edukacyjnym, prezentującym matematyczne i statystyczne
                  podejście do danych historycznych. Każde losowanie Lotto jest{" "}
                  <strong>całkowicie niezależne i losowe</strong>. Nie
                  gwarantujemy wygranej - traktuj tę aplikację jako eksperyment
                  analityczny i źródło ciekawostek statystycznych. Graj
                  odpowiedzialnie!
                </p>
              </CardContent>
            </Card>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>
              © 2025 LottoWizard | Analiza statystyczna Lotto | Graj
              odpowiedzialnie
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  // Wczytaj dane z pliku JSON
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    "wyniki_lotto.json"
  )
  const fileContents = fs.readFileSync(filePath, "utf8")
  const wyniki: Losowanie[] = JSON.parse(fileContents)

  // Oblicz wszystkie statystyki
  const czestotliwosci = obliczCzestotliwoscLiczb(wyniki)
  const goraceZimne = znajdzGoraceIZimne(czestotliwosci, 10)
  const rozkladParzysteNieparzyste = analizujParzysteNieparzyste(wyniki)
  const statystykiSum = analizujSumyLosowan(wyniki)

  // Sortuj wyniki po dacie aby uzyskać zakres
  const posortowane = sortujLosowaniaPoDatech(wyniki, false)
  const zakresData = {
    od: posortowane[0].dataLosowania,
    do: posortowane[posortowane.length - 1].dataLosowania,
  }

  const statystyki: StatystykiDashboard = {
    czestotliwosci,
    goraceZimne,
    rozkladParzysteNieparzyste,
    statystykiSum,
    liczbaLosowan: wyniki.length,
    zakresData,
  }

  // Generuj predykcje dla Hero (po stronie serwera, aby uniknąć hydration errors)
  const heroPredictions = {
    mieszany: generujMieszany(czestotliwosci),
    gorace: generujNaPodstawieCzestych(czestotliwosci),
    balans: generujZBalansem(),
  }

  return {
    props: {
      statystyki,
      heroPredictions,
    },
  }
}
