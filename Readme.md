# Groq API 免翻墙代理

Groq API 反向代理，用于在无法直接访问 `api.groq.com` 的网络环境下使用 Groq 的 LLM 服务。

支持平台：Deno Deploy / Cloudflare Workers。

## 目录

- [为什么需要代理](#为什么需要代理)
- [Groq 免费额度](#groq-免费额度)
- [支持的模型](#支持的模型)
- [部署教程](#部署教程)
- [使用方法](#使用方法)
- [落地应用场景](#落地应用场景)
- [API 兼容性](#api-兼容性)
- [本地开发](#本地开发)
- [常见问题](#常见问题)

---

## 为什么需要代理

Groq 是一家美国 AI 芯片公司，自研 LPU 处理器可实现每秒近 500 token 的输出速度，远超 GPT-4 和 Gemini。

但 Groq 平台已封禁国内 IP 访问。本代理部署在境外 Deno Deploy / Cloudflare Workers 上，将请求转发至 Groq API，实现**免翻墙、零成本**访问。

## Groq 免费额度

Groq 个人账户免费，无需购买 API Key。各模型免费额度如下：

| 模型 | RPM（每分钟请求数） | RPD（每日请求数） | TPM（每分钟 Token） |
|------|-------------------|-------------------|---------------------|
| Llama 3.3 70B | 30 | 14,400 | 6,000 |
| Llama 3.1 8B | 30 | 14,400 | 6,000 |
| Qwen 3 32B | 30 | 14,400 | 6,000 |
| Mixtral 8x7B | 30 | 14,400 | 6,000 |

> 以上为免费层限额，足够个人日常使用。超出后需等待重置或升级付费计划。

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

## 落地应用场景

代理部署完成后，可以接入各种支持 OpenAI API 格式的平台：

### 场景一：接入扣子（Coze）工作流

在扣子工作流中使用代码节点调用 Groq 代理，实现 0 Token 白嫖算力：

```javascript
async function main({ params }): Promise<Output> {
  const url = '你的代理地址/openai/v1/chat/completions';

  const headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer gsk_your_api_key'
  });

  const body = JSON.stringify({
    model: "llama-3.3-70b-versatile",
    temperature: 0.8,
    max_tokens: 8192,
    top_p: 1,
    messages: [
      {
        "role": "system",
        "content": "you are a helpful assistant, please check the user input language, only use same language to reply."
      },
      {
        "role": "user",
        "content": params.input
      }
    ],
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error('Network was not ok');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### 场景二：接入沉浸式翻译

1. 安装 [沉浸式翻译](https://immersivetranslate.com/) 浏览器插件
2. 设置中选择 OpenAI 作为翻译服务
3. 填入：
   - API Key：你的 Groq API Key
   - 模型：`llama-3.3-70b-versatile`
   - API 地址：`https://你的代理地址/openai/v1/chat/completions`
4. 建议设置为鼠标悬停翻译，避免请求过多触发限额

### 场景三：接入其他平台

- **Dify / FastGPT**：在模型配置中填入代理地址和 API Key
- **Open WebUI**：设置环境变量 `OPENAI_API_BASE_URL` 为代理地址
- **任何支持 OpenAI API 的客户端**：将 `base_url` 指向代理地址即可

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

Groq API 的完整路径是 `api.groq.com/openai/v1/...`，代理保持了原始路径结构。填入 API 地址时需包含 `/openai` 前缀。

### Q: 如何获取 API Key？

1. 访问 [console.groq.com/keys](https://console.groq.com/keys)（需要临时使用代理或 VPN）
2. 注册并登录 Groq 账号
3. 点击 Create API Key，命名后保存

> 注意：国内 IP 注册可能被封号，建议使用境外邮箱注册。

### Q: 代理有调用限制吗？

代理本身无限流，但受 Groq 免费额度限制：
- 免费层：30 RPM / 14,400 RPD / 6,000 TPM
- 建议设置合理的请求间隔，避免触发限额

### Q: 支持 function calling 吗？

支持。只要底层模型支持 function calling，代理会原样转发请求和响应。

### Q: Deno Deploy 和 Cloudflare Workers 选哪个？

- **Deno Deploy**（推荐）：部署简单，免费额度充足（100 万次/月），稳定性好
- **Cloudflare Workers**：全球 CDN 加速，但国内访问可能有 DNS 污染问题

### Q: 能接入扣子/微信机器人吗？

可以。通过扣子工作流的代码节点调用代理 API，再配合微信机器人插件即可实现。详见[落地应用场景](#场景一接入扣子coze工作流)。

---

[1]: https://dash.deno.com/new?url=https://raw.githubusercontent.com/Ikaros-521/groq-proxy/main/deno.ts
