const express = require('express');
const router = express.Router();
const { getDb, query } = require('../db');

router.get('/daily-pick', async (req, res) => {
  await getDb();
  const rows = query('SELECT * FROM models WHERE is_daily_pick = 1 ORDER BY daily_pick_date DESC LIMIT 1');
  res.json(rows[0] || null);
});

router.get('/categories', async (req, res) => {
  const db = await getDb();
  const sceneResult = db.exec('SELECT category_scene, COUNT(*) as count FROM models GROUP BY category_scene');
  const typeResult = db.exec('SELECT category_type, COUNT(*) as count FROM models GROUP BY category_type');

  const scenes = {};
  const types = {};
  if (sceneResult.length) sceneResult[0].values.forEach(([k, v]) => scenes[k] = v);
  if (typeResult.length) typeResult[0].values.forEach(([k, v]) => types[k] = v);

  res.json({ scenes, types });
});

router.get('/', async (req, res) => {
  await getDb();
  const { scene, type, sort = 'score' } = req.query;

  let where = [];
  let params = [];

  if (scene && scene !== 'all') {
    where.push('category_scene = ?');
    params.push(scene);
  }
  if (type && type !== 'all') {
    where.push('category_type = ?');
    params.push(type);
  }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const orderBy = sort === 'ranking' ? 'ranking ASC' : 'score DESC';

  const rows = query(`SELECT * FROM models ${whereClause} ORDER BY ${orderBy}`, params);
  res.json(rows);
});

module.exports = router;
