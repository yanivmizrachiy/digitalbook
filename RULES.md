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

## 15. Advanced Navigation Protocol (Update 2026-03-06)
- **Sidebar Filtering:** המערכת תומכת בסינון רב-שכבתי (כיתה, נושא, סוג) הפועל בזמן אמת.
- **Dynamic Counters:** מונה הקבצים מתעדכן אוטומטית לפי תוצאות הסינון.
- **RTL Integrity:** הממשק שומר על יישור לימין (RTL) מלא גם בתצוגת ה-Sidebar.

## 16. Maximalist UX & Motion Protocol (v10.0)
- **Glassmorphism:** הממשק חייב להתבסס על שכבות שקופות וטשטוש (Blur).
- **Physics-Based Motion:** כל אלמנט נכנס לאתר עם אנימציית Stagger המבוססת על Anime.js.
- **Visual Feedback:** כל לחיצה על כפתור חייבת לכלול תגובה ויזואלית (Scaling/Haptic feel).
