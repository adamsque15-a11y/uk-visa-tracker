import { IconName } from '../../components/Icon';

export interface VocabItem {
  word: string;
  meaning: string;
  example: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ConversationLine {
  speaker: string;
  line: string;
}

// A short listening passage plus follow-up discussion questions, mirroring
// the real exam's Speaking Part 2 structure: listen, then discuss.
export interface ListenDiscussItem {
  id: string;
  title: string;
  passage: string;
  followUpQuestions: string[];
}

// A plain string rather than an enumerated literal union: A1 alone already
// has 100 distinct lesson keys, and each new CEFR level (see level.ts) adds
// its own set on top — enumerating all of them here would be unwieldy to
// maintain and doesn't buy meaningful type safety, since lesson keys are
// only ever compared against each other (progress tracking, weak topics),
// never used to discriminate a union elsewhere.
export type LessonKey = string;

export interface Lesson {
  key: LessonKey;
  icon: IconName;
  title: string;
  vocabulary: VocabItem[];
  pronunciationTip: string;
  conversation: ConversationLine[];
  quiz: QuizQuestion[];
}
