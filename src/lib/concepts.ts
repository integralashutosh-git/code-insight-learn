export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type ConceptKey =
  | "Variables"
  | "Data Types"
  | "Operators"
  | "If-Else"
  | "Loops"
  | "Arrays"
  | "Functions"
  | "OOP"
  | "Recursion"
  | "Strings";

export const CONCEPT_ORDER: ConceptKey[] = [
  "Variables",
  "Data Types",
  "Operators",
  "If-Else",
  "Loops",
  "Arrays",
  "Strings",
  "Functions",
  "OOP",
  "Recursion",
];

export interface ConceptMeta {
  key: ConceptKey;
  icon: string;
  difficulty: Difficulty;
  short: string;
  explanation: string;
  progress: number;
}

export const CONCEPTS: Record<ConceptKey, ConceptMeta> = {
  Variables: {
    key: "Variables",
    icon: "Box",
    difficulty: "Beginner",
    short: "Named memory locations that store data.",
    explanation:
      "A variable is a named memory location used to store data. You give it a name, a type (in typed languages) and a value. Changing the value later does not change the name, which is why variables let a program remember and reuse information.",
    progress: 92,
  },
  "Data Types": {
    key: "Data Types",
    icon: "Shapes",
    difficulty: "Beginner",
    short: "The kind of value a variable can hold.",
    explanation:
      "A data type tells the language what kind of value is stored and how much memory it needs — whole numbers (int), decimals (float/double), single characters (char), true/false (boolean) and text (String). Picking the right type prevents wrong results and wasted memory.",
    progress: 84,
  },
  Operators: {
    key: "Operators",
    icon: "Percent",
    difficulty: "Beginner",
    short: "Symbols that perform work on values.",
    explanation:
      "Operators act on values: arithmetic (+ - * / %), comparison (== != > <), logical (&& || !) and assignment (= += -=). Comparison and logical operators produce booleans, which is what conditions rely on.",
    progress: 76,
  },
  "If-Else": {
    key: "If-Else",
    icon: "GitBranch",
    difficulty: "Beginner",
    short: "Run different code based on a condition.",
    explanation:
      "An if-else statement checks a boolean condition. If it is true the first block runs, otherwise the else block runs. You can chain else-if to test several cases in order — only the first matching branch executes.",
    progress: 71,
  },
  Loops: {
    key: "Loops",
    icon: "Repeat",
    difficulty: "Beginner",
    short: "Repeat a block of code many times.",
    explanation:
      "A loop repeats a block while a condition holds. A for loop is used when the number of repetitions is known (initialisation, condition, update). A while loop repeats until a condition becomes false. Always make sure something inside the loop moves it toward ending, or it runs forever.",
    progress: 64,
  },
  Arrays: {
    key: "Arrays",
    icon: "Grid3x3",
    difficulty: "Intermediate",
    short: "A fixed collection of values under one name.",
    explanation:
      "An array stores many values of the same type in one continuous block of memory. Each value has an index starting at 0, so the first element is arr[0] and the last is arr[length - 1]. Arrays pair naturally with loops for traversal.",
    progress: 58,
  },
  Strings: {
    key: "Strings",
    icon: "Type",
    difficulty: "Intermediate",
    short: "Sequences of characters and their operations.",
    explanation:
      "A string is a sequence of characters. Most languages give you length, indexing, concatenation, slicing/substring, comparison and case conversion. In Java and Python strings are immutable — operations return a new string instead of changing the original.",
    progress: 52,
  },
  Functions: {
    key: "Functions",
    icon: "FunctionSquare",
    difficulty: "Intermediate",
    short: "Reusable named blocks of logic.",
    explanation:
      "A function (or method) groups statements under a name so you can run them again with different inputs. It takes parameters, does work and usually returns a value. Functions make code shorter, testable and easier to reason about.",
    progress: 47,
  },
  OOP: {
    key: "OOP",
    icon: "Boxes",
    difficulty: "Advanced",
    short: "Model data and behaviour as objects.",
    explanation:
      "Object-oriented programming groups data (fields) and behaviour (methods) into classes. An object is one instance of a class. The four pillars are encapsulation, inheritance, polymorphism and abstraction.",
    progress: 33,
  },
  Recursion: {
    key: "Recursion",
    icon: "Infinity",
    difficulty: "Advanced",
    short: "A function that calls itself.",
    explanation:
      "Recursion solves a problem by solving a smaller version of the same problem. Every recursive function needs a base case that stops the calls, and a recursive case that moves toward that base case. Without a base case you get a stack overflow.",
    progress: 21,
  },
};

export function isConceptKey(value: string): value is ConceptKey {
  return value in CONCEPTS;
}