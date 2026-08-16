export type LanguageKey = "java" | "python" | "c" | "cpp" | "javascript";

export interface LanguageMeta {
  key: LanguageKey;
  label: string;
  monaco: string;
  extension: string;
  commentPrefix: string;
  sample: string;
}

export const LANGUAGES: Record<LanguageKey, LanguageMeta> = {
  java: {
    key: "java",
    label: "Java",
    monaco: "java",
    extension: "java",
    commentPrefix: "//",
    sample: `public class Main {
    public static void main(String[] args) {
        int marks = 87;
        String name = "Ashutosh";
        if (marks >= 40) {
            System.out.println(name + " passed");
        } else {
            System.out.println(name + " failed");
        }
        for (int i = 1; i <= 3; i++) {
            System.out.println("Attempt " + i);
        }
    }
}`,
  },
  python: {
    key: "python",
    label: "Python",
    monaco: "python",
    extension: "py",
    commentPrefix: "#",
    sample: `marks = 87
name = "Ashutosh"

if marks >= 40:
    print(name, "passed")
else:
    print(name, "failed")

for i in range(1, 4):
    print("Attempt", i)`,
  },
  c: {
    key: "c",
    label: "C",
    monaco: "c",
    extension: "c",
    commentPrefix: "//",
    sample: `#include <stdio.h>

int main() {
    int marks = 87;
    if (marks >= 40) {
        printf("passed\\n");
    } else {
        printf("failed\\n");
    }
    return 0;
}`,
  },
  cpp: {
    key: "cpp",
    label: "C++",
    monaco: "cpp",
    extension: "cpp",
    commentPrefix: "//",
    sample: `#include <iostream>
using namespace std;

int main() {
    int marks = 87;
    if (marks >= 40) {
        cout << "passed" << endl;
    }
    return 0;
}`,
  },
  javascript: {
    key: "javascript",
    label: "JavaScript",
    monaco: "javascript",
    extension: "js",
    commentPrefix: "//",
    sample: `const marks = 87;
const name = "Ashutosh";

if (marks >= 40) {
  console.log(\`\${name} passed\`);
} else {
  console.log(\`\${name} failed\`);
}

for (let i = 1; i <= 3; i++) {
  console.log("Attempt", i);
}`,
  },
};

export const LANGUAGE_LIST = Object.values(LANGUAGES);