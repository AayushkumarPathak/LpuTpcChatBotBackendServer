// services/GeminiService.ts

import { GoogleGenerativeAI, Content, Part } from "@google/generative-ai";
import {
  SYSTEM_PROMPT,
  PLACEMENT_POLICIES_DATA,
  TPC_CONTACT_EMAIL,
  TPC_LOCATION,
  TPC_OFFICE_HOURS,
} from "../configs/constants";

import {
  isBlockedQuery,
  isPlacementRelated,
  isCourtesyMessage,
} from "../utils/queryGuard";

export interface ChatHistoryItem {
  role: "user" | "model";
  parts: Part[];
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model = "gemini-3-flash-preview";

  constructor(apiKey: string) {
    if (!apiKey) throw new Error("Gemini API key missing");
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private getRelevantPolicies(question: string): string {
    const query = question.toLowerCase();

    const matched = PLACEMENT_POLICIES_DATA.filter((p) => {
      if (query.includes("cgpa") || query.includes("eligibility"))
        return p.id === "p1";
      if (query.includes("register")) return p.id === "p2";
      if (query.includes("offer") || query.includes("dream"))
        return p.id === "p3";
      if (query.includes("interview") || query.includes("conduct"))
        return p.id === "p4";
      if (
        query.includes("debar") ||
        query.includes("umc") ||
        query.includes("unfair") ||
        query.includes("reappear") ||
        query.includes("re-appear") ||
        query.includes("backlog") ||
        query.includes("active") ||
        query.includes("suspension") ||
        query.includes("placement status")
      ) {
        return p.id === "p5";
      }
      if (
        query.includes("ojt") ||
        query.includes("internship") ||
        query.includes("fte") ||
        query.includes("left company") ||
        query.includes("cancel") ||
        query.includes("rejoin") ||
        query.includes("rejoin university")
      ) {
        return p.id === "p6";
      }

      return false;
    });

    return matched.map((p) => `[${p.title}]\n${p.content}`).join("\n\n");
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
    // 🚫 Guard layer (before LLM)
    if (isBlockedQuery(userPrompt)) {
      return {
        content:
          "This assistant cannot respond to personal, explicit, or non-academic queries. Unfair queries lead to UMC",
        requiresHuman: false,
      };
    }

    if (!isPlacementRelated(userPrompt)) {
      return {
        content:
          "This assistant is only designed to answer placement-related questions. Unfair questions lead to UMC",
        requiresHuman: false,
      };
    }

    const policyContext = this.getRelevantPolicies(userPrompt);

    const model = this.genAI.getGenerativeModel({
      model: this.model,
      systemInstruction: SYSTEM_PROMPT,
    });

    const contents: Content[] = [
      {
        role: "user",
        parts: [
          {
            text: `
POLICY_CONTEXT:
${policyContext || "No matching policy found."}

OPERATIONAL_DETAILS:
Office Hours: ${TPC_OFFICE_HOURS}
Email: ${TPC_CONTACT_EMAIL}
Location: ${TPC_LOCATION}
`,
          },
        ],
      },
      ...history,
      { role: "user", parts: [{ text: userPrompt }] },
    ];

    try {
      const result = await model.generateContent({
        contents,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 600,
        },
      });

      const text = result.response.text() || "";
      const requiresHuman = text.includes("REQUEST_HUMAN_INTERVENTION");

      return {
        content: text.replace("REQUEST_HUMAN_INTERVENTION", "").trim(),
        requiresHuman,
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("TPC Assistant is currently unavailable.");
    }
  }
}
