# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Environment Setup
```bash
cp .env.example .env.local
# Fill in required environment variables
npm install
npm run dev
```

### Email Configuration (Resend)
The app uses Resend for email delivery with custom domain setup:

- **Domain**: papromakeovers.com (configured with SPF, DKIM, DMARC)
- **From Address**: bookings@papromakeovers.com  
- **Reply-To**: papromakeroversstudios@gmail.com
- **Features**: HTML + plain text emails, delivery tracking

**DNS Records Required:**
- MX: `send.papromakeovers.com` → `feedback-smtp.eu-west-1.amazonses.com` (priority 10)
- TXT SPF: `send` → `"v=spf1 include:amazonses.com ~all"`
- TXT DKIM: `resend._domainkey` → (provided by Resend)
- TXT DMARC: `_dmarc` → `v=DMARC1; p=none; rua=mailto:papromakeroversstudios@gmail.com`

## Architecture Overview

### Project Structure
This is a Next.js 15 App Router application for PaproMakeovers, a makeup artist booking website with:

- **Frontend**: React 19 with TypeScript, Tailwind CSS v4, App Router
- **Backend**: Next.js API routes for booking and availability management  
- **Database**: Supabase with PostgreSQL (tables: `availability`, `bookings`)
- **External Services**: EmailJS for notifications, Zoho for invoicing

### Key Components
- `src/app/page.tsx` - Main landing page with services showcase
- `src/app/admin/page.tsx` - Admin interface for availability management
- `src/components/BookingForm.tsx` - Client booking form
- `src/components/Calendar.tsx` - Availability calendar display

### API Architecture
- `POST /api/booking` - Process new bookings with conflict prevention
- `GET/POST /api/availability` - Manage date/time availability slots

The booking flow uses optimistic concurrency control:
1. Check slot availability
2. Insert booking record
3. Remove time slot from availability
4. Send email notification and create draft invoice

### Database Schema
- `availability` table: date → slots array mapping
- `bookings` table: customer details with unique constraint on (date, time)

### External Integrations
- **EmailJS**: Booking confirmations via browser API
- **Zoho Invoice**: Draft invoice creation via REST API
- **Supabase**: Database with service role for admin operations

## Environment Variables

### Required for Full Functionality
- `ADMIN_PASSCODE` - Simple passcode for admin access
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Database access
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side database operations
- `RESEND_API_KEY` - Email delivery via Resend

### Optional Services  
- `ZOHO_ORG_ID` / `ZOHO_ACCESS_TOKEN` - Invoice generation
  - Sign up at https://www.zoho.com/invoice/
  - Create OAuth app for access token
  - Get Organization ID from account settings

## Development Notes

### Database Setup
Run `supabase.sql` to create required tables. The schema includes:
- Availability slots per date
- Booking records with conflict prevention
- Optional RLS policies for security

### Admin Interface
Access `/admin` with the `ADMIN_PASSCODE` to manage availability. Uses simple passcode protection that should be replaced with proper authentication for production.

### Color Scheme
The site uses a warm, beauty-focused palette:
- Primary: `#b49b82` (warm brown)
- Secondary: `#d4b896` (light brown) 
- Background: `#faf8f5` (cream)
- Text: `#4a4037` (dark brown)