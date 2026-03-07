import os, json
from pypdf import PdfReader

TOPIC_MAP = {
    "אלגברה": ["משוואה ריבועית", "חוק הפילוג", "פונקציה קווית", "פרבולה", "מערכת משוואות", "חזקות"],
    "גיאומטריה": ["משפט פיתגורס", "דמיון משולשים", "חפיפת משולשים", "שטח ומעגל", "טרפז", "דלתון"]
}

def extract_tags(text):
    return list(set([t for c, ts in TOPIC_MAP.items() for t in ts if t in text]))[:3]

def analyze_content(filepath):
    subject, tags, pages = "כללי", [], 0
    try:
        reader = PdfReader(filepath)
        pages = len(reader.pages)
        text = "".join([page.extract_text().lower() for page in reader.pages[:2] if page.extract_text()])
        
        a_score = sum(1 for k in ["משוואה", "אלגברה", "פונקציה", "x", "y"] if k in text)
        g_score = sum(1 for k in ["שטח", "זווית", "משולש", "מלבן", "גיאומטריה"] if k in text)
        if a_score > g_score: subject = "אלגברה"
        elif g_score > a_score: subject = "גיאומטריה"
        tags = extract_tags(text)
    except: pass
    return subject, tags, pages

data = []
for root, dirs, files in os.walk("site/pdf"):
    for file in files:
        if file.endswith('.pdf'):
            path = os.path.join(root, file)
            sub, tags, p_count = analyze_content(path)
            parts = path.split(os.sep)
            level = parts[-2].replace("Grade_", "כיתה ") if len(parts) > 1 and "Grade" in parts[-2] else "כללי"
            data.append({
                "title": file.replace(".pdf", ""),
                "url": path.replace("site/", ""),
                "level": level,
                "subject": sub, "tags": tags, "pages": p_count,
                "difficulty": "בינוני",
                "date": os.path.getmtime(path) * 1000
            })

with open("site/generated/chapters.json", "w", encoding="utf-8") as f:
    json.dump({"items": data}, f, ensure_ascii=False, indent=4)
