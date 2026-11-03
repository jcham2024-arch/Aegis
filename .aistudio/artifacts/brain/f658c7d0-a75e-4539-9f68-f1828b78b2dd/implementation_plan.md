# Aegis-Agent: Strict Java OOP & Multi-Provider Perchance Agentic Chat Engine

An agentic chat platform and orchestrator built around strict Java OOP architectural primitives (immutable Java Records, sealed interface hierarchies, monadic `Result<S, F>` failure containment) and a flexible multi-provider model router (Gemini, local Ollama, OpenAI, Anthropic Claude, and custom HTTP endpoints), wrapped in a Perchance-styled AI Character Chat interface with task-specific Card Creation.

> [!IMPORTANT]
> **Revised Architectural Directives**:
> 1. **Strict Java OOP & Records Architecture**: Data structures are modeled as immutable Java Records (`record CharacterCard(...)`, `record ChatThread(...)`, `record ModelRequest(...)`, `record ModelResponse(...)`). Fallible computations evaluate through sealed monadic `Result<Value, Failure>` containers.
> 2. **Multi-Provider API Model Router**: Sealed interface `sealed interface ModelProvider permits GeminiProvider, OllamaProvider, OpenAIProvider, ClaudeProvider, CustomHttpProvider`. The model router dynamically dispatches API calls to any cloud or local LLM endpoint using user-configured base URLs, API keys, and model identifiers.
> 3. **Perchance UI Fidelity**: Replicates the dark-themed Perchance AI Character Chat UI (left thread sidebar with 3-row bottom control grid, character header bar, speaker/mode pill bar above text input, and `send ➡️` / `⚒️ options` buttons).
> 4. **AI Task-Specific Card Creator**: Character cards serve as context loaders and system prompts. Includes an AI Assistant module that generates customized, task-specific character cards on demand.
> 5. **Top Menu IDE Suite**: Advanced modules (AST Rule Builder, Loom Thread Visualizer, Vision Inspector, Audit Ledger, Admin Console) are accessible via top menu bar dropdowns and the options modal.

---

## 1. Overview & Core Concept

### Architecture & Paradigm
- **Strict Java OOP & Functional Records**: Uses immutable records for state representations, sealed interface hierarchies for exhaustive pattern matching, and monadic result handling to prevent raw runtime exception throwing.
- **Universal Multi-Provider Model Router**: Server-side model routing engine that makes direct API calls to:
  - **Google Gemini API** (`@google/genai` SDK with `gemini-3.8-flash` / `gemini-4-argon`)
  - **Local Ollama Daemon** (`http://localhost:11434/api/generate` or custom Ollama URL)
  - **OpenAI / Claude / Custom API Proxies** (`/v1/chat/completions` with user API keys and custom base URLs)
- **Perchance Character Chat Interface**: A 1:1 visual match with Perchance AI Character Chat, supporting multi-character threads, message editing, response regeneration, narrator/anon speaker toggles, character card management, and chat backup export/import.
- **Task-Specific AI Card Creator**: An AI Assistant module that takes user task requirements and generates full character cards complete with system prompts, greeting messages, personality traits, and tool permissions.

---

## 2. User Experience & Visual Design

### Viewport & Spatial Composition
- **Dark Tactical Canvas**: Matches the exact Perchance dark theme (`#181818` / `#202020` background, `#2a2a2a` card panels, subtle 1px border dividers).
- **Left Sidebar ($280\text{px}$ width)**:
  - Top: `💬 new chat / character` + sidebar toggle button (`☰`).
  - Middle: Scrollable thread list with active character avatar, thread title (`Unnamed Thread`), character tag (`Chloe #1`), edit pencil, delete icon, and tag indicators.
  - Notice Box: Browser local storage / Firestore sync notice.
  - Bottom Grid Controls: 3 rows of compact dark action buttons:
    - Row 1: `⚙️ settings`, `❓ tips`, collapse button (`↖`)
    - Row 2: `🗑️ clear`, `💾 export`, `📁 import`
    - Row 3: `📝 feedback`, `🐮 comments`
- **Main Chat Body**:
  - Header Bar: Top navigation menu bar (`File`, `Edit Character`, `Set Name/Pic`, `Card Creator`, `IDE Modules`) + top right wrench icon.
  - Message Stream: Character avatar, character name, action toolbar (edit, delete, regenerate), rendered text content with markdown formatting.
  - Input Toolbar:
    - Persona/Speaker Pills: `✏️ Edit`, `🗣️ Chloe`, `🗣️ Anon`, `🗣️ Narrator`, `🖼️ Image Tool`.
    - Multiline Text Area: Resizable prompt input ("Type your reply here...").
    - Action Buttons: `send ➡️`, `⚒️ options`.

---

## 3. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Menu Bar: [File] [Edit Character] [Set Name/Pic] [Card Creator] [IDE Modules] [Admin] │
├───────────────────────────┬────────────────────────────────────────────────────────────┤
│ Left Thread Sidebar       │ Main Chat Workspace                                        │
│ ┌───────────────────────┐ │ ┌────────────────────────────────────────────────────────┐ │
│ │ 💬 New Chat           │ │ │ Active Character Header: Chloe ✏️ 🗑️ 🔄                 │ │
│ ├───────────────────────┤ │ ├────────────────────────────────────────────────────────┤ │
│ │ Active Thread Items   │ │ │ Message Stream                                         │ │
│ │ - Chloe #1            │ │ │ - Chloe: "Hi! 😊"                                      │ │
│ │ - Code Auditor #2     │ │ │ - Anon: "Can you analyze this project?"                │ │
│ ├───────────────────────┤ │ ├────────────────────────────────────────────────────────┤ │
│ │ Storage Info Notice   │ │ │ Input Area                                             │ │
│ ├───────────────────────┤ │ │ [✏️] [🗣️ Chloe] [🗣️ Anon] [🗣️ Narrator] [🖼️ Image]    │ │
│ │ Bottom Control Grid   │ │ │ ┌──────────────────────────────────────────┐ ┌───────┐  │ │
│ │ [settings] [tips]     │ │ │ │ Type your reply here...                  │ │ send  │  │ │
│ │ [export] [import]     │ │ │ └──────────────────────────────────────────┘ └───────┘  │ │
│ └───────────────────────┘ │ └────────────────────────────────────────────────────────┘ │
└───────────────────────────┴────────────────────────────────────────────────────────────┘
                                            │
                                  Model Router Dispatch
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        Sealed Interface ModelProvider Engine                           │
│ ┌───────────────────────┐ ┌───────────────────────┐ ┌────────────────────────────────┐ │
│ │ GeminiProvider        │ │ OllamaProvider        │ │ OpenAIProvider / ClaudeProvider│ │
│ │ (@google/genai SDK)   │ │ (Local Daemon)        │ │ (Custom HTTP / Base URLs)      │ │
│ └───────────────────────┘ └───────────────────────┘ └────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Strict Records & Sealed Type Schema
1. **CharacterCard Record**:
   - `id`: string
   - `name`: string
   - `avatarUrl`: string
   - `greetingMessage`: string
   - `systemPrompt`: string (Context Loader)
   - `personality`: string
   - `enabledTools`: string[]
   - `providerConfig`: ProviderSelectionRecord
2. **ProviderSelection Record**:
   - `providerType`: 'gemini' | 'ollama' | 'openai' | 'claude' | 'custom'
   - `baseUrl`: string
   - `apiKey`: string
   - `modelName`: string
3. **ChatThread Record**:
   - `id`: string
   - `characterId`: string
   - `title`: string
   - `userAlias`: string
   - `messages`: MessageRecord[]
   - `updatedAt`: string

---

## 4. Execution Strategy & Implementation Steps

1. **Strict Java OOP & Record Model Infrastructure (`/src/engine/`)**:
   - Implement record definitions for `CharacterCard`, `ChatThread`, `MessageRecord`, and `ProviderSelection`.
   - Implement sealed interface model router with support for Gemini, Ollama, OpenAI, Claude, and Custom HTTP endpoints.
2. **Multi-Provider Router Endpoint (`/api/providers/chat`)**:
   - Express server backend dispatching requests to configured provider URLs and API keys.
3. **Perchance Chat Workspace UI**:
   - Rebuild interface matching Perchance AI Character Chat layout (dark theme, left thread sidebar, 3-row bottom control grid, header menu bar, speaker pills, and multiline input bar).
4. **AI Task-Specific Card Creator**:
   - Build `CardCreatorModal.tsx` allowing an AI Assistant to generate customized, task-specific character cards with system prompts and tool permissions.
5. **Top Navigation Bar IDE Modules**:
   - Menu bar dropdowns for `File`, `Edit Character`, `Set Name/Pic`, `Card Creator`, and `IDE Modules` (AST Rule Builder, Loom Thread Visualizer, Vision Inspector, Audit Stream, Admin Console).
6. **Firestore Database Sync & Verification**:
   - Sync threads and character cards with Firestore database `ai-studio-aegisagentzerotr-f658c7d0-a75e-4539-9f68-f1828b78b2dd`.
   - Run `compile_applet` and `lint_applet` to confirm 100% build success.
