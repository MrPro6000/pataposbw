import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeColors {
  primary: string;
  accent: string;
}

const defaultColors: ThemeColors = {
  primary: "217 100% 50%", // Pata Blue (matching logo)
  accent: "217 100% 50%",
};

const colorPresets = [
  { name: "Blue", primary: "217 100% 50%", accent: "217 100% 50%" },
  { name: "Cyan", primary: "192 100% 45%", accent: "192 100% 45%" },
  { name: "Purple", primary: "262 83% 58%", accent: "262 83% 58%" },
  { name: "Green", primary: "142 71% 45%", accent: "142 71% 45%" },
  { name: "Orange", primary: "25 95% 53%", accent: "25 95% 53%" },
  { name: "Pink", primary: "330 81% 60%", accent: "330 81% 60%" },
];

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: ThemeColors;
  setColors: (colors: ThemeColors) => void;
  colorPresets: typeof colorPresets;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("pata-theme");
    return (stored as Theme) || "light";
  });

  const [colors, setColorsState] = useState<ThemeColors>(() => {
    const stored = localStorage.getItem("pata-colors");
    return stored ? JSON.parse(stored) : defaultColors;
  });

  useEffect(() => {
    localStorage.setItem("pata-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("pata-colors", JSON.stringify(colors));
    document.documentElement.style.setProperty("--pata-cyan", colors.primary);
    // Update the actual element colors
    const root = document.documentElement;
    root.style.setProperty("--pata-cyan", colors.primary);
  }, [colors]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setColors = (newColors: ThemeColors) => {
    setColorsState(newColors);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors, setColors, colorPresets }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
