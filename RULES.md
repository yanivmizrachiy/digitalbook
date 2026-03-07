# 📜 DigitalBook Project - Sovereign Protocol (v13.0)
> **אדריכל מערכת:** יניב רז | **סטטוס:** Live / Autonomous | **יעד:** אפס תקלות, מקסימום עוצמה.

---

## 1. ניהול נכסים (Asset Management)
- **נתיב פיזי:** כל הקבצים מאוחסנים תחת `site/pdf/` בחלוקה לשכבות גיל.
- **סנכרון (Atomic Sync):** מתבצע אך ורק דרך `sync_engine.py`. אין להעתיק קבצים ידנית.
- **זהות קובץ:** כל קובץ חייב לעבור דרך `extract_meta.py` להפקת מזהה ייחודי, סיווג כיתה וחילוץ מחבר.

## 2. חוקת העיצוב (Cinematic Interface)
- **Theme:** "Eclipse Mode" בלבד. רקע Deep Space, Glassmorphism וטקסט נאון.
- **Physics:** כל תנועה בממשק חייבת לעבור דרך Anime.js עם אפקטי Elastic.
- **Reading Experience:** הקורא חייב לתמוך באנימציית 3D Flip המדמה דפדוף פיזי.

## 3. בקרה וניהול (Command Center)
- **Admin Panel:** לוח הבקרה ב-`admin.html` הוא מקור הסמכות היחיד לסטטיסטיקה.
- **Audit Logs:** כל פעולת מערכת (Sync, Push, Error) מתועדת ב-`logs.json`.
- **Integrity:** יחס ה-Unknown Author חייב להישאר מתחת ל-5%.

## 4. תשתית טכנולוגית (The Stack)
- **Frontend:** HTML5, CSS3 (Modern features only), JavaScript (ES6+).
- **Backend Automation:** Python 3.13, Shell scripts, Git.
- **Tools:** גיוס הכלים המקומיים (jq, gdown, gh) לטובת אוטומציה מלאה.

---
*נערך לאחרונה: 2026-03-07 | המערכת במצב Sovereign - פועלת עצמאית.*
