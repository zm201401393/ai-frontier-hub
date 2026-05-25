const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'data.db');
let db;

async function getDb() {
  if (db) return db;
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
    initTables();
    seedData();
    saveDb();
  }
  return db;
}

function saveDb() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function query(sql, params = []) {
  const results = db.exec(sql, params);
  if (!results.length) return [];
  const columns = results[0].columns;
  return results[0].values.map(row => {
    const obj = {};
    columns.forEach((col, i) => obj[col] = row[i]);
    return obj;
  });
}

function run(sql, params = []) {
  db.run(sql, params);
  saveDb();
}

function initTables() {
  db.run(`CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT,
    url TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL,
    source_icon TEXT,
    image_url TEXT,
    published_at TEXT,
    fetched_at TEXT NOT NULL,
    category TEXT DEFAULT 'general'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS models (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    logo TEXT,
    description TEXT,
    url TEXT,
    category_scene TEXT,
    category_type TEXT,
    score REAL DEFAULT 0,
    ranking INTEGER DEFAULT 0,
    is_daily_pick INTEGER DEFAULT 0,
    daily_pick_date TEXT,
    features TEXT DEFAULT '[]',
    pricing TEXT DEFAULT 'free'
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    logo TEXT,
    description TEXT,
    detail TEXT,
    url TEXT,
    category TEXT DEFAULT 'other',
    base_model TEXT,
    is_daily_pick INTEGER DEFAULT 0,
    daily_pick_date TEXT,
    recommend_reason TEXT,
    created_at TEXT NOT NULL
  )`);
}

function seedData() {
  const today = new Date().toISOString().split('T')[0];

  const models = [
    ['GPT-4o', 'OpenAI', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/120px-ChatGPT_logo.svg.png', 'OpenAI 最强多模态模型，支持文本、图像、音频输入输出，推理能力顶级', 'https://chat.openai.com', 'work', 'multimodal', 95.2, 1, 0, null, '["多模态理解","代码生成","数据分析","图像识别"]', 'freemium'],
    ['Claude 4 Sonnet', 'Anthropic', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Anthropic_logo.svg/120px-Anthropic_logo.svg.png', 'Anthropic 旗舰模型，超长上下文窗口，深度推理与编程能力卓越', 'https://claude.ai', 'work', 'text', 94.8, 2, 1, today, '["200K上下文","深度推理","代码生成","安全可控"]', 'freemium'],
    ['Gemini 2.5 Pro', 'Google', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/120px-Google_Gemini_logo.svg.png', 'Google 最新旗舰模型，100万token上下文，原生多模态', 'https://gemini.google.com', 'work', 'multimodal', 94.1, 3, 0, null, '["百万上下文","原生多模态","代码理解","搜索增强"]', 'freemium'],
    ['DeepSeek-R1', 'DeepSeek', 'https://avatars.githubusercontent.com/u/148330874?s=120', '深度求索推出的推理模型，数学和编程领域表现突出，开源可部署', 'https://chat.deepseek.com', 'study', 'text', 92.5, 4, 0, null, '["深度推理","数学证明","代码生成","开源免费"]', 'free'],
    ['Grok-3', 'xAI', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/X_AI_Logo.png/120px-X_AI_Logo.png', 'xAI 最新大模型，实时联网，幽默风趣的对话风格', 'https://grok.x.ai', 'work', 'text', 91.8, 5, 0, null, '["实时联网","幽默对话","代码生成","图像理解"]', 'freemium'],
    ['Llama 4 Maverick', 'Meta', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Meta-Logo.png/120px-Meta-Logo.png', 'Meta 开源大模型最新版，性能比肩闭源模型，完全免费开源', 'https://llama.meta.com', 'study', 'text', 91.2, 6, 0, null, '["完全开源","高性能","可本地部署","多语言"]', 'free'],
    ['Qwen 3', 'Alibaba', 'https://img.alicdn.com/imgextra/i1/O1CN01AKPvHR1Mz1b8ylRFb_!!6000000001505-2-tps-120-120.png', '阿里通义千问3.0，中英文双语能力领先，支持多模态', 'https://tongyi.aliyun.com', 'work', 'text', 90.5, 7, 0, null, '["中文优化","多模态","代码生成","数学推理"]', 'freemium'],
    ['Mistral Large 2', 'Mistral AI', 'https://avatars.githubusercontent.com/u/132372032?s=120', '欧洲领先AI公司旗舰模型，多语言能力出色，推理性能优秀', 'https://chat.mistral.ai', 'work', 'text', 89.3, 8, 0, null, '["多语言","推理","代码","开源生态"]', 'freemium'],
    ['DALL-E 3', 'OpenAI', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/120px-ChatGPT_logo.svg.png', 'OpenAI 图像生成模型，提示词理解精准，图像质量极高', 'https://chat.openai.com', 'creative', 'image', 93.0, 1, 0, null, '["精准提示理解","高质量图像","风格多样","安全过滤"]', 'paid'],
    ['Midjourney v6.1', 'Midjourney', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Midjourney_Emblem.png/120px-Midjourney_Emblem.png', '艺术级AI绘画工具，美学质量业界第一，社区活跃', 'https://midjourney.com', 'creative', 'image', 95.5, 1, 0, null, '["艺术级画质","风格丰富","社区共创","提示优化"]', 'paid'],
    ['Stable Diffusion 3.5', 'Stability AI', 'https://avatars.githubusercontent.com/u/100950301?s=120', '开源图像生成模型，可本地部署，生态丰富', 'https://stability.ai', 'creative', 'image', 88.0, 3, 0, null, '["开源免费","本地部署","LoRA微调","插件生态"]', 'free'],
    ['Suno v4', 'Suno AI', 'https://avatars.githubusercontent.com/u/148925795?s=120', 'AI音乐生成领导者，支持歌词创作和多种音乐风格', 'https://suno.ai', 'creative', 'voice', 91.0, 1, 0, null, '["音乐生成","歌词创作","多种风格","高质量音频"]', 'freemium'],
    ['ElevenLabs', 'ElevenLabs', 'https://avatars.githubusercontent.com/u/101422956?s=120', '最先进的AI语音合成平台，支持语音克隆和多语言', 'https://elevenlabs.io', 'work', 'voice', 93.5, 1, 0, null, '["语音克隆","多语言","情感控制","实时合成"]', 'freemium'],
    ['Runway Gen-3 Alpha', 'Runway', 'https://avatars.githubusercontent.com/u/44708522?s=120', 'AI视频生成领先者，支持文生视频和图生视频', 'https://runwayml.com', 'creative', 'video', 90.0, 1, 0, null, '["文生视频","图生视频","运动控制","高清输出"]', 'paid'],
    ['Cursor', 'Anysphere', 'https://avatars.githubusercontent.com/u/102771702?s=120', 'AI驱动的代码编辑器，基于VS Code深度集成AI编程能力', 'https://cursor.sh', 'work', 'code', 94.0, 1, 0, null, '["AI代码补全","多文件编辑","Agent模式","调试辅助"]', 'freemium'],
    ['Gemini 2.5 Flash', 'Google', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/120px-Google_Gemini_logo.svg.png', 'Google 高速推理模型，速度快成本低，适合大规模应用', 'https://gemini.google.com', 'work', 'text', 88.5, 9, 0, null, '["超快速度","低成本","百万上下文","多模态"]', 'freemium'],
  ];

  const modelStmt = db.prepare('INSERT INTO models (name, provider, logo, description, url, category_scene, category_type, score, ranking, is_daily_pick, daily_pick_date, features, pricing) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)');
  models.forEach(m => modelStmt.run(m));
  modelStmt.free();

  const products = [
    ['Perplexity AI', 'https://avatars.githubusercontent.com/u/114076998?s=120', 'AI驱动的智能搜索引擎，实时联网回答问题并提供引用来源', '融合搜索与AI对话的新一代搜索引擎，每次回答都附带来源引用，支持学术论文检索和深度研究模式', 'https://perplexity.ai', 'other', 'GPT-4o / Claude', 1, today, '今日最佳 - 搜索+AI的完美结合，每个知识工作者都应该尝试'],
    ['Cursor', 'https://avatars.githubusercontent.com/u/102771702?s=120', 'AI原生代码编辑器，让编程效率提升10倍', '基于VS Code打造的AI代码编辑器，支持代码生成、多文件编辑、Bug修复，集成Claude/GPT等多个模型', 'https://cursor.sh', 'dev', 'Claude / GPT-4o', 0, null, '程序员必备工具，AI编程的标杆产品'],
    ['v0.dev', 'https://avatars.githubusercontent.com/u/14985020?s=120', 'Vercel推出的AI前端代码生成器', '输入自然语言描述即可生成完整的React/Vue组件代码，支持实时预览和迭代修改', 'https://v0.dev', 'dev', 'Claude 4 Sonnet', 0, null, '前端开发者的效率倍增器'],
    ['Jasper AI', 'https://avatars.githubusercontent.com/u/87327093?s=120', '企业级AI营销内容创作平台', '专为营销团队设计的AI写作工具，支持广告文案、博客、社交媒体内容批量生成', 'https://jasper.ai', 'marketing', 'GPT-4o', 0, null, '营销团队的AI助手'],
    ['Harvey AI', 'https://avatars.githubusercontent.com/u/119390279?s=120', '专为法律行业设计的AI助手', '基于大模型的法律AI，可以进行合同分析、法律研究、文书起草，已获多家顶级律所采用', 'https://harvey.ai', 'legal', 'GPT-4 / Claude', 0, null, '法律行业AI应用的标杆'],
    ['Glass Health', 'https://avatars.githubusercontent.com/u/100706866?s=120', '临床决策支持AI系统', '帮助医生生成鉴别诊断和临床计划，基于最新医学文献和循证医学', 'https://glass.health', 'healthcare', 'GPT-4o', 0, null, '医疗AI的创新先锋'],
    ['Gamma', 'https://avatars.githubusercontent.com/u/94858026?s=120', 'AI一键生成精美演示文稿', '输入主题即可生成完整PPT，支持自定义模板、图表嵌入和实时协作', 'https://gamma.app', 'other', 'GPT-4o', 0, null, '告别PPT制作焦虑'],
    ['Notion AI', 'https://avatars.githubusercontent.com/u/1171232?s=120', 'Notion内置AI助手，智能知识管理', '集成在Notion中的AI功能，支持写作辅助、内容总结、头脑风暴和数据库查询', 'https://notion.so', 'other', 'Claude / GPT', 0, null, '知识管理+AI的完美融合'],
    ['Descript', 'https://avatars.githubusercontent.com/u/37455380?s=120', 'AI音视频编辑全能工具', '像编辑文档一样编辑视频，支持AI字幕、语音克隆、背景移除和自动剪辑', 'https://descript.com', 'design', 'Custom', 0, null, '视频创作者的效率革命'],
    ['Runway ML', 'https://avatars.githubusercontent.com/u/44708522?s=120', '专业AI视频生成和编辑平台', '提供文生视频、图生视频、视频编辑等一站式AI创作工具，影视行业广泛使用', 'https://runwayml.com', 'design', 'Gen-3 Alpha', 0, null, '影视级AI创作工具'],
    ['Canva AI', 'https://avatars.githubusercontent.com/u/17797957?s=120', 'Canva集成的AI设计助手Magic Studio', '一键生成设计、AI抠图、文案写作、视频编辑，让所有人都能做出专业设计', 'https://canva.com', 'design', 'Multiple', 0, null, '设计民主化的推动者'],
    ['Codeium / Windsurf', 'https://avatars.githubusercontent.com/u/115708469?s=120', '免费AI代码补全和生成工具', '支持70+编程语言的AI编程助手，提供代码补全、解释和重构功能，对个人开发者免费', 'https://codeium.com', 'dev', 'Custom', 0, null, '免费且强大的AI编程助手'],
  ];

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const prodStmt = db.prepare('INSERT INTO products (name, logo, description, detail, url, category, base_model, is_daily_pick, daily_pick_date, recommend_reason, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
  products.forEach(p => prodStmt.run([...p, now]));
  prodStmt.free();

  const newsItems = [
    ['OpenAI发布GPT-5预览版，推理能力大幅提升', 'OpenAI今日发布了GPT-5模型的开发者预览版，新模型在数学推理、编程和多语言任务上表现显著提升，同时首次引入了持久记忆功能。', 'https://example.com/news/gpt5-preview', 'TechCrunch AI', 'https://img.icons8.com/color/48/techcrunch.png', 'https://picsum.photos/seed/gpt5/600/300', '2026-05-20 08:00:00', 'research'],
    ['Google DeepMind发布新一代蛋白质结构预测模型AlphaFold 4', '新版AlphaFold在预测蛋白质-药物相互作用方面准确率提升40%，有望加速新药研发进程。', 'https://example.com/news/alphafold4', 'MIT Tech Review', 'https://img.icons8.com/color/48/mit.png', 'https://picsum.photos/seed/alphafold/600/300', '2026-05-20 07:30:00', 'research'],
    ['欧盟AI法案正式生效，全球AI监管进入新阶段', '欧盟《人工智能法案》今日全面生效，要求高风险AI系统必须经过严格的安全评估和透明度审查。', 'https://example.com/news/eu-ai-act', 'The Verge AI', 'https://img.icons8.com/color/48/the-verge.png', 'https://picsum.photos/seed/euai/600/300', '2026-05-20 06:45:00', 'industry'],
    ['Anthropic开源Claude Code工具链，开发者社区反响热烈', 'Anthropic将其内部使用的Claude Code开发工具完整开源，包括CLI、IDE插件和Agent SDK。', 'https://example.com/news/claude-code-open', 'VentureBeat AI', 'https://img.icons8.com/color/48/venturebeat.png', 'https://picsum.photos/seed/claudecode/600/300', '2026-05-19 22:00:00', 'product'],
    ['Meta发布Llama 4 Scout：首个支持1000万token上下文的开源模型', 'Meta最新开源模型Llama 4 Scout支持超长上下文窗口，可处理整本书籍或大型代码库。', 'https://example.com/news/llama4-scout', 'Ars Technica', 'https://img.icons8.com/color/48/ars-technica.png', 'https://picsum.photos/seed/llama4/600/300', '2026-05-19 20:30:00', 'research'],
    ['AI芯片竞争白热化：NVIDIA发布B300 GPU，性能翻倍', 'NVIDIA最新Blackwell B300 GPU在AI训练任务上较前代提升2倍，推理能效比提升3倍。', 'https://example.com/news/nvidia-b300', 'TechCrunch AI', 'https://img.icons8.com/color/48/techcrunch.png', 'https://picsum.photos/seed/nvidia/600/300', '2026-05-19 18:00:00', 'industry'],
    ['百度文心一言4.5发布，中文理解能力超越GPT-4o', '百度最新大模型在中文语义理解、古诗词创作和中国法律知识测试中取得领先成绩。', 'https://example.com/news/ernie-45', 'VentureBeat AI', 'https://img.icons8.com/color/48/venturebeat.png', 'https://picsum.photos/seed/ernie/600/300', '2026-05-19 15:00:00', 'product'],
    ['AI视频生成迎来突破：Sora正式向公众开放', 'OpenAI视频生成模型Sora结束邀请制，正式向所有ChatGPT Plus用户开放。', 'https://example.com/news/sora-public', 'The Verge AI', 'https://img.icons8.com/color/48/the-verge.png', 'https://picsum.photos/seed/sora/600/300', '2026-05-19 12:00:00', 'product'],
    ['麻省理工研究：AI辅助编程可将开发效率提升55%', '一项涉及500名开发者的随机对照实验表明，使用AI编程助手可显著提升代码产出和质量。', 'https://example.com/news/mit-ai-coding', 'MIT Tech Review', 'https://img.icons8.com/color/48/mit.png', 'https://picsum.photos/seed/mitcoding/600/300', '2026-05-19 09:00:00', 'research'],
    ['全球AI独角兽融资创新高：2026年Q1共筹集280亿美元', '据CB Insights报告，AI领域在2026年第一季度完成了创纪录的融资总额，其中基础模型和AI应用层各占约半。', 'https://example.com/news/ai-funding-q1', 'VentureBeat AI', 'https://img.icons8.com/color/48/venturebeat.png', 'https://picsum.photos/seed/aifunding/600/300', '2026-05-18 16:00:00', 'industry'],
  ];

  const newsStmt = db.prepare('INSERT INTO news (title, summary, url, source, source_icon, image_url, published_at, fetched_at, category) VALUES (?,?,?,?,?,?,?,?,?)');
  newsItems.forEach(n => newsStmt.run([...n.slice(0, 7), now, n[7]]));
  newsStmt.free();
}

module.exports = { getDb, saveDb, query, run };
