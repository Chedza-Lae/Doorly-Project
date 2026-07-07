import { createContext, useContext } from "react";

export type ThemeName = "light" | "dark" | "midnight" | "premium";

export type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};

export const THEME_STORAGE_KEY = "doorly_theme";

export const themeOptions: { value: ThemeName; label: string }[] = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
  { value: "midnight", label: "Midnight" },
  { value: "premium", label: "Premium" },
];

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function isThemeName(value: string | null): value is ThemeName {
  return themeOptions.some((option) => option.value === value);
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
