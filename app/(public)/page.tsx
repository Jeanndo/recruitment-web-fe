import { Hero } from "@/components/home/hero";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { OpenRoles } from "@/components/home/open-roles";

export default function HomePage() {
  return (
    <>
      <Hero />
      <OpenRoles />
      <NewsletterCta />
    </>
  );
}
