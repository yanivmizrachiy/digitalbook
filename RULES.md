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
- ריפו GitHub פעיל ומסונכרן
- GitHub Pages חי
- מנוע הבית החי זוהה ואומת: site/index.html + site/catalog_v2.js
- reader חי ואומת
- compare חי ואומת ברמת נתיבי קלט
- הקטלוג החי מסונכרן עם site/pdf
- קיימים 15 קבצים חיים בקטלוג הפעיל
- DOWNLOAD_OK_COUNT = 15
- DOWNLOAD_MISS_COUNT = 0
- COMPARE_READY = YES
- הוטמע reader multiview שלב א: 1 / 2 / 3 עמודים + הדפסה + fit-to-width
- הוטמע reader multiview שלב ב: גלילה רציפה + שיפור מסכים רחבים
- הוטמע reader UX שלב ג: שמירת מצב + קיצורי מקלדת
- נשמרו דוחות מצב ב-STATE/


## מה נשאר לעשות
1. לבדוק ידנית מהנייד ומהמחשב שסידור הכפתורים נוח באמת
2. לאשר שה-reader וה-compare מרגישים ברורים יותר
3. רק אם יישאר כאב UX אמיתי לבצע תיקון נוסף נקודתי


## מצב מנוע חי אמיתי
- עודכן: 2026-03-08 13:15:50
- דף הבית החי מבוסס בפועל על: site/index.html
- מנוע הקטלוג החי שזוהה: site/catalog_v2.js
- קבצי עזר שזוהו:
  - site/reader_nav.js
  - site/reader_thumbs.js
- אין לתאר את app.js כמנוע דף הבית הפעיל עד אימות חי מפורש


## מצב אימות reader
- דוח אימות נשמר: STATE/reader_validation.md
- קבצים שנמצאו תקינים ל-reader: 15
- קבצים חסרים ל-reader: 0
- מנוע האימות בוצע מול site/generated/chapters.json


## מצב אימות compare והורדה
- דוח אימות נשמר: STATE/compare_download_validation.md
- קבצים תקינים להורדה: 15
- קבצים חסרים להורדה: 0
- compare מוכן ברמת נתיבי קלט: YES
- האימות בוצע מול site/generated/chapters.json


## מצב ליטוש סופי
- עודכן: 2026-03-08 21:00:29
- site/reader.html שופר עם כפתור הורדה וסרגל פעולות
- site/compare.html שופר עם כותרת וסרגל פעולות
- site/styles.css שופר לליטוש ממשק חי
- הליטוש בוצע רק על המנוע החי, בלי ליצור מנוע כפול
- דוח נשמר: STATE/final_polish_report.md


## מצב הרחבת reader - שלב א
- עודכן: 2026-03-08 23:02:34
- נוסף מנוע multiview לקורא החי: site/reader_multiview.js
- נוספו מצבי תצוגה: 1 / 2 / 3 עמודים
- נוסף דפדוף לפי קבוצת עמודים
- נוספה התאמה לרוחב
- נוספה הדפסה
- עודכן CSS למסך ולהדפסה
- דוח נשמר: STATE/multiview_phase_a_report.md


## מצב ניקוי אחרי multiview
- עודכן: 2026-03-08 23:09:18
- קבצי bak של reader/styles נוקו או הוחרגו
- .gitignore עודכן עבור site/*.bak.*
- הריפו נשמר נקי אחרי שלב א'


## מצב הרחבת reader - שלב ב
- עודכן: 2026-03-08 23:22:13
- נוסף מצב גלילה רציפה לקורא החי
- נשמרו מצבי 1 / 2 / 3 עמודים
- שופרה תצוגה למסכים רחבים
- דוח נשמר: STATE/multiview_phase_b_report.md


## מצב נעילה סופי
- עודכן: 2026-03-08 23:29:04
- פיתוח המערכת החיה הושלם
- המנוע החי הנוכחי ננעל כמנוע אמת
- אין להוסיף מנוע נוסף או לעבוד כפול לפני צורך אמיתי
- נשמר checklist ידני: STATE/manual_qa_checklist.md


## מצב reader UX - שלב ג
- עודכן: 2026-03-08 23:26:35
- נשמר מצב תצוגה אחרון ב-localStorage
- נשמר מצב fit-to-width ב-localStorage
- נשמר מצב גלילה רציפה ב-localStorage
- נוספו קיצורי מקלדת ל-reader
- דוח נשמר: STATE/reader_phase_c_report.md



## מצב QA מואץ
- עודכן: 2026-03-08 23:33:53
- נוסף support לפרמטרים ב-reader: mode / scroll / fit
- נוצר קובץ קישורי בדיקה חיים: STATE/qa_quick_links.md
- אפשר לבדוק במהירות מצבי 1 / 2 / 3 / גלילה רציפה / compare / הורדה


## מצב QA חי
- עודכן: 2026-03-08 23:36:39
- נוצר עמוד QA חי: site/qa.html
- אפשר לבדוק ממנו מצבי 1 / 2 / 3 / גלילה רציפה / compare / הורדה
- מטרת העמוד: להאיץ QA ידני בלי לעבוד דרך קבצים חיצוניים


## מצב QA משולב
- עודכן: 2026-03-08 23:49:14
- QA שולב בתוך הזרימה החיה של האתר
- נוסף כפתור QA בדף הבית
- נוסף קישור QA מתוך reader ו-compare
- נשמר דוח: STATE/embedded_qa_flow_report.md


## מצב תיקון מובייל
- עודכן: 2026-03-09 08:18:13
- תוקן סידור הכפתורים בנייד עבור reader / multiview / compare
- הוגדל אזור לחיצה לכפתורים
- נשמר דוח: STATE/mobile_reader_fix_report.md


## מצב שיפור כפתורים עמוק
- עודכן: 2026-03-09 09:14:06
- שופרה היררכיית הכפתורים
- שופר grouping של פעולות ב-reader וב-compare
- שופרו sticky toolbars
- שופר UX לנייד ולמסכים רחבים
- נשמר דוח: STATE/deep_buttons_ux_report.md


## מצב מערכת אוטומטי
- עודכן:  + "TS" + 
- commit אחרון:  + "LAST_COMMIT" + 
- הודעה:  + "LAST_MSG" + 
- מספר PDFs:  + "PDF_COUNT" + 

