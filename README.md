# 每日自拍

每天一张自拍的打卡站点。首页是一面照片墙，点进某一天可以看到当天的更多文字和照片记录。

在线地址：https://rickliang-jy.github.io/Build-Yourself/

首次使用先装一次本地压缩工具（只装一次）：

```
npm install
```

## 每天怎么更新

1. 把今天的自拍放进 `photos/`，文件名用日期，例如 `photos/2026-07-03.jpg`
   （支持 jpg / jpeg / png / webp / gif / avif，原图直接扔进去就行）
2. 压缩 + 生成列表：
   ```
   npm run prepare-day
   ```
   这会把 photos/ 里的大图缩到长边 1600px 的 JPEG（几百 KB），并更新 `manifest.json`
3. （可选）在 `entries/` 建同名 md，例如 `entries/2026-07-03.md`，写点文字或贴更多照片
4. 提交并推送：
   ```
   git add photos entries manifest.json
   git commit -m "2026-07-03"
   git push
   ```

推送后 GitHub Action 会自动部署，几分钟后网站就更新了。
**不需要手动改任何列表文件。**

> 为什么要压缩：原图常有 5–10MB，每天提交会让仓库越来越大且无法瘦身。压缩后每张只有几百 KB。

## 规则

- 一天 = `photos/` 里一张以日期命名的图片
- 只有存在同名 `entries/<日期>.md` 时，照片才可以点进详情页
- md 里插入图片时，路径相对于站点根目录，例如 `![](photos/2026-07-03-2.jpg)`

## 本地预览

纯静态站，随便起个静态服务器即可（因为要 fetch json/md，不能直接双击打开）：

```
python -m http.server 8000
# 打开 http://localhost:8000
```

改动照片/记录后想在本地看到最新列表，手动跑一次：

```
node scripts/build-manifest.mjs
```

## 自定义

- 站点标题/副标题：改 `config.json`
- 配色：改 `assets/style.css` 顶部的 `:root` 变量

## 文件结构

```
index.html              照片墙首页
day.html                某一天的详情页
config.json             标题、副标题
manifest.json           自动生成的天数列表（别手动改）
photos/                 每天的自拍
entries/                每天的 md 记录
assets/                 样式与脚本
scripts/build-manifest.mjs   扫描 photos/entries 生成 manifest.json
```
