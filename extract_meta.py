import os, json, shutil
try:
    from PyPDF2 import PdfReader
except ImportError:
    PdfReader = None
try:
    import docx
except ImportError:
    docx = None

data = []
base_dir = './pdf'
count = 1

for root, dirs, files in os.walk(base_dir):
    for f in files:
        if f.startswith('.'): continue
        filepath = os.path.join(root, f)
        ext = f.split('.')[-1].lower()
        title = f.replace('.'+ext, '').replace('_', ' ')
        
        # Deduce Grade Level from path taxonomy
        grade = "General"
        if "ז" in root: grade = "Grade 7"
        elif "ח" in root: grade = "Grade 8"
        elif "ט" in root: grade = "Grade 9"
        
        # Extract internal Author metadata
        author = "Unknown Author"
        if ext == 'pdf' and PdfReader:
            try:
                meta = PdfReader(filepath).metadata
                if meta and meta.author: author = meta.author
            except: pass
        elif ext == 'docx' and docx:
            try:
                author = docx.Document(filepath).core_properties.author or "Unknown Author"
            except: pass

        # Ensure the file is copied to the web directory
        web_path = f"site/pdf/{f}"
        shutil.copy2(filepath, f"./{web_path}")

        data.append({
            "id": count,
            "title": title,
            "type": ext.upper(),
            "author": author,
            "grade": grade,
            "url": f"pdf/{f}"
        })
        print(f"\033[0;32m   [+] Processed: {title} | {ext.upper()} | {grade}\033[0m")
        count += 1

with open('./site/generated/chapters.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
