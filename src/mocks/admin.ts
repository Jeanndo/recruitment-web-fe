import { MOCK_JOBS } from "@/mocks/jobs";
import type {
  AdminApplicationDetail,
  AdminJobListItem,
  ApplicationStatus,
} from "@/types/admin";

/** Roles that only exist in the admin preview: two closed, two drafts. */
const ADMIN_ONLY_JOBS: AdminJobListItem[] = [
  {
    id: 19,
    title: "Office Manager",
    location: "Kigali, Rwanda",
    status: "Closed",
    closing_date: "2026-09-30",
    application_count: 0,
  },
  {
    id: 20,
    title: "Growth Marketing Manager",
    location: "Remote",
    status: "Closed",
    closing_date: "2026-10-10",
    application_count: 0,
  },
  {
    id: 21,
    title: "Engineering Manager",
    location: "Kigali, Rwanda",
    status: "Draft",
    closing_date: "2026-12-01",
    application_count: 0,
  },
  {
    id: 22,
    title: "Recruitment Coordinator",
    location: "Remote (East Africa)",
    status: "Draft",
    closing_date: "2026-12-15",
    application_count: 0,
  },
];

interface ApplicationSeed {
  id: number;
  job_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  status: ApplicationStatus;
  created_at: string;
  cover_note: string;
  admin_note: string | null;
  cv_available?: boolean;
}

const APPLICATION_SEEDS: ApplicationSeed[] = [
  {
    id: 1,
    job_id: 1,
    full_name: "Aline Uwase",
    email: "aline.uwase@example.com",
    phone_number: "+250 788 123 456",
    status: "Pending",
    created_at: "2026-10-22T08:40:00Z",
    cover_note:
      "I have spent the last six years building FastAPI services and data pipelines. BrightCore's focus on thoughtful, small teams is exactly where I do my best work.",
    admin_note: null,
  },
  {
    id: 2,
    job_id: 1,
    full_name: "Eric Niyonzima",
    email: "eric.niyonzima@example.com",
    phone_number: "+250 789 441 208",
    status: "Accepted",
    created_at: "2026-10-21T14:10:00Z",
    cover_note:
      "I maintain a large multi-tenant Django platform today and have been moving parts of it to FastAPI. I would love to bring that experience to your platform team.",
    admin_note: "Strong systems background. Moving to a technical interview.",
  },
  {
    id: 3,
    job_id: 1,
    full_name: "Grace Mutoni",
    email: "grace.mutoni@example.com",
    phone_number: "+250 787 006 119",
    status: "Rejected",
    created_at: "2026-10-20T09:25:00Z",
    cover_note:
      "I am a backend engineer with four years of experience in Python and PostgreSQL. I enjoy working on APIs that other teams rely on every day.",
    admin_note: "Good foundation, but we need a little more senior experience.",
  },
  {
    id: 4,
    job_id: 1,
    full_name: "Samuel Ochieng",
    email: "samuel.ochieng@example.com",
    phone_number: "+254 712 884 390",
    status: "Pending",
    created_at: "2026-10-19T16:05:00Z",
    cover_note:
      "I have designed and operated recruiting APIs at scale. The chance to work close to the product and keep the team small is very appealing.",
    admin_note: null,
  },
  {
    id: 5,
    job_id: 2,
    full_name: "Diane Ingabire",
    email: "diane.ingabire@example.com",
    phone_number: "+250 788 552 010",
    status: "Accepted",
    created_at: "2026-10-22T07:15:00Z",
    cover_note:
      "I design tools for people who spend their whole day in them. I care about clear states, calm layouts and making the hard parts feel obvious.",
    admin_note: "Portfolio is excellent. Schedule the paid trial task.",
  },
  {
    id: 6,
    job_id: 2,
    full_name: "Brian Kato",
    email: "brian.kato@example.com",
    phone_number: "+256 772 310 842",
    status: "Pending",
    created_at: "2026-10-21T11:50:00Z",
    cover_note:
      "I have led design for two applicant tracking products. I would love to help shape the candidate experience at BrightCore.",
    admin_note: null,
  },
  {
    id: 7,
    job_id: 2,
    full_name: "Cynthia Akinyi",
    email: "cynthia.akinyi@example.com",
    phone_number: "+254 701 220 765",
    status: "Rejected",
    created_at: "2026-10-18T13:30:00Z",
    cover_note:
      "I am a product designer focused on complex internal tools. My portfolio includes a recruiting dashboard used by a team of forty recruiters.",
    admin_note: "Good work, but the contract timing does not line up.",
  },
  {
    id: 8,
    job_id: 3,
    full_name: "Yannick Habimana",
    email: "yannick.habimana@example.com",
    phone_number: "+250 785 900 311",
    status: "Pending",
    created_at: "2026-10-22T10:05:00Z",
    cover_note:
      "I work mostly in React and TypeScript and care a lot about accessibility and performance. I would love to build interfaces candidates actually enjoy using.",
    admin_note: null,
  },
  {
    id: 9,
    job_id: 3,
    full_name: "Fatima Al-Hassan",
    email: "fatima.alhassan@example.com",
    phone_number: "+971 50 447 2201",
    status: "Accepted",
    created_at: "2026-10-20T08:20:00Z",
    cover_note:
      "I have shipped design systems and large Next.js products. I like working close to design and taking responsibility for the small details.",
    admin_note: "Very strong frontend craft. Moving to the next round.",
  },
  {
    id: 10,
    job_id: 3,
    full_name: "Peter Mwangi",
    email: "peter.mwangi@example.com",
    phone_number: "+254 720 448 901",
    status: "Rejected",
    created_at: "2026-10-17T15:45:00Z",
    cover_note:
      "I am a frontend engineer with five years of experience in React. I am comfortable owning features from design review through release.",
    admin_note: "Competent, but less product-minded than the current shortlist.",
  },
  {
    id: 11,
    job_id: 3,
    full_name: "Josiane Umutoni",
    email: "josiane.umutoni@example.com",
    phone_number: "+250 788 740 227",
    status: "Pending",
    created_at: "2026-10-16T09:10:00Z",
    cover_note:
      "I like building applications that feel simple because the hard work is hidden. I have worked with React and accessible component libraries for four years.",
    admin_note: null,
  },
  {
    id: 12,
    job_id: 4,
    full_name: "Daniel Otieno",
    email: "daniel.otieno@example.com",
    phone_number: "+254 733 019 447",
    status: "Accepted",
    created_at: "2026-10-21T09:35:00Z",
    cover_note:
      "I have spent the last three years turning messy operational data into dashboards that people actually use. SQL is my happy place.",
    admin_note: "Strong SQL and clear communication. Offer conversation next.",
  },
  {
    id: 13,
    job_id: 4,
    full_name: "Sandrine Mukamana",
    email: "sandrine.mukamana@example.com",
    phone_number: "+250 789 221 043",
    status: "Pending",
    created_at: "2026-10-19T12:00:00Z",
    cover_note:
      "I currently support a recruitment team with reporting and data quality. I would love to build the reporting layer for a product instead of one team.",
    admin_note: null,
  },
  {
    id: 14,
    job_id: 4,
    full_name: "Kelvin Mwenda",
    email: "kelvin.mwenda@example.com",
    phone_number: "+254 710 556 238",
    status: "Rejected",
    created_at: "2026-10-15T17:20:00Z",
    cover_note:
      "I am a data analyst with experience in Metabase and dbt. I enjoy working with non-technical colleagues to make numbers useful.",
    admin_note: "Solid, but more pipeline-oriented than the role needs.",
  },
  {
    id: 15,
    job_id: 5,
    full_name: "Noella Uwimana",
    email: "noella.uwimana@example.com",
    phone_number: "+250 786 300 154",
    status: "Accepted",
    created_at: "2026-10-20T10:45:00Z",
    cover_note:
      "I have built customer success from scratch at two early-stage companies. I like clear playbooks, honest feedback and getting customers to value quickly.",
    admin_note: "Exactly the profile we discussed. References next.",
  },
  {
    id: 16,
    job_id: 5,
    full_name: "Ibrahim Diallo",
    email: "ibrahim.diallo@example.com",
    phone_number: "+221 77 620 4410",
    status: "Pending",
    created_at: "2026-10-18T08:55:00Z",
    cover_note:
      "I manage a portfolio of enterprise accounts today and spend most of my time turning product feedback into better onboarding.",
    admin_note: null,
  },
  {
    id: 17,
    job_id: 6,
    full_name: "Esther Achieng",
    email: "esther.achieng@example.com",
    phone_number: "+254 721 407 665",
    status: "Accepted",
    created_at: "2026-10-19T14:30:00Z",
    cover_note:
      "I have run Kubernetes and Terraform for a team of thirty engineers. I enjoy making deployments boring and observability obvious.",
    admin_note: "Great practical examples. Set up the platform interview.",
  },
  {
    id: 18,
    job_id: 6,
    full_name: "Victor Nkurunziza",
    email: "victor.nkurunziza@example.com",
    phone_number: "+257 79 442 118",
    status: "Rejected",
    created_at: "2026-10-14T11:15:00Z",
    cover_note:
      "I am a DevOps engineer with strong Linux fundamentals and experience running CI/CD for small product teams.",
    admin_note: "Good potential, but not enough depth for this role yet.",
  },
  {
    id: 19,
    job_id: 7,
    full_name: "Alice Wanjiku",
    email: "alice.wanjiku@example.com",
    phone_number: "+254 715 006 983",
    status: "Pending",
    created_at: "2026-10-22T12:25:00Z",
    cover_note:
      "I am finishing a marketing degree and have run social accounts for two small businesses. I would love to learn from a team that cares about the craft.",
    admin_note: null,
  },
  {
    id: 20,
    job_id: 7,
    full_name: "Olivier Bizimana",
    email: "olivier.bizimana@example.com",
    phone_number: "+250 784 552 019",
    status: "Accepted",
    created_at: "2026-10-18T09:40:00Z",
    cover_note:
      "I have been writing for a regional tech publication while finishing my studies. I am interested in how good job content helps people make decisions.",
    admin_note: "Strong writing samples. Internship offer approved.",
  },
  {
    id: 21,
    job_id: 7,
    full_name: "Peace Udo",
    email: "peace.udo@example.com",
    phone_number: "+234 803 441 9902",
    status: "Rejected",
    created_at: "2026-10-13T16:50:00Z",
    cover_note:
      "I am a recent graduate with experience running campus campaigns and a strong interest in recruitment marketing.",
    admin_note: "Promising, but we are prioritizing candidates closer to Kigali.",
  },
  {
    id: 22,
    job_id: 8,
    full_name: "Mark Johnson",
    email: "mark.johnson@example.com",
    phone_number: "+44 7700 900 123",
    status: "Pending",
    created_at: "2026-10-21T07:30:00Z",
    cover_note:
      "I have written developer documentation for API platforms for eight years. I like working with engineers to make complex systems understandable.",
    admin_note: null,
  },
  {
    id: 23,
    job_id: 8,
    full_name: "Solange Nyirahabimana",
    email: "solange.nyirahabimana@example.com",
    phone_number: "+250 788 007 912",
    status: "Accepted",
    created_at: "2026-10-16T10:20:00Z",
    cover_note:
      "I combine technical writing with a background in software testing. I would love to own the help centre and API reference at BrightCore.",
    admin_note: "Excellent trial task. Ready for a final conversation.",
  },
  {
    id: 24,
    job_id: 9,
    full_name: "Denis Rugamba",
    email: "denis.rugamba@example.com",
    phone_number: "+250 789 314 005",
    status: "Rejected",
    created_at: "2026-10-15T12:35:00Z",
    cover_note:
      "I have shipped React Native apps for logistics and fintech products. I care about smooth interactions and predictable release cycles.",
    admin_note: "Strong mobile work, but our direction changed.",
  },
  {
    id: 25,
    job_id: 9,
    full_name: "Mireille Uwera",
    email: "mireille.uwera@example.com",
    phone_number: "+250 785 118 702",
    status: "Pending",
    created_at: "2026-10-14T08:05:00Z",
    cover_note:
      "I am a mobile engineer with three years of React Native experience and a soft spot for offline-first products.",
    admin_note: null,
  },
  {
    id: 26,
    job_id: 10,
    full_name: "James Kariuki",
    email: "james.kariuki@example.com",
    phone_number: "+254 722 590 117",
    status: "Accepted",
    created_at: "2026-10-19T11:00:00Z",
    cover_note:
      "I have led product for two B2B SaaS platforms, including a hiring product. I like working with small teams where the feedback loop is short.",
    admin_note: "Very aligned with the roadmap. Final panel scheduled.",
  },
  {
    id: 27,
    job_id: 10,
    full_name: "Divine Iradukunda",
    email: "divine.iradukunda@example.com",
    phone_number: "+250 787 682 390",
    status: "Rejected",
    created_at: "2026-10-13T13:10:00Z",
    cover_note:
      "I am a product manager with a background in operations and customer research. I enjoy turning messy workflows into simple product decisions.",
    admin_note: "Good operator, but less product leadership experience than needed.",
  },
  {
    id: 28,
    job_id: 19,
    full_name: "Aisha Mohamed",
    email: "aisha.mohamed@example.com",
    phone_number: "+254 700 118 247",
    status: "Accepted",
    created_at: "2026-10-11T09:00:00Z",
    cover_note:
      "I have managed offices for growing teams across East Africa. I enjoy building the quiet systems that let everyone else do their best work.",
    admin_note: "Offer accepted. Starts on the first of November.",
  },
  {
    id: 29,
    job_id: 19,
    full_name: "Patrick Nshimiyimana",
    email: "patrick.nshimiyimana@example.com",
    phone_number: "+250 786 442 581",
    status: "Rejected",
    created_at: "2026-10-08T15:25:00Z",
    cover_note:
      "I have five years of office administration experience and have supported a team of sixty people.",
    admin_note: "Did not demonstrate the financial admin experience we need.",
  },
  {
    id: 30,
    job_id: 20,
    full_name: "Linda Mbabazi",
    email: "linda.mbabazi@example.com",
    phone_number: "+256 774 220 681",
    status: "Pending",
    created_at: "2026-10-07T10:30:00Z",
    cover_note:
      "I have led growth for a recruitment marketplace and would love to bring a content-led approach to BrightCore.",
    admin_note: "Job closed before review was completed.",
    cv_available: false,
  },
];

function jobReference(id: number) {
  const job = [...MOCK_JOBS, ...ADMIN_ONLY_JOBS].find((item) => item.id === id);

  if (!job) {
    throw new Error(`Mock application ${id} points at a missing job.`);
  }

  return {
    id: job.id,
    title: job.title,
    location: job.location,
    closing_date: job.closing_date,
    status: job.status,
  };
}

function cvFilename(name: string) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-cv.pdf`;
}

/** Full mock applications, shaped like the admin detail endpoint. */
export const MOCK_ADMIN_APPLICATIONS: AdminApplicationDetail[] =
  APPLICATION_SEEDS.map((seed) => {
    const job = jobReference(seed.job_id);
    const cvAvailable = seed.cv_available ?? true;

    return {
      ...seed,
      job,
      cv_available: cvAvailable,
      cv: cvAvailable
        ? {
            application_id: seed.id,
            filename: cvFilename(seed.full_name),
            content_type: "application/pdf",
            size_bytes: 148_000 + seed.id * 1_137,
            download_url: `/api/v1/admin/applications/${seed.id}/cv`,
          }
        : null,
    };
  });

const applicationCounts = MOCK_ADMIN_APPLICATIONS.reduce<Record<number, number>>(
  (counts, application) => {
    counts[application.job_id] = (counts[application.job_id] ?? 0) + 1;
    return counts;
  },
  {},
);

/** Every job an administrator can see, including drafts and closed roles. */
export const MOCK_ADMIN_JOBS: AdminJobListItem[] = [
  ...MOCK_JOBS.map((job) => ({
    id: job.id,
    title: job.title,
    location: job.location,
    status: job.status,
    closing_date: job.closing_date,
    application_count: applicationCounts[job.id] ?? 0,
  })),
  ...ADMIN_ONLY_JOBS,
].sort((a, b) => a.id - b.id);
