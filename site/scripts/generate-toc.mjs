import fs from "fs";
import path from "path";
const root = process.cwd();
const pdfDir = path.join(root, "pdf");
const outDir = path.join(root, "site", "generated");
const outFile = path.join(outDir, "toc.json");
fs.mkdirSync(outDir, { recursive: true });
let files = [];
if (fs.existsSync(pdfDir)) {
  files = fs.readdirSync(pdfDir).filter(f => f.toLowerCase().endsWith(".pdf")).sort((a,b)=>a.localeCompare(b,"he"));
}
const chapters = files.map((filename, i) => ({
  id: String(i+1).padStart(3,"0"),
  title: filename.replace(/\.pdf$/i,"").replace(/[_-]+/g," ").trim() || filename,
  filename,
  url: `../pdf/${encodeURIComponent(filename)}`
}));
fs.writeFileSync(outFile, JSON.stringify({ generatedAt: new Date().toISOString(), chapterCount: chapters.length, chapters }, null, 2), "utf8");
console.log("TOC generated:", chapters.length, "chapters");
