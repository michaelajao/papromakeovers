PaproMakeovers website built with Next.js App Router, Tailwind CSS, and a simple booking flow.

Getting started
1. Copy env and fill values:
```
cp .env.example .env.local
```
2. Run dev server:
```
npm run dev
```

Environment variables
- NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (optional for persistence)
- NEXT_PUBLIC_EMAILJS_SERVICE_ID / NEXT_PUBLIC_EMAILJS_TEMPLATE_ID / NEXT_PUBLIC_EMAILJS_PUBLIC_KEY (optional for email)
- ZOHO_ORG_ID / ZOHO_ACCESS_TOKEN (optional for invoice)
- ADMIN_PASSCODE (required to save availability from /admin)

Routes
- /            Landing page with services and booking form
- /admin       Manage availability (simple passcode protection)
- /api/availability  GET availability by month, POST to set
- /api/booking       Submit booking; emails and draft invoice if configured
