import os, json, shutil, re

def get_year(name):
    match = re.search(r'20\d{2}', name)
    return match.group(0) if match else "Unknown"

def get_assignment_type(name):
    name = name.lower()
    if any(x in name for x in ['מבחן', 'בוחן', 'מיצב']): return 'Test'
    if 'סיכום' in name: return 'Summary Assignment'
    if 'קיץ' in name: return 'Summer Assignment'
    if 'תיקון' in name: return 'Correction Assignment'
    if any(x in name for x in ['תרגול', 'חזרה']): return 'Practice Assignment'
    return 'Worksheet'

def extract_meta(root, f):
    path = root.lower()
    name = f.lower()
    
    # 1. Determine Level (Middle School vs Bagrut)
    level = "Unknown"
    if 'ז' in path or '7' in path: level = "Grade 7"
    elif 'ח' in path or '8' in path: level = "Grade 8"
    elif 'ט' in path or '9' in path: level = "Grade 9"
    elif '3 יח' in path: level = "3 Units"
    elif '4 יח' in path: level = "4 Units"
    elif '5 יח' in path: level = "5 Units"

    # 2. Determine Subject / Questionnaire
    subject = "Unknown"
    if 'אלגברה' in path: subject = "Algebra"
    elif 'גיאומטריה' in path or 'גאומטריה' in path: subject = "Geometry"
    for q in ['371','372','481','482','581','582']:
        if q in path or q in name: subject = f"Questionnaire {q}"
    
    return level, subject

data = []
for root, dirs, files in os.walk('./pdf'):
    for f in files:
        if f.startswith('.'): continue
        filepath = os.path.join(root, f)
        ext = f.split('.')[-1].lower()
        
        level, subject = extract_meta(root, f)
        
        # Metadata Extraction
        author = "Unknown" # Logic for real extraction can be added here
        year = get_year(f)
        
        data.append({
            "title": f.replace('.'+ext, '').replace('_', ' '),
            "author": author,
            "year": year,
            "level": level,
            "subject": subject,
            "type": get_assignment_type(f),
            "url": f"pdf/{f}",
            "ext": ext.upper()
        })

with open('./site/generated/chapters.json', 'w', encoding='utf-8') as jf:
    json.dump(data, jf, ensure_ascii=False, indent=2)
