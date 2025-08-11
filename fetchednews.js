const API_KEY = "adbe0de2f3002d5e5bb990937c185fbf"; //API Key

// Function to get selected preferences
function getUserPreferences() {
    return {
        topic: localStorage.getItem("selectedTopic") || "general",
        region: localStorage.getItem("selectedRegion") || "in"
    };
}

// Function to fetch news based on preferences or search query
async function fetchNews(searchQuery = "") {
    const { topic, region } = getUserPreferences();
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = "<p>Fetching news...</p>";

    let apiUrl = `https://gnews.io/api/v4/top-headlines?category=${topic}&country=${region}&apikey=${API_KEY}`;
    
    if (searchQuery) {
        apiUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=en&apikey=${API_KEY}`;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            displayNews(data.articles);
        } else {
            newsContainer.innerHTML = "<p>No news found.</p>";
        }
    } catch (error) {
        newsContainer.innerHTML = "<p>Error fetching news. Please try again later.</p>";
        console.error("Error fetching news:", error);
    }
}

// Function to handle search
function searchNews() {
    const searchQuery = document.getElementById("searchQuery").value.trim();
    if (searchQuery) {
        fetchNews(searchQuery);
    } else {
        fetchNews(); // If search is empty, fetch based on preferences
    }
}

// Function to display fetched news
function displayNews(articles) {
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = ""; // Clear previous content

    articles.forEach(article => {
        const articleCard = document.createElement("div");
        articleCard.classList.add("article-card");
        articleCard.innerHTML = `
            <div class="article-title">${article.title}</div>
            <div class="article-meta">Source: ${article.source.name} | Published on: ${new Date(article.publishedAt).toLocaleDateString()}</div>
            <div class="article-content">${article.description || "No description available."}</div>
            <a href="${article.url}" class="read-more" target="_blank" rel="noopener noreferrer">Read more</a>
        `;
        newsContainer.appendChild(articleCard);
    });
}

// Fetch news when the page loads
document.addEventListener("DOMContentLoaded", () => fetchNews());
