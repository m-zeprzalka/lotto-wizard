import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GoraceZimne } from "@/types"
import { Flame, Snowflake } from "lucide-react"

interface HotColdPanelProps {
  goraceZimne: GoraceZimne
}

export default function HotColdPanel({ goraceZimne }: HotColdPanelProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Gorące liczby */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-6 h-6" />
            Gorące Liczby
          </CardTitle>
          <CardDescription>
            Najczęściej losowane liczby w historii
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {goraceZimne.gorace.map((liczba, index) => (
              <div
                key={liczba}
                className="relative group flex items-center justify-center"
                title={`#${index + 1} najczęstsza liczba`}
              >
                {index < 3 && (
                  <div className="absolute -left-2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shadow z-10">
                    {index + 1}
                  </div>
                )}
                <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center font-bold text-lg hover:bg-primary/5 transition-all cursor-pointer">
                  {liczba}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-muted rounded-lg border">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Strategia:</strong> Te liczby pojawiają się
              najczęściej. Niektórzy gracze preferują wybierać je, wierząc w
              kontynuację trendu.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Zimne liczby */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Snowflake className="w-6 h-6" />
            Zimne Liczby
          </CardTitle>
          <CardDescription>
            Najrzadziej losowane liczby w historii
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {goraceZimne.zimne.map((liczba, index) => (
              <div
                key={liczba}
                className="relative group flex items-center justify-center"
                title={`#${index + 1} najrzadsza liczba`}
              >
                {index < 3 && (
                  <div className="absolute -left-2 w-5 h-5 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs font-bold shadow z-10">
                    {index + 1}
                  </div>
                )}
                <div className="w-14 h-14 rounded-full border-2 border-secondary flex items-center justify-center font-bold text-lg hover:bg-secondary/5 transition-all cursor-pointer">
                  {liczba}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-muted rounded-lg border">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Strategia:</strong> Te liczby występują najrzadziej.
              Teoria "wymagalności" sugeruje, że mogą być "wymagalne".
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
