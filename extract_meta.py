import os, json, fitz
def analyze_content(filepath):
    subject = "כללי"
    try:
        if filepath.endswith('.pdf'):
            doc = fitz.open(filepath)
            text = "".join([doc[i].get_text().lower() for i in range(min(2, len(doc)))])
            # זיהוי מילות מפתח למתמטיקה
            a_score = sum(1 for k in ["משוואה", "נעלם", "אלגברה", "פונקציה", "x", "y"] if k in text)
            g_score = sum(1 for k in ["שטח", "היקף", "זווית", "משולש", "מלבן", "גיאומטריה"] if k in text)
            if a_score > g_score: subject = "אלגברה"
            elif g_score > a_score: subject = "גיאומטריה"
    except: pass
    return subject

data = []
for root, dirs, files in os.walk("site/pdf"):
    for file in files:
        if file.endswith(('.pdf', '.docx')):
            path = os.path.join(root, file)
            parts = path.split(os.sep)
            grade = "Unknown"
            for g in ["Grade_7", "Grade_8", "Grade_9"]:
                if g in parts: grade = g.replace("Grade_", "כיתה ")
            data.append({
                "title": file.replace(".pdf", "").replace(".docx", ""),
                "url": path.replace("site/", ""),
                "level": grade, "subject": analyze_content(path), "type": "דף עבודה",
                "author": "משרד החינוך" if "Min" in file else "Unknown",
                "ext": file.split('.')[-1]
            })

with open("site/generated/chapters.json", "w", encoding="utf-8") as f:
    json.dump({"items": data}, f, ensure_ascii=False, indent=4)
