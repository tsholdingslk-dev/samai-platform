# SAM AI - Project Vision Document

## 1. Project Vision

SAM AI is not a chatbot. It is a **Personal AI Operating System** — a unified workspace where every AI capability is controlled from one chat interface. Every project has its own isolated context, but the interface stays the same. The platform is built around YOUR daily workflow, not generic users. It is private by default, modular by design, and powered by a centralized API hub that can route to any AI provider.

---

## 2. Core Foundation Rules

### Core Rule #1: Contextual Chat OS
- One main chat workspace.
- Every project has its own isolated context (files, knowledge base, prompts, tools).
- Switching projects automatically loads the correct context, but the chat interface never changes.

### Core Rule #2: Centralized API Hub
- Every AI request flows through a single API Hub.
- All provider keys, quotas, statuses, priorities, and failover logic are managed in one place.
- Adding a new provider requires only a new connector in the Hub, not changes across the app.

### Core Rule #3: Plug-in Modular Architecture
- Every capability is a standalone plug-in module.
- Modules can be installed, updated, or removed independently.
- Core modules: PDF, Translation, Coding, Image, Video, Voice.

### Core Rule #4: Workflow-Based Design
- Build only the 10% of features you actually use daily.
- Prioritize speed and simplicity over feature bloat.
- Every module must solve a real repeated task in under 5 minutes.

### Core Rule #5: Private by Default
- All projects, API keys, knowledge bases, and files belong only to you.
- Nothing is shared unless you explicitly enable sharing.

---

## 3. System Architecture

```
┌─────────────────────────────────────────┐
│              Frontend (Next.js)         │
│   Single Chat Interface (Core Rule #1)  │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│          API Hub (Backend)              │
│   - Request Router                      │
│   - Provider Management                 │
│   - Failover / Load Balancing           │
│   - Rate Limiting / Quota Tracking      │
└────────────────────┬────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐
   │ Gemini  │ │ InferX  │ │Groq/    │
   │         │ │/DeepSeek│ │OpenRouter│
   └─────────┘ └─────────┘ └─────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│         Module Layer                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ Project │ │  PDF &  │ │ Coding  │  │
│  │  Brain  │ │Translate│ │ Module  │  │
│  └─────────┘ └─────────┘ └─────────┘  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ Media & │ │ Voice   │ │  Image  │  │
│  │ Content │ │Workspace│ │ Module  │  │
│  └─────────┘ └─────────┘ └─────────┘  │
└─────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│         Knowledge Base (RAG)            │
│  - Uploaded PDFs, Docs, Code            │
│  - Vector Store                         │
│  - Project-specific embeddings          │
└─────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│         Database (MySQL)                │
│  - Users, Projects, Chats, Files        │
│  - API Keys, Provider Configs           │
│  - Module States                        │
└─────────────────────────────────────────┘
```

---

## 4. Modules Specification

### 4.1 Project Brain (Core)
- RAG-based knowledge retrieval from your own files.
- Auto-indexes uploaded PDFs, documents, and code snippets.
- No model retraining required — uses vector embeddings.
- Project-specific context isolation.

### 4.2 API Hub (Core)
- Multi-provider router (Gemini, InferX, Groq, OpenRouter).
- Failover and load balancing.
- Per-provider quota tracking and status monitoring.
- Unified interface for all modules.

### 4.3 Coding Module
- Generate code in React, PHP, Python, etc.
- Connect to APIs, run localhost, fix errors.
- Deploy guides and best practices.
- Code snippet library with project-specific context.

### 4.4 PDF & Translation Module
- Extract text from PDFs, DOCX, TXT.
- Translate between Tamil, Sinhala, English.
- Data extraction and summarization.
- Batch processing support.

### 4.5 Media & Content Module
- Social media templates (Facebook, Instagram, YouTube).
- Auto-resize to 1:1, 9:16, 16:9.
- Caption generation.
- Video/Image prompt engineering.

### 4.6 Voice Workspace
- Voice-first input/output.
- Speech-to-text for hands-free operation.
- Text-to-speech for AI responses.
- Multi-language support (Tamil, English, Sinhala).

### 4.7 Image Module (Future)
- Image generation via Imagen or similar.
- Image editing and transformation.
- Prompt-based image creation.

### 4.8 Video Module (Future)
- Video generation via Veo or similar.
- Video analysis and transcription.
- Template-based video creation.

---

## 5. Database Schema

### Users
- id, email, password_hash, role, created_at

### Projects
- id, user_id, title, type, context (JSON), created_at

### Chats
- id, project_id, role, content, files (JSON), timestamp

### Files
- id, project_id, filename, file_type, file_path, extracted_text, created_at

### API_Providers
- id, name, api_key, base_url, model, status, priority, quota_used, quota_limit, created_at

### Modules
- id, project_id, module_type, config (JSON), enabled, created_at

---

## 6. Development Roadmap

### Phase 1: Foundation (Current)
- [x] Basic chat interface
- [x] User authentication (JWT)
- [x] Project management
- [x] AI integration (InferX/Gemini)
- [x] File upload UI

### Phase 2: API Hub + Project Brain
- [ ] Centralized API Hub backend
- [ ] Multi-provider router with failover
- [ ] Vector store for RAG
- [ ] Auto-indexing of uploaded files
- [ ] Project-specific context loading

### Phase 3: Core Modules
- [ ] PDF & Translation module
- [ ] Coding module
- [ ] Voice workspace
- [ ] Media & Content module

### Phase 4: Advanced Features
- [ ] Image module
- [ ] Video module
- [ ] Sharing and collaboration
- [ ] Analytics and usage tracking

### Phase 5: Polish
- [ ] Performance optimization
- [ ] Offline mode
- [ ] Mobile responsive design
- [ ] Export/import projects

---

## 7. Technology Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS (planned)
- Zustand / Context API for state

### Backend
- FastAPI
- SQLAlchemy ORM
- JWT Authentication
- Python-multipart for file uploads
- PyPDF2, docx2txt, SpeechRecognition, MoviePy

### AI/ML
- InferX (DeepSeek) - Primary
- Gemini 1.5 Pro - Fallback
- Future: Groq, OpenRouter

### Database
- MySQL (XAMPP)
- Future: Vector store (Chroma/Qdrant) for RAG

### Hosting
- Local development: XAMPP + Uvicorn
- Future: Docker + Cloud deployment

---

## 8. Non-Negotiable Principles

1. **Speed over features** — Every task must be completable in under 5 minutes.
2. **Single interface** — Never leave the chat to use a tool.
3. **Your data stays yours** — Private by default, no cloud sync unless you choose it.
4. **Modular always** — Never hardcode a feature into the core.
5. **Workflow-first** — Build for YOUR tasks, not hypothetical users.

---

## 9. Next Steps

1. Finalize this vision document.
2. Build API Hub as the new backend core.
3. Implement Project Brain with RAG.
4. Develop modules one by one, starting with PDF & Translation.
5. Test each module independently before integration.

---

*Document Version: 1.0*
*Last Updated: 2026-08-05*
