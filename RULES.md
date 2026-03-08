# 📘 DigitalBook — RULES (Source of Truth)

## עיקרון על
הקובץ הזה משקף רק מצב אמיתי שנבדק בפועל.
אין דמו.
אין תיאור של יכולת שלא אומתה.

# DIGITALBOOK — RULES.md
Last verified: 2026-03-08T09:07:36+02:00

## מטרת הפרויקט
בניית ספר דיגיטלי לדפי PDF עם דפדוף נוח, ניווט מהיר והשוואת קבצים.

## מה קיים בפועל (מאומת)
✔ אתר חי ב-GitHub Pages
✔ Reader לדפדוף PDF
✔ ניווט בין עמודים
✔ Compare V2 להשוואת שני קבצים
✔ קטלוג חכם V2
✔ Thumbnails לניווט
✔ טעינה מתוך generated/chapters.json

## כתובת האתר
https://yanivmizrachiy.github.io/digitalbook/

## מצב
המערכת חיה ומסונכרנת עם GitHub.

## שדרוג V3 — Auto Book Engine
- נוסף scripts/rebuild_book.py
- נוצר מחדש site/generated/chapters.json מתוך site/pdf
- מספר קבצי PDF שזוהו: 15
- מספר thumbnails שזוהו: 0
- המנוע משתמש בנתיבים אמיתיים מתוך site/
- אין דמו: המידע נבנה אוטומטית מהקבצים הקיימים




## מצב פריסה חי
- עודכן: 2026-03-08 12:16:31
- root/index.html: True
- root/reader.html: True
- root/compare.html: True
- root/app.js: False
- root/styles.css: False
- root/manifest.webmanifest: False


## מה בוצע ואומת ✅
- ריפו GitHub פעיל
- אתר GitHub Pages פעיל
- root/index.html נבדק מקומית
- root/reader.html נבדק מקומית
- root/compare.html נבדק מקומית
- generated/chapters.json נבנה מחדש מתוך PDF אמיתיים
- מספר קבצי PDF המחוברים כרגע לספר: 0
- RULES.md מסונכרן כמקור אמת
- נוצר דוח מצב אמיתי: STATE/latest_health_report.md

## מה נשאר לעשות
1. לאמת live שהדף הראשי נטען עם app.js, styles.css ו-manifest.webmanifest
2. לאמת בפועל דפדוף עמודים בתוך כמה PDF שונים
3. לאמת בפועל מעבר לקובץ הבא/הקודם
4. לאמת בפועל שכפתור הורדה עובד לכל קובץ
5. לטפל רק אחר כך בשיפורי UI/אנימציה שלא פוגעים ביציבות
6. להסיר או למזג קבצי PDF כפולים רק אחרי דוח כפילויות מאומת



## מצב מערכת אוטומטי
- עודכן: 2026-03-08 12:56:48
- מספר PDFs: 15
- root/index.html: yes
- root/reader.html: yes
- root/compare.html: yes
- root/app.js: yes
- root/styles.css: yes
- root/manifest.webmanifest: yes
