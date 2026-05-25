const RSSParser = require('rss-parser');
const { getDb, query, saveDb } = require('../db');

const parser = new RSSParser({ timeout: 10000 });

const RSS_SOURCES = [
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', icon: 'https://img.icons8.com/color/48/techcrunch.png', category: 'industry' },
  { name: 'The Verge AI', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', icon: 'https://img.icons8.com/color/48/the-verge.png', category: 'general' },
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/', icon: 'https://img.icons8.com/color/48/mit.png', category: 'research' },
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', icon: 'https://img.icons8.com/color/48/venturebeat.png', category: 'industry' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', icon: 'https://img.icons8.com/color/48/ars-technica.png', category: 'general' },
];

async function fetchNews() {
  const db = await getDb();
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  let totalNew = 0;

  for (const source of RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      const items = feed.items.slice(0, 10);

      for (const item of items) {
        const url = item.link || item.guid;
        if (!url) continue;

        const existing = db.exec('SELECT id FROM news WHERE url = ?', [url]);
        if (existing.length && existing[0].values.length) continue;

        const title = item.title || '';
        const aiKeywords = /\bai\b|artificial intelligence|machine learning|deep learning|llm|gpt|claude|gemini|大模型|人工智能|深度学习/i;
        if (source.name.includes('AI') || aiKeywords.test(title) || aiKeywords.test(item.contentSnippet || '')) {
          const summary = (item.contentSnippet || item.content || '').substring(0, 300);
          const imageMatch = (item.content || '').match(/<img[^>]+src="([^"]+)"/);
          const imageUrl = item.enclosure?.url || (imageMatch ? imageMatch[1] : null) || `https://picsum.photos/seed/${encodeURIComponent(title.substring(0, 20))}/600/300`;
          const publishedAt = item.pubDate ? new Date(item.pubDate).toISOString().replace('T', ' ').substring(0, 19) : now;

          db.run(
            'INSERT OR IGNORE INTO news (title, summary, url, source, source_icon, image_url, published_at, fetched_at, category) VALUES (?,?,?,?,?,?,?,?,?)',
            [title, summary, url, source.name, source.icon, imageUrl, publishedAt, now, source.category]
          );
          totalNew++;
        }
      }
    } catch (err) {
      console.error(`[RSS] Failed to fetch ${source.name}:`, err.message);
    }
  }

  if (totalNew > 0) saveDb();
  console.log(`[RSS] Fetched ${totalNew} new articles at ${now}`);
  return totalNew;
}

module.exports = { fetchNews };
