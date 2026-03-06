# Digital Mathematics Book - Project Rules & Governance (Updated 2026-03-06)

## 1. UI/UX Architecture
- **Premium Interface:** Implementation of Dark Mode, Skeleton Loaders, and Micro-interactions.
- **Visual Hierarchy:** Sticky headers and high-contrast typography for academic readability.

## 2. Navigation & Usability
- **Tabbed Browsing:** Separate views for Middle School (7-9) and Matriculation (3-5 Units).
- **Fuzzy Search:** Intelligent search matching across titles, authors, and subjects.
- **Deep Linking:** Support for URL parameters to share specific views (e.g., ?level=5-units).

## 3. Content Interaction
- **Inline PDF Reader:** Direct viewing using PDF.js to keep users within the platform.
- **Metadata Visibility:** Author, Year, and Assignment Type must be displayed on every card.
- **Empty States:** Clear messaging and "Reset Filters" when no results are found.

## 4. Technical Standards
- **Sync Integrity:** GitHub repository structure must mirror the UI taxonomy.
- **Performance:** Optimized JSON parsing and CSS Grid for mobile-first responsiveness.
## 6. Smart URL Parameters (Update 2026-03-06)
- המערכת תומכת בקישורים מסוננים מראש: ?grade=7 יפתח אוטומטית את חומרי כיתה ז'.
