┌────────────────────┐
│     Client (Next.js)│
│  - Form UI          │
│  - Upload CV (PDF)  │
└────────┬────────────┘
         │
         ▼
┌──────────────────────────┐
│   tRPC Router (API)      │
│  - saveUserData          │
│  - uploadPDFToSupabase   │
│  - validateWithOpenAI    │
└────────┬─────────────────┘
         │
         ▼
┌─────────────────────────────┐       ┌─────────────────────────────┐
│ PostgreSQL (via Prisma)     │       │ Supabase Storage (Bucket)   │
│ - users table               │       │ - Store raw PDF files       │
│ - cv_files table (PDF URLs) │       └─────────────────────────────┘
│                             │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  OpenAI API (GPT-4 / GPT-3.5)│
│ - Compare Form vs Extracted  │
│   Text from PDF              │
└─────────────────────────────┘
