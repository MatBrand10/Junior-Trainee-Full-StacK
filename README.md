# Amazon Product Scraper

A simple full-stack app to scrape Amazon product listings from the first page of search results for a given keyword.

## Features

- **Backend (Bun + Express):**
  - `/api/scrape?keyword=...` endpoint scrapes and returns product info from Amazon.
  - Extracts title, rating, reviews, and image for each product.

- **Frontend (Vite + Vanilla JS):**
  - Input field and button to enter and submit a search.
  - Displays results cleanly and handles errors gracefully.

## Setup & Running

### 1. Backend

#### Prerequisites

- [Bun](https://bun.sh/) installed (≥ v1.0)

#### Install and Run

```sh
cd backend
bun install
bun index.js
```

- The backend will run on **http://localhost:3001**

### 2. Frontend

#### Prerequisites

- [Node.js](https://nodejs.org/) (for Vite)

#### Install and Run

```sh
cd frontend
npm install
npm run dev
```

- The frontend runs on **http://localhost:5173** (or as shown in your terminal).

#### Usage

1. Open the frontend in your browser.
2. Enter a keyword (e.g., "laptop") and click *Scrape*.
3. Product results will be displayed with title, rating, review count, and image.

### Troubleshooting

- **CORS errors:** The backend enables CORS for local frontend. Make sure both servers are running.
- **No results or scraping error:** Amazon frequently changes their HTML and employs anti-bot measures. This scraper is for educational/demo use and may break; try changing User-Agent or adding cookies if needed.
- **Rate Limits:** Frequent requests may trigger Amazon's bot detection or CAPTCHA.

### Notes

- This project is for educational/demo use. Do not use for commercial purposes or abuse Amazon's site.
- The code is commented for clarity; review `backend/index.js` for scraping logic.

---

**Enjoy!**