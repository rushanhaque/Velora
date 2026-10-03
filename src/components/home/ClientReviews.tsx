import { randomInt } from "crypto";
import { SAMPLE_REVIEWS } from "@/lib/reviews";
import { ReviewsSection } from "./ReviewsSection";

export function ClientReviews() {
  const shuffled = [...SAMPLE_REVIEWS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return <ReviewsSection initialReviews={shuffled.slice(0, 6)} />;
}
