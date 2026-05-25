const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const { getDb, run, query, saveDb } = require('./db');
const { fetchNews } = require('./tasks/fetchNews');
const newsRouter = require('./routes/news');
const modelsRouter = require('./routes/models');
const productsRouter = require('./routes/products');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/news', newsRouter);
app.use('/api/models', modelsRouter);
app.use('/api/products', productsRouter);

app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  }
});

function rotateDailyPick() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const db = require('./db');

    run('UPDATE models SET is_daily_pick = 0 WHERE is_daily_pick = 1');
    const models = query('SELECT id FROM models ORDER BY RANDOM() LIMIT 1');
    if (models.length) {
      run('UPDATE models SET is_daily_pick = 1, daily_pick_date = ? WHERE id = ?', [today, models[0].id]);
    }

    run('UPDATE products SET is_daily_pick = 0 WHERE is_daily_pick = 1');
    const products = query('SELECT id FROM products ORDER BY RANDOM() LIMIT 1');
    if (products.length) {
      run('UPDATE products SET is_daily_pick = 1, daily_pick_date = ? WHERE id = ?', [today, products[0].id]);
    }

    console.log(`[DAILY] Rotated daily picks for ${today}`);
  } catch (err) {
    console.error('[DAILY] Rotation error:', err.message);
  }
}

async function start() {
  await getDb();

  cron.schedule('0 * * * *', () => {
    console.log('[CRON] Hourly news fetch triggered');
    fetchNews();
  });

  cron.schedule('0 0 * * *', () => {
    console.log('[CRON] Daily pick rotation triggered');
    rotateDailyPick();
  });

  app.listen(PORT, () => {
    console.log(`AI Frontier Hub Server running at http://localhost:${PORT}`);
    console.log('Cron jobs: RSS fetch (hourly), Daily pick rotation (midnight)');
  });
}

start();
