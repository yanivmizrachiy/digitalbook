# DigitalBook | Engineering Audit & Classification Protocol

## 1. Classification Standards
- **Grades:** 7, 8, 9 or Bagrut (חומר לבגרות).
- **Subjects:** Algebra (אלגברה), Geometry (גיאומטריה), or General (כללי).
- **Types:** Worksheet (עבודה), Test (מבחן), Exam_Prep (הכנה), Summary (סיכום).

## 2. Metadata Integrity
- **Authorship:** Every file MUST display an author. If not found in document text, it is marked as `Unknown`.
- **Validation:** No placeholder buttons allowed. Every "Download" button must trigger a physical file fetch.

## 3. Repository Structure
- Files are organized by `Grade/Subject/Type` subdirectories.
- Flat file structures in `/pdf` are strictly prohibited.
