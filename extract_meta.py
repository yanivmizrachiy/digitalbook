import os, json, fitz

def estimate_difficulty(text):
    complexity_symbols = ["√", "²", "π", "Σ", "Δ", "=", "x^", "/", "(", ")"]
    score = sum(text.count(s) for s in complexity_symbols)
    if score > 40: return "מאתגר"
    if score > 15: return "בינוני"
    return "קל"

def analyze_content(filepath):
    subject, difficulty = "כללי", "קל"
    try:
        if filepath.endswith('.pdf'):
            doc = fitz.open(filepath)
            text = "".join([doc[i].get_text().lower() for i in range(min(2, len(doc)))])
            a_score = sum(1 for k in ["משוואה", "נעלם", "אלגברה", "פונקציה", "x", "y"] if k in text)
            g_score = sum(1 for k in ["שטח", "היקף", "זווית", "משולש", "מלבן", "גיאומטריה"] if k in text)
            if a_score > g_score: subject = "אלגברה"
            elif g_score > a_score: subject = "גיאומטריה"
            difficulty = estimate_difficulty(text)
    except: pass
    return subject, difficulty

data = []
for root, dirs, files in os.walk("site/pdf"):
    for file in files:
        if file.endswith(('.pdf', '.docx')):
            path = os.path.join(root, file)
            sub, diff = analyze_content(path)
            data.append({
                "title": file.replace(".pdf", "").replace(".docx", ""),
                "url": path.replace("site/", ""),
                "level": path.split(os.sep)[-2].replace("Grade_", "כיתה "),
                "subject": sub, "difficulty": diff, "author": "משרד החינוך" if "Min" in file else "Unknown"
            })

with open("site/generated/chapters.json", "w", encoding="utf-8") as f:
    json.dump({"items": data}, f, ensure_ascii=False, indent=4)
