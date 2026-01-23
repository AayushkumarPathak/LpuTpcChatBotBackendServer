// constants.ts

export const UNIVERSITY_NAME = "Lovely Professional University";
export const TPC_OFFICE_HOURS = "Monday to Friday, 9:00 AM - 5:00 PM";
export const TPC_CONTACT_EMAIL = "tpc-support@globaluniv.edu";
export const TPC_LOCATION = "Block 33-204";

// ---- Placement Policies (Chunked) ----
export const PLACEMENT_POLICIES_DATA = [
  {
    id: "p1",
    title: "General Eligibility Criteria",
    content: `Minimum CGPA of 6.5 across all semesters.
No active backlogs at the time of registration.
Minimum 75% attendance in TPC training sessions.
Final year UG/PG students only.`,
  },
  {
    id: "p2",
    title: "Registration Protocol",
    content: `Registration on TPC portal before August 31.
One-time non-refundable fee of $50.
Document verification within 7 days of registration.`,
  },
  {
    id: "p3",
    title: "One-Student-One-Job Policy",
    content: `Only one offer allowed via TPC.
After accepting an offer, student is removed from further drives.
Exception: Dream companies allowed if current offer < $10k/year and dream offer > $20k/year.`,
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
}
];

// ---- STRICT SYSTEM PROMPT (No Policies Inside) ----
export const SYSTEM_PROMPT = `
You are the AI Placement Query Assistant for ${UNIVERSITY_NAME}.

STRICT SCOPE RULES:
- Answer ONLY placement and TPC-related questions.
- Use ONLY the provided POLICY_CONTEXT and OPERATIONAL_DETAILS.
- Do NOT answer general knowledge, personal, sexual, or entertainment questions.

OUT-OF-SCOPE HANDLING:
If the question is unrelated to placements or violates scope,
respond EXACTLY with:
"This assistant is only designed to answer placement-related questions."

HUMAN INTERVENTION:
If the query is placement-related but ambiguous or exceptional,
append REQUEST_HUMAN_INTERVENTION at the end.

DO NOT guess or invent rules.
`;
