import { Section, Shell } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Atoms";
import { SpecimenStage } from "@/components/visual/SpecimenStage";

export default function NotFound() {
  return (
    <Section pad="xl" className="pt-[clamp(140px,16vw,200px)] text-center">
      <Shell>
        <div className="mx-auto max-w-md">
          <SpecimenStage shape="bowl" tone="brass" seed="notfound" className="mx-auto max-w-[18rem]" />
        </div>
        <Eyebrow className="mt-6 justify-center">Error 404</Eyebrow>
        <h1 className="display mt-6 text-[clamp(2.4rem,6vw,4.5rem)] text-bitumen">
          This piece has been <span className="serif-italic text-brass-deep">re-homed.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md leading-relaxed text-stone">
          The page you were looking for is no longer on the bench. Let us walk you back
          to the collections.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-5">
          <Button href="/" variant="solid" arrow magnetic>
            Return home
          </Button>
          <Button href="/collections" variant="link" arrow>
            Browse the catalogue
          </Button>
        </div>
      </Shell>
    </Section>
  );
}
