# Digital Mathematics Book - Library Protocol (v6.0)

## 1. Digital Library Standards
- **Real File Access:** כל קובץ חייב לכלול כפתור הורדה (Download) שעובד בטכנולוגיית Blob להבטחת הורדה פיזית.
- **Visual Library:** הממשק מעוצב כספרייה דיגיטלית עם כרטיסיות תוכן עשירות.

## 2. Button Functionality
- **No-Demo Policy:** כל כפתור "הורדה" או "צפייה" חייב להיות מחובר לקובץ האמיתי בתיקיית /pdf.
- **Mobile Native:** הכפתורים מותאמים ללחיצה קלה במסכי מגע (Fat-finger friendly).

## 12. Exam Mode & Time Management (Update 2026-03-06)
- **Functional Timer:** ה-Reader כולל טיימר אקטיבי לספירה לאחור (90 דקות ברירת מחדל).
- **Focus Mode:** אפשרות להעלמת הממשק (Focus Mode) כדי למנוע הסחות דעת בזמן פתרון.
- **Strict Implementation:** כל כפתור במצב המבחן מחובר ללוגיקה של Javascript ואינו דקורטיבי.

## 13. Data Ingestion Protocol (Update 2026-03-06)
- **Source Sync:** בוצעה שאיבת קבצים מתיקיות הדרייב "שאלות כמו בתוכנית" ו"מתמטיקה ז'".
- **New Content:** הוטמעה חוברת תרגול כיתה ז' (מחצית א').
- **Integrity:** כל קובץ חדש קיבל אוטומטית כפתורי צפייה, הורדה ומצב מבחן.
