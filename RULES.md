
---
## System Upgrade — Universal File Integration & Metadata
- **Scope:** Process ALL file types (PDF, DOCX, DOC) from the source directory. No file left behind.
- **Metadata Extraction:** Systematically extract filename, author (via internal file properties), and educational grade level.
- **UI Integration:** Display extracted metadata on the dashboard. PDFs route to the Reader; Word docs route to native device viewers.
- **System Dependencies:** Termux specifically requires libxml2, libxslt, clang, and pkg-config to compile python-docx and lxml.

---
## פרויקט מושלם — 2026-03-06
- [X] PWA Deployment: האתר ניתן להתקנה כאפליקציה.
- [X] Live Search: הוטמע מנוע חיפוש חכם.
- [X] Metadata: זיהוי אוטומטי של מחברים ושכבות גיל.
- **סטטוס סופי:** מערכת מבצעית מלאה.
