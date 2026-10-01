# Mentor AI - Mock Interview Platform

A full-stack AI-powered mock interview platform where candidates have a real, dynamic voice conversation with an AI interviewer. Built with Next.js, MongoDB, and Vapi.

## Features
- **Custom JWT Authentication**: Simple email/password sign up with profile details (Job Role, Experience Level).
- **Dynamic Voice Interviews**: Powered by Vapi.ai, the AI listens, responds, asks follow-ups, and adapts in real-time. No static question banks.
- **Multiple Interview Types**: Practice Behavioral, Technical, System Design, or HR/Culture Fit interviews.
- **Instant Feedback Reports**: Generates a comprehensive feedback report immediately after the session with scores, strengths, weaknesses, and a question-by-question breakdown.
- **Dashboard & History**: Track past performance and review detailed reports.
- **Responsive UI**: "Claude-style" cream aesthetic that is fully mobile responsive.

## Tech Stack
- **Frontend & Backend**: Next.js (App Router, API Routes)
- **Database**: MongoDB (via Prisma ORM)
- **Voice AI**: Vapi.ai (Managed Voice Layer)
- **AI Graph Routing**: `@langchain/langgraph` (Bonus Feature)
- **Evaluation Engine**: Puter.js (GPT-4o-mini, powering LangGraph nodes)
- **Styling**: Pure CSS (Custom Design System, Mobile Responsive)

## Local Setup (Under 5 Commands)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create a `.env` file in the root directory and add the following:
```env
# Database
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/mentor?retryWrites=true&w=majority"


# JWT Secret for Auth
JWT_SECRET="your_super_secret_jwt_key_123"

# Vapi (Voice AI)
NEXT_PUBLIC_VAPI_PUBLIC_KEY="your_vapi_public_key"
```

### 3. Initialize the database
```bash
npx prisma db push
```

### 4. Run the development server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Architecture Decisions & Assignment Criteria Met

- **Strict Custom Auth**: Kept strictly to simple custom JWT (Email/Password) without external providers like OAuth or Magic Links to perfectly adhere to the prompt's strict requirements.
- **Dynamic Voice Loop**: Delegated real-time WebRTC audio handling and LLM latency optimization to **Vapi.ai**. The conversational loop is entirely unscripted—no hardcoded question banks. The AI listens, pushes back, and asks deep follow-ups based *only* on candidate answers.
- **Bonus Feature: LangGraph Pipeline**: We implemented the requested LangGraph bonus! Instead of processing the evaluation with a single, fragile monolithic prompt, the final call transcript is processed through a robust **Multi-Node LangGraph State Machine**:
  - `Node 1 (Evaluate Communication)`: Grades confidence and clarity.
  - `Node 2 (Evaluate Technical)`: Grades problem-solving depth.
  - `Node 3 (Synthesize Feedback)`: Merges scores, provides 3 actionable recommendations, and structures the exact JSON.
- **Edge Case Handling**: Implemented custom unhandled promise rejection catching to silence Vapi's natural "ejection" WebRTC disconnect errors, ensuring a completely crash-free Next.js experience.
