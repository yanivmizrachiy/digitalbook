import fitz, os
def gen():
    path = "site/generated/thumbs"
    if not os.path.exists(path): os.makedirs(path)
    for root, dirs, files in os.walk("site/pdf"):
        for file in files:
            if file.endswith(".pdf"):
                pdf_path = os.path.join(root, file)
                img_path = os.path.join(path, file.replace('.pdf', '.jpg'))
                if not os.path.exists(img_path):
                    try:
                        doc = fitz.open(pdf_path)
                        page = doc.load_page(0)
                        pix = page.get_pixmap(matrix=fitz.Matrix(0.3, 0.3))
                        pix.save(img_path)
                        print(f"Created thumb for: {file}")
                    except: pass
if __name__ == "__main__": gen()
