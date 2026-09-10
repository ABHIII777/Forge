"use client";

import * as React from "react";

export type ThemeChoice = "dark" | "light" | "system";
export type DensityChoice = "compact" | "comfortable" | "spacious";

const THEME_KEY = "forge:theme";
const DENSITY_KEY = "forge:density";

function read<T extends string>(key: string, fallback: T, valid: readonly T[]): T {
    if (typeof window === "undefined") return fallback;
    const v = window.localStorage.getItem(key);
    return v && (valid as readonly string[]).includes(v) ? (v as T) : fallback;
}

export function useAppearance() {
    const [theme, setThemeState] = React.useState<ThemeChoice>(() =>
        read(THEME_KEY, "dark", ["dark", "light", "system"] as const),
    );
    const [density, setDensityState] = React.useState<DensityChoice>(() =>
        read(DENSITY_KEY, "comfortable", ["compact", "comfortable", "spacious"] as const),
    );

    React.useEffect(() => {
        const root = document.documentElement;
        const resolved =
            theme === "system"
                ? window.matchMedia("(prefers-color-scheme: light)").matches
                    ? "light"
                    : "dark"
                : theme;
        root.dataset.theme = resolved;
        root.dataset.density = density;
        window.localStorage.setItem(THEME_KEY, theme);
        window.localStorage.setItem(DENSITY_KEY, density);
    }, [theme, density]);

    return { theme, density, setTheme: setThemeState, setDensity: setDensityState };
}
