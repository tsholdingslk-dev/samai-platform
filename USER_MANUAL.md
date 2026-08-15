# SAM AI - User Manual

## 📋 Overview

SAM AI is a **Personal AI Operating System** — not just a chatbot, but a unified workspace where every AI capability is controlled from one chat interface. Every project has its own isolated context, but the interface stays the same. The platform is built around your daily workflow, is private by default, modular by design, and powered by a centralized API hub that can route to any AI provider.

---

## 🚀 Getting Started

### Prerequisites

1. **XAMPP** installed and running (MySQL service)
2. **Python 3.8+** installed
3. **Node.js 18+** installed
4. **Git** (optional, for version control)

---

## ⚙️ Installation & Setup

### Step 1: Database Setup

1. Open **XAMPP Control Panel**
2. Start **MySQL** service
3. Open browser and go to `http://localhost/phpmyadmin`
4. The database `samai_db` will be created automatically on first run
5. Tables (`users`, `projects`, `chats`, `modules`, `api_providers`, `user_feedback`) are created automatically by SQLAlchemy

### Step 2: Backend Setup

```bash
cd C:\Users\ASUS\Desktop\xampp\htdocs\samai\backend

# Activate virtual environment (already created)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Edit .env and add your actual API keys:
# - GEMINI_API_KEY
# - INFERX_API_KEY
# - SECRET_KEY

# Run the backend server
python -m uvicorn main:app --reload
```

Backend will run on: **http://localhost:8000**

### Step 3: Frontend Setup

```bash
cd C:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## 🎯 Core Features

### 1. User Authentication
- **Register:** Create a new account with email and password
- **Login:** Access your account with JWT authentication
- **Profile:** View account info, role, and membership date
- **Logout:** Securely log out from any device

### 2. Project Management
- Create multiple chat projects
- Organize chats by type:
  - **General** - Everyday conversations
  - **Education** - Learning and studying
  - **Coding** - Programming and development
  - **Creator** - Content creation assistance
- Delete projects you no longer need
- Switch between projects seamlessly
- Each project has its own isolated context

### 3. Contextual Chat OS
- One main chat workspace for everything
- Project-specific context auto-loads when you switch projects
- Chat interface never changes — same UI for all tasks
- Chat history saved per project
- Voice input (Speech-to-Text) - Click the microphone icon
- Text-to-Speech - Click "Read Aloud" on AI responses

### 4. Multi-Modal File Upload
- Upload **images** (JPG, PNG, GIF, WEBP)
- Upload **documents** (PDF, DOCX, TXT) - text is extracted automatically
- Upload **audio** (MP3, WAV, OGG) - transcribed to text
- Upload **video** (MP4, AVI, MOV) - audio is extracted and transcribed
- Multiple files can be uploaded at once
- Preview attachments before sending

### 5. Centralized API Hub
- All AI requests flow through a single API Hub
- Multi-provider support: InferX (DeepSeek), Gemini, OpenRouter, Groq
- Automatic failover and load balancing
- Per-provider quota tracking and status monitoring
- Adding a new provider requires only a new connector in the Hub

---

## 📱 How to Use

### First Time Setup

1. **Open the app:** Go to `http://localhost:3000`
2. **Register:** Click "Create Account" and fill in your details
3. **Login:** Use your email and password to log in
4. **Start Chatting:** You'll be redirected to the chat dashboard

### Creating a New Chat Project

1. Click **"+ New Chat"** button in the sidebar
2. Enter a title for your project
3. Select a project type (1-4):
   - `1` - General
   - `2` - Education
   - `3` - Coding
   - `4` - Creator
4. Click OK - you'll be taken to the chat interface

### Chatting with SAM AI

1. Type your message in the input box at the bottom
2. Press Enter or click the send button (➤)
3. Wait for SAM AI to respond
4. Use the **microphone** (🎙️) to speak instead of typing
5. Click **"Read Aloud"** (🔊) to hear AI responses

### Uploading Files in Chat

1. Click the **📎 attachment icon** in the chat input area
2. Select one or more files:
   - **Images:** JPG, PNG, GIF, WEBP
   - **Documents:** PDF, DOCX, TXT
   - **Video:** MP4, AVI, MOV
   - **Audio:** MP3, WAV, OGG
3. Preview your attachments below the input box
4. Click **×** to remove an attachment
5. Type an optional message or just send the files
6. SAM AI will analyze the content and respond

**File Processing:**
- **PDF/DOCX/TXT:** Text is extracted and analyzed
- **Audio/Video:** Speech is transcribed to text using Google Speech Recognition
- **Images:** Acknowledged in chat (current model is text-only)

### Managing Projects

- **Switch projects:** Click any project in the sidebar
- **Delete project:** Click the **×** button next to the project name
- **View profile:** Click "Profile" in the sidebar footer
- **Toggle modules:** When inside a project, use the ON/OFF toggles in the sidebar

---

## 🧩 Modules

SAM AI has a plug-in modular architecture. Every capability is a standalone module. Access modules from the sidebar **Modules** link or from the chat layout.

### Available Modules

| Module | Path | Description |
|--------|------|-------------|
| 🤖 Autonomous Agents | `/modules/agents` | Plan, research, code, and execute multi-step tasks automatically |
| 🧠 Self Learning AI | `/modules/learning` | SAM AI learns from your feedback and adapts to your style |
| 📄 PDF & Translation | `/modules/pdf-translate` | Extract text from PDFs, DOCX, TXT. Translate Tamil/Sinhala/English |
| 💻 Coding Assistant | `/modules/coding` | Generate code, explain code, fix bugs, API connect guides, deploy help |
| 🎙️ Voice Workspace | `/modules/voice` | Transcribe audio, voice commands, text-to-speech |
| 🎬 Media & Content | `/modules/media` | Social media prompts, image/video prompts, resize guides |
| 🖼️ Image Studio | `/modules/image` | Generate prompts, edit images, resize, apply filters, add text |

### How to Use Modules

1. **From Chat Layout:** Click **Modules** in the sidebar footer
2. **Choose a module** from the dashboard grid
3. **Use the module** - each has its own tabbed interface
4. **Return to chat** - click "Back to Modules" or use sidebar

### Module Access Control

- When you create a new project, all modules are auto-created and enabled
- In the chat sidebar, you'll see an **"Active Modules"** section
- Toggle modules ON/OFF per project
- Disabled modules won't load their context for that project

---

## 🤖 Autonomous Agents (Step 3)

The Agent System transforms SAM AI from a chatbot into an autonomous assistant that can plan and execute complex tasks.

### Available Agents

| Agent | Description | Tools |
|-------|-------------|-------|
| 🧠 Planner | Breaks down complex tasks into actionable steps | analysis, decomposition, prioritization |
| 🔍 Researcher | Gathers and analyzes information from multiple sources | web_search, document_analysis, data_extraction |
| 💻 Coder | Generates, reviews, and fixes code in multiple languages | code_generation, code_review, debugging, documentation |
| 📊 Business Analyst | Analyzes business problems and creates strategies | market_analysis, financial_calc, report_generation |
| ✍️ Content Creator | Creates articles, scripts, and marketing content | writing, editing, seo_optimization, formatting |

### How to Use Agents

1. Go to **Modules → Autonomous Agents**
2. Enter your **goal/task** in the text area
3. Optionally add **context** as JSON (e.g., `{"language": "python"}`)
4. Toggle **"Use Planner Agent"** on/off:
   - **ON:** SAM AI creates a step-by-step plan, then executes each step
   - **OFF:** Direct execution without planning
5. Click **"Run Agent Task"**
6. View results: plan, steps completed, final result, execution time

### Example Tasks

- "Create a YouTube marketing plan for my AI app"
- "Write a Python script to scrape a website"
- "Analyze the market for a new mobile app"
- "Write a blog post about AI trends"

### Agent Flow

```
User Goal
    ↓
Planner Agent (optional)
    ↓
Task Breakdown
    ↓
Specialist Agent Selection
    ↓
Tool Execution
    ↓
Result Check
    ↓
Final Answer
```

---

## 🧠 Self Learning AI (Step 4)

SAM AI learns from your feedback and adapts to your preferences over time.

### How Learning Works

1. **User Interaction** → SAM AI responds
2. **Collect Feedback** → You rate the response (1-5 stars)
3. **Analyze Performance** → System identifies patterns
4. **Update Knowledge** → Preferences and knowledge base grow
5. **Improve Responses** → Future responses are personalized

### Features

- **User Preference Learning** - SAM AI learns your preferred response style
- **Knowledge Updates** - Your documents and conversations become part of the knowledge base
- **Response Quality Analysis** - Tracks what makes responses good or bad
- **Feedback Loop** - Continuous improvement based on your input
- **Personalized Behavior** - Adapts to your workflow
- **Workflow Optimization** - Learns which tools you use most

### How to Use Learning Features

1. Go to **Modules → Self Learning AI**
2. **Submit Feedback:**
   - Rate a response (1-5 stars)
   - Select category (quality, speed, accuracy, relevance)
   - Add feedback text
   - Click "Submit Feedback"
3. **Add Knowledge:**
   - Enter source (e.g., `user_document`, `conversation`)
   - Paste content
   - Add optional metadata JSON
   - Click "Add to Knowledge Base"
4. **View Stats:**
   - Average rating
   - Total feedback count
   - Learned preferences
   - Active preference tags

### Safety & Privacy

- ✅ **Human Control** - You decide what feedback to give
- ✅ **Memory Delete Option** - You can clear learned preferences
- ✅ **Data Privacy** - All data stays in your account
- ✅ **Approval Before Learning** - No automatic learning without your input

---

## 📄 PDF & Translation Module

### Extract Text
1. Go to **Modules → PDF & Translation**
2. Select **"Extract Text"** tab
3. Upload a document (PDF, DOCX, TXT)
4. Click **"Extract Text"**
5. View extracted text in the output area

### Translate Text
1. Select **"Translate"** tab
2. Enter text to translate
3. Select source language (Auto Detect, English, Tamil, Sinhala, Hindi)
4. Select target language
5. Click **"Translate"**
6. View translation result

---

## 💻 Coding Assistant Module

### Generate Code
1. Go to **Modules → Coding**
2. Select **"Generate"** tab
3. Describe what you want to build
4. Select language and optional framework
5. Click **"Generate Code"**
6. Copy the generated code

### Explain Code
1. Select **"Explain"** tab
2. Paste your code
3. Select language
4. Click **"Explain Code"**

### Fix Code
1. Select **"Fix"** tab
2. Paste your broken code
3. Optionally paste the error message
4. Select language
5. Click **"Fix Code"**

### API Connect
1. Select **"API Connect"** tab
2. Describe what API you want to connect
3. Select language
4. Click **"Get API Connect Guide"**

### Deploy Guide
1. Select **"Deploy"** tab
2. Select project type (React, PHP, Python, etc.)
3. Select deployment platform (Vercel, Netlify, Heroku, Localhost, etc.)
4. Click **"Get Deploy Guide"**

---

## 🎙️ Voice Workspace Module

### Voice Input
1. Go to **Modules → Voice**
2. Click the **microphone button** to start recording
3. Speak your message
4. Transcript appears automatically
5. Click **"Translate to Tamil"** if needed

### Audio File Transcription
1. Click **"Or upload audio file"**
2. Select an audio file (MP3, WAV, OGG)
3. Wait for transcription

### Text to Speech
1. Enter text in the **Text to Speech** section
2. Click **"Speak"**
3. SAM AI will speak the text aloud

---

## 🎬 Media & Content Module

### Social Media Prompt
1. Go to **Modules → Media**
2. Select **"Social Prompt"** tab
3. Choose platform (Facebook, Instagram, YouTube, Twitter)
4. Choose content type (Post, Reel, Story, Thumbnail)
5. Enter topic/description
6. Select tone (Professional, Casual, Funny, Inspirational, Promotional)
7. Click **"Generate Social Content"**

### Image Prompt
1. Select **"Image Prompt"** tab
2. Describe the image you want
3. Select style (Photorealistic, Digital Art, Anime, 3D Render, etc.)
4. Click **"Generate Image Prompt"**
5. Copy the prompt to use in Midjourney, DALL-E, or Stable Diffusion

### Video Prompt
1. Select **"Video Prompt"** tab
2. Describe the video scene
3. Select duration and style
4. Click **"Generate Video Prompt"**

### Resize Guide
1. Select **"Resize Guide"** tab
2. Select original and target aspect ratios
3. Select platform
4. Click **"Get Resize Guide"**

---

## 🖼️ Image Studio Module

### Generate Prompt
1. Go to **Modules → Image**
2. Select **"Generate Prompt"** tab
3. Describe the image
4. Select style
5. Click **"Generate Prompt"**

### Edit Instructions
1. Select **"Edit"** tab
2. Upload an image
3. Describe what you want to do
4. Click **"Get Edit Instructions"**

### Resize Image
1. Select **"Resize"** tab
2. Upload an image
3. Enter width and height
4. Click **"Resize Image"**
5. View and download the resized image

### Apply Filter
1. Select **"Filter"** tab
2. Upload an image
3. Select filter (Grayscale, Sepia, Blur, Brightness, Contrast)
4. Click **"Apply Filter"**
5. View the filtered image

### Add Text to Image
1. Select **"Add Text"** tab
2. Upload an image
3. Enter text, position, font size, and color
4. Click **"Add Text to Image"**
5. View the result

---

## 🔧 Configuration

### Backend Configuration (.env)

```env
# Database
DATABASE_URL=mysql+pymysql://root:@localhost:3306/samai_db

# AI API Keys
GEMINI_API_KEY=your_actual_gemini_api_key
INFERX_API_KEY=your_actual_inferx_api_key
OPENROUTER_API_KEY=your_openrouter_api_key  # Optional
GROQ_API_KEY=your_groq_api_key  # Optional

# JWT Secret (change this in production!)
SECRET_KEY=your_random_secret_key_here
```

### Getting API Keys

1. **Gemini API Key:**
   - Go to https://makersuite.google.com/app/apikey
   - Create a new API key
   - Copy and paste into `.env`

2. **InferX API Key:**
   - Go to https://inferx.net
   - Sign up and get your API key
   - Copy and paste into `.env`

3. **OpenRouter API Key (Optional):**
   - Go to https://openrouter.ai
   - Sign up and get your API key
   - Copy and paste into `.env`

4. **Groq API Key (Optional):**
   - Go to https://groq.com
   - Sign up and get your API key
   - Copy and paste into `.env`

---

## 🛠️ Troubleshooting

### Backend Issues

**Problem:** `ImportError: No module named 'fastapi'`
```bash
# Solution: Activate virtual environment first
venv\Scripts\activate
pip install -r requirements.txt
```

**Problem:** `Can't connect to MySQL server`
```bash
# Solution: Start MySQL from XAMPP Control Panel
# Ensure port 3306 is not blocked
```

**Problem:** `Database connection error`
```bash
# Solution: Verify DATABASE_URL in .env
# Default: mysql+pymysql://root:@localhost:3306/samai_db
```

**Problem:** `Module not found` for agents/learning
```bash
# Solution: Ensure backend directory is in Python path
# The app runs from backend/ directory, so imports should work
```

### Frontend Issues

**Problem:** `Port 3000 already in use`
```bash
# Solution: Kill the process or use different port
npx next dev --port 3001
```

**Problem:** `Module not found`
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Problem:** Speech Recognition not working
```bash
# Solution: Use Chrome or Edge browser
# Speech Recognition API is not supported in Firefox/Safari
```

---

## 📂 Project Structure

```
samai/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── models.py               # Database models (User, Project, Chat, Module, APIProvider)
│   ├── schemas.py              # Pydantic schemas for validation
│   ├── database.py             # Database connection setup
│   ├── security.py             # JWT authentication & password hashing
│   ├── ai_engine.py            # AI model integration (Gemini/InferX)
│   ├── api_hub.py              # Centralized API Hub with multi-provider failover
│   ├── project_brain.py        # RAG-based knowledge base per project
│   ├── agents/                 # Autonomous AI Agent System
│   │   ├── base.py             # Base agent class
│   │   ├── planner.py          # Task planning agent
│   │   ├── researcher.py       # Research agent
│   │   ├── coder.py            # Coding agent
│   │   ├── business.py         # Business analysis agent
│   │   ├── content.py          # Content creation agent
│   │   ├── executor.py         # Agent executor
│   │   └── router.py           # Agent router
│   ├── tools/                  # Agent tools
│   │   └── __init__.py         # Search, file, calculator, translator, analyzer
│   ├── learning/               # Self Learning AI System
│   │   ├── __init__.py         # Feedback, preferences, knowledge, analyzer
│   ├── routers/
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── project.py          # Project CRUD endpoints
│   │   ├── chat.py             # Chat endpoints with file uploads
│   │   ├── api_provider.py     # API provider management
│   │   ├── module.py           # Module management
│   │   ├── pdf_translate.py    # PDF extraction & translation
│   │   ├── coding.py           # Coding assistant
│   │   ├── voice.py            # Voice workspace
│   │   ├── media.py            # Media & content
│   │   ├── image.py            # Image studio
│   │   └── agents.py           # Agent system endpoints
│   ├── .env                    # Environment variables (SECRET!)
│   ├── .env.example            # Environment template
│   ├── .gitignore              # Git ignore rules
│   └── requirements.txt        # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx              # Root layout
    │   │   ├── page.tsx                # Home page
    │   │   ├── globals.css             # Global styles
    │   │   ├── login/page.tsx          # Login page
    │   │   ├── register/page.tsx       # Registration page
    │   │   ├── profile/page.tsx        # User profile
    │   │   ├── chat/
    │   │   │   ├── layout.tsx          # Chat dashboard with sidebar
    │   │   │   ├── page.tsx            # Empty chat state
    │   │   │   └── [projectId]/page.tsx # Chat session
    │   │   └── modules/                # Module pages
    │   │       ├── page.tsx            # Modules dashboard
    │   │       ├── agents/page.tsx     # Autonomous agents
    │   │       ├── learning/page.tsx   # Self learning AI
    │   │       ├── pdf-translate/page.tsx # PDF & translation
    │   │       ├── coding/page.tsx     # Coding assistant
    │   │       ├── voice/page.tsx      # Voice workspace
    │   │       ├── media/page.tsx      # Media & content
    │   │       └── image/page.tsx      # Image studio
    │   └── utils/
    │       └── api.ts                  # API client utilities
    ├── package.json
    └── tsconfig.json
```

---

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Projects
- `POST /projects/` - Create new project
- `GET /projects/` - List all user projects
- `DELETE /projects/{id}` - Delete a project

### Chat
- `POST /chat/{project_id}` - Send message and get AI response (supports text + file uploads)
- `GET /chat/{project_id}` - Get chat history

### Modules
- `POST /modules/` - Create module
- `GET /modules/project/{project_id}` - Get project modules
- `PUT /modules/{module_id}` - Update module
- `DELETE /modules/{module_id}` - Delete module

### PDF & Translation
- `POST /pdf-translate/extract-text` - Extract text from documents
- `POST /pdf-translate/translate` - Translate text

### Coding
- `POST /coding/generate` - Generate code
- `POST /coding/explain` - Explain code
- `POST /coding/fix` - Fix code
- `POST /coding/api-connect` - API connection guide
- `POST /coding/deploy` - Deployment guide

### Voice
- `POST /voice/transcribe` - Transcribe audio file
- `POST /voice/text-to-speech` - Text to speech info
- `POST /voice/process-voice-command` - Process voice command

### Media
- `POST /media/social-prompt` - Generate social media content
- `POST /media/image-prompt` - Generate image prompt
- `POST /media/video-prompt` - Generate video prompt
- `POST /media/resize-guide` - Get resize guide

### Image
- `POST /image/generate-prompt` - Generate image prompt
- `POST /image/edit` - Get image editing instructions
- `POST /image/resize` - Resize image
- `POST /image/filter` - Apply filter to image
- `POST /image/add-text` - Add text to image

### Agents
- `POST /agents/run` - Run agent task
- `GET /agents/available` - Get available agents
- `GET /agents/tools` - Get available tools
- `GET /agents/history` - Get agent execution history

### Self Learning
- `POST /learning/feedback` - Submit feedback
- `GET /learning/preferences` - Get learned preferences
- `POST /learning/knowledge` - Add knowledge
- `GET /learning/knowledge` - Get knowledge base
- `POST /learning/analyze` - Analyze response quality

### API Providers
- `POST /api-providers/` - Create provider
- `GET /api-providers/` - List providers
- `PUT /api-providers/{id}` - Update provider
- `DELETE /api-providers/{id}` - Delete provider
- `GET /api-providers/status` - Get provider status

### Health
- `GET /` - API info
- `GET /health` - Health check

---

## 🔒 Security Notes

1. **Never commit `.env` file** - It contains sensitive API keys
2. **Change SECRET_KEY** in production - Use a strong random string
3. **Use HTTPS** in production - JWT tokens should not be sent over HTTP
4. **Restrict CORS** - Update `allow_origins` in `main.py` for production
5. **Database credentials** - Use strong passwords in production
6. **Private by Default** - All projects, API keys, and knowledge bases belong only to you
7. **Module Control** - Disable modules you don't use per project

---

## 🚢 Deployment

### Backend Deployment

```bash
# Install production dependencies
pip install fastapi uvicorn sqlalchemy pydantic python-dotenv passlib[bcrypt] PyJWT

# Run with production server
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

Or deploy to **Vercel**, **Netlify**, or any Node.js hosting service.

---

## 📝 License

This project is developed for educational purposes.

---

**Built with ❤️ using FastAPI, Next.js, and AI**
