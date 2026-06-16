# Groq API 免翻墙代理

Groq API 反向代理，用于在无法直接访问 `api.groq.com` 的网络环境下使用 Groq 的 LLM 服务。

支持平台：Deno Deploy / Cloudflare Workers。

## 目录

- [为什么需要代理](#为什么需要代理)
- [支持的模型](#支持的模型)
- [部署教程](#部署教程)
- [使用方法](#使用方法)
- [API 兼容性](#api-兼容性)
- [本地开发](#本地开发)
- [常见问题](#常见问题)

---

## 为什么需要代理

部分网络环境无法直接访问 `api.groq.com`。本代理部署在境外服务器上，将请求转发至 Groq API，实现免翻墙访问。

## 支持的模型

以下模型已通过代理测试验证（2025-06-16）：

### 文本生成模型

| 模型 ID | 厂商 | 上下文窗口 | 最大输出 | 说明 |
|---------|------|-----------|---------|------|
| `llama-3.1-8b-instant` | Meta | 128K | 128K | 轻量快速，适合简单任务 |
| `llama-3.3-70b-versatile` | Meta | 128K | 32K | 通用大模型，推荐首选 |
| `qwen/qwen3-32b` | 阿里云 | 128K | 40K | 支持 thinking 推理模式 |
| `meta-llama/llama-4-scout-17b-16e-instruct` | Meta | 128K | 8K | Llama 4 系列，MoE 架构 |
| `allam-2-7b` | SDAIA | 4K | 4K | 阿拉伯语优化模型 |
| `openai/gpt-oss-20b` | OpenAI | 128K | 64K | OpenAI 开源模型，支持 reasoning |
| `openai/gpt-oss-120b` | OpenAI | 128K | 64K | OpenAI 开源大模型，支持 reasoning |

### 语音模型

| 模型 ID | 厂商 | 说明 |
|---------|------|------|
| `whisper-large-v3` | OpenAI | 语音转文字 |
| `whisper-large-v3-turbo` | OpenAI | 语音转文字（快速版） |
| `canopylabs/orpheus-v1-english` | Canopy Labs | 文字转语音（英文） |

### 其他模型

| 模型 ID | 说明 |
|---------|------|
| `groq/compound` | Groq 复合推理模型 |
| `groq/compound-mini` | Groq 复合推理模型（轻量版） |
| `meta-llama/llama-prompt-guard-2-86m` | Prompt 安全防护 |
| `meta-llama/llama-prompt-guard-2-22m` | Prompt 安全防护（轻量版） |
| `openai/gpt-oss-safeguard-20b` | OpenAI 安全防护模型 |

> 已下线模型：`llama3-8b-8192`、`llama3-70b-8192`、`mixtral-8x7b-32768`、`gemma2-9b-it` 均已废弃，请勿使用。

---

## 部署教程

### 方式一：Deno Deploy（推荐）

**一键部署**：点击 [Deploy to Deno][1]，自动创建项目。

**手动部署**：

1. 访问 [deno.new](https://deno.new)
2. 将 `deno.ts` 的内容复制到编辑器中
3. 点击 Play 按钮运行测试
4. 在 Deno Deploy 控制台创建新项目，关联 GitHub 仓库
5. 在 Settings 中设置自定义域名

### 方式二：Cloudflare Workers

1. 登录 [Cloudflare Workers 控制台](https://dash.cloudflare.com/)
2. 创建新的 Worker
3. 将 `cloudflare.ts` 的内容粘贴到编辑器中
4. 部署并获取 Worker URL

---

## 使用方法

### Python

```python
from openai import OpenAI

client = OpenAI(
    api_key="gsk_your_api_key",
    base_url="https://your-proxy.deno.dev/openai",
)

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"},
    ],
)

print(response.choices[0].message.content)
```

### JavaScript / TypeScript

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "gsk_your_api_key",
  baseURL: "https://your-proxy.deno.dev/openai",
});

const response = await client.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "What is the capital of France?" },
  ],
});

console.log(response.choices[0].message.content);
```

### cURL

```bash
curl -X POST https://your-proxy.deno.dev/openai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer gsk_your_api_key" \
  -d '{
    "model": "llama-3.3-70b-versatile",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

### 流式输出

```python
stream = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "Write a poem"}],
    stream=True,
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

---

## API 兼容性

本代理完全兼容 OpenAI API 格式，以下端点可用：

| 端点 | 方法 | 说明 |
|------|------|------|
| `/openai/v1/chat/completions` | POST | 聊天补全 |
| `/openai/v1/completions` | POST | 文本补全 |
| `/openai/v1/embeddings` | POST | 文本嵌入 |
| `/openai/v1/models` | GET | 获取模型列表 |
| `/openai/v1/audio/transcriptions` | POST | 语音转文字 |
| `/openai/v1/audio/translations` | POST | 语音翻译 |

> **重要**：路径必须包含 `/openai` 前缀，即 `/openai/v1/...`。

---

## 本地开发

```bash
# 安装 Deno（如未安装）
curl -fsSL https://deno.land/install.sh | sh

# 启动开发服务器
deno run --allow-net --allow-read --allow-env --watch deno.ts
```

访问 `http://localhost:8000` 测试。

---

## 常见问题

### Q: 为什么路径是 `/openai/v1` 而不是 `/v1`？

Groq API 的完整路径是 `api.groq.com/openai/v1/...`，代理保持了原始路径结构。

### Q: 如何获取 API Key？

1. 访问 [console.groq.com](https://console.groq.com/)
2. 注册并登录
3. 进入 API Keys 页面创建新 Key

### Q: 代理有调用限制吗？

代理本身无限流，但受 Groq 免费额度限制。免费账户有 RPM（每分钟请求数）和 TPM（每分钟 Token 数）限制。

### Q: 支持 function calling 吗？

支持。只要底层模型支持 function calling，代理会原样转发请求和响应。

---

[1]: https://dash.deno.com/new?url=https://raw.githubusercontent.com/Ikaros-521/groq-proxy/main/deno.ts
