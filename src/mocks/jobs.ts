import type { JobListItem } from "@/types/api";

/**
 * Mock Jobs
 */
export interface MockJob extends JobListItem {
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export const MOCK_JOBS: MockJob[] = [
  {
    id: 1,
    title: "Senior Backend Engineer",
    location: "Remote (East Africa)",
    employment_type: "Full-time",
    summary:
      "Design and build the APIs that power BrightCore's hiring platform.",
    description:
      "You will join a small platform team that owns the services behind our job board and applicant tracking tools. We care about clear code, solid tests and databases that make invalid states hard to represent.",
    responsibilities: [
      "Design and ship REST APIs with FastAPI",
      "Review database schemas and write migrations",
      "Mentor junior engineers and improve our engineering practices",
    ],
    requirements: [
      "5+ years building backend services in Python",
      "Strong SQL and PostgreSQL knowledge",
      "Experience with automated testing and CI",
    ],
    closing_date: "2026-11-13",
    status: "Open",
    is_accepting_applications: true,
  },
  {
    id: 2,
    title: "Product Designer",
    location: "Kigali, Rwanda",
    employment_type: "Contract",
    summary: "Shape how candidates and recruiters experience BrightCore.",
    description:
      "This is a six-month contract for a designer who likes working close to the code. You will own the end-to-end experience of applying for a job and of reviewing applicants, from the first sketch to the final accessibility check.",
    responsibilities: [
      "Turn research into clear, testable designs",
      "Maintain and extend our design system",
      "Work closely with engineers during implementation",
    ],
    requirements: [
      "A portfolio of shipped product work",
      "Confidence with Figma and design tokens",
      "Experience testing designs with real users",
    ],
    closing_date: "2026-11-06",
    status: "Open",
    is_accepting_applications: true,
  },
  {
    id: 3,
    title: "Frontend Engineer (React)",
    location: "Remote",
    employment_type: "Full-time",
    summary:
      "Build fast, accessible interfaces for candidates and hiring teams.",
    description:
      "Our frontend is Next.js and TypeScript, with a strong bias toward readable components and real accessibility. You will work on the public job board and the internal tools recruiters use every day.",
    responsibilities: [
      "Ship polished interfaces in Next.js and TypeScript",
      "Own accessibility and performance on the pages you build",
      "Partner with design from sketch through release",
    ],
    requirements: [
      "3+ years with React and TypeScript",
      "A sharp eye for layout, states and detail",
      "Comfortable discussing accessibility trade-offs",
    ],
    closing_date: "2026-11-20",
    status: "Open",
    is_accepting_applications: true,
  },
  {
    id: 4,
    title: "Data Analyst",
    location: "London, United Kingdom",
    employment_type: "Full-time",
    summary:
      "Turn recruitment data into decisions our customers can act on.",
    description:
      "You will own the reporting layer of our recruitment product: the dashboards recruiters use every morning and the monthly insights our leadership team relies on.",
    responsibilities: [
      "Build dashboards for recruiters and hiring managers",
      "Maintain the reporting pipeline and data quality checks",
      "Present monthly insights to the leadership team",
    ],
    requirements: [
      "Strong SQL and spreadsheet skills",
      "Experience with a BI tool such as Metabase",
      "Comfortable explaining data to non-technical colleagues",
    ],
    closing_date: "2026-11-27",
    status: "Open",
    is_accepting_applications: true,
  },
  {
    id: 5,
    title: "Customer Success Lead",
    location: "Nairobi, Kenya",
    employment_type: "Full-time",
    summary:
      "Help hiring teams get real value from BrightCore from day one.",
    description:
      "You will be the first dedicated customer success hire, working with a portfolio of growing companies. The role is part relationship building, part product feedback loop.",
    responsibilities: [
      "Onboard new hiring teams and run quarterly reviews",
      "Turn recurring customer problems into product feedback",
      "Build simple playbooks the team can reuse",
    ],
    requirements: [
      "3+ years in customer success or account management",
      "Excellent written and spoken communication",
      "Comfortable with data and product tools",
    ],
    closing_date: "2026-11-18",
    status: "Open",
    is_accepting_applications: true,
  },
  {
    id: 6,
    title: "DevOps Engineer",
    location: "Remote",
    employment_type: "Contract",
    summary:
      "Keep our infrastructure boring, observable and easy to deploy to.",
    description:
      "A six-month contract to tighten the path from commit to production. You will work alongside two backend engineers and leave behind documentation the team can actually follow.",
    responsibilities: [
      "Improve CI pipelines and deployment automation",
      "Add monitoring, alerting and sensible dashboards",
      "Document runbooks and infrastructure decisions",
    ],
    requirements: [
      "Strong Linux and container fundamentals",
      "Experience with GitHub Actions or similar",
      "Comfortable with PostgreSQL backups and recovery",
    ],
    closing_date: "2026-12-04",
    status: "Open",
    is_accepting_applications: true,
  },
  {
    id: 7,
    title: "Marketing Intern",
    location: "Kigali, Rwanda",
    employment_type: "Internship",
    summary:
      "Learn the craft of marketing while helping us reach more job seekers.",
    description:
      "A paid six-month internship for someone curious about content, campaigns and community. You will work directly with the founders and get real ownership of small projects.",
    responsibilities: [
      "Draft social posts and short newsletter pieces",
      "Help organise community and campus events",
      "Track campaign results in a shared dashboard",
    ],
    requirements: [
      "Clear, friendly writing in English",
      "Curiosity about hiring and the job market",
      "Available to work from Kigali two days a week",
    ],
    closing_date: "2026-11-09",
    status: "Open",
    is_accepting_applications: true,
  },
  {
    id: 8,
    title: "Technical Writer",
    location: "Remote",
    employment_type: "Part-time",
    summary:
      "Make complex hiring workflows easy to understand in writing.",
    description:
      "You will document our product and our public API, working from conversations with engineers and designers. Around twenty hours a week, with a flexible schedule.",
    responsibilities: [
      "Write and maintain product help articles",
      "Keep the public API reference accurate",
      "Edit customer-facing emails and release notes",
    ],
    requirements: [
      "Experience writing developer or product documentation",
      "Ability to read code well enough to follow it",
      "A clear, plain-English style",
    ],
    closing_date: "2026-12-11",
    status: "Open",
    is_accepting_applications: true,
  },
  {
    id: 9,
    title: "Mobile Engineer (React Native)",
    location: "Remote",
    employment_type: "Full-time",
    summary:
      "Bring the BrightCore experience to candidates on their phones.",
    description:
      "You will take our mobile app from a thin wrapper to a genuinely useful product: saved roles, application status and job alerts that people actually want.",
    responsibilities: [
      "Build and ship features in React Native",
      "Work with push notifications and offline caching",
      "Improve release automation for iOS and Android",
    ],
    requirements: [
      "2+ years shipping React Native apps",
      "Experience with app store release processes",
      "Attention to performance on older devices",
    ],
    closing_date: "2026-11-25",
    status: "Open",
    is_accepting_applications: true,
  },
  {
    id: 10,
    title: "Product Manager",
    location: "Kigali, Rwanda",
    employment_type: "Full-time",
    summary:
      "Own a small, focused product area from problem to shipped outcome.",
    description:
      "We are looking for a product manager who prefers talking to users over writing long documents. You will own the hiring team experience and work with a small cross-functional squad.",
    responsibilities: [
      "Talk to hiring teams and candidate users every week",
      "Shape a clear, prioritised roadmap for your area",
      "Define and measure the outcomes of what ships",
    ],
    requirements: [
      "3+ years managing a software product",
      "Comfortable with basic SQL and product analytics",
      "Strong written communication",
    ],
    closing_date: "2026-11-16",
    status: "Open",
    is_accepting_applications: true,
  },
  {
    id: 11,
    title: "QA Engineer",
    location: "Remote",
    employment_type: "Contract",
    summary:
      "Help us ship confidently without slowing the team down.",
    description:
      "A six-month contract focused on practical quality: a lean test strategy, a few well-chosen automated checks and a release process the team trusts.",
    responsibilities: [
      "Map the critical paths worth testing",
      "Write end-to-end tests for core flows",
      "Review releases and report issues clearly",
    ],
    requirements: [
      "Experience testing modern web applications",
      "Comfortable with Playwright or Cypress",
      "A pragmatic approach to test coverage",
    ],
    closing_date: "2026-12-18",
    status: "Open",
    is_accepting_applications: true,
  },
  {
    id: 12,
    title: "People Operations Coordinator",
    location: "Kigali, Rwanda",
    employment_type: "Part-time",
    summary:
      "Keep the people side of BrightCore organised and human.",
    description:
      "A part-time role for someone who enjoys the details: contracts, onboarding, benefits questions and the small things that make a team feel cared for.",
    responsibilities: [
      "Coordinate onboarding for new team members",
      "Keep people records accurate and confidential",
      "Support hiring managers with interview scheduling",
    ],
    requirements: [
      "Experience in HR, operations or administration",
      "Discretion with confidential information",
      "Warm, organised written communication",
    ],
    closing_date: "2026-11-30",
    status: "Open",
    is_accepting_applications: true,
  },
  {
    id: 13,
    title: "Content Strategist",
    location: "Remote",
    employment_type: "Part-time",
    summary:
      "Plan and write content that helps people make better career decisions.",
    description:
      "You will own our editorial calendar and write the guides, interviews and newsletter pieces job seekers actually read. About twenty hours a week.",
    responsibilities: [
      "Plan a monthly editorial calendar",
      "Write and edit long-form career guides",
      "Work with the marketing intern on distribution",
    ],
    requirements: [
      "A portfolio of published writing",
      "Experience in content strategy or editorial",
      "Interest in careers and the future of work",
    ],
    closing_date: "2026-12-07",
    status: "Open",
    is_accepting_applications: true,
  },
  {
    id: 14,
    title: "Solutions Engineer",
    location: "Lagos, Nigeria",
    employment_type: "Full-time",
    summary:
      "Help larger hiring teams fit BrightCore into how they already work.",
    description:
      "You will sit between sales and engineering: understanding how a customer hires today, then designing a practical setup in BrightCore that their team will actually use.",
    responsibilities: [
      "Run technical discovery with prospective customers",
      "Build demos and proof-of-concept setups",
      "Feed recurring integration requests back to product",
    ],
    requirements: [
      "Experience in a technical customer-facing role",
      "Comfortable with APIs and data imports",
      "Clear, patient explanation of technical ideas",
    ],
    closing_date: "2026-12-02",
    status: "Open",
    is_accepting_applications: true,
  },
  {
    id: 15,
    title: "Finance Intern",
    location: "Kigali, Rwanda",
    employment_type: "Internship",
    summary:
      "Learn the basics of running finance for a small software company.",
    description:
      "A six-month paid internship supporting invoicing, expenses and monthly reporting. You will work directly with our operations lead and see how the numbers connect to the business.",
    responsibilities: [
      "Help prepare invoices and track payments",
      "Keep expense records tidy and up to date",
      "Support the monthly reporting pack",
    ],
    requirements: [
      "Studying or recently graduated in finance or accounting",
      "Comfortable with spreadsheets",
      "Careful, consistent attention to detail",
    ],
    closing_date: "2026-11-11",
    status: "Open",
    is_accepting_applications: true,
  },
  {
    id: 16,
    title: "Security Engineer",
    location: "Remote",
    employment_type: "Full-time",
    summary:
      "Help us handle candidate data with the care it deserves.",
    description:
      "You will work across our platform to reduce risk in practical ways: sensible access control, dependency hygiene, secure defaults and a team that knows what to do when something looks wrong.",
    responsibilities: [
      "Review access control and data handling practices",
      "Set up dependency and secret scanning",
      "Run lightweight security reviews with engineers",
    ],
    requirements: [
      "Experience securing web applications and APIs",
      "Knowledge of common auth and data protection pitfalls",
      "A calm, collaborative approach to incidents",
    ],
    closing_date: "2026-12-15",
    status: "Open",
    is_accepting_applications: true,
  },
  {
    id: 17,
    title: "UX Researcher",
    location: "Remote",
    employment_type: "Contract",
    summary:
      "Help the team understand candidates and recruiters through real conversations.",
    description:
      "A four-month contract to run a focused research programme across our two main audiences. You will plan the studies, talk to people and turn what you learn into decisions the team can act on.",
    responsibilities: [
      "Plan and run moderated interviews",
      "Summarise findings into clear, usable insights",
      "Work with design to test early concepts",
    ],
    requirements: [
      "Experience running qualitative product research",
      "Strong synthesis and writing skills",
      "Comfortable recruiting your own participants",
    ],
    closing_date: "2026-12-09",
    status: "Open",
    is_accepting_applications: true,
  },
  {
    id: 18,
    title: "Data Engineer",
    location: "Nairobi, Kenya",
    employment_type: "Full-time",
    summary:
      "Build the pipelines that keep hiring data accurate and available.",
    description:
      "You will own the data platform behind our reporting: ingestion from the product database, a small warehouse and the transforms analysts rely on every day.",
    responsibilities: [
      "Build and maintain reliable ingestion pipelines",
      "Model data in the warehouse for analysts",
      "Monitor data quality and fix issues at the source",
    ],
    requirements: [
      "Strong SQL and Python",
      "Experience with a cloud warehouse such as BigQuery",
      "Comfortable with orchestration tools and version control",
    ],
    closing_date: "2026-12-22",
    status: "Open",
    is_accepting_applications: true,
  },
];

/** Look up one mock role by  id. */
export function getMockJob(id: number): MockJob | undefined {
  return MOCK_JOBS.find((job) => job.id === id);
}
