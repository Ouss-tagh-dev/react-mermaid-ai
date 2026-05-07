import axios from "axios";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Available Groq models
export const AVAILABLE_MODELS = [
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B (Recommended)" },
  { id: "llama-3.1-405b-reasoning", name: "Llama 3.1 405B Reasoning" },
  { id: "llama-3.1-70b-versatile", name: "Llama 3.1 70B" },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B" },
  { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
  { id: "gemma-7b-it", name: "Gemma 7B" },
];

const SYSTEM_PROMPT = `You are an expert software architect and Mermaid.js specialist. Your task is to generate ONLY valid Mermaid code based on natural language descriptions.

STRICT RULES:
1. Respond ONLY with the Mermaid code. No markdown formatting outside the code block, no explanations, no greetings.
2. The code MUST be enclosed within \`\`\`mermaid and \`\`\` tags.
3. Use descriptive, professional English node names and labels.
4. Apply premium aesthetics (colors, gradients, stroke widths) where relevant. Use professional color palettes (e.g., slate, indigo, emerald, amber).
5. Ensure the syntax is 100% perfectly valid.
6. For class diagrams: clearly define attributes and methods using proper visibility indicators (+, -, #).
7. For sequence diagrams: use activate/deactivate, robust actor descriptions, and autonumber.
8. For flowcharts: use direction TD or LR appropriately, and varied node shapes for decisions vs processes.

EXPECTED RESPONSE FORMAT:
\`\`\`mermaid
classDiagram
    class User {
        +String id
        +String email
        +authenticate() boolean
    }
\`\`\``;

// Get API key and model from environment or user settings
function getApiConfig() {
  const storedConfig = localStorage.getItem("groq-config");

  if (storedConfig) {
    try {
      return JSON.parse(storedConfig);
    } catch (e) {
      console.warn("Failed to parse stored Groq config");
    }
  }

  // Fallback to environment variables
  return {
    apiKey: import.meta.env.VITE_GROQ_API_KEY || null,
    model: import.meta.env.VITE_GROQ_MODEL || "llama-3.3-70b-versatile",
  };
}

export async function generateMermaidCode(userPrompt) {
  const config = getApiConfig();

  if (!config.apiKey) {
    throw new Error(
      "Groq API Key is not configured. Please configure your API key in settings.",
    );
  }

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: config.model,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `Generate a high-quality, professional Mermaid diagram for the following: ${userPrompt}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        stream: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
      },
    );

    const content = response.data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response received from AI model.");
    }

    // Extract Mermaid code
    const mermaidMatch = content.match(/```mermaid\n?([\s\S]*?)```/);
    if (mermaidMatch && mermaidMatch[1]) {
      return mermaidMatch[1].trim();
    }

    // Fallback if no tags
    return content.trim();
  } catch (error) {
    console.error("Groq Generation Error:", error);
    throw new Error(
      error.response?.data?.error?.message || error.message || "Groq API Error",
    );
  }
}

export async function fixMermaidCode(brokenCode, errorMessage) {
  const config = getApiConfig();

  if (!config.apiKey) {
    throw new Error(
      "Groq API Key is not configured. Please configure your API key in settings.",
    );
  }

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: config.model,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `The following Mermaid code produced a syntax error during rendering.
Mermaid Code:
\`\`\`mermaid
${brokenCode}
\`\`\`

Compiler Error Message:
${errorMessage}

Please analyze the error, fix the syntax issue, and return ONLY the corrected Mermaid code enclosed in \`\`\`mermaid and \`\`\`. Do not include any other text.`,
          },
        ],
        temperature: 0.3, // Lower temperature for bug fixing
        max_tokens: 2000,
        top_p: 1,
        stream: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
      },
    );

    const content = response.data.choices[0]?.message?.content;

    if (!content) {
      throw new Error(
        "Empty response received from AI model during correction.",
      );
    }

    const mermaidMatch = content.match(/```mermaid\n?([\s\S]*?)```/);
    if (mermaidMatch && mermaidMatch[1]) {
      return mermaidMatch[1].trim();
    }

    return content.trim();
  } catch (error) {
    console.error("Groq Correction Error:", error);
    throw new Error(
      error.response?.data?.error?.message ||
        error.message ||
        "Groq API Error during correction",
    );
  }
}

// Configuration management
export function saveGroqConfig(apiKey, model) {
  const config = { apiKey, model };
  localStorage.setItem("groq-config", JSON.stringify(config));
}

export function getGroqConfig() {
  return getApiConfig();
}

export function clearGroqConfig() {
  localStorage.removeItem("groq-config");
}
