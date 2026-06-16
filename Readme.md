# Groq API 免翻墙代理

Groq API 反向代理，用于在无法直接访问 `api.groq.com` 的网络环境下使用 Groq 的 LLM 服务。

支持平台：Deno Deploy / Cloudflare Workers。

## 自己部署

### Deno

点击[这个链接][1]，可以快速一键部署到 Deno Deploy 上。

然后在 Settings 选项卡里可以设置自定义二级域名，或者绑定自己的域名。

或者，访问 https://deno.new 域名，把 deno.ts 复制到 Playground 中，点击 Play
按钮。

### CloudFlare

将 cloudflare.ts 复制到 CloudFlare Workers 中。

## 使用

使用 OpenAI 官方 npm 包（兼容 Groq）：

```js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "gsk_xxx",
  baseURL: "https://xxxxx.deno.dev/openai",
});
```

使用 OpenAI 官方 Python 包（兼容 Groq）：

```python
from openai import OpenAI

client = OpenAI(
    api_key="gsk_xxx",
    base_url="https://xxxxx.deno.dev/openai",
)
```

调用示例：

```python
response = client.chat.completions.create(
    model="llama-3.1-8b-instant",
    messages=[{"role": "user", "content": "Hello"}],
)
```

> **注意**：路径必须包含 `/openai` 前缀，即 `/openai/v1/chat/completions`。

## 支持的模型

- `llama-3.1-8b-instant`
- `llama-3.3-70b-versatile`
- `mixtral-8x7b-32768`
- `gemma2-9b-it`

完整列表见 [Groq 模型文档](https://console.groq.com/docs/models)。

## 本地开发

```bash
deno run --allow-net --allow-read --allow-env --watch deno.ts
```

[1]: https://dash.deno.com/new?url=https://raw.githubusercontent.com/Ikaros-521/groq-proxy/main/deno.ts
