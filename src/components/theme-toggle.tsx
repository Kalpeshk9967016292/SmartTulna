"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  // Install next-themes: npm install next-themes
  // This component requires `next-themes` to be installed and configured.
  // We'll mock the functionality for now.
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  React.useEffect(() => {
    // This is a workaround because next-themes is not actually installed in this environment.
    // In a real app, the ThemeProvider from next-themes would handle this.
    const isDark = document.documentElement.classList.contains("dark");
    if ((theme === "dark" && !isDark) || (theme === "light" && isDark)) {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme])

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

// Mock useTheme hook if next-themes is not available
const useThemeMock = () => {
    const [theme, setTheme] = React.useState("light");
    return { theme, setTheme };
};

// Add `ThemeProvider` to your `layout.tsx` for this to work properly.
// e.g. <ThemeProvider attribute="class" defaultTheme="system" enableSystem>...</ThemeProvider>
// We'll assume for the build that `next-themes` is not installed and mock it.
const finalUseTheme = typeof useTheme === 'function' ? useTheme : useThemeMock;
