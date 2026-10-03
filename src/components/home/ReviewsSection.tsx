"use client";

import { useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import type { Review } from "@/lib/reviews";

export function ReviewsSection({ initialReviews }: { initialReviews: Review[] }) {
  // Keep the selection steady during content-beacon refreshes and form entry.
  const [reviews] = useState(initialReviews);
  return (
    <section id="reviews" className="client-notes" aria-labelledby="reviews-heading">
      <Shell>
        <Reveal>
          <div className="client-notes-heading">
            <div>
              <p className="eyebrow text-brass-deep">The client journal</p>
              <h2 id="reviews-heading" className="mt-5 font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.98] text-bitumen">
                Words worth <span className="serif-italic text-brass-deep">keeping.</span>
              </h2>
            </div>
            <div className="client-notes-intro">
              <span className="review-preview-label">Sample reviews</span>
              <p className="mt-3 text-sm leading-relaxed text-stone">A preview of our client stories. The names and reviews below are illustrative, not actual customer feedback.</p>
            </div>
          </div>
        </Reveal>
        <div className="client-notes-grid">
          {reviews.map((review, index) => (
            <Reveal key={review.id} className="h-full">
              <figure className="client-note">
                <div className="client-note-top">
                  <span className="review-stars" aria-hidden="true">★★★★★</span>
                  <span className="review-sample">Sample review</span>
                </div>
                <h3 className="mt-6 font-display text-[1.6rem] leading-tight text-bitumen">{review.subject}</h3>
                <blockquote className="mt-4 flex-1 text-[0.94rem] leading-[1.85] text-stone">
                  <p>&ldquo;{review.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="client-note-author">
                  <span className={`review-monogram review-monogram-${index % 3}`} aria-hidden="true">{review.initials}</span>
                  <div>
                    <p className="text-sm font-medium text-bitumen">{review.name}</p>
                    <p className="mt-0.5 text-xs text-ash">{review.role}</p>
                    <p className="mt-1 text-[0.62rem] uppercase tracking-[0.12em] text-brass-deep">{review.location}</p>
                  </div>
                  <span className="review-quote-mark" aria-hidden="true">”</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <div className="client-notes-foot">
          <p className="font-display text-xl text-stone">Something beautiful begins with a conversation.</p>
          <Link href="/contact" className="group inline-flex items-center gap-5 text-xs uppercase tracking-wider2 text-bitumen">
            Start your project <span aria-hidden="true" className="text-xl transition-transform group-hover:translate-x-1">↗</span>
          </Link>
        </div>
      </Shell>
    </section>
  );
}
