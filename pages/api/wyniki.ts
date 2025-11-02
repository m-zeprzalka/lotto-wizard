import type { NextApiRequest, NextApiResponse } from "next"
import { Losowanie } from "@/types"
import path from "path"
import fs from "fs"

/**
 * API Route do pobierania wyników Lotto
 * GET /api/wyniki - Zwraca wszystkie wyniki losowań
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Losowanie[] | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Metoda nie dozwolona" })
  }

  try {
    // Ścieżka do pliku JSON
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "wyniki_lotto.json"
    )

    // Sprawdzenie czy plik istnieje
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: "Plik z wynikami nie został znaleziony",
      })
    }

    // Odczyt i parsowanie pliku
    const fileContents = fs.readFileSync(filePath, "utf8")
    const data: Losowanie[] = JSON.parse(fileContents)

    // Walidacja danych
    if (!Array.isArray(data)) {
      return res.status(500).json({
        error: "Nieprawidłowy format danych",
      })
    }

    // Opcjonalna walidacja struktury pojedynczego losowania
    if (data.length > 0) {
      const pierwszeLosowanie = data[0]
      if (
        !pierwszeLosowanie.numerLosowania ||
        !pierwszeLosowanie.dataLosowania ||
        !Array.isArray(pierwszeLosowanie.liczbyLotto) ||
        pierwszeLosowanie.liczbyLotto.length !== 6
      ) {
        return res.status(500).json({
          error: "Nieprawidłowa struktura danych losowania",
        })
      }
    }

    // Zwrócenie danych
    res.status(200).json(data)
  } catch (error) {
    console.error("Błąd podczas odczytu pliku:", error)
    res.status(500).json({
      error: "Wystąpił błąd podczas odczytu danych",
    })
  }
}
