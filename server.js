require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { PROVIDER_PRESETS, PROVIDER_GROUPS } = require("./providers");

// Use native fetch (Node 18+) with node-fetch fallback
const fetchFn = globalThis.fetch || require("node-fetch");

// ─── Configuration ──────────────────────────────────────────────────────────
const CONFIG = {
  port: parseInt(process.env.PORT, 10) || 3000,
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.AI_API_KEY,
  model: process.env.CLAUDE_MODEL || process.env.AI_MODEL || "claude-sonnet-4-20250514",
  provider: process.env.AI_PROVIDER || "claude-official",
  baseUrl: process.env.AI_BASE_URL || "",
  maxTokens: parseInt(process.env.MAX_TOKENS, 10) || 1000,
  apiTimeoutMs: parseInt(process.env.API_TIMEOUT_MS, 10) || 60000,
  bodyLimit: process.env.BODY_LIMIT || "50kb",
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX, 10) || 20,
  },
};

// Resolve active provider preset
function getActiveProvider() {
  const preset = PROVIDER_PRESETS[CONFIG.provider];
  if (!preset) return null;
  return {
    ...preset,
    baseUrl: CONFIG.baseUrl || preset.baseUrl,
    model: CONFIG.model || preset.models[0],
    apiKey: CONFIG.apiKey,
  };
}

// ─── In-Memory Rate Limiter ─────────────────────────────────────────────────
const requestCounts = new Map();

function rateLimiter(req, res, next) {
  // Skip rate limiting for read-only endpoints
  if (req.method === "GET" && (
    req.path === "/api/health" ||
    req.path === "/api/providers" ||
    req.path === "/api/settings"
  )) return next();

  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  if (requestCounts.size > 10000) {
    for (const [key, entry] of requestCounts) {
      if (entry.resetAt < now) requestCounts.delete(key);
    }
  }
  const record = requestCounts.get(ip);
  if (!record || record.resetAt < now) {
    requestCounts.set(ip, { count: 1, resetAt: now + CONFIG.rateLimit.windowMs });
    return next();
  }
  record.count++;
  if (record.count > CONFIG.rateLimit.maxRequests) {
    return res.status(429).json({
      error: "请求过于频繁，请稍后再试",
      retryAfterMs: record.resetAt - now,
    });
  }
  next();
}

// ─── Agent System Prompts ────────────────────────────────────────────────────
const AGENT_PROMPTS = {
  security: `你是资深安全工程师，专注于代码安全审查。
分析提交的代码，找出安全漏洞（SQL注入、XSS、敏感信息泄露、不安全的加密等）。
每个问题单独一行，格式：[HIGH/MEDIUM/LOW] 问题简述（30字以内）
最多输出6条，只输出问题列表，不加任何前缀或说明。`,

  style: `你是代码规范专家，专注于代码质量与可维护性审查。
分析命名规范、代码结构、注释、可读性、DRY原则等问题。
每个问题单独一行，格式：[HIGH/MEDIUM/LOW] 问题简述（30字以内）
最多输出6条，只输出问题列表，不加任何前缀或说明。`,

  logic: `你是后端架构师，专注于代码逻辑与正确性审查。
分析逻辑错误、边界条件、空指针、竞态条件、错误处理缺失等问题。
每个问题单独一行，格式：[HIGH/MEDIUM/LOW] 问题简述（30字以内）
最多输出6条，只输出问题列表，不加任何前缀或说明。`,

  orchestrator: `你是首席代码审查官。综合三位专家的分析，输出结构化JSON报告。
严格按如下格式输出，不要Markdown代码块，不要任何额外文字：
{
  "scores": {
    "security": <0-10整数>,
    "style": <0-10整数>,
    "logic": <0-10整数>,
    "overall": <0-10整数>
  },
  "issues": [
    {"sev": "high|medium|low", "agent": "security|style|logic", "text": "问题描述"}
  ],
  "summary": "2-3句综合评价，指出最需要修改的问题",
  "suggestion": "最重要的一条具体修改建议"
}`,
};

// ─── Universal AI Caller ─────────────────────────────────────────────────────

/**
 * Call an AI model via any supported provider format.
 * @param {string} system - System prompt
 * @param {string} userContent - User message
 * @param {object} [providerOverride] - Override active provider
 * @returns {Promise<string>} - Model response text
 */
async function callAI(system, userContent, providerOverride) {
  const provider = providerOverride || getActiveProvider();

  if (!provider) {
    throw new Error(`未知的供应商: ${CONFIG.provider}，请在设置页重新选择`);
  }
  if (!provider.apiKey) {
    throw new Error("API Key 未配置，请在设置页面配置");
  }

  const timeout = CONFIG.apiTimeoutMs;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    let url, headers, body;

    if (provider.format === "claude") {
      // ─── Anthropic Claude Format ───────────────────────────────────────
      url = `${provider.baseUrl}/v1/messages`;
      headers = {
        "Content-Type": "application/json",
        "x-api-key": provider.apiKey,
        "anthropic-version": "2023-06-01",
      };
      body = JSON.stringify({
        model: provider.model,
        max_tokens: CONFIG.maxTokens,
        system,
        messages: [{ role: "user", content: userContent }],
      });
    } else {
      // ─── OpenAI-Compatible Format ──────────────────────────────────────
      url = `${provider.baseUrl}/chat/completions`;
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`,
      };
      body = JSON.stringify({
        model: provider.model,
        max_tokens: CONFIG.maxTokens,
        messages: [
          { role: "system", content: system },
          { role: "user", content: userContent },
        ],
      });
    }

    const response = await fetchFn(url, {
      method: "POST",
      headers,
      body,
      signal: controller.signal,
    });

    // Check HTTP status before parsing
    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      let errorMsg;
      try {
        const errJson = JSON.parse(errorText);
        errorMsg = errJson.error?.message || errJson.error?.msg || errJson.message || JSON.stringify(errJson.error || errJson);
      } catch {
        errorMsg = errorText.slice(0, 200) || `HTTP ${response.status}`;
      }
      throw new Error(`API 返回 ${response.status}: ${errorMsg}`);
    }

    const data = await response.json();

    // Handle errors
    if (data.error) {
      const msg = data.error.message || data.error.msg || JSON.stringify(data.error);
      throw new Error(msg);
    }

    // Extract response text based on format
    if (provider.format === "claude") {
      if (!data.content || !data.content[0]) throw new Error("API 返回了空内容");
      return data.content[0].text;
    } else {
      // OpenAI format
      if (!data.choices || !data.choices[0]) throw new Error("API 返回了空内容");
      const choice = data.choices[0];
      return choice.message?.content || choice.text || "";
    }
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(`API 请求超时（${timeout / 1000}秒）`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Parse orchestrator JSON output with robust error handling.
 */
function parseOrchestratorJSON(raw) {
  let cleaned = raw.replace(/```(?:json)?\s*/gi, "").replace(/```\s*/g, "").trim();
  try { return JSON.parse(cleaned); } catch (_) {}
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[0]); } catch (_) {
      const fixed = jsonMatch[0].replace(/,\s*([\]}])/g, "$1").replace(/[\x00-\x1f]+/g, "");
      try { return JSON.parse(fixed); } catch (e) { throw new Error("JSON 修复后仍无法解析: " + e.message); }
    }
  }
  throw new Error("未能从输出中提取到 JSON 对象");
}

function log(level, message, meta) {
  const ts = new Date().toISOString();
  const m = meta ? " " + JSON.stringify(meta) : "";
  console[level === "error" ? "error" : "log"](`[${ts}] [${level.toUpperCase()}] ${message}${m}`);
}

// ─── App Setup ───────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json({ limit: CONFIG.bodyLimit }));
app.use(express.static(path.join(__dirname, "public")));
app.use(rateLimiter);

// ─── Provider API ────────────────────────────────────────────────────────────

app.get("/api/providers", (_, res) => {
  res.json({ presets: PROVIDER_PRESETS, groups: PROVIDER_GROUPS });
});

app.post("/api/providers/test", async (req, res) => {
  const { provider: providerId, apiKey, baseUrl, model } = req.body;
  const preset = PROVIDER_PRESETS[providerId];
  if (!preset) return res.status(400).json({ error: "未知供应商" });
  if (!apiKey) return res.status(400).json({ error: "请填写 API Key" });

  const testProvider = {
    ...preset,
    baseUrl: baseUrl || preset.baseUrl,
    model: model || preset.models[0],
    apiKey,
  };

  try {
    const result = await callAI("你好，请回复'连接成功'四个字。", "测试连接", testProvider);
    res.json({ ok: true, message: result.slice(0, 100) });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

// ─── Settings API ────────────────────────────────────────────────────────────

const ENV_PATH = path.join(__dirname, ".env");

app.get("/api/settings", (_, res) => {
  const provider = getActiveProvider();
  const masked = CONFIG.apiKey
    ? CONFIG.apiKey.slice(0, 7) + "..." + CONFIG.apiKey.slice(-4)
    : "";
  res.json({
    provider: CONFIG.provider,
    apiKey: masked,
    apiKeyConfigured: !!CONFIG.apiKey,
    model: CONFIG.model,
    baseUrl: CONFIG.baseUrl,
    maxTokens: CONFIG.maxTokens,
    apiTimeoutMs: CONFIG.apiTimeoutMs,
    port: CONFIG.port,
    activeProvider: provider ? {
      name: provider.name,
      format: provider.format,
      models: provider.models,
      region: provider.region,
    } : null,
  });
});

app.post("/api/settings", (req, res) => {
  const { provider, apiKey, model, maxTokens, apiTimeoutMs, baseUrl, port } = req.body;

  // Validate provider exists (allow _custom)
  if (provider && provider !== "_custom" && !PROVIDER_PRESETS[provider]) {
    return res.status(400).json({ error: `未知供应商: ${provider}` });
  }

  if (provider) CONFIG.provider = provider;
  if (apiKey && !apiKey.includes("...")) CONFIG.apiKey = apiKey;
  if (model) CONFIG.model = model;
  if (baseUrl !== undefined) CONFIG.baseUrl = baseUrl;
  if (maxTokens) CONFIG.maxTokens = parseInt(maxTokens, 10);
  if (apiTimeoutMs) CONFIG.apiTimeoutMs = parseInt(apiTimeoutMs, 10);

  const envLines = [
    `AI_PROVIDER=${CONFIG.provider}`,
    `AI_API_KEY=${CONFIG.apiKey || ""}`,
    `AI_MODEL=${CONFIG.model}`,
    `AI_BASE_URL=${CONFIG.baseUrl}`,
    `MAX_TOKENS=${CONFIG.maxTokens}`,
    `API_TIMEOUT_MS=${CONFIG.apiTimeoutMs}`,
    `PORT=${port || CONFIG.port}`,
  ];

  try {
    fs.writeFileSync(ENV_PATH, envLines.join("\n") + "\n", "utf-8");
    log("info", "设置已保存", { provider: CONFIG.provider, model: CONFIG.model });
    res.json({ ok: true, message: "设置已保存" });
  } catch (err) {
    log("error", "保存设置失败", { error: err.message });
    res.status(500).json({ error: "写入 .env 失败: " + err.message });
  }
});

// ─── Review API ──────────────────────────────────────────────────────────────

app.post("/api/review/:agent", async (req, res) => {
  const { agent } = req.params;
  const { code } = req.body;

  if (!AGENT_PROMPTS[agent]) {
    return res.status(400).json({ error: `未知 agent: ${agent}，可选: security, style, logic` });
  }
  if (!code || !code.trim()) return res.status(400).json({ error: "code 不能为空" });
  if (code.length > 100000) return res.status(400).json({ error: "代码过长，限制 100KB" });

  try {
    log("info", `单路审查: ${agent}`, { provider: CONFIG.provider });
    const result = await callAI(AGENT_PROMPTS[agent], `请审查以下代码：\n\n${code}`);
    res.json({ agent, result });
  } catch (err) {
    log("error", `单路审查失败: ${agent}`, { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/review", async (req, res) => {
  const { code } = req.body;
  if (!code || !code.trim()) return res.status(400).json({ error: "code 不能为空" });
  if (code.length > 100000) return res.status(400).json({ error: "代码过长，限制 100KB" });

  log("info", "开始三路并行审查", { provider: CONFIG.provider, model: CONFIG.model, codeLength: code.length });

  const [secRes, styleRes, logicRes] = await Promise.allSettled([
    callAI(AGENT_PROMPTS.security, `请审查以下代码：\n\n${code}`),
    callAI(AGENT_PROMPTS.style, `请审查以下代码：\n\n${code}`),
    callAI(AGENT_PROMPTS.logic, `请审查以下代码：\n\n${code}`),
  ]);

  const names = ["security", "style", "logic"];
  const results = [secRes, styleRes, logicRes];
  const agents = {};
  const failedAgents = [];

  results.forEach((r, i) => {
    if (r.status === "fulfilled") { agents[names[i]] = r.value; }
    else { agents[names[i]] = null; failedAgents.push(names[i]); log("warn", `Agent "${names[i]}" 失败`, { error: r.reason?.message }); }
  });

  let orchestrator = null;
  if (failedAgents.length === names.length) {
    orchestrator = { error: "所有 Agent 均执行失败，无法生成综合报告" };
  } else {
    try {
      const parts = [`原始代码：\n${code}`];
      const labels = { security: "安全专家", style: "规范专家", logic: "逻辑专家" };
      for (const n of names) {
        parts.push(agents[n] !== null ? `${labels[n]}分析：\n${agents[n]}` : `${n} Agent：执行失败（已跳过）`);
      }
      const raw = await callAI(AGENT_PROMPTS.orchestrator, parts.join("\n\n"));
      orchestrator = parseOrchestratorJSON(raw);
      log("info", "Orchestrator 报告生成", { score: orchestrator?.scores?.overall });
    } catch (err) {
      log("error", "Orchestrator 解析失败", { error: err.message });
      orchestrator = { error: "Orchestrator 解析失败: " + err.message };
    }
  }

  res.json({ agents, orchestrator, failedAgents });
});

// ─── File Upload ─────────────────────────────────────────────────────────────

app.post("/api/upload", express.json({ limit: "5mb" }), (req, res) => {
  const { files } = req.body;
  if (!files || !Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: "请上传至少一个文件" });
  }
  if (files.length > 20) return res.status(400).json({ error: "最多上传 20 个文件" });

  const results = [];
  for (const file of files) {
    if (!file.name || !file.content) return res.status(400).json({ error: "每个文件必须包含 name 和 content" });
    if (file.content.length > 200000) return res.status(400).json({ error: `文件 "${file.name}" 过大，限制 200KB` });
    results.push({ name: file.name, size: file.content.length });
  }

  const combinedCode = files.map(f => `// ─── File: ${f.name} ───\n${f.content}`).join("\n\n");
  res.json({ ok: true, files: results, code: combinedCode, totalSize: combinedCode.length });
});

// ─── Health ──────────────────────────────────────────────────────────────────

app.get("/api/health", (_, res) => {
  const provider = getActiveProvider();
  res.json({
    status: "ok",
    provider: CONFIG.provider,
    providerName: provider?.name || "未知",
    apiKey: CONFIG.apiKey ? "已配置" : "未配置",
    model: CONFIG.model,
    format: provider?.format || "unknown",
  });
});

// ─── Error Handlers ──────────────────────────────────────────────────────────

app.use((_, res) => res.status(404).json({ error: "接口不存在" }));
app.use((err, _req, res, _next) => {
  log("error", "全局错误", { error: err.message });
  res.status(500).json({ error: "服务器内部错误" });
});

// ─── Start ───────────────────────────────────────────────────────────────────

const server = app.listen(CONFIG.port, () => {
  const provider = getActiveProvider();
  log("info", "PR Review Agent 已启动", {
    port: CONFIG.port,
    provider: `${provider?.name || "未配置"} (${CONFIG.provider})`,
    model: CONFIG.model,
    format: provider?.format || "-",
    apiKey: CONFIG.apiKey ? "已配置" : "未配置",
  });
});

function shutdown(signal) {
  log("info", `收到 ${signal}，关闭中...`);
  server.close(() => { requestCounts.clear(); process.exit(0); });
  setTimeout(() => process.exit(1), 5000);
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("uncaughtException", (e) => log("error", "未捕获异常", { error: e.message }));
process.on("unhandledRejection", (r) => log("error", "未处理拒绝", { reason: String(r) }));
