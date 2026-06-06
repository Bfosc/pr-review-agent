# PR Review Agent

多 Agent 并行代码审查系统，支持 50+ AI 供应商，基于 Claude API / OpenAI 兼容 API 构建。

## 架构

```
代码输入
   ├── 🔒 Security Agent  ─┐
   ├── 📐 Style Agent     ─┼─ 并行执行
   └── 🧠 Logic Agent     ─┘
                            └──▶ ⚡ Orchestrator → 综合报告 + 评分
```

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动服务
npm start

# 3. 打开浏览器配置供应商和 API Key
open http://localhost:3000#/settings
```

## 支持的供应商（50+）

| 分类 | 供应商 |
|------|--------|
| **Claude 兼容** | Claude Official、胜算云、PatewayAI、ClaudeAPI、ClaudeCN |
| **字节跳动** | 火山 Agentplan、BytePlus、DouBaoSeed |
| **DeepSeek** | DeepSeek 官方 |
| **智谱 AI** | Zhipu GLM（国内/国际）|
| **百度** | 百度千帆 |
| **阿里云** | 百炼、百炼编程专用 |
| **Moonshot** | Kimi、Kimi 编程专用 |
| **Google** | Gemini Native |
| **多模型聚合** | AiHubMix、OpenRouter、SiliconFlow、DMXAPI 等 20+ |
| **更多** | MiniMax、阶跃星辰、魔搭、Nvidia、GitHub Copilot 等 |

完整列表见 [providers.js](./providers.js)。

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET  | `/api/health` | 服务健康检查 |
| GET  | `/api/providers` | 供应商预设列表 |
| GET  | `/api/settings` | 当前配置 |
| POST | `/api/settings` | 保存配置 |
| POST | `/api/providers/test` | 测试供应商连接 |
| POST | `/api/review` | 完整三路+综合审查 |
| POST | `/api/review/:agent` | 单路 Agent 审查 |
| POST | `/api/upload` | 文件上传 |

## 技术栈

- **Backend**: Node.js 18+ / Express
- **AI**: Claude API + OpenAI 兼容 API（50+ 供应商）
- **多 Agent**: Promise.allSettled 并行 + Orchestrator 综合
- **Frontend**: 原生 HTML/CSS/JS SPA（零构建工具）

## 安全特性

- ✅ 请求体大小限制（防 OOM）
- ✅ IP 级速率限制（读取接口豁免）
- ✅ API 请求超时（防挂起）
- ✅ HTTP 状态码检查（非 2xx 正确报错）
- ✅ 前端 XSS 防护（全 DOM API 渲染）
- ✅ 优雅关停（SIGTERM/SIGINT 处理）
- ✅ 全局错误兜底（uncaughtException / unhandledRejection）

## 项目结构

```
pr-review-agent/
├── server.js          # 后端入口（Express + 通用 AI 调用层）
├── providers.js       # 50+ 供应商预设数据
├── public/
│   └── index.html     # 前端 SPA（首页 / 审查 / 设置）
├── package.json
├── .env.example       # 环境变量模板
├── .gitignore
└── README.md
```
