// constants.ts

import 'dotenv/config';

export const GROQ_API_KEY = process.env.GROQ_API_KEY;
export const GROQ_MODEL = "llama-3.1-8b-instant";

export const UNIVERSITY_NAME = "Lovely Professional University";
export const TPC_OFFICE_HOURS = "Monday to Friday, 9:00 AM - 5:00 PM";
export const TPC_CONTACT_EMAIL = "cse.tpc1@lpu.co.in";
export const TPC_LOCATION = "Block 33-204";

// ---- Placement Policies (Chunked) ----
export const PLACEMENT_POLICIES_DATA = [
  {
    id: "p1",
    title: "General Eligibility Criteria",
    content: `Minimum CGPA of 6.5 across all semesters.
No active backlogs at the time of registration.
Minimum 75% attendance in TPC training sessions.
Placement registered students only.`,
  },
  {
    id: "p2",
    title: "Registration Protocol",
    content: `Registration on TPC portal before August 31.
One-time non-refundable fee as university policy.
Document verification within 7 days of registration.`,
  },
  {
    id: "p3",
    title: "One-Student-One-Job Policy",
    content: `1. Internship Only: Students with only an internship offer can participate in further drives for any package.
2. Placed Below 5 LPA: Students with a full-time offer below 5 LPA can participate in all eligible drives.
3. Placed Above 5 LPA: Students with a full-time offer above 5 LPA can only participate in companies offering at least 1.5x their current package (e.g., 12 LPA -> 18 LPA+).`,
  },
  {
    id: "p4",
    title: "Interview & Code of Conduct",
    content: `Professional attire mandatory.
Missing interview without 24-hour notice leads to 30-day suspension.
Malpractice results in permanent ban and disciplinary action.`,
  },
  {
    id: "p5",
    title: "Placement Debar Policy",
    content: `A student will be automatically debarred from all placement drives if:
1. The student has any active Unfair Means Case (UMC).
2. The student has one or more re-appear subjects at the time of placement participation.

Once the student clears all re-appear subjects and there is no active UMC case, the placement status will be reverted to ACTIVE, and the student may participate in subsequent placement drives.`,
  },
  {
  id: "p6",
  title: "OJT / Internship / FTE Cancellation & Rejoining University Policy",
  content: `If a student leaves an ongoing On Job Training (OJT), internship, or full-time employment (FTE) role before completion and wishes to rejoin the University, the following steps must be followed:

1. The student must first initiate OJT cancellation through the UMS portal:
   - UMS Navigation Path:
     UMS → Placement Services → OJT / Internship Application → Cancel OJT
   - The student must complete all guided steps shown on the portal.

2. After online cancellation, the student must physically visit their respective School TPC Office:
   - Location: Block 33-204
   - The student must fill the official OJT cancellation form.

3. The School TPC will verify the submitted details and documents.

4. After verification, the student will receive an official notification via:
   - Email and/or
   - LPU Touch App
   regarding a scheduled meeting with the Placement Committee.

5. The final decision regarding reinstatement and further placement eligibility will be taken by the Placement Committee.

Until the completion of this process and final approval, the student’s placement status will remain under review.`
  },
  {
    id: "p7",
    title: "PEP (Placement Enhancement Program) Exemption Policy",
    content: `If a student is placed or holds an offer from any company and PEP classes are still scheduled, they must follow these steps to request an exemption:

1. **Online via RMS**: Raise a request on UMS > RMS > Category: PEP Classes. You must upload supporting documents.
2. **Offline via TPC Office**: Visit the TPC Office to submit an offline form along with the offer letter or evidence document.

The request will be reviewed for exemption.`
}
];

// ---- STRICT SYSTEM PROMPT (No Policies Inside) ----
export const SYSTEM_PROMPT = `
You are the AI Placement Query Assistant for ${UNIVERSITY_NAME}.

ROLE & SCOPE:
- Answer ONLY placement and TPC-related questions.
- If someone ask how are you or related to this, reply gently ask about their further query you can help with(create own message).
- Base your answers on the provided POLICY_CONTEXT and OPERATIONAL_DETAILS.
- If a student asks about a specific situation (e.g., "I missed my interview because of an exam"), this IS placement-related. Address it by citing the relevant policy (e.g., suspension rules) and advising them to contact TPC.
- Contextual Follow-ups: If a user provides a reason, excuse, or follow-up to a previous placement query (e.g., "I was sick", "I had an exam"), treat it as relevant. Do NOT mark it as out-of-scope.
- Do NOT answer general knowledge, personal life, or entertainment questions.

OUT-OF-SCOPE HANDLING:
If the question is clearly unrelated to placements (e.g., "Who won the match?", "Best movies?") AND lacks context linking it to placements,
respond EXACTLY with:
"This assistant is only designed to answer placement-related questions. Unfair questions lead to UMC"

SAFETY HANDLING:
If the question is personal, explicit, or non-academic,
respond EXACTLY with:
"This assistant cannot respond to personal, explicit, or non-academic queries. Unfair queries lead to UMC"

HUMAN INTERVENTION:
If the query is placement-related but ambiguous or exceptional,
append REQUEST_HUMAN_INTERVENTION at the end.

DO NOT guess or invent rules.
`;
