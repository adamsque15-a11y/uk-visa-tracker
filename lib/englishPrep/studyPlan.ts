import { Lesson } from './types';

export interface StudyWeek {
  week: number;
  lessons: Lesson[];
  focusNote: string;
}

// Deterministic, client-side plan generator — not personalized by any real
// model, just an even split of not-yet-completed lessons across the chosen
// number of weeks, with weak topics called out up front. Good enough for
// scaffolding; swap for something smarter later if it's worth the investment.
export function generateStudyPlan(
  allLessons: Lesson[],
  completedKeys: string[],
  weakTopicTitles: string[],
  weeks: number
): StudyWeek[] {
  const remaining = allLessons.filter((l) => !completedKeys.includes(l.key));
  const pool = remaining.length > 0 ? remaining : allLessons;
  const perWeek = Math.max(1, Math.ceil(pool.length / weeks));

  const plan: StudyWeek[] = [];
  for (let i = 0; i < weeks; i++) {
    const weekLessons = pool.slice(i * perWeek, (i + 1) * perWeek);
    const isFirstWeek = i === 0;
    plan.push({
      week: i + 1,
      lessons: weekLessons,
      focusNote:
        isFirstWeek && weakTopicTitles.length > 0
          ? `Start by reviewing your weakest topics: ${weakTopicTitles.join(', ')}. Then work through the lessons below.`
          : 'Work through the lessons below, plus a mock test and a listening session before the week is out.',
    });
  }
  return plan;
}
