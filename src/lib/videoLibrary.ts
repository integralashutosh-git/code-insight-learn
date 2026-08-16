import type { ConceptKey, Difficulty } from "./concepts";
import type { LanguageKey } from "./languages";

export interface LectureRef {
  id: string;
  videoId: string;
  title: string;
  creator: string;
  duration: string;
  start: string;
  end: string;
  language: LanguageKey;
  concept: ConceptKey;
  difficulty: Difficulty;
  summary: string;
}

function secondsOf(timestamp: string): number {
  const parts = timestamp.split(":").map((p) => Number(p) || 0);
  return parts.reduce((acc, part) => acc * 60 + part, 0);
}

export function watchUrl(video: LectureRef): string {
  return `https://www.youtube.com/watch?v=${video.videoId}&t=${secondsOf(video.start)}s`;
}

export function thumbnailUrl(video: LectureRef): string {
  return `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
}

interface CourseSeed {
  videoId: string;
  title: string;
  creator: string;
  duration: string;
  language: LanguageKey;
}

const COURSES: CourseSeed[] = [
  {
    videoId: "UmnCZ7-9yDY",
    title: "Java Full Course for Beginners",
    creator: "Apna College",
    duration: "12:45:10",
    language: "java",
  },
  {
    videoId: "UrsmFxEIp5k",
    title: "Python Tutorial For Beginners in Hindi",
    creator: "CodeWithHarry",
    duration: "11:38:47",
    language: "python",
  },
  {
    videoId: "KJgsSFOSQv0",
    title: "C Programming Tutorial for Beginners",
    creator: "freeCodeCamp.org",
    duration: "03:46:13",
    language: "c",
  },
  {
    videoId: "vLnPwxZdW4Y",
    title: "C++ Tutorial for Beginners — Full Course",
    creator: "freeCodeCamp.org",
    duration: "04:01:20",
    language: "cpp",
  },
  {
    videoId: "lfmg-EJ8gm4",
    title: "JavaScript Full Course for Beginners",
    creator: "Bro Code",
    duration: "12:00:00",
    language: "javascript",
  },
];

interface ChapterSeed {
  concept: ConceptKey;
  start: string;
  end: string;
  difficulty: Difficulty;
  summary: string;
}

const CHAPTERS: ChapterSeed[] = [
  {
    concept: "Variables",
    start: "05:32",
    end: "11:08",
    difficulty: "Beginner",
    summary:
      "This section explains the same variable declaration used in your code — naming, assigning and reassigning values.",
  },
  {
    concept: "Data Types",
    start: "11:08",
    end: "19:40",
    difficulty: "Beginner",
    summary:
      "Walks through int, float, char, boolean and String with the exact declarations you wrote.",
  },
  {
    concept: "Operators",
    start: "19:40",
    end: "31:15",
    difficulty: "Beginner",
    summary:
      "Covers arithmetic, comparison and logical operators, including the comparison used in your condition.",
  },
  {
    concept: "If-Else",
    start: "42:05",
    end: "56:22",
    difficulty: "Beginner",
    summary:
      "Explains branching with if, else-if and else — matching the decision block in your program.",
  },
  {
    concept: "Loops",
    start: "58:10",
    end: "01:22:40",
    difficulty: "Beginner",
    summary:
      "Breaks down for and while loops step by step, including the counter pattern used in your loop.",
  },
  {
    concept: "Arrays",
    start: "01:35:00",
    end: "02:04:18",
    difficulty: "Intermediate",
    summary:
      "Shows array declaration, indexing from zero and traversal with a loop like the one in your code.",
  },
  {
    concept: "Strings",
    start: "02:12:30",
    end: "02:40:05",
    difficulty: "Intermediate",
    summary:
      "Covers string creation, concatenation and the built-in methods your code relies on.",
  },
  {
    concept: "Functions",
    start: "02:48:12",
    end: "03:20:44",
    difficulty: "Intermediate",
    summary:
      "Explains parameters, return values and scope for the function you defined.",
  },
  {
    concept: "OOP",
    start: "03:35:00",
    end: "04:28:36",
    difficulty: "Advanced",
    summary:
      "Classes, objects, constructors and encapsulation — the object model behind your code.",
  },
  {
    concept: "Recursion",
    start: "04:40:15",
    end: "05:06:52",
    difficulty: "Advanced",
    summary:
      "Base case, recursive case and the call stack, using an example close to your recursive function.",
  },
];

export const LECTURES: LectureRef[] = COURSES.flatMap((course) =>
  CHAPTERS.map((chapter) => ({
    id: `${course.videoId}-${chapter.concept}`,
    videoId: course.videoId,
    title: `${chapter.concept} — ${course.title}`,
    creator: course.creator,
    duration: course.duration,
    start: chapter.start,
    end: chapter.end,
    language: course.language,
    concept: chapter.concept,
    difficulty: chapter.difficulty,
    summary: chapter.summary,
  })),
);

export function findLectures(
  language: LanguageKey,
  concepts: ConceptKey[],
): { best: LectureRef | null; related: LectureRef[] } {
  const forLanguage = LECTURES.filter((l) => l.language === language);
  const ranked = concepts
    .map((concept) => forLanguage.find((l) => l.concept === concept))
    .filter((l): l is LectureRef => Boolean(l));

  const best = ranked[0] ?? forLanguage[0] ?? null;
  const related = [
    ...ranked.slice(1),
    ...forLanguage.filter((l) => !ranked.includes(l)),
  ]
    .filter((l) => l.id !== best?.id)
    .slice(0, 3);

  return { best, related };
}