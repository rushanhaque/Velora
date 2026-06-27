import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Section, Shell } from "@/components/ui/Section";
import { EnquiryClient } from "@/components/enquiry/EnquiryClient";

export const metadata: Metadata = {
  title: "Your cart",
  description:
    "Review the pieces you've added and send them to Velora International as a single enquiry.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <PageHero
        eyebrow="Your cart"
        titleLines={["Your selection."]}
        intro="The pieces you add are kept on this device. Send them to us as a single enquiry — pricing, samples and lead times follow within two working days."
      />
      <Section pad="md" className="pt-0">
        <Shell>
          <EnquiryClient />
        </Shell>
      </Section>
    </>
  );
}
