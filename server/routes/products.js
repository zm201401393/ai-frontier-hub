const express = require('express');
const router = express.Router();
const { getDb, query } = require('../db');

router.get('/daily-pick', async (req, res) => {
  await getDb();
  const rows = query('SELECT * FROM products WHERE is_daily_pick = 1 ORDER BY daily_pick_date DESC LIMIT 1');
  res.json(rows[0] || null);
});

router.get('/', async (req, res) => {
  await getDb();
  const { category } = req.query;

  let where = [];
  let params = [];

  if (category && category !== 'all') {
    where.push('category = ?');
    params.push(category);
  }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const rows = query(`SELECT * FROM products ${whereClause} ORDER BY is_daily_pick DESC, created_at DESC`, params);
  res.json(rows);
});

module.exports = router;
