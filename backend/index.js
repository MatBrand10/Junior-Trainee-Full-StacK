// Dependencies
import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Enable CORS for frontend local dev
app.use(cors());

// Utility to extract product details from Amazon HTML
function extractProducts(document) {
  // Amazon sometimes uses a variety of selectors. The main product containers have data-asin and s-result-item.
  const productNodes = Array.from(document.querySelectorAll('div[data-component-type="s-search-result"]'));
  return productNodes.map(node => {
    // Title
    const titleElem = node.querySelector('h2 a span');
    const title = titleElem ? titleElem.textContent.trim() : null;

    // Rating (might be missing)
    const ratingElem = node.querySelector('[aria-label*="out of 5 stars"]');
    let rating = null;
    if (ratingElem) {
      const match = ratingElem.getAttribute('aria-label').match(/([\d.,]+) out of 5 stars/);
      rating = match ? match[1] : null;
    }

    // Number of reviews (might be missing)
    const reviewsElem = node.querySelector('span[aria-label][class*="review"]');
    let reviews = null;
    if (reviewsElem) {
      const match = reviewsElem.getAttribute('aria-label').replace(/[^\d]/g, '');
      reviews = match || null;
    }

    // Image URL
    const imgElem = node.querySelector('img.s-image');
    const image = imgElem ? imgElem.src : null;

    return {
      title,
      rating,
      reviews,
      image
    };
  }).filter(p => p.title && p.image); // Filter out non-product nodes
}

// /api/scrape?keyword=...
app.get('/api/scrape', async (req, res) => {
  const { keyword } = req.query;
  if (!keyword || typeof keyword !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid keyword query parameter.' });
  }

  // Construct Amazon search URL (US site)
  const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

  try {
    // Fetch the HTML of the results page. Use a user-agent to avoid bot detection as much as possible.
    const { data: html } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });

    // Parse HTML with JSDOM
    const dom = new JSDOM(html);
    const products = extractProducts(dom.window.document);

    res.json({ products });
  } catch (error) {
    console.error('Scraping error:', error.message);
    res.status(500).json({ error: 'Failed to fetch or parse Amazon results.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});