/**
 * Skrypt konwersji danych z formatu oryginalnego do formatu wymaganego przez aplikację
 * Uruchom: node scripts/convertData.js
 */

const fs = require("fs")
const path = require("path")

// Funkcja konwertująca datę z DD-MM-YYYY na YYYY-MM-DD
function convertDate(dateStr) {
  const [day, month, year] = dateStr.split("-")
  return `${year}-${month}-${day}`
}

// Odczytaj oryginalny plik
const inputPath = path.join(__dirname, "..", "wyniki_lotto.json")
const outputPath = path.join(
  __dirname,
  "..",
  "public",
  "data",
  "wyniki_lotto.json"
)

console.log("🔄 Rozpoczynam konwersję danych...")

try {
  // Odczytaj dane
  const rawData = fs.readFileSync(inputPath, "utf8")
  const originalData = JSON.parse(rawData)

  console.log(`📊 Znaleziono ${originalData.length} losowań`)

  // Konwertuj dane
  const convertedData = originalData.map((item) => ({
    numerLosowania: item.numer_losowania,
    dataLosowania: convertDate(item.data),
    liczbyLotto: item.liczby,
  }))

  // Utwórz katalog jeśli nie istnieje
  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
    console.log("📁 Utworzono katalog public/data/")
  }

  // Zapisz skonwertowane dane
  fs.writeFileSync(outputPath, JSON.stringify(convertedData, null, 2), "utf8")

  console.log("✅ Konwersja zakończona pomyślnie!")
  console.log(`📝 Zapisano do: ${outputPath}`)

  // Wyświetl przykładowe dane
  console.log("\n📋 Przykładowe skonwertowane dane (pierwsze 3 losowania):")
  console.log(JSON.stringify(convertedData.slice(0, 3), null, 2))
} catch (error) {
  console.error("❌ Błąd podczas konwersji:", error.message)
  process.exit(1)
}
