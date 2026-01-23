// guards/queryGuard.ts



export function isCourtesyMessage(question: string): boolean {
  const q = question.toLowerCase().trim();

  const courtesyPhrases = [
    "thanks",
    "thank you",
    "thanks a lot",
    "ok",
    "okay",
    "cool",
    "got it",
    "understood",
    "great"
  ];

  return courtesyPhrases.includes(q);
}

// Block sexual, personal, and random queries
export function isBlockedQuery(question: string): boolean {
  const q = question.toLowerCase();

  const forbiddenKeywords = [
    // Sexual / nudity
    "sex", "sexual", "nude", "nudity", "porn", "adult", "erotic",

    // Personal / individual
    "who is", "about me", "about you", "tell me about",
    "teacher", "student", "person",

    // General / random
    "gdp", "movie", "bollywood", "cricket",
    "politics", "news", "celebrity",
    "india", "world"
  ];

  return forbiddenKeywords.some(word => q.includes(word));
}

// Allow only placement-related queries
export function isPlacementRelated(question: string): boolean {
  const q = question.toLowerCase();

  const placementKeywords = [
    "placement", "tpc", "training",
    "eligibility", "cgpa", "backlog",
    "register", "registration",
    "offer", "dream", "salary",
    "interview", "company",
    "internship", "ppo",
    "ojt", "internship",
    "fte","rejoin",
    "cancel","cancellation"

  ];

  return placementKeywords.some(k => q.includes(k));
}
