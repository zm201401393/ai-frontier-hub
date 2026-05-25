const express = require('express');
const router = express.Router();
const { getDb, query } = require('../db');
const { fetchNews } = require('../tasks/fetchNews');

router.get('/latest', async (req, res) => {
  await getDb();
  const rows = query('SELECT * FROM news ORDER BY published_at DESC LIMIT 10');
  res.json(rows);
});

router.get('/', async (req, res) => {
  const db = await getDb();
  const { category, search, page = 1, pageSize = 12 } = req.query;

  let where = [];
  let params = [];

  if (category && category !== 'all') {
    where.push('category = ?');
    params.push(category);
  }
  if (search) {
    where.push('(title LIKE ? OR summary LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const countResult = db.exec(`SELECT COUNT(*) FROM news ${whereClause}`, params);
  const total = countResult.length ? countResult[0].values[0][0] : 0;

  const offset = (parseInt(page) - 1) * parseInt(pageSize);
  const rows = query(`SELECT * FROM news ${whereClause} ORDER BY published_at DESC LIMIT ? OFFSET ?`, [...params, parseInt(pageSize), offset]);

  res.json({ data: rows, total, page: parseInt(page), pageSize: parseInt(pageSize) });
});

router.post('/fetch', async (req, res) => {
  try {
    const count = await fetchNews();
    res.json({ success: true, newArticles: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
