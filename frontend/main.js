// Handles frontend logic for scraping and displaying Amazon products

const keywordInput = document.getElementById('keyword');
const scrapeBtn = document.getElementById('scrapeBtn');
const resultsDiv = document.getElementById('results');
const errorDiv = document.getElementById('error');

scrapeBtn.onclick = async () => {
  const keyword = keywordInput.value.trim();
  errorDiv.textContent = '';
  resultsDiv.innerHTML = '';

  if (!keyword) {
    errorDiv.textContent = 'Please enter a keyword to search.';
    return;
  }

  scrapeBtn.disabled = true;
  scrapeBtn.textContent = 'Scraping...';

  try {
    const response = await fetch('http://localhost:3001/api/scrape?keyword=' + encodeURIComponent(keyword));
    if (!response.ok) {
      throw new Error('Server error: ' + (await response.text()));
    }
    const { products } = await response.json();

    if (!products || products.length === 0) {
      resultsDiv.innerHTML = '<p>No products found. Try a different keyword.</p>';
      return;
    }

    // Render results
    resultsDiv.innerHTML = '';
    products.forEach(prod => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <img src="${prod.image}" alt="Product Image"/>
        <div class="prod-info">
          <div class="prod-title">${prod.title}</div>
          <div class="prod-rating">⭐ ${prod.rating || 'N/A'}</div>
          <div class="prod-reviews">${prod.reviews ? (prod.reviews + ' reviews') : 'No reviews'}</div>
        </div>
      `;
      resultsDiv.appendChild(div);
    });
  } catch (err) {
    errorDiv.textContent = 'Failed to fetch or parse products. Please try again.';
  } finally {
    scrapeBtn.disabled = false;
    scrapeBtn.textContent = 'Scrape';
  }
};