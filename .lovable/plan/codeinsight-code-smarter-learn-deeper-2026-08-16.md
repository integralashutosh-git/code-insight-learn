# CodeInsight — Code Smarter. Learn Deeper.

An AI learning platform where beginners write code and instantly get line-by-line comments, detected concepts, and the exact YouTube lecture timestamp. No Run / Compile / Output anywhere.

## What gets built

**Homepage (/)** — Hero "Learn Programming by Understanding Every Line." with Start Learning + Open AI Editor buttons and an animated editor preview on the right. Six feature cards (Real-time AI Comments, No Compilation Needed, Concept Detection, YouTube Smart References, Personal Notes, Multi-language Support).

**AI Editor (/editor)** — the core three-column VS Code-style workspace:

```text
+-------------+----------------------------+------------------------+
| Explorer    | AI Code Editor (Monaco)    | Smart Learning Panel   |
| Java/Python |  toolbar: New File,        |  1 Detected Concepts   |
| C++/JS      |  Upload, Save, Download,   |  2 Best YouTube Lecture|
| Notes       |  Theme Toggle              |  3 More References     |
| Saved Lsns  |  (no Run/Compile/Output)   |  4 AI Notes            |
| Language    |  AI comments auto-inserted |                        |
| selector    |  above each line, green    |                        |
+-------------+----------------------------+------------------------+
```

- Monaco editor preloaded with a sample program; analysis runs automatically as you type (debounced), never on a button press.
- AI returns a comment for every line, which is rendered as a green comment line above the code, plus the detected concepts, beginner explanations, and short revision notes.
- Concept chips (Variables, Data Types, Operators, If-Else, Loops, Arrays, Functions, OOP, Recursion) open an explanation modal on click.
- Lecture card: thumbnail, title, creator, duration, exact timestamp range, Watch Topic button. Plus 3 related videos with thumbnail, title, timestamp, difficulty, Watch button.

**Learn (/learn)** — grid of concept cards with icon, name, progress bar, difficulty.

**Dashboard (/dashboard)** — Concepts Learned, Videos Watched, Study Hours, Daily Streak cards; Weekly Progress chart, Strong/Weak Topics, and a "Next, learn Nested Loops" recommendation. Demo data.

**Profile (/profile)** — name, avatar, learning level, completed concepts, certificates, saved notes. Demo data.

Mobile: the three columns collapse into tabs (Explorer / Editor / Learning) so the editor stays usable on phones.

## Design

Apple × VS Code: Inter, 16px radius, glassmorphism nav, `#2563EB` primary / `#60A5FA` secondary, `#F8FAFC` light background, `#0F172A` dark, full dark + light mode. All colors as semantic tokens in the design system.

## Technical notes

- **Backend:** enable Lovable Cloud so the AI analysis and YouTube search run server-side with keys hidden.
- **AI:** a server function calls the Lovable AI Gateway with the code + language and returns structured JSON: per-line comments, detected concepts with explanations, revision notes, and search intent for videos. Debounced on typing; results cached per code snapshot to avoid burning calls on every keystroke.
- **YouTube:** live YouTube Data API v3 search from a server function, ranked against the detected concept, returning thumbnail/title/channel/duration. This needs a **YouTube Data API key** — I'll prompt you to add it as a secret when we build. Timestamps come from the AI's mapping of the concept onto the video (chapters when available); results cached per concept+language.
- **Persistence:** none — files, notes, dashboard and profile use in-memory/demo state, as chosen.
- Monaco loads client-side only.
- Every route gets its own SEO metadata.
