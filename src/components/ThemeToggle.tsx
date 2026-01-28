import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors hover:bg-white/10 dark:hover:bg-white/10 ${className}`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
