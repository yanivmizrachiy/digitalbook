from pathlib import Path
import json
import re
import sys

ROOT = Path.home() / "digitalbook"
SITE = ROOT / "site"
PDF_DIR = SITE / "pdf"
GEN = SITE / "generated"
THUMBS = GEN / "thumbs"
CHAPTERS = GEN / "chapters.json"

GEN.mkdir(parents=True, exist_ok=True)
THUMBS.mkdir(parents=True, exist_ok=True)

fitz = None
try:
    import fitz  # PyMuPDF
except Exception:
    fitz = None

def safe_title(p: Path) -> str:
    return p.stem.replace("_", " ").strip()

def norm_url(p: Path) -> str:
    return p.relative_to(SITE).as_posix()

def infer_tags(rel: Path):
    tags = []
    parts = [x for x in rel.parts[:-1] if x.lower() != "pdf"]
    for part in parts:
        val = part.strip()
        if val and val not in tags:
            tags.append(val)
    name = rel.stem
    guesses = [
        ("geometry", "גיאומטריה"),
        ("algebra", "אלגברה"),
        ("bagrut", "בגרות"),
        ("middle", "חטיבת ביניים"),
        ("elementary", "יסודי"),
        ("3u", "3 יחידות"),
        ("4u", "4 יחידות"),
        ("5u", "5 יחידות"),
        ("z", "ז"),
        ("h", "ח"),
        ("t", "ט"),
    ]
    low = name.lower()
    for key, label in guesses:
        if key in low and label not in tags:
            tags.append(label)
    return tags

def page_count_and_thumb(pdf_path: Path, thumb_base: str):
    pages = 0
    thumb_rel = ""
    if not fitz:
        return pages, thumb_rel
    try:
        doc = fitz.open(pdf_path)
        pages = doc.page_count
        if pages > 0:
            page = doc.load_page(0)
            pix = page.get_pixmap(matrix=fitz.Matrix(0.35, 0.35), alpha=False)
            thumb_name = f"{thumb_base}.png"
            thumb_path = THUMBS / thumb_name
            pix.save(thumb_path)
            thumb_rel = f"generated/thumbs/{thumb_name}"
        doc.close()
    except Exception:
        pass
    return pages, thumb_rel

items = []
for pdf in sorted(PDF_DIR.rglob("*.pdf")):
    rel = pdf.relative_to(SITE)
    title = safe_title(pdf)
    thumb_base = re.sub(r'[^A-Za-z0-9א-ת._ -]+', '_', pdf.stem).strip().replace("/", "_")
    pages, thumb_rel = page_count_and_thumb(pdf, thumb_base)

    rel_parts = rel.parts
    category = rel_parts[1] if len(rel_parts) > 2 else ""
    grade = ""
    subject = ""
    if "middle" in rel_parts:
        for g in ("z", "h", "t"):
            if g in rel_parts:
                grade = g
                break
    if "bagrut" in rel_parts:
        for g in ("3u", "4u", "5u"):
            if g in rel_parts:
                grade = g
                break

    items.append({
        "title": title,
        "url": norm_url(pdf),
        "thumbnail": thumb_rel,
        "pages": pages,
        "category": category,
        "grade": grade,
        "subject": subject,
        "tags": infer_tags(rel),
    })

CHAPTERS.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"CHAPTERS_WRITTEN={CHAPTERS}")
print(f"PDF_COUNT={len(items)}")
print(f"FITZ_AVAILABLE={'yes' if fitz else 'no'}")
