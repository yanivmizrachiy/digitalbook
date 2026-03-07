# 📜 DigitalBook Project - Master Governance (v14.0)

## 🕒 יומן שינויים (Change Log) - 2026-03-07
- **מה בוצע:** הטמעת Intelligence Hub וניתוח תוכן PDF אקטיבי.
- **למה:** מעבר מסיווג ידני לסיווג אוטומטי מבוסס מילות מפתח (אלגברה/גיאומטריה).
- **קבצים שהושפעו:** `extract_meta.py`, `RULES.md`, `site/generated/chapters.json`.
- **התפתחות המבנה:** הוספת תלות ב-PyMuPDF; המערכת כעת "קוראת" את התוכן הפדגוגי.

## ⚖️ חוקת הניהול (The Guardian Protocol)
1. **GitHub Absolute:** ה-GitHub הוא ה-Source of Truth. שום עבודה לא נשארת מקומית.
2. **No-Demo:** כל פונקציונליות חייבת להיות מחוברת לקבצים האמיתיים ב-`site/pdf/`.
3. **Change Tracking:** כל שינוי במבנה או בקוד חייב להירשם ביומן השינויים כאן.
4. **Sovereign Sync:** סנכרון הדרייב חייב להסתיים ב-Push אוטומטי ל-GitHub.

---
*נערך ומפוקח ע"י ה-Repository Governance Guardian.*
