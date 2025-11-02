import { GetStaticProps } from "next"
import Head from "next/head"
import Header from "@/components/layout/Header"
import ResultsTable from "@/components/archive/ResultsTable"
import { Losowanie } from "@/types"
import fs from "fs"
import path from "path"
import { Archive } from "lucide-react"

interface ArchiwumProps {
  wyniki: Losowanie[]
}

export default function Archiwum({ wyniki }: ArchiwumProps) {
  return (
    <>
      <Head>
        <title>Archiwum Losowań - LottoWizard</title>
        <meta
          name="description"
          content="Kompletne archiwum wszystkich losowań Lotto"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Nagłówek */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <Archive className="w-10 h-10 text-purple-600" />
              Archiwum Losowań
            </h2>
            <p className="text-gray-600 text-lg">
              Przeglądaj kompletną historię wszystkich {wyniki.length} losowań
              Lotto
            </p>
          </div>

          {/* Tabela wyników */}
          <ResultsTable wyniki={wyniki} />

          {/* Informacja o danych */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-bold text-blue-800 mb-2">
              📊 Informacje o danych
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
              <div>
                <strong>Liczba losowań:</strong> {wyniki.length}
              </div>
              <div>
                <strong>Najstarsze losowanie:</strong>{" "}
                {wyniki[wyniki.length - 1]?.dataLosowania}
              </div>
              <div>
                <strong>Najnowsze losowanie:</strong> {wyniki[0]?.dataLosowania}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
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

export const getStaticProps: GetStaticProps<ArchiwumProps> = async () => {
  // Wczytaj dane z pliku JSON
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    "wyniki_lotto.json"
  )
  const fileContents = fs.readFileSync(filePath, "utf8")
  const wyniki: Losowanie[] = JSON.parse(fileContents)

  // Sortuj wyniki od najnowszych
  const posortowaneWyniki = [...wyniki].sort((a, b) => {
    return (
      new Date(b.dataLosowania).getTime() - new Date(a.dataLosowania).getTime()
    )
  })

  return {
    props: {
      wyniki: posortowaneWyniki,
    },
  }
}
