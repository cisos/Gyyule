## Gyyule

订房 H5 源码在目录 **`ktv-h5`**。

### 线上地址

`https://hengdaguanwang.github.io/Gyyule/`（路径需带 **`/Gyyule/`**，与 `ktv-h5/vite.config.ts` 里的 `base` 一致。）

### 发布方式（二选一）

1. **GitHub Actions（推荐）**：仓库 **Settings → Pages → Source** 选 **GitHub Actions**，推送 `main` 后会自动构建并发布。
2. **gh-pages 分支**：Pages 里分支选 **gh-pages**，在 `ktv-h5` 下执行 `npm run deploy`。

若 Pages 误选为从 **main / (root)** 发布且未配置上述方式，浏览器可能只显示本说明或根目录占位页，而不会加载 React 站点。
