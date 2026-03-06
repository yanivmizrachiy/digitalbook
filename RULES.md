# Digital Mathematics Book - Engineering Audit & Governance

## 1. Audit Result (2026-03-06)
- **Readiness Level:** Production Ready.
- **Validated Components:** Responsive UI, Deep Linking, Inline PDF Reader, Metadata Engine.
- **Environment:** Termux -> GitHub Pages (Atomic Sync).

## 2. Core Architecture Rules (No-Demo Policy)
- **Real Data Only:** Every card in the interface must be linked to a physical file in `/pdf`.
- **Metadata Integrity:** Author and Year must be extracted from file properties; no inventions.
- **RTL Standards:** Interface must remain natively Hebrew with full RTL support across all devices.

## 3. Maintenance Protocol
- **Sync Command:** `python extract_meta.py` must be run before every push to ensure `chapters.json` is updated.
- **Cleanup:** `node_modules` and `.npm` are strictly forbidden in the repository (enforced via .gitignore).

## 7. Admin & Health Monitoring (Update 2026-03-06)
- **Monitoring:** הגישה לדף הניהול מתבצעת דרך `/admin.html`.
- **Quality Assurance:** חובת טיפול בקבצים המופיעים ב-Red Flags כדי לשמור על סטנדרט אקדמי.

## 7. Admin & Health Monitoring (Update 2026-03-06)
- **Monitoring:** הגישה לדף הניהול מתבצעת דרך `/admin.html`.
- **Quality Assurance:** חובת טיפול בקבצים המופיעים ב-Red Flags כדי לשמור על סטנדרט אקדמי.

## 8. Backup & Disaster Recovery (Update 2026-03-06)
- **Protocol:** חובת ביצוע גיבוי ZIP דרך ה-Admin Panel לפני כל עדכון גרסה מאסיבי.
- **Redundancy:** הגיבוי משמש כנקודת שחזור (Point of Return) במקרה של שחיתות נתונים ב-GitHub או ב-Local Storage.

## 9. Advanced Accessibility (Update 2026-03-06)
- **Night Mode:** ה-Reader חייב לתמוך ב-CSS Inversion לשיפור הקריאה בתנאי תאורה נמוכים.
