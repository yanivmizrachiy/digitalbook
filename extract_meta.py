import os, json, shutil

def get_grade(path):
    if 'ז' in path: return 'Grade 7'
    if 'ח' in path: return 'Grade 8'
    if 'ט' in path: return 'Grade 9'
    return 'General'

def get_subject(path):
    if 'אלגברה' in path: return 'Algebra'
    if any(x in path for x in ['גיאומטריה', 'גאומטריה', 'משולש', 'מלבן', 'שטחים', 'היקפים']): return 'Geometry'
    return 'General'

def get_type(name):
    name = name.lower()
    if 'מבחן' in name or 'מיצב' in name or 'בוחן' in name: return 'Test'
    if 'תיקון' in name: return 'Correction'
    if 'תרגול' in name or 'חזרה' in name: return 'Practice'
    if 'דף' in name or 'עבודה' in name or 'משימה' in name: return 'Worksheet'
    return 'Additional'

def extract_author(filepath, ext):
    author = "Unknown Author"
    try:
        if ext == 'pdf':
            from PyPDF2 import PdfReader
            meta = PdfReader(filepath).metadata
            if meta and meta.author: author = meta.author
        elif ext in ['docx', 'doc']:
            import docx
            author = docx.Document(filepath).core_properties.author or "Unknown Author"
    except: pass
    return author

data = []
base_dir = './pdf'
count = 1

for root, dirs, files in os.walk(base_dir):
    for f in files:
        if f.startswith('.'): continue
        filepath = os.path.join(root, f)
        ext = f.split('.')[-1].lower()
        title = f.replace('.'+ext, '').replace('_', ' ')
        
        grade = get_grade(root)
        subject = get_subject(root)
        doc_type = get_type(title)
        author = extract_author(filepath, ext)
        
        target_dir = os.path.join('./site/pdf')
        os.makedirs(target_dir, exist_ok=True)
        shutil.copy2(filepath, os.path.join(target_dir, f))
        
        data.append({
            "id": count,
            "title": title,
            "type": doc_type,
            "subject": subject,
            "author": author,
            "grade": grade,
            "url": f"pdf/{f}",
            "file_ext": ext.upper()
        })
        print(f"\033[0;32m   [+] Classified: {title} | {grade} | {subject} | {doc_type}\033[0m")
        count += 1

with open('./site/generated/chapters.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
