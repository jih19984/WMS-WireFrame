export function getTagSourceBadgeClass(source: "AI" | "MANUAL") {
  return source === "AI"
    ? "border-cyan-300 bg-cyan-100 text-cyan-800 shadow-sm dark:border-cyan-400/55 dark:bg-cyan-400/16 dark:text-cyan-100"
    : "border-violet-300 bg-violet-100 text-violet-800 shadow-sm dark:border-violet-400/55 dark:bg-violet-400/16 dark:text-violet-100";
}
