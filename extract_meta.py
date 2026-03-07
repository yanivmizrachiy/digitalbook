import os, json, fitz

TOPIC_MAP = {
    "אלגברה": ["משוואה ריבועית", "חוק הפילוג", "פונקציה קווית", "פרבולה", "מערכת משוואות", "חזקות"],
    "גיאומטריה": ["משפט פיתגורס", "דמיון משולשים", "חפיפת משולשים", "שטח ומעגל", "טרפז", "דלתון"]
}

def extract_tags(text):
    found_tags = []
    for category, topics in TOPIC_MAP.items():
        for topic in topics:
            if topic in text:
                found_tags.append(topic)
    return list(set(found_tags))[:3] # מחזיר עד 3 תגיות רלוונטיות

def analyze_content(filepath):
    subject, tags, pages = "כללי", [], 0
    try:
        doc = fitz.open(filepath)
        pages = len(doc)
        text = "".join([doc[i].get_text().lower() for i in range(min(2, pages))])
        
        # זיהוי נושא ראשי
        a_score = sum(1 for k in ["משוואה", "אלגברה", "פונקציה", "x", "y"] if k in text)
        g_score = sum(1 for k in ["שטח", "זווית", "משולש", "מלבן", "גיאומטריה"] if k in text)
        if a_score > g_score: subject = "אלגברה"
        elif g_score > a_score: subject = "גיאומטריה"
        
        # חילוץ תגיות ספציפיות
        tags = extract_tags(text)
    except: pass
    return subject, tags, pages

data = []
for root, dirs, files in os.walk("site/pdf"):
    for file in files:
        if file.endswith('.pdf'):
            path = os.path.join(root, file)
            sub, tags, p_count = analyze_content(path)
            data.append({
                "title": file.replace(".pdf", ""),
                "url": path.replace("site/", ""),
                "level": path.split(os.sep)[-2].replace("Grade_", "כיתה "),
                "subject": sub,
                "tags": tags,
                "pages": p_count,
                "date": os.path.getmtime(path) * 1000
            })

with open("site/generated/chapters.json", "w", encoding="utf-8") as f:
    json.dump({"items": data}, f, ensure_ascii=False, indent=4)
