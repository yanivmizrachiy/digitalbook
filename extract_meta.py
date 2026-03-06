import os, json, re
from docx import Document
from PyPDF2 import PdfReader

def get_meta_from_file(filepath, ext):
    author, year = "Unknown", "Unknown"
    try:
        if ext == 'DOCX':
            doc = Document(filepath)
            author = doc.core_properties.author or "Unknown"
            year = str(doc.core_properties.created.year) if doc.core_properties.created else "Unknown"
        elif ext == 'PDF':
            reader = PdfReader(filepath)
            meta = reader.metadata
            author = meta.author if meta and meta.author else "Unknown"
    except: pass
    return author, year

def get_assignment_type(name):
    n = name.lower()
    if any(x in n for x in ['מבחן', 'בוחן', 'מיצב']): return 'Test'
    if 'סיכום' in n: return 'Summary Assignment'
    if 'תיקון' in n: return 'Correction Assignment'
    return 'Worksheet'

data = []
for root, dirs, files in os.walk('./pdf'):
    for f in files:
        if f.startswith('.'): continue
        ext = f.split('.')[-1].upper()
        author, year = get_meta_from_file(os.path.join(root, f), ext)
        
        # לוגיקת סיווג רמה (Level)
        path = root.lower()
        level = "General"
        if 'ז' in path or '7' in path: level = "Grade 7"
        elif '3 יח' in path: level = "3 Units"
        
        data.append({
            "title": f.rsplit('.', 1)[0].replace('_', ' '),
            "author": author,
            "year": year,
            "level": level,
            "subject": "Mathematics",
            "type": get_assignment_type(f),
            "url": f"pdf/{f}",
            "ext": ext
        })

with open('./site/generated/chapters.json', 'w', encoding='utf-8') as jf:
    json.dump(data, jf, ensure_ascii=False, indent=2)
