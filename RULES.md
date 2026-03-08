# 📘 DigitalBook — RULES (Source of Truth)

עודכן: 2026-03-08 07:44:34

## עיקרון על
הקובץ הזה משקף רק מצב אמיתי שנבדק בפועל.
אין דמו.
אין תיאור של יכולת שלא אומתה.
כל שינוי בפרויקט מחייב עדכון RULES.md.

---

## מטרת הפרויקט
ספר דיגיטלי אמיתי בעברית RTL, עם צפייה אמיתית ב-PDF, ניווט אמיתי, הורדה אמיתית, וריפו מסודר ב-GitHub.

---

## מה בוצע ואומת ✅
- ריפו GitHub פעיל ומסונכרן
- אתר חי ב-GitHub Pages
- קיימים 15 קובצי PDF אמיתיים
- תוקנה בעיית הנתיבים ב-chapters.json
- הוגדר hook אוטומטי בטוח מסוג pre-commit לעדכון RULES.md
- בוצעה בדיקה והשלמה של קבצי publish ב-root
- דוח מצב אחרון נכתב ל-STATE/latest_smart_fix.md

  - לפני: pdf\...
  - אחרי: pdf/...
- אומת שלכל 15 קובצי ה-PDF יש התאמה תקינה ב-chapters.json
- אומת שלכל 15 קובצי ה-PDF יש נתיב חי תקין באתר
- תוצאת בדיקה אחרונה:
  - OK_COUNT = 15
  - BAD_COUNT = 0

---

## מה זוהה בקוד אבל עדיין דורש אימות שימושיות ⚠️
- compare feature זוהה בקוד
- stealth feature זוהה בקוד
- night mode זוהה בקוד

---

## מה לא הוכח או לא קיים עדיין ❌
- site/sw.js לא זוהה
- voice search לא זוהה
- cinema mode לא זוהה
- לא הושלם עדיין אימות ידני מלא של כל כפתורי הממשק בדפדפן

---

## מה נשאר לעשות
1. לאמת סופית ש-reader.html חי באתר
2. לאמת סופית ש-compare.html חי באתר
3. לאמת ידנית את פעולת compare בממשק
4. לאמת ידנית את פעולת stealth ו-night mode
5. לנקות קבצים לא מנוהלים/מיותרים


## דרך עבודה מחייבת
כל שינוי מחייב:
1. שינוי אמיתי בקוד או בנתונים
2. בדיקה אמיתית
3. עדכון RULES.md
4. commit
5. push


## מצב פריסת Pages
- עודכן: 2026-03-08 08:18:21
- מקור הפריסה: GitHub Actions workflow
- נוצר workflow: .github/workflows/pages.yml
- היעד: פריסה של root artifact
- reader.html: ממתין לאימות אחרי ריצת workflow
- compare.html: ממתין לאימות אחרי ריצת workflow




## מצב מערכת אוטומטי
- עודכן: 2026-03-08 08:18:21
- מספר PDFs: 15
- root/index.html: yes
- root/reader.html: yes
- root/compare.html: yes
- root/app.js: no
- root/styles.css: no
- root/manifest.webmanifest: no
