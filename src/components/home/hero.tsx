import { Check } from "lucide-react";

import { SearchPanel } from "@/components/home/search-panel";
import { Container } from "@/components/layout/container";

const assurances = [
  "New roles every week",
  "Remote-friendly",
  "No account needed",
];

export function Hero() {
  return (
    <section
      id="top"
      className="scroll-mt-20 border-b border-border bg-gradient-to-b from-accent via-background to-background"
    >
      <Container className="flex flex-col items-center py-14 text-center sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          <h1 className="text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.03] font-semibold tracking-[-0.03em] text-balance">
            Find a role that{" "}
            <span className="text-primary">fits your life.</span>
          </h1>

        </div>

        <SearchPanel className="mt-9 w-full max-w-3xl text-left" />

        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {assurances.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Check aria-hidden="true" className="size-4 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
