export const journalThemes = [
  {
    id: "editorial",
    name: "Editorial",
    accent: "#1A3626",
    accentSoft: "rgba(26,54,38,0.06)",
    accentText: "#FBF9F6",
    panel: "transparent",
    panelBorder: "transparent",
    text: "#1C1917",
    muted: "#8A867D",
    background: "#FBF9F6",
    grid: "rgba(28,25,23,0.02)",
  },
  {
    id: "linen",
    name: "Linen",
    accent: "#b5835a",
    accentSoft: "rgba(181,131,90,0.14)",
    accentText: "#2b2b2b",
    panel: "transparent",
    panelBorder: "transparent",
    text: "#111827",
    muted: "rgba(17,24,39,0.55)",
    background: "linear-gradient(180deg, #fbf7f3 0%, #f5f1ee 100%)",
    grid: "rgba(17,24,39,0.03)",
  },
  {
    id: "serene",
    name: "Serene",
    accent: "#7dd3fc",
    accentSoft: "rgba(125,211,252,0.14)",
    accentText: "#042b3d",
    panel: "transparent",
    panelBorder: "transparent",
    text: "#052f3a",
    muted: "rgba(5,47,58,0.55)",
    background: "linear-gradient(180deg, #f8fbfd 0%, #eef9fb 100%)",
    grid: "rgba(5,47,58,0.03)",
  },
];

export function getTheme(themeId) {
  return journalThemes.find((theme) => theme.id === themeId) ?? journalThemes[0];
}