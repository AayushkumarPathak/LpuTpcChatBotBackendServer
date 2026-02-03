// services/GroqService.ts

import Groq from "groq-sdk";
import {
  SYSTEM_PROMPT,
  PLACEMENT_POLICIES_DATA,
  TPC_CONTACT_EMAIL,
  TPC_LOCATION,
  TPC_OFFICE_HOURS,
  GROQ_API_KEY,
  GROQ_MODEL,
} from "../configs/constants";

import {
  isCourtesyMessage,
} from "../utils/queryGuard";

export interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

export class GroqService {
  private groq: Groq;
  private model = GROQ_MODEL;

  constructor() {
    if (!GROQ_API_KEY) throw new Error("Groq API key missing");
    this.groq = new Groq({ apiKey: GROQ_API_KEY });
  }

  private getAllPolicies(): string {
    return PLACEMENT_POLICIES_DATA
      .map((policy) => `[${policy.title}]\n${policy.content}`)
      .join("\n\n");
  }

  private async summarizeHistory(
    history: ChatHistoryItem[],
  ): Promise<ChatHistoryItem[]> {
    if (history.length <= 10) {
      return history;
    }

    const summaryPrompt = `Summarize the following conversation in a single paragraph:\n\n${history
      .slice(0, -5)
      .map((h) => `${h.role}: ${h.content}`)
      .join("\n")}`;

    try {
      const summaryCompletion = await this.groq.chat.completions.create({
        messages: [{ role: "user", content: summaryPrompt }],
        model: this.model,
      });

      const summary = summaryCompletion.choices[0]?.message?.content || "";

      return [
        {
          role: "assistant",
          content: `Summary of previous conversation: ${summary}`,
        },
        ...history.slice(-5),
      ];
    } catch (error) {
      console.error("Error summarizing history:", error);
      // If summarization fails, return the original history to avoid breaking the chat flow
      return history;
    }
  }

  async sendMessage(
    history: ChatHistoryItem[],
    userPrompt: string,
  ): Promise<{ content: string; requiresHuman: boolean }> {
    // ✅ Friendly closing response
    if (isCourtesyMessage(userPrompt)) {
      return {
        content:
          "You're welcome! 😊 If you have any more tpc related questions, feel free to ask. Wishing you the best for your placements!",
        requiresHuman: false,
      };
    }

    const policyContext = this.getAllPolicies();

    const summarizedHistory = await this.summarizeHistory(history);

    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}
        POLICY_CONTEXT:
        ${policyContext || "No matching policy found."}

        OPERATIONAL_DETAILS:
        Office Hours: ${TPC_OFFICE_HOURS}
        Email: ${TPC_CONTACT_EMAIL}
        Location: ${TPC_LOCATION}
`,
      },
      ...summarizedHistory,
      { role: "user", content: userPrompt },
    ];

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages,
        model: this.model,
        temperature: 0.6,
        max_tokens: 600,
      });

      const text = chatCompletion.choices[0]?.message?.content || "";
      const requiresHuman = text.includes("REQUEST_HUMAN_INTERVENTION");

      return {
        content: text.replace("REQUEST_HUMAN_INTERVENTION", "").trim(),
        requiresHuman,
      };
    } catch (error) {
      console.error("Groq API Error:", error);
      throw new Error("TPC Assistant is currently unavailable.");
    }
  }
}
