import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "./ThemeProvider"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // Check the actual class on the document element
    const checkTheme = () => {
      const root = document.documentElement
      const isDark = root.classList.contains("dark")
      setActualTheme(isDark ? "dark" : "light")
    }

    checkTheme()

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [theme])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <Sun className={`h-4 w-4 transition-all ${actualTheme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"}`} />
          <Moon className={`absolute h-4 w-4 transition-all ${actualTheme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`} />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-black border-neutral-200 dark:border-neutral-800">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span className="text-neutral-900 dark:text-neutral-100">Light</span>
          {theme === "light" && <span className="ml-auto text-blue-600 dark:text-blue-500">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span className="text-neutral-900 dark:text-neutral-100">Dark</span>
          {theme === "dark" && <span className="ml-auto text-blue-600 dark:text-blue-500">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span className="text-neutral-900 dark:text-neutral-100">System</span>
          {theme === "system" && <span className="ml-auto text-blue-600 dark:text-blue-500">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

