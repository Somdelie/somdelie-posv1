"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const themes = {
  current: {
    name: "Sophisticated Cream",
    description: "Warm cream with navy and green accents",
    colors: {
      background: "oklch(0.98 0.01 85)",
      primary: "oklch(0.25 0.03 240)",
      accent: "oklch(0.65 0.15 160)",
    },
  },
  modern: {
    name: "Modern Blue",
    description: "Clean blues and whites, professional and trustworthy",
    colors: {
      background: "oklch(0.99 0.005 220)",
      primary: "oklch(0.45 0.15 220)",
      accent: "oklch(0.6 0.2 200)",
    },
  },
  warm: {
    name: "Warm Earth",
    description: "Browns and oranges, friendly and approachable",
    colors: {
      background: "oklch(0.97 0.01 60)",
      primary: "oklch(0.35 0.08 40)",
      accent: "oklch(0.65 0.15 50)",
    },
  },
  dark: {
    name: "Dark Professional",
    description: "Dark grays with purple accents, modern and sleek",
    colors: {
      background: "oklch(0.1 0.01 240)",
      primary: "oklch(0.6 0.15 280)",
      accent: "oklch(0.7 0.2 320)",
    },
  },
};

export function ThemeSelector() {
  const [selectedTheme, setSelectedTheme] = useState("current");

  const applyTheme = (themeKey: string) => {
    const root = document.documentElement;

    if (themeKey === "current") {
      // Current sophisticated cream theme
      root.style.setProperty("--background", "oklch(0.98 0.01 85)");
      root.style.setProperty("--foreground", "oklch(0.15 0.02 85)");
      root.style.setProperty("--card", "oklch(1 0 0)");
      root.style.setProperty("--primary", "oklch(0.25 0.03 240)");
      root.style.setProperty("--primary-foreground", "oklch(0.98 0.01 85)");
      root.style.setProperty("--secondary", "oklch(0.95 0.01 85)");
      root.style.setProperty("--secondary-foreground", "oklch(0.25 0.03 240)");
      root.style.setProperty("--accent", "oklch(0.65 0.15 160)");
      root.style.setProperty("--accent-foreground", "oklch(0.98 0.01 85)");
      root.style.setProperty("--border", "oklch(0.9 0.01 85)");
      root.style.setProperty("--muted", "oklch(0.94 0.01 85)");
      root.style.setProperty("--muted-foreground", "oklch(0.45 0.02 85)");
    } else if (themeKey === "modern") {
      // Modern blue theme
      root.style.setProperty("--background", "oklch(0.99 0.005 220)");
      root.style.setProperty("--foreground", "oklch(0.15 0.01 220)");
      root.style.setProperty("--card", "oklch(1 0 0)");
      root.style.setProperty("--primary", "oklch(0.45 0.15 220)");
      root.style.setProperty("--primary-foreground", "oklch(0.99 0.005 220)");
      root.style.setProperty("--secondary", "oklch(0.96 0.01 220)");
      root.style.setProperty("--secondary-foreground", "oklch(0.45 0.15 220)");
      root.style.setProperty("--accent", "oklch(0.6 0.2 200)");
      root.style.setProperty("--accent-foreground", "oklch(0.99 0.005 220)");
      root.style.setProperty("--border", "oklch(0.92 0.01 220)");
      root.style.setProperty("--muted", "oklch(0.96 0.01 220)");
      root.style.setProperty("--muted-foreground", "oklch(0.5 0.05 220)");
    } else if (themeKey === "warm") {
      // Warm earth theme
      root.style.setProperty("--background", "oklch(0.97 0.01 60)");
      root.style.setProperty("--foreground", "oklch(0.2 0.02 40)");
      root.style.setProperty("--card", "oklch(0.99 0.005 60)");
      root.style.setProperty("--primary", "oklch(0.35 0.08 40)");
      root.style.setProperty("--primary-foreground", "oklch(0.97 0.01 60)");
      root.style.setProperty("--secondary", "oklch(0.93 0.02 50)");
      root.style.setProperty("--secondary-foreground", "oklch(0.35 0.08 40)");
      root.style.setProperty("--accent", "oklch(0.65 0.15 50)");
      root.style.setProperty("--accent-foreground", "oklch(0.97 0.01 60)");
      root.style.setProperty("--border", "oklch(0.88 0.02 50)");
      root.style.setProperty("--muted", "oklch(0.93 0.02 50)");
      root.style.setProperty("--muted-foreground", "oklch(0.45 0.05 40)");
    } else if (themeKey === "dark") {
      // Dark professional theme
      root.style.setProperty("--background", "oklch(0.1 0.01 240)");
      root.style.setProperty("--foreground", "oklch(0.95 0.01 240)");
      root.style.setProperty("--card", "oklch(0.15 0.01 240)");
      root.style.setProperty("--primary", "oklch(0.6 0.15 280)");
      root.style.setProperty("--primary-foreground", "oklch(0.1 0.01 240)");
      root.style.setProperty("--secondary", "oklch(0.2 0.01 240)");
      root.style.setProperty("--secondary-foreground", "oklch(0.95 0.01 240)");
      root.style.setProperty("--accent", "oklch(0.7 0.2 320)");
      root.style.setProperty("--accent-foreground", "oklch(0.1 0.01 240)");
      root.style.setProperty("--border", "oklch(0.2 0.01 240)");
      root.style.setProperty("--muted", "oklch(0.18 0.01 240)");
      root.style.setProperty("--muted-foreground", "oklch(0.6 0.02 240)");
    }

    setSelectedTheme(themeKey);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Your Theme</h2>
        <p className="text-muted-foreground">
          Select a theme that best fits your POS system style
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(themes).map(([key, theme]) => (
          <Card
            key={key}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTheme === key ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => applyTheme(key)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{theme.name}</CardTitle>
                <div className="flex gap-1">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.colors.background }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>
              </div>
              <CardDescription>{theme.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant={selectedTheme === key ? "default" : "outline"}
                size="sm"
                className="w-full"
              >
                {selectedTheme === key ? "Current Theme" : "Apply Theme"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
