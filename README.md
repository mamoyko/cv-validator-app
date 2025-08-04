## 🧠 Architecture Overview

```text
┌────────────────────┐
│   Client (Next.js) │
│  - Form UI         │
│  - Upload CV (PDF) │
└────────┬───────────┘
         │
         ▼
┌────────────────────────────────┐
│         tRPC API Router        │
│  - saveUserData                │
│  - uploadPDFToSupabase         │
│  - validateWithOpenAI          │
└────────┬───────────────────────┘
         │
         ▼
┌───────────────────────────────┐       ┌──────────────────────────────┐
│ PostgreSQL (via Prisma ORM)   │       │ Supabase Storage (Bucket)    │
│ - users table                 │       │ - Stores uploaded PDF files  │
│ - cv_files table (PDF URLs)   │       └──────────────────────────────┘
└────────┬──────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ OpenAI API (GPT-4 / GPT-3.5 Turbo) │
│ - Extract text from PDF            │
│ - Compare with submitted form data │
└────────────────────────────────────┘

## 🧰 Tech Stack Used

### Frontend
- **Next.js** – Full-stack React framework
- **React** – UI components
- **tRPC** – End-to-end typesafe API communication

### Backend
- **Node.js** – JavaScript runtime
- **tRPC Router** – Handles form submission, validation, and file upload logic
- **OpenAI SDK** – Calls GPT-4 / GPT-3.5-turbo for AI-based CV validation
- **pdf-parse** – Extracts raw text from PDF files

### Database & Storage
- **Supabase PostgreSQL** – Hosted relational database
- **Prisma ORM** – Type-safe database access layer
- **Supabase Storage (Buckets)** – Stores uploaded PDF files securely

### Dev & Deployment Tools
- **Docker Compose** – Local development environment
- **.env** – Environment variable management
- *(Optional)* **Coolify / Railway / Render / Vercel** – Deployment options for backend/frontend

