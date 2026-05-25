<template>
  <div class="app">
    <nav class="navbar">
      <div class="container nav-inner">
        <router-link to="/" class="nav-logo">
          <span class="logo-icon">&#9672;</span>
          <span class="logo-text">AI Frontier Hub</span>
        </router-link>
        <div class="nav-links">
          <router-link to="/" :class="{ active: $route.path === '/' }">首页</router-link>
          <router-link to="/news" :class="{ active: $route.path === '/news' }">AI资讯</router-link>
          <router-link to="/models" :class="{ active: $route.path === '/models' }">大模型</router-link>
          <router-link to="/products" :class="{ active: $route.path === '/products' }">AI产品</router-link>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
    <footer class="footer">
      <div class="container">
        <p>AI Frontier Hub &copy; 2026 - 探索AI前沿，连接未来科技</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
</script>

<style>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 14, 23, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text-primary);
}
.logo-icon {
  font-size: 28px;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.nav-links {
  display: flex;
  gap: 32px;
}
.nav-links a {
  color: var(--text-secondary);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  padding: 8px 0;
  position: relative;
  transition: color 0.2s;
}
.nav-links a:hover, .nav-links a.active { color: var(--text-primary); }
.nav-links a.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent-gradient);
  border-radius: 1px;
}
.main-content { min-height: calc(100vh - 64px - 60px); }
.footer {
  text-align: center;
  padding: 20px;
  color: var(--text-dim);
  font-size: 13px;
  border-top: 1px solid var(--border-color);
}
</style>
