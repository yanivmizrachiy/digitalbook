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
- עודכן: 2026-03-08 13:12:23
- publish source בפועל: site/
- site/index.html: True
- site/reader.html: True
- site/compare.html: True
- site/app.js: True
- site/styles.css: True
- site/manifest.webmanifest: True
- site/generated/chapters.json: True



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
1. לעבוד רק על מנוע הדף החי האמיתי: site/index.html + site/catalog_v2.js
2. לאמת שכפתור פתיחה ל-reader עובד לכל הקבצים
3. לאמת שכפתור compare עובד באמת
4. להוסיף הורדה נוחה וברורה לכל קובץ
5. לשפר דפדוף וניווט בלי ליצור מנוע כפול
6. לנקות בהמשך קבצי frontend לא פעילים רק אחרי אימות סופי


## מצב מנוע חי אמיתי
- עודכן: 2026-03-08 13:15:50
- דף הבית החי מבוסס בפועל על: site/index.html
- מנוע הקטלוג החי שזוהה: site/catalog_v2.js
- קבצי עזר שזוהו:
  - site/reader_nav.js
  - site/reader_thumbs.js
- אין לתאר את app.js כמנוע דף הבית הפעיל עד אימות חי מפורש


## מצב מערכת אוטומטי
- עודכן:  + "TS" + 
- commit אחרון:  + "LAST_COMMIT" + 
- הודעה:  + "LAST_MSG" + 
- מספר PDFs:  + "PDF_COUNT" + 

