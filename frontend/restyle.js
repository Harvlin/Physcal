import fs from "fs";
import path from "path";

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith(".tsx") || file.endsWith(".ts")) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk("c:/MORF/frontend/src");

for (const file of files) {
  let content = fs.readFileSync(file, "utf-8");
  let original = content;

  // 1. Remove ThemeToggle
  content = content.replace(/import\s+\{?\s*ThemeToggle\s*\}?\s+from\s+['"][^'"]+['"];?\n?/g, "");
  content = content.replace(/<ThemeToggle\s*\/?>(<\/ThemeToggle>)?/g, "");

  // 2. Card pattern replacement
  // "bg-surface border border-border rounded-2xl" -> "bg-white rounded-3xl shadow-[var(--shadow-card)]"
  content = content.replace(
    /bg-surface border border-border rounded-2xl/g,
    "bg-white rounded-3xl shadow-[var(--shadow-card)] border-none",
  );
  content = content.replace(
    /bg-surface border border-border rounded-3xl/g,
    "bg-white rounded-3xl shadow-[var(--shadow-card)] border-none",
  );

  // Also any other bg-surface that implies a card, but be careful
  // "bg-surface" -> "bg-white" for cards
  // Let's rely on specific class swaps

  // Font variants
  content = content.replace(/font-display/g, "font-sans tracking-[-0.02em]");
  content = content.replace(/font-mono/g, "tabular-nums");

  if (content !== original) {
    fs.writeFileSync(file, content, "utf-8");
    console.log("Updated", file);
  }
}
