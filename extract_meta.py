import os, json, PyPDF2

def extract_smart_author(filepath):
    if not filepath.endswith('.pdf'): return "Unknown"
    try:
        with open(filepath, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            first_page = reader.pages[0].extract_text()
            if "משרד החינוך" in first_page: return "משרד החינוך"
            if "צוות הדרכה" in first_page: return "צוות הדרכה ארצי"
            # ניתן להוסיף כאן עוד מזהים חכמים
    except: pass
    return "Unknown"

def get_metadata(filepath):
    parts = filepath.split(os.sep)
    grade = "חומר לבגרות" if "Bagrut" in parts else "Unknown"
    for g in ["Grade_7", "Grade_8", "Grade_9"]:
        if g in parts: grade = g.replace("Grade_", "כיתה ")
    
    subject = "אלגברה" if "Algebra" in parts else ("גיאומטריה" if "Geometry" in parts else "כללי")
    doc_type = "עבודה/משימה"
    if "Test" in parts: doc_type = "מבחן"
    elif "Exam_Prep" in parts: doc_type = "הכנה למבחן"
    
    author = extract_smart_author(filepath)
    return grade, subject, doc_type, author

data = []
for root, dirs, files in os.walk("site/pdf"):
    for file in files:
        if file.endswith(('.pdf', '.docx')):
            path = os.path.join(root, file)
            g, s, t, a = get_metadata(path)
            data.append({
                "title": file.replace(".pdf", "").replace(".docx", ""),
                "url": path.replace("site/", ""),
                "level": g, "subject": s, "type": t, "author": a, "ext": file.split('.')[-1]
            })

with open("site/generated/chapters.json", "w", encoding="utf-8") as f:
    json.dump({"items": data}, f, ensure_ascii=False, indent=4)
