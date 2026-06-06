/**
 * Provider presets for various AI API vendors.
 * Each preset defines how to call that vendor's API.
 *
 * format: "claude" | "openai"
 *   - claude:  POST /v1/messages, x-api-key header, Anthropic message format
 *   - openai:  POST /v1/chat/completions, Bearer token, OpenAI message format
 */

const PROVIDER_PRESETS = {
  // ─── Claude-Compatible ──────────────────────────────────────────────────
  "claude-official": {
    name: "Claude Official",
    format: "claude",
    baseUrl: "https://api.anthropic.com",
    models: ["claude-sonnet-4-20250514", "claude-haiku-4-5-20251001", "claude-opus-4-20250514"],
    description: "Anthropic 官方 API",
    region: "global",
  },
  "shengsuancloud": {
    name: "胜算云",
    format: "claude",
    baseUrl: "https://api.shengsuancloud.com",
    models: ["claude-sonnet-4-20250514", "claude-haiku-4-5-20251001"],
    description: "Claude API 代理服务",
    region: "cn",
  },
  "gatewayai": {
    name: "PatewayAI",
    format: "claude",
    baseUrl: "https://api.pateway.ai",
    models: ["claude-sonnet-4-20250514", "claude-haiku-4-5-20251001"],
    description: "AI 网关代理",
    region: "global",
  },
  "claudeapi": {
    name: "ClaudeAPI",
    format: "claude",
    baseUrl: "https://api.claudeapi.com",
    models: ["claude-sonnet-4-20250514", "claude-haiku-4-5-20251001"],
    description: "Claude API 第三方代理",
    region: "global",
  },
  "claudecn": {
    name: "ClaudeCN",
    format: "claude",
    baseUrl: "https://api.claudecn.com",
    models: ["claude-sonnet-4-20250514", "claude-haiku-4-5-20251001"],
    description: "国内 Claude API 加速",
    region: "cn",
  },

  // ─── ByteDance / Volcengine ─────────────────────────────────────────────
  "volcengine-agentplan": {
    name: "火山 Agentplan",
    format: "openai",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    models: ["doubao-1-5-pro-256k-250115", "doubao-1-5-lite-32k-250115", "deepseek-v3-250324"],
    description: "火山引擎方舟平台",
    region: "cn",
  },
  "byteplus": {
    name: "BytePlus",
    format: "openai",
    baseUrl: "https://ark.ap-southeast.bytepluses.com/api/v3",
    models: ["doubao-1-5-pro-256k", "doubao-1-5-lite-32k"],
    description: "BytePlus 国际版",
    region: "global",
  },
  "doubao-seed": {
    name: "DouBaoSeed",
    format: "openai",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    models: ["seed-2-0-pro", "seed-2-0-lite"],
    description: "豆包 Seed 模型",
    region: "cn",
  },

  // ─── Google ─────────────────────────────────────────────────────────────
  "gemini-native": {
    name: "Gemini Native",
    format: "openai",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    models: ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.0-flash"],
    description: "Google Gemini 原生 API",
    region: "global",
  },

  // ─── DeepSeek ───────────────────────────────────────────────────────────
  "deepseek": {
    name: "DeepSeek",
    format: "openai",
    baseUrl: "https://api.deepseek.com/v1",
    models: ["deepseek-chat", "deepseek-coder", "deepseek-reasoner"],
    description: "DeepSeek 官方 API",
    region: "cn",
  },

  // ─── Specialized Services ───────────────────────────────────────────────
  "opencode-go": {
    name: "OpenCode Go",
    format: "openai",
    baseUrl: "https://api.opencodego.com/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o", "deepseek-v3"],
    description: "多模型聚合服务",
    region: "global",
  },

  // ─── Zhipu GLM ─────────────────────────────────────────────────────────
  "zhipu-glm": {
    name: "Zhipu GLM",
    format: "openai",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    models: ["glm-4-plus", "glm-4-flash", "glm-4-long", "codegeex-4"],
    description: "智谱 AI 开放平台",
    region: "cn",
  },
  "zhipu-glm-en": {
    name: "Zhipu GLM en",
    format: "openai",
    baseUrl: "https://open.bigmodel.cloud/api/paas/v4",
    models: ["glm-4-plus", "glm-4-flash"],
    description: "智谱 AI 国际站",
    region: "global",
  },

  // ─── Baidu ──────────────────────────────────────────────────────────────
  "baidu-qianfan": {
    name: "Baidu Qianfan Coding Plan",
    format: "openai",
    baseUrl: "https://qianfan.baidubce.com/v2",
    models: ["ernie-4.5-8k", "ernie-4.0-8k", "ernie-3.5-8k", "deepseek-v3"],
    description: "百度千帆大模型平台",
    region: "cn",
  },

  // ─── Alibaba ────────────────────────────────────────────────────────────
  "bailian": {
    name: "Bailian",
    format: "openai",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    models: ["qwen-max", "qwen-plus", "qwen-turbo", "qwen-coder-plus"],
    description: "阿里云百炼平台",
    region: "cn",
  },
  "bailian-coding": {
    name: "Bailian For Coding",
    format: "openai",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    models: ["qwen-coder-plus", "qwen-coder-turbo", "qwen2.5-coder-32b-instruct"],
    description: "百炼编程专用模型",
    region: "cn",
  },

  // ─── Moonshot / Kimi ────────────────────────────────────────────────────
  "kimi": {
    name: "Kimi",
    format: "openai",
    baseUrl: "https://api.moonshot.cn/v1",
    models: ["moonshot-v1-128k", "moonshot-v1-32k", "moonshot-v1-8k"],
    description: "Kimi / Moonshot API",
    region: "cn",
  },
  "kimi-coding": {
    name: "Kimi For Coding",
    format: "openai",
    baseUrl: "https://api.moonshot.cn/v1",
    models: ["kimi-for-coding", "moonshot-v1-128k"],
    description: "Kimi 编程专用",
    region: "cn",
  },

  // ─── StepFun ────────────────────────────────────────────────────────────
  "stepfun": {
    name: "StepFun",
    format: "openai",
    baseUrl: "https://api.stepfun.com/v1",
    models: ["step-2-16k", "step-2-32k", "step-1-flash-8k"],
    description: "阶跃星辰 API",
    region: "cn",
  },
  "stepfun-en": {
    name: "StepFun en",
    format: "openai",
    baseUrl: "https://api.stepfun.com/v1",
    models: ["step-2-16k", "step-2-32k"],
    description: "阶跃星辰国际站",
    region: "global",
  },

  // ─── ModelScope ─────────────────────────────────────────────────────────
  "modelscope": {
    name: "ModelScope",
    format: "openai",
    baseUrl: "https://api-inference.modelscope.cn/v1",
    models: ["Qwen/Qwen2.5-Coder-32B-Instruct", "Qwen/Qwen2.5-72B-Instruct", "deepseek-ai/DeepSeek-V3"],
    description: "魔搭社区 API",
    region: "cn",
  },

  // ─── KAT-Coder ──────────────────────────────────────────────────────────
  "kat-coder": {
    name: "KAT-Coder",
    format: "openai",
    baseUrl: "https://api.kat-coder.com/v1",
    models: ["kat-coder-pro", "kat-coder-lite"],
    description: "KAT 编程模型",
    region: "global",
  },

  // ─── Longcat ────────────────────────────────────────────────────────────
  "longcat": {
    name: "Longcat",
    format: "openai",
    baseUrl: "https://api.longcat.cloud/v1",
    models: ["longcat-chat", "longcat-code"],
    description: "Longcat AI",
    region: "global",
  },

  // ─── MiniMax ────────────────────────────────────────────────────────────
  "minimax": {
    name: "MiniMax",
    format: "openai",
    baseUrl: "https://api.minimax.chat/v1",
    models: ["MiniMax-Text-01", "abab6.5s-chat"],
    description: "MiniMax API",
    region: "cn",
  },
  "minimax-en": {
    name: "MiniMax en",
    format: "openai",
    baseUrl: "https://api.minimax.chat/v1",
    models: ["MiniMax-Text-01"],
    description: "MiniMax 国际站",
    region: "global",
  },

  // ─── BaiLing ────────────────────────────────────────────────────────────
  "bailing": {
    name: "BaiLing",
    format: "openai",
    baseUrl: "https://api.bailing.ai/v1",
    models: ["bailing-v2", "bailing-lite"],
    description: "百灵 AI",
    region: "cn",
  },

  // ─── Proxy / Aggregator Services ────────────────────────────────────────
  "aihubmix": {
    name: "AiHubMix",
    format: "openai",
    baseUrl: "https://api.aihubmix.com/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o", "deepseek-v3", "gemini-2.5-pro"],
    description: "多模型聚合平台",
    region: "global",
  },
  "siliconflow": {
    name: "SiliconFlow",
    format: "openai",
    baseUrl: "https://api.siliconflow.cn/v1",
    models: ["Qwen/Qwen2.5-Coder-32B-Instruct", "deepseek-ai/DeepSeek-V3", "Pro/deepseek-ai/DeepSeek-R1"],
    description: "硅基流动 API",
    region: "cn",
  },
  "siliconflow-en": {
    name: "SiliconFlow en",
    format: "openai",
    baseUrl: "https://api.siliconflow.com/v1",
    models: ["Qwen/Qwen2.5-Coder-32B-Instruct", "deepseek-ai/DeepSeek-V3"],
    description: "SiliconFlow 国际站",
    region: "global",
  },
  "dmxapi": {
    name: "DMXAPI",
    format: "openai",
    baseUrl: "https://www.dmxapi.cn/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o", "deepseek-v3", "gemini-2.5-pro"],
    description: "DMX 代理 API",
    region: "cn",
  },
  "packycode": {
    name: "PackyCode",
    format: "openai",
    baseUrl: "https://api.packycode.com/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o"],
    description: "PackyCode 聚合",
    region: "global",
  },
  "apikeyfun": {
    name: "APIKEY.FUN",
    format: "openai",
    baseUrl: "https://api.apikey.fun/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o", "deepseek-v3"],
    description: "APIKEY.FUN 代理",
    region: "global",
  },
  "apinebula": {
    name: "APINebula",
    format: "openai",
    baseUrl: "https://api.apinebula.com/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o"],
    description: "APINebula 代理",
    region: "global",
  },
  "atlascloud": {
    name: "AtlasCloud",
    format: "openai",
    baseUrl: "https://api.atlascloud.ai/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o"],
    description: "AtlasCloud 代理",
    region: "global",
  },
  "sudocode": {
    name: "SudoCode",
    format: "openai",
    baseUrl: "https://api.sudocode.ai/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o"],
    description: "SudoCode 编程代理",
    region: "global",
  },
  "runapi": {
    name: "RunAPI",
    format: "openai",
    baseUrl: "https://api.runapi.cn/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o", "deepseek-v3"],
    description: "RunAPI 代理",
    region: "cn",
  },
  "relaxycode": {
    name: "RelaxyCode",
    format: "openai",
    baseUrl: "https://api.relaxycode.com/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o"],
    description: "RelaxyCode 代理",
    region: "global",
  },
  "cubence": {
    name: "Cubence",
    format: "openai",
    baseUrl: "https://api.cubence.com/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o"],
    description: "Cubence 代理",
    region: "global",
  },
  "aigocode": {
    name: "AIGoCode",
    format: "openai",
    baseUrl: "https://api.aigocode.com/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o"],
    description: "AIGoCode 编程代理",
    region: "global",
  },
  "rightcode": {
    name: "RightCode",
    format: "openai",
    baseUrl: "https://api.rightcode.cn/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o"],
    description: "RightCode 代理",
    region: "cn",
  },
  "aicodemirror": {
    name: "AICodeMirror",
    format: "openai",
    baseUrl: "https://api.aicodemirror.com/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o"],
    description: "AICodeMirror 代理",
    region: "global",
  },
  "crazyrouter": {
    name: "CrazyRouter",
    format: "openai",
    baseUrl: "https://api.crazyrouter.xyz/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o", "deepseek-v3"],
    description: "CrazyRouter 代理",
    region: "global",
  },
  "sssaicode": {
    name: "SSSAiCode",
    format: "openai",
    baseUrl: "https://api.sssaicode.com/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o"],
    description: "SSSAiCode 代理",
    region: "global",
  },
  "youyun": {
    name: "优云智算",
    format: "openai",
    baseUrl: "https://api.youyun.ai/v1",
    models: ["claude-sonnet-4-20250514", "deepseek-v3", "qwen-coder-plus"],
    description: "优云智算平台",
    region: "cn",
  },
  "youyun-coding": {
    name: "优云智算 Coding Plan",
    format: "openai",
    baseUrl: "https://api.youyun.ai/v1",
    models: ["claude-sonnet-4-20250514", "deepseek-coder-v3"],
    description: "优云智算编程专用",
    region: "cn",
  },
  "micu": {
    name: "Micu",
    format: "openai",
    baseUrl: "https://api.micu.ai/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o"],
    description: "Micu AI 代理",
    region: "cn",
  },
  "ctok": {
    name: "CTok.ai",
    format: "openai",
    baseUrl: "https://api.ctok.ai/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o"],
    description: "CTok AI 代理",
    region: "global",
  },
  "eflowcode": {
    name: "E-FlowCode",
    format: "openai",
    baseUrl: "https://api.eflowcode.com/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o"],
    description: "E-FlowCode 代理",
    region: "global",
  },

  // ─── OpenRouter / TheRouter ─────────────────────────────────────────────
  "openrouter": {
    name: "OpenRouter",
    format: "openai",
    baseUrl: "https://openrouter.ai/api/v1",
    models: ["anthropic/claude-sonnet-4-20250514", "openai/gpt-4o", "deepseek/deepseek-chat", "google/gemini-2.5-pro"],
    description: "OpenRouter 多模型路由",
    region: "global",
  },
  "therouter": {
    name: "TheRouter",
    format: "openai",
    baseUrl: "https://api.therouter.ai/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o"],
    description: "TheRouter 代理路由",
    region: "global",
  },

  // ─── Novita AI ──────────────────────────────────────────────────────────
  "novita": {
    name: "Novita AI",
    format: "openai",
    baseUrl: "https://api.novita.ai/v3/openai",
    models: ["deepseek/deepseek-v3-0324", "deepseek/deepseek-r1-0528", "meta-llama/llama-3.3-70b-instruct"],
    description: "Novita AI 推理平台",
    region: "global",
  },

  // ─── GitHub ─────────────────────────────────────────────────────────────
  "github-copilot": {
    name: "GitHub Copilot",
    format: "openai",
    baseUrl: "https://api.githubcopilot.com",
    models: ["gpt-4o", "gpt-4o-mini", "claude-sonnet-4-20250514"],
    description: "GitHub Copilot API",
    region: "global",
  },

  // ─── Codex ──────────────────────────────────────────────────────────────
  "codex": {
    name: "Codex",
    format: "openai",
    baseUrl: "https://api.codex.ai/v1",
    models: ["codex-4o", "codex-4o-mini"],
    description: "Codex AI",
    region: "global",
  },

  // ─── LemonData ──────────────────────────────────────────────────────────
  "lemondata": {
    name: "LemonData",
    format: "openai",
    baseUrl: "https://api.lemondata.ai/v1",
    models: ["deepseek-v3", "deepseek-r1", "qwen-coder-plus"],
    description: "LemonData AI",
    region: "global",
  },

  // ─── Nvidia ─────────────────────────────────────────────────────────────
  "nvidia": {
    name: "Nvidia",
    format: "openai",
    baseUrl: "https://integrate.api.nvidia.com/v1",
    models: ["nvidia/llama-3.1-nemotron-70b-instruct", "meta/llama-3.3-70b-instruct"],
    description: "Nvidia NIM 推理平台",
    region: "global",
  },

  // ─── PIPELLM ────────────────────────────────────────────────────────────
  "pipellm": {
    name: "PIPELLM",
    format: "openai",
    baseUrl: "https://api.pipellm.com/v1",
    models: ["claude-sonnet-4-20250514", "gpt-4o"],
    description: "PIELLMM 代理",
    region: "global",
  },

  // ─── Xiaomi MiMo ────────────────────────────────────────────────────────
  "xiaomi-mimo": {
    name: "Xiaomi MiMo",
    format: "openai",
    baseUrl: "https://api.xiaomi.com/v1",
    models: ["MiMo-7B-RL", "MiMo-7B-SFT"],
    description: "小米 MiMo 模型",
    region: "cn",
  },
  "xiaomi-mimo-token": {
    name: "Xiaomi MiMo Token Plan (China)",
    format: "openai",
    baseUrl: "https://api.xiaomi.com/v1",
    models: ["MiMo-7B-RL", "MiMo-7B-SFT"],
    description: "小米 MiMo Token 计划（国内）",
    region: "cn",
  },

  // ─── AWS Bedrock ────────────────────────────────────────────────────────
  "aws-bedrock-aksk": {
    name: "AWS Bedrock (AKSK)",
    format: "openai",
    baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
    models: ["anthropic.claude-sonnet-4-20250514-v1:0", "anthropic.claude-haiku-4-5-20251001-v1:0"],
    description: "AWS Bedrock (Access Key 认证)",
    region: "global",
    note: "需要 AWS AKSK 签名，建议使用代理服务",
  },
  "aws-bedrock-apikey": {
    name: "AWS Bedrock (API Key)",
    format: "openai",
    baseUrl: "https://bedrock-runtime.us-east-1.amazonaws.com",
    models: ["anthropic.claude-sonnet-4-20250514-v1:0"],
    description: "AWS Bedrock (API Key 认证)",
    region: "global",
    note: "需要配置 AWS API Key 代理",
  },
};

// ─── Grouped for UI display ─────────────────────────────────────────────────

const PROVIDER_GROUPS = [
  {
    label: "Claude 兼容",
    providers: ["claude-official", "shengsuancloud", "gatewayai", "claudeapi", "claudecn"],
  },
  {
    label: "字节跳动 / 火山引擎",
    providers: ["volcengine-agentplan", "byteplus", "doubao-seed"],
  },
  {
    label: "Google",
    providers: ["gemini-native"],
  },
  {
    label: "DeepSeek",
    providers: ["deepseek"],
  },
  {
    label: "智谱 AI",
    providers: ["zhipu-glm", "zhipu-glm-en"],
  },
  {
    label: "百度",
    providers: ["baidu-qianfan"],
  },
  {
    label: "阿里云",
    providers: ["bailian", "bailian-coding"],
  },
  {
    label: "Moonshot / Kimi",
    providers: ["kimi", "kimi-coding"],
  },
  {
    label: "阶跃星辰",
    providers: ["stepfun", "stepfun-en"],
  },
  {
    label: "魔搭 / 硅基",
    providers: ["modelscope", "siliconflow", "siliconflow-en"],
  },
  {
    label: "MiniMax",
    providers: ["minimax", "minimax-en"],
  },
  {
    label: "多模型聚合",
    providers: ["aihubmix", "openrouter", "therouter", "opencode-go", "novita"],
  },
  {
    label: "代理服务 (国内)",
    providers: ["dmxapi", "runapi", "rightcode", "youyun", "youyun-coding", "micu"],
  },
  {
    label: "代理服务 (国际)",
    providers: ["packycode", "apikeyfun", "apinebula", "atlascloud", "sudocode", "relaxycode", "cubence", "aigocode", "aicodemirror", "crazyrouter", "sssaicode", "ctok", "eflowcode", "pipellm"],
  },
  {
    label: "其他",
    providers: ["kat-coder", "longcat", "bailing", "github-copilot", "codex", "lemondata", "nvidia", "xiaomi-mimo", "xiaomi-mimo-token", "aws-bedrock-aksk", "aws-bedrock-apikey"],
  },
];

module.exports = { PROVIDER_PRESETS, PROVIDER_GROUPS };
