# EventLoop

EventLoop is an event management platform designed for a small community business, with a special focus on organising and sharing **tech events and networking opportunities** with its members. It allows community members to easily browse upcoming events, express their interest by signing up, and add events to their personal Google Calendars. Designated staff members have administrative privileges to create, manage, and update event listings.

## Live Demo

You can access the live deployed application here: [https://eventl-00-p.vercel.app/](https://eventl-00-p.vercel.app/)

## Video Walkthrough

[Link to Video Walkthrough - To Be Added]

## Features Implemented

**Core Functionality:**

- **Public Event Listing:** Browse a list of all available events on the `/events` page.
- **Event Detail View:** View comprehensive details for a single event on `/events/:id`.
- **User Registration & Login:** Community members can register for an account (`/register`) and log in (`/login`) to access personalised features.
- **User Event Sign-up:** Authenticated users can sign up for events they are interested in.
- **User Account Page (`/account`):** Logged-in users can view a list of events they have signed up for. (Future enhancements: full user profile).
- **Add to Google Calendar:** After a user signs up for an event, an option becomes available to easily add the event to their personal Google Calendar using a pre-filled web intent link.
- **Staff Authentication:** Secure login for staff members using email and password credentials, leveraging `sidebase/nuxt-auth` with the Credentials Provider.
- **Staff Dashboard (`/staff/dashboard`):**
  - A protected area accessible only to logged-in staff members.
  - **Event Creation:** Staff can create new events with various details (title, description, start/end times, location, image URL).
  - **Event Management:** Staff can view, edit, and delete existing events.

**Additional Platform Features:**

- **Responsive Design:** The application interface is designed to be responsive and work well across various screen sizes (desktop, tablet, mobile).
- **Social Sharing:** Users can share event details on popular social media platforms directly from the event page.
- **Database-backed User Sessions:** User authentication sessions are securely managed and stored in the PostgreSQL database using the `@auth/prisma-adapter`.
- **Robust API Backend:** A comprehensive set of RESTful API endpoints built with Nuxt 3's Nitro server handles all event management, user registration, and sign-up logic.
- **Input Validation:** Server-side data validation using Zod ensures data integrity for API requests.

## Tech Stack

- **Core Framework:** [Nuxt 3](https://nuxt.com/) (v3.16.2) with [Vue 3](https://vuejs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (hosted on [Neon](https://neon.tech/))
- **ORM:** [Prisma](https://www.prisma.io/) (v6.6.0) - Used for database schema management, migrations, and type-safe queries.
- **Authentication:** [Sidebase Nuxt Auth](https://sidebase.io/nuxt-auth/getting-started) (v0.10.1) - Leverages NextAuth.js v4 core (`@auth/core` v0.39.0) with:
  - Credentials Provider for email/password login.
  - `@auth/prisma-adapter` (v2.8.0) for database session storage.
- **UI Components & Styling:**
  - [Nuxt UI](https://ui.nuxt.com/) (v2.17.0) - Component library built on top of Headless UI and Tailwind CSS.
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework (via Nuxt UI).
  - [Nuxt Icon](https://github.com/nuxt/icon) (v1.12.0) for SVG icons (using Heroicons and Simple Icons).
  - [Google Fonts](https://fonts.google.com/) (via `@nuxtjs/google-fonts` v3.2.0).
- **API Layer:** Built with Nuxt 3's [Nitro server engine](https://nitro.unjs.io/) (`/server/api` routes). Includes security features like rate limiting on sensitive endpoints (e.g., user registration) using [nuxt-rate-limit](https://github.com/timb-103/nuxt-rate-limit) (v1.2.0).
- **Data Validation:** [Zod](https://zod.dev/) (v3.24.3) for robust schema validation on backend API requests.
- **Utility Libraries:**
  - [date-fns](https://date-fns.org/) (v4.1.0) for date formatting and manipulation.
  - [bcrypt](https://www.npmjs.com/package/bcrypt) (v5.1.1) for password hashing.
  - [vue-social-sharing](https://github.com/nicolasbeauvais/vue-social-sharing) (v4.0.0-alpha4) for social media sharing functionality.
- **Deployment:**
  - Application Hosting: [Vercel](https://vercel.com/)
  - Database Hosting: [Neon](https://neon.tech/)
- **Development Tooling:**
  - [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/command-reference) for database migrations and client generation.

## Local Setup Instructions

Follow these steps to set up and run the project locally:

**1. Prerequisites:**

- [Node.js](https://nodejs.org/) (LTS version recommended, e.g., v18 or v20)
- [npm](https://docs.npmjs.com/cli/v7/commands/npm-install)
- [Git](https://git-scm.com/)
- A local [PostgreSQL](https://www.postgresql.org/download/) server instance.

**2. Clone the Repository:**

```bash
git clone https://github.com/hessam-0/EVENTL00P.git
cd EVENTL00P
```

**3. Install Dependencies:**

Using npm:

```bash
npm install
```

**4. Environment Variables:**

Create a `.env` file in the root of the project. Add the following variables:

```env
# .env

# PostgreSQL Connection String
# Example: DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
DATABASE_URL="your_local_postgresql_connection_string"

# Authentication Secret for Nuxt Auth
# Generate a strong, random string (e.g., using openssl rand -hex 32)
AUTH_SECRET="a_very_strong_and_random_secret_key_for_jwt_signing"

# Authentication Origin (for local development, ensure it matches your dev server URL)
AUTH_ORIGIN="http://localhost:3000/api/auth"
```

- Replace `"your_local_postgresql_connection_string"` with your actual local PostgreSQL connection string.
- Generate a secure `AUTH_SECRET`. You can use an online generator or a command like `openssl rand -base64 32`.

**5. Database Setup:**

Ensure your local PostgreSQL server is running.

- **Apply Migrations:** This will create the database schema based on `prisma/schema.prisma`.

  ```bash
  npx prisma migrate dev
  ```

  (You might be prompted to name the migration if it's the first one for a new change).

- **Seed the Database:** This will populate the database with initial data, including a staff user and sample events, as defined in `prisma/seed.ts`.
  ```bash
  npx prisma db seed
  ```

**6. Run the Development Server:**

```bash
npm run dev
```

**7. Access the Application:**

The application should now be running and accessible at [http://localhost:3000](http://localhost:3000).

## Testing Approach

Throughout the development process, iterative manual testing was performed across all implemented features to ensure functionality and user experience met requirements. Key user flows, including event creation, event viewing, user registration, login, and event sign-ups, have been thoroughly tested.
Formal unit tests with Vitest are planned in the next sprint, they had to be pushed back due to some minor albeit time consuming UI roadblocks. The focus for this phase was on delivering core functionality, now I will be refining existing features and adding new ones.

## Test Account Details

You can use the following pre-seeded staff account to test staff-specific functionalities:

- **Email:** `admin@eventloop.com`
- **Password:** `password123`

Regular users can register new accounts through the registration page. The seed script also creates a sample regular user:

- **Email:** `user@example.com`
- **Password:** `password456`

## Known Issues / Future Enhancements

- **Mobile View Carousel:** The horizontal scrolling event view on mobile needs clearer visual cues.
- **UI/UX Refinements:** Further improvements to the overall responsiveness, dynamic UI elements, accessibility and styling will be implemented.
- **Search & Filtering:** Search and filtering feature for events are planned for a future release.
- **User Profile Expansion:** Develop full user profile pages beyond the current event sign-up list.
- **Theme Customisation:** Implement dark mode / light mode options.
- **Visual Enhancements:** Incorporate illustrations (e.g., from [Storyset](https://storyset.com/)) to improve visual appeal.
- **Event Comments/Discussion:** Add functionality for users to comment on events.
- **Enhanced "Interest" Feature:** Develop more backend functionality around expressing interest in events, potentially for notifications or recommendations.
