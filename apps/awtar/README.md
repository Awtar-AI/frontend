# 🚀 Awtar AI: Navigation & Architecture Guide

Here is a quick map of the platform for testing, review, and engineering onboarding.

## 🧑‍💻 Applicant Portal (Candidate Side)

### 🔑 Getting Started
- **Login**: [http://localhost:3000/applicant/login](http://localhost:3000/applicant/login)
  - *Action*: Click "Login" (pre-filled) to enter the portal.

### 🧭 Core Features to Explore
1. **Find Jobs**: `/applicant/jobs`
   - Test the Search Bar, Category filters, and Page numbers.
2. **Apply for a Role**: Click any job in the list → Click "Apply Now".
   - Follow the 3-Step Wizard: Profile Review → Questions → Submit.
3. **Application Tracker**: `/applicant/applications`
   - See your submission status in a clean, visual list.
4. **Saved Jobs**: `/applicant/saved`
   - Check out your bookmarked roles and try the "Manage List" feature.
5. **Companies List**: `/applicant/companies`
   - Browse the employer directory and click a company to see its full profile.

### 📋 Key UI Checkpoints
- **Header**: Click the Bell 🔔 and User Profile 👤 icons for dropdown menus.
- **AI Match**: Look for the "% Match" badge on job cards.
- **Sidebar**: Use the left sidebar to jump between all modules instantly.

---

## 🏢 Recruiter Portal (Employer Side)

The Recruiter Portal is an AI-first dashboard designed for HR professionals and hiring managers to manage talent, optimize job listings, and leverage **Awtar AI** for deep hiring insights.

### 📁 Exhaustive Component-Level Breakdown (`app/(platform)/recruiter/`)

This directory follows a strict component architecture mapped directly to Next.js file-based routing.

#### 1. Core Layout & Global UI
- **`layout.tsx`**  
  The root wrapper for the recruiter authenticated state. It handles the injection of the `RecruiterSidebarNav` alongside children components, ensuring the layout does not unmount during client-side navigation.
  
- **`_components/AwtarLogo.tsx`**  
  An isolated, reusable SVG logo component utilized across the header and modals.

- **`_components/RecruiterSidebarNav.tsx`**  
  The primary vertical navigation pane. 
  * **Explainer**: Implements Next.js `usePathname` to actively highlight the user's current section via dynamic Tailwind utility classes. Maps through an array of `tabs` rendering `lucide-react` icons (Home, FilePlus, User, etc.) aligned with `next/link` components for fast client-side SPA routing.

#### 2. AI Modals
- **`_components/modals/AIGenerateModal.tsx`**
  * **Explainer**: An interactive, visually engaging modal component. Simulates Awtar AI generating a job description via a synthetic `setInterval` progress tracking hook. Employs complex stacked Tailwind classes (`animate-ping`, `backdrop-blur-sm`, `zoom-in-95`) to create a floating popup containing pulse-animations, a progress bar, and a generated placeholder interface.

#### 3. Main Application Routes (`(main)/`)
The `(main)` folder uses Next.js Route Groups strictly for mapping UI layout state across different routes without affecting the actual URL structure.
  
- **`profile/page.tsx`**  
  * **Explainer**: Renders the authenticated Recruiter’s personal Account Settings, login credentials, and user data interface.
  
- **`company/page.tsx`**  
  * **Explainer**: Employer Branding page. Contains the UI logic for updating the company's description, location, and metadata fields visible to Applicants.

- **`team/page.tsx`**  
  * **Explainer**: Allows the lead Recruiter to manage internal user permissions, inviting other hiring managers to collaborate.

- **`messages/page.tsx`**  
  * **Explainer**: The internal direct-messaging inbox simulating chat threads with specific candidates regarding their applications.

#### 4. The Talent Intelligence Suite (`talent/`)
The talent namespace is the "engine" of the recruiter platform. It processes candidate data through Awtar's analysis views.

- **`talent/page.tsx`** (Talent List Dashboard)
  * **Explainer**: The primary candidate feed. It initiates a simulated local state array of `TALENTS`, mapping through candidates dynamically. Features paginated routing (`ITEMS_PER_PAGE`), location/skills filter dropdown buttons, and rendering of individual candidate summary cards detailing: Title, Rate, Remote/Onsite toggles, and UI triggers (`toggleSave`).
  
- **`talent/[id]/page.tsx`** (Individual Profile Base)
  * **Explainer**: The core overview layout wrapper capturing the dynamic `[id]` parameter. Used as the jumping off point to view a candidate's resume timeline.

- **`talent/[id]/trust-score/page.tsx`** (Trust & Verification Metrics)
  * **Explainer**: A highly granular dashboard rendering the candidate's `CANDIDATE` security background profile via the NeuraParser v4.2.0 engine mock.
  * **Features**: Displays an SVG-powered circular radial progress meter reflecting the "Trust Score" (e.g., 88%). Maps through risk flags (Gap in Employment, Relocation Discrepancies) styling them dynamically via `severityStyles` (amber, info, clear). Renders a "Verification Breakdown" tracker showing the confidence progress bars for Education and Employment history validations.

- **`talent/[id]/xai-analysis/page.tsx`** (Explainable AI Insights)
  * **Explainer**: Evaluates why Awtar AI matched the applicant to a specific posting. Renders UI breaking down exact percentage matches on Hard Skills vs. Soft Skills and lists any identified discrepancies so the recruiter can manually review.

---
**Happy Testing!**
