import os, json, re

def get_metadata(filepath):
    # Classification based on path
    parts = filepath.split(os.sep)
    grade = "חומר לבגרות" if "Bagrut" in parts else "Unknown"
    for g in ["Grade_7", "Grade_8", "Grade_9"]:
        if g in parts: grade = g.replace("Grade_", "כיתה ")
    
    subject = "אלגברה" if "Algebra" in parts else ("גיאומטריה" if "Geometry" in parts else "כללי")
    type_map = {"Worksheet": "עבודה/משימה", "Test": "מבחן", "Exam_Prep": "הכנה למבחן", "Summary": "עבודת סיכום"}
    doc_type = "מסמך"
    for k, v in type_map.items():
        if k in parts: doc_type = v
    
    # Author Extraction Placeholder (Marked as Unknown if not found)
    author = "Unknown" 
    # Logic to be expanded: search text for "מאת:" or "נכתב ע"י"
    
    return grade, subject, doc_type, author

data = []
base_path = "site/pdf"
for root, dirs, files in os.walk(base_path):
    for file in files:
        if file.endswith(('.pdf', '.docx')):
            rel_path = os.path.join(root, file)
            grade, subject, doc_type, author = get_metadata(rel_path)
            data.append({
                "title": file.replace(".pdf", "").replace(".docx", ""),
                "url": rel_path.replace("site/", ""),
                "level": grade,
                "subject": subject,
                "type": doc_type,
                "author": author,
                "year": "2026",
                "ext": file.split('.')[-1]
            })

os.makedirs("site/generated", exist_ok=True)
with open("site/generated/chapters.json", "w", encoding="utf-8") as f:
    json.dump({"items": data}, f, ensure_ascii=False, indent=4)
