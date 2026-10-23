/* ==========================================================================
   THE CURRENT — app logic
   Fetches assets/data.json and renders either the homepage or the
   article page, depending on which elements exist in the current document.
   ========================================================================== */

const CATEGORY_COLORS = {
  Politics: "var(--c-politics)",
  Tech: "var(--c-tech)",
  Sports: "var(--c-sports)",
  Business: "var(--c-business)",
  Culture: "var(--c-culture)",
};

let ARTICLES = [];

async function loadArticles() {
  const res = await fetch("assets/data.json");
  if (!res.ok) throw new Error("Failed to load articles");
  const data = await res.json();
  return data.articles;
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function tagHTML(category) {
  const color = CATEGORY_COLORS[category] || "var(--accent)";
  return `<span class="tag" style="background:${color}">${category}</span>`;
}

function cardHTML(article) {
  return `
    <a class="card" href="article.html?id=${article.id}">
      <div class="card-media"><img src="${article.image}" alt="${article.title}" loading="lazy"></div>
      ${tagHTML(article.category)}
      <h3>${article.title}</h3>
      <p>${article.excerpt}</p>
      <div class="byline">${article.author} &middot; ${formatDate(article.date)} &middot; ${article.readTime}</div>
    </a>`;
}

/* ---------------------------------------------------------------------- */
/* Homepage rendering                                                      */
/* ---------------------------------------------------------------------- */

function renderHero(article) {
  const el = document.getElementById("hero");
  if (!el) return;
  el.innerHTML = `
    <a href="article.html?id=${article.id}" style="display:block">
      <div class="hero-media">
        <img src="${article.image}" alt="${article.title}">
        <div class="hero-content">
          ${tagHTML(article.category)}
          <h1>${article.title}</h1>
          <p>${article.excerpt}</p>
          <div class="byline">${article.author} &middot; ${formatDate(article.date)} &middot; ${article.readTime}</div>
        </div>
      </div>
    </a>`;
}

function renderTicker(articles) {
  const track = document.getElementById("ticker-track");
  if (!track) return;
  const trending = articles.filter(a => a.trending);
  const items = trending.map(a => `<span>▲ ${a.category.toUpperCase()} — ${a.title}</span>`);
  // duplicate the list so the CSS scroll animation loops seamlessly
  track.innerHTML = items.concat(items).join("");
}

function renderTrending(articles) {
  const list = document.getElementById("trending-list");
  if (!list) return;
  const trending = articles.filter(a => a.trending).slice(0, 4);
  list.innerHTML = trending.map((a, i) => `
    <li class="trending-item" onclick="location.href='article.html?id=${a.id}'">
      <span class="trending-num">${String(i + 1).padStart(2, "0")}</span>
      <div class="trending-body">
        <h3>${a.title}</h3>
        <span class="trending-meta">${a.category} &middot; ${a.readTime}</span>
      </div>
      <span class="trending-meta trending-meta-col">${formatDate(a.date)}</span>
    </li>`).join("");
}

function renderGrid(articles, category) {
  const grid = document.getElementById("category-grid");
  const heading = document.getElementById("category-heading");
  if (!grid) return;
  const filtered = category === "All" ? articles : articles.filter(a => a.category === category);
  grid.innerHTML = filtered.map(cardHTML).join("") || `<p style="color:var(--paper-dim)">No stories in this category yet.</p>`;
  if (heading) heading.textContent = category === "All" ? "Latest Stories" : category;
}

function setupCategoryNav(articles) {
  const buttons = document.querySelectorAll(".cat-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderGrid(articles, btn.dataset.category);
      document.getElementById("category-nav")?.classList.remove("open");
    });
  });
}

function setupMenuToggle() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("category-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
}

function setupNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  const note = document.getElementById("form-note");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input[type='email']");
    const email = input.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      note.textContent = "Please enter a valid email address.";
      note.classList.remove("success");
      return;
    }
    note.textContent = `Thanks — a confirmation was sent to ${email}.`;
    note.classList.add("success");
    form.reset();
  });
}

async function initHome() {
  try {
    ARTICLES = await loadArticles();
    const featured = ARTICLES.find(a => a.featured) || ARTICLES[0];
    renderHero(featured);
    renderTicker(ARTICLES);
    renderTrending(ARTICLES);
    renderGrid(ARTICLES, "All");
    setupCategoryNav(ARTICLES);
    setupMenuToggle();
    setupNewsletterForm();
  } catch (err) {
    console.error(err);
    const grid = document.getElementById("category-grid");
    if (grid) grid.innerHTML = `<p style="color:var(--paper-dim)">Couldn't load stories right now.</p>`;
  }
}

/* ---------------------------------------------------------------------- */
/* Article page rendering                                                  */
/* ---------------------------------------------------------------------- */

function paragraphOrQuote(text) {
  if (text.startsWith("PULLQUOTE::")) {
    return `<blockquote class="pull-quote">${text.replace("PULLQUOTE::", "")}</blockquote>`;
  }
  return `<p>${text}</p>`;
}

function renderArticle(article, all) {
  document.title = `${article.title} — The Current`;

  document.getElementById("article-tag").outerHTML = tagHTML(article.category).replace('class="tag"', 'id="article-tag" class="tag"');
  document.getElementById("article-title").textContent = article.title;
  document.getElementById("article-excerpt").textContent = article.excerpt;
  document.getElementById("article-author").textContent = article.author;
  document.getElementById("article-date").textContent = formatDate(article.date);
  document.getElementById("article-readtime").textContent = article.readTime;

  const media = document.getElementById("article-hero-img");
  media.src = article.image;
  media.alt = article.title;

  const body = document.getElementById("article-body");
  body.innerHTML = article.content.map(paragraphOrQuote).join("");

  const related = all.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3);
  const relatedGrid = document.getElementById("related-grid");
  const relatedSection = document.getElementById("related-section");
  if (related.length === 0 && relatedSection) {
    relatedSection.style.display = "none";
  } else if (relatedGrid) {
    relatedGrid.innerHTML = related.map(cardHTML).join("");
  }
}

async function initArticle() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const container = document.getElementById("article-body");
  try {
    ARTICLES = await loadArticles();
    const article = ARTICLES.find(a => a.id === id) || ARTICLES[0];
    renderArticle(article, ARTICLES);
  } catch (err) {
    console.error(err);
    if (container) container.innerHTML = `<p>Couldn't load this article right now.</p>`;
  }
}

/* ---------------------------------------------------------------------- */
/* Boot                                                                     */
/* ---------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("hero")) initHome();
  if (document.getElementById("article-body")) initArticle();
});
