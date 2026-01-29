# Artworks DataTable – React Internship Assignment

This project is a React application built as part of a technical assignment. It demonstrates **server-side pagination**, **persistent row selection**, and **custom bulk selection** using the **PrimeReact DataTable** component while consuming data from the **Art Institute of Chicago API**.

---

## Live Demo

**Deployed URL:** https://artworksdata.netlify.app/

---

## Features Implemented

### Server-Side Pagination
- Data is fetched **page by page** from the API
- No prefetching or caching of other pages
- Pagination state (`page`, `rows`) is synced with the API

### Data Display
The following artwork fields are displayed in the table:
- `title`
- `place_of_origin`
- `artist_display`
- `inscriptions`
- `date_start`
- `date_end`

### Row Selection
- Checkbox selection for individual rows
- Select / deselect all rows on the **current page**
- Selection is based on a unique `id` (`dataKey="id"`)

### Persistent Selection Across Pages
- Selected rows **remain selected** when navigating between pages
- Selection state is maintained using a global `Set<number>` of artwork IDs
- No row objects from other pages are stored in memory

### Custom Row Selection Panel
- Overlay panel triggered from the selection column header
- User can input `N` to select a specific number of rows
- Selection is applied **incrementally across pages** without prefetching

Example:
- Page size = 12
- User selects `15`
- Page 1 → 12 rows selected
- Page 2 → first 3 rows automatically selected

---

## Selection Strategy (Important)

To comply with the assignment constraints:

- No prefetching of other pages
- No storing of row objects from other pages
- No looping API calls for bulk selection

### ✔ Implemented Approach

- Only **current page data** is stored
- Selected rows are tracked using:
  ```ts
  Set<number> // artwork IDs
  ```
- On each page load:
  - The table derives selected rows by matching IDs
- Custom bulk selection:
  - Selects as many rows as possible on the current page
  - Remaining selections are applied when the next page loads

This ensures:
- Low memory usage
- True server-side pagination
- Persistent selection behavior

---

## Tech Stack

- **React** (Vite)
- **TypeScript**
- **PrimeReact** (DataTable, OverlayPanel, InputNumber)
- **Art Institute of Chicago API**

---

## Installation & Setup

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to the project directory
cd artworks-datatable

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## API Used

```txt
https://api.artic.edu/api/v1/artworks?page=1
```

The API is called on:
- Initial load (page 1)
- Every pagination change

---

## Assignment Constraints Followed

- Vite used (no CRA)
- TypeScript only
- PrimeReact DataTable
- Server-side pagination
- Persistent row selection
- No mass data storage
- No prefetching of pages

---

## Testing Checklist

- [x] Navigate between pages and verify selections persist
- [x] Select rows on multiple pages
- [x] Use custom selection > page size
- [x] Reload pages and ensure fresh API fetch

---


## Author

**Name:** Vidhilika Gupta  

---