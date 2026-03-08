# 📘 DigitalBook — RULES (Source of Truth)

עודכן: 2026-03-08 07:34:13

## עיקרון על
הקובץ הזה חייב לשקף רק מצב אמיתי שנבדק בפועל.
אין דמו.
אין תיאור כאילו הוא קיים אם הוא לא נבדק.

---

## מטרת הפרויקט
לבנות ספר דיגיטלי אמיתי בעברית RTL, עם צפייה אמיתית ב-PDF, ניווט אמיתי, הורדה אמיתית, וריפו מסודר.

---

## מה בוצע ונבדק ✅
- ריפו GitHub פעיל
- אתר חי ב-GitHub Pages
- site/index.html: yes
- site/reader.html: yes
- site/compare.html: yes
- site/generated/chapters.json: yes
- מספר PDFים אמיתיים תחת site/pdf: 15

---

## מה קיים בקבצים אבל עדיין צריך אימות מלא ⚠️
- site/app.js: no
- site/styles.css: no
- site/manifest.webmanifest: no
- compare feature בקוד: yes
- stealth feature בקוד: yes
- voice search בקוד: no
- night mode בקוד: yes
- cinema mode בקוד: no

---

## מה לא הוכח או לא קיים עדיין ❌
- site/sw.js: no
- extract_meta.py: yes

אם ערך הוא no — מבחינת הפרויקט זה לא קיים/לא הוכח.

---

## תהליך עבודה מחייב
כל שינוי בפרויקט מחייב:
1. שינוי אמיתי בקוד
2. בדיקה אמיתית
3. עדכון RULES.md
4. commit
5. push

---

## מה נשאר לעשות
1. לאמת שכל קבצי ה-PDF באמת מוצגים באתר
2. לאמת שכפתור הורדה עובד באמת
3. לאמת מה מתוך compare / stealth / voice / night / cinema באמת עובד
4. להוסיף רק אחר כך פיצ'רים חסרים

---

## דוח מצב
ראו:
- STATE/REAL_STATUS.md
