import os, json, shutil

def get_grade(path):
    if 'ז' in path: return 'Grade 7'
    if 'ח' in path: return 'Grade 8'
    if 'ט' in path: return 'Grade 9'
    return 'General'

def get_subject(path):
    if 'אלגברה' in path or 'משוואות' in path or 'פונקצי' in path: return 'Algebra'
    if any(x in path for x in ['גיאומטריה', 'גאומטריה', 'משולש', 'מרובע', 'שטח', 'היקף', 'זווית']): return 'Geometry'
    return 'General'

def get_type(name):
    name = name.lower()
    # מבחנים והערכות
    if any(x in name for x in ['מבחן', 'בוחן', 'מיצב', 'מבדק', 'הערכה', 'מיון']): return 'Test'
    # דפי עבודה ותרגילים
    if any(x in name for x in ['דף', 'עבודה', 'משימה', 'שאלות', 'תרגילים']): return 'Worksheet'
    # סיכומים וחומרי ליבה
    if any(x in name for x in ['סיכום', 'מכוונים', 'כללים', 'משפט', 'חוקיות', 'מבוא', 'מסכם', 'הצבה', 'תובנה']): return 'Summary'
    # תרגול וחזרה
    if any(x in name for x in ['תרגול', 'חזרה', 'הכנה', 'מבוך']): return 'Practice'
    # תיקונים
    if 'תיקון' in name: return 'Correction'
    
    return 'Additional'

def extract_author(filepath, ext):
    author = "יניב מזרחי" # Default Academic Author
    try:
        if ext == 'pdf':
            from PyPDF2 import PdfReader
            meta = PdfReader(filepath).metadata
            if meta and meta.author and meta.author.strip(): author = meta.author
        elif ext in ['docx', 'doc']:
            import docx
            doc_author = docx.Document(filepath).core_properties.author
            if doc_author and doc_author.strip(): author = doc_author
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
        # הדפסה צבעונית חכמה לטרמינל
        print(f"\033[0;36m[DATA]\033[0m {title[:30]:<30} | \033[0;32m{grade}\033[0m | \033[0;33m{subject}\033[0m | \033[0;35m{doc_type}\033[0m")
        count += 1

with open('./site/generated/chapters.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
