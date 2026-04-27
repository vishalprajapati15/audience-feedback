# Audience Feedback

Audience Feedback is a small full-stack Next.js (App Router + TypeScript) project that collects, suggests, and moderates short messages from users. It includes serverless API routes, authentication (NextAuth), email verification, and a lightweight MongoDB integration.

**Main features**
- Submit and moderate user messages
- Suggest messages based on content
- Sign-up / sign-in flow with verification email
- Server-side validation with Zod schemas
- Reusable UI components and a simple dashboard

**Tech stack**
- Next.js (App Router) + TypeScript
- NextAuth for authentication
- MongoDB (via a small `dbConnect` helper)
- Zod for request validation
- React + custom UI primitives in `src/components/ui`

## Quick Start

Prerequisites: Node.js 18+, npm (or pnpm/yarn) and a MongoDB instance.

1. Install dependencies

```bash
npm install
```

2. Create a `.env.local` in the project root and provide the environment variables used by the app (examples below).

3. Run the development server

```bash
npm run dev
```

Open http://localhost:3000

## Environment Variables
Create `.env.local` with at least:

- `MONGODB_URI` — MongoDB connection string
- `NEXTAUTH_URL` — e.g. `http://localhost:3000`
- `NEXTAUTH_SECRET` — a random secret for NextAuth
- SMTP settings for sending verification emails (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) or use a provider integration
- `VERIFICATION_FROM_EMAIL` — the From address for verification emails

Adjust additional variables as required by your deployment/provider.

## Project Structure
Top-level important files and folders:

- `src/app` — Next.js App Router pages and API routes
	- `src/app/api` — serverless routes (see API Endpoints)
- `src/components` — React UI components and primitives
- `src/context/AuthProvider.tsx` — authentication context
- `src/lib/dbConnect.ts` — database connection helper ([src/lib/dbConnect.ts](src/lib/dbConnect.ts))
- `src/model/user.model.ts` — user model ([src/model/user.model.ts](src/model/user.model.ts))
- `src/schemas` — Zod request/response schemas
- `emailTemplets` — verification email templates ([emailTemplets/VerificationEmail.tsx](emailTemplets/VerificationEmail.tsx))

Example important files:

- [src/app/page.tsx](src/app/page.tsx)
- [src/app/(auth)/sign-in/page.tsx](src/app/(auth)/sign-in/page.tsx)
- [src/app/(auth)/sign-up/page.tsx](src/app/(auth)/sign-up/page.tsx)

### Folder structure
```
.
├─ components.json
├─ eslint.config.mjs
├─ next-env.d.ts
├─ next.config.ts
├─ package.json
├─ postcss.config.mjs
├─ README.md
├─ tsconfig.json
├─ emailTemplets/
│  └─ VerificationEmail.tsx
├─ public/
└─ src/
	├─ proxt.ts
	├─ app/
	│  ├─ globals.css
	│  ├─ layout.tsx
	│  ├─ (app)/
	│  │  ├─ layout.tsx
	│  │  ├─ page.tsx
	│  │  └─ dashboard/
	│  │     └─ page.tsx
	│  ├─ (auth)/
	│  │  ├─ sign-in/
	│  │  │  └─ page.tsx
	│  │  ├─ sign-up/
	│  │  │  └─ page.tsx
	│  │  └─ verify/
	│  │     └─ [username]/
	│  │        └─ page.tsx
	│  ├─ api/
	│  │  ├─ accept-message/
	│  │  │  └─ route.ts
	│  │  ├─ auth/
	│  │  │  └─ [...nextauth]/
	│  │  │     ├─ options.ts
	│  │  │     └─ route.ts
	│  │  ├─ check-username-unique/
	│  │  │  └─ route.ts
	│  │  ├─ delete-message/
	│  │  │  └─ [message-id]/
	│  │  │     └─ route.ts
	│  │  ├─ get-messages/
	│  │  │  └─ route.ts
	│  │  ├─ send-message/
	│  │  │  └─ route.ts
	│  │  ├─ sign-up/
	│  │  │  └─ route.ts
	│  │  ├─ suggest-messages/
	│  │  │  └─ route.ts
	│  │  └─ verify-code/
	│  │     └─ route.ts
	│  └─ u/
	│     └─ [username]/
	│        └─ page.tsx
	├─ components/
	│  ├─ MessageCard.tsx
	│  ├─ Navbar.tsx
	│  └─ ui/
	│     ├─ alert-dialog.tsx
	│     ├─ button.tsx
	│     ├─ card.tsx
	│     ├─ carousel.tsx
	│     ├─ form.tsx
	│     ├─ input.tsx
	│     ├─ label.tsx
	│     ├─ separator.tsx
	│     ├─ switch.tsx
	│     └─ textarea.tsx
	├─ context/
	│  └─ AuthProvider.tsx
	├─ data/
	│  └─ messages.json
	├─ helper/
	│  └─ sendVerificationEmails.ts
	├─ lib/
	│  ├─ dbConnect.ts
	│  ├─ resend.ts
	│  └─ utils.ts
	├─ model/
	│  └─ user.model.ts
	├─ schemas/
	│  ├─ acceptMessageSchema.ts
	│  ├─ messageSchema.ts
	│  ├─ signInSchema.ts
	│  ├─ signUpSchema.ts
	│  └─ verifySchema.ts
	└─ types/
		├─ ApiResponse.ts
		└─ next-auth.d.ts
```

## API Endpoints
The app exposes a set of serverless routes under `src/app/api`. Key endpoints:

- `POST /api/accept-message` — accept (approve) a message (see [src/app/api/accept-message/route.ts](src/app/api/accept-message/route.ts))
- `POST /api/send-message` — create/send a new message ([src/app/api/send-message/route.ts](src/app/api/send-message/route.ts))
- `GET /api/get-messages` — list messages ([src/app/api/get-messages/route.ts](src/app/api/get-messages/route.ts))
- `POST /api/suggest-messages` — return suggested messages based on input ([src/app/api/suggest-messages/route.ts](src/app/api/suggest-messages/route.ts))
- `DELETE /api/delete-message/[message-id]` — delete a message ([src/app/api/delete-message/[message-id]/route.ts](src/app/api/delete-message/[message-id]/route.ts))
- `POST /api/sign-up` — register a new user and send verification code ([src/app/api/sign-up/route.ts](src/app/api/sign-up/route.ts))
- `POST /api/verify-code` — verify a user's code ([src/app/api/verify-code/route.ts](src/app/api/verify-code/route.ts))
- `POST /api/check-username-unique` — check username availability ([src/app/api/check-username-unique/route.ts](src/app/api/check-username-unique/route.ts))

Each route validates requests using Zod schemas located in `src/schemas` (for example, [src/schemas/messageSchema.ts](src/schemas/messageSchema.ts)).

## Authentication
Authentication is provided via NextAuth. See `src/app/api/auth/[...nextauth]/options.ts` for provider/session configuration.

## Emails
Verification and notification emails are implemented with a simple helper in `src/helper/sendVerificationEmails.ts` and templates in `emailTemplets/`.

## Development Notes
- Validation: Zod schemas in `src/schemas` enforce request shapes.
- Database: `src/lib/dbConnect.ts` centralizes MongoDB connection logic.
- Components: Shared UI primitives live in `src/components/ui` for reuse across pages.

## Scripts
- `npm run dev` — run in development
- `npm run build` — build for production
- `npm run start` — run production build

## Contributing
PRs and issues welcome. Suggested workflow:

1. Fork the repo
2. Create a feature branch
3. Open a pull request with a clear description

## License
This repository does not include a license file. Add one (for example, MIT) if you intend to make the code open source.

---

If you want, I can also:

- Add a sample `.env.example` file
- Add a short Postman collection or curl examples for the API
- Add CI scripts for linting/tests

Tell me which of those you'd like next.
