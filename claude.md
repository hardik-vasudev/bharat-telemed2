Bharat Telemed is Telemedicine ecosystem and here were are creating a doctor dashbaord themes which we will use here are light greenish themes and more .
When i said to you create the detailed readme files too in readme folder
🏛 Codebase Philosophy

Clarity over cleverness → write code that’s easy to understand, not just smart.

Consistency everywhere → no matter who writes it, code should look like one person wrote it.
Maintian Proffesional COdebase which is consistent and create independent files whenever required.

Future-ready → design components & patterns for scale, localization, and upcoming features.

Accessibility-first → every feature must support patients & doctors of all abilities.

Performance is a feature → always optimize for speed & responsiveness.

⚙️ Tech Stack Standards

Framework: Next.js (App Router) + React 18 + TypeScript

Styling: Tailwind CSS + packages/ui shared component library

State Management: React Query (server state) + Context (local state)

Forms: React Hook Form + Zod (validation)

UI Components: shadcn/ui (wrapped in shared ui package for consistency)

Icons: Lucide-react (all icons must come from here unless custom)

Charts/Graphs: Recharts

Testing: Jest + React Testing Library + Playwright (e2e)

Linting & Formatting: ESLint + Prettier + Stylelint (strict configs)

🗂 Project Structure
/apps
  /doctor-dashboard   → Main Next.js frontend
/packages
  /ui                 → Shared component library (buttons, inputs, cards, modals)
  /types              → Shared TypeScript types
  /utils              → Shared helpers (date, formatting, API clients)


Every new UI element must be added to packages/ui if reusable.

Use absolute imports (@/components/...) instead of relative imports.

Keep pages minimal → business logic & UI live in components, not in page.tsx.

🎨 UI/UX Standards

Must follow modern professional dashboards (clean spacing, semantic typography).

Animations → subtle, smooth, never distracting. Use Framer Motion.

Layouts → always grid/flex-based, responsive-first.

Accessibility:

Use semantic HTML tags.

ARIA attributes for all interactive elements.

Minimum contrast ratio: 4.5:1.

Dark mode support required for all components.

🧪 Testing Requirements

Unit Tests: Required for all utils and components (≥ 80% coverage).

Integration Tests: For API interactions and state logic.

E2E Tests: For critical user journeys (login → video consult → prescription).

Every PR must pass CI tests before merging.

🔐 Security & Privacy

All patient data must be mocked in dev environments.

No hardcoded credentials, tokens, or API keys.

Follow HIPAA/GDPR alignment: patient info is sensitive by default.

Only fetch necessary data; avoid over-fetching.

📝 Git & Branching

Main branch = always production-ready.

Branch naming:

feature/<short-desc> → new features

fix/<short-desc> → bug fixes

chore/<short-desc> → tooling/infra updates

PRs must:

Be reviewed by at least 1 senior contributor.

Include updated tests/docs.

Pass CI/CD pipeline checks.

📄 Documentation

Every new component → must include a Storybook story.

Every new feature → add a doc in readme/ explaining design & usage.

All props in shared components → documented with JSDoc.

API calls → typed with full Zod schemas.
