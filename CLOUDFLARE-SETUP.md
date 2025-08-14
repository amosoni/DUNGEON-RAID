# Cloudflare 配置建议 - 移除重定向

## 🚫 移除重定向规则

### 当前问题
你的Cloudflare中有一个"WWW to root 301"重定向规则，这会导致：
- 访问 `www.dungeonraid.online` 时被重定向到 `dungeonraid.online`
- Google Search Console 显示"网页会自动重定向"错误
- 影响SEO和用户体验

### 推荐配置：不使用重定向

#### 1. 在Cloudflare中删除重定向规则
- 登录 Cloudflare 控制台
- 进入 `dungeonraid.online` 域名
- 点击左侧菜单 `Rules` → `Overview`
- 找到 "WWW to root 301" 规则
- 点击删除按钮或设置为非活动状态

#### 2. DNS设置建议
```
A记录：
- 名称：@ (根域名)
- 内容：你的服务器IP
- 代理状态：已代理（橙色云朵）

CNAME记录：
- 名称：www
- 内容：dungeonraid.online
- 代理状态：已代理（橙色云朵）
```

#### 3. 页面规则设置
- 不需要设置任何页面规则
- 让Cloudflare自动处理缓存和优化

### 优势
✅ **无重定向延迟** - 用户直接访问目标页面  
✅ **SEO友好** - 避免重定向链，搜索引擎更容易索引  
✅ **性能提升** - 减少HTTP请求和响应时间  
✅ **用户体验** - 页面加载更快，无跳转等待  

### 注意事项
⚠️ **确保一致性** - 所有内部链接都使用主域名  
⚠️ **外部链接** - 建议外部网站也链接到主域名  
⚠️ **监控** - 观察Google Search Console中的重定向状态变化  

### 预期结果
移除重定向规则后：
- Google Search Console 中的"网页会自动重定向"错误应该消失
- 网站访问速度会有所提升
- SEO评分会改善
- 用户体验更加流畅

## 🔧 技术细节

### 当前配置状态
- ✅ 所有HTML文件都使用主域名
- ✅ 图片路径已修复
- ✅ OG图片已设置
- ✅ 服务器配置优化完成

### 下一步操作
1. 在Cloudflare中删除重定向规则
2. 等待24-48小时让更改生效
3. 在Google Search Console中重新验证
4. 监控网站性能和SEO指标 