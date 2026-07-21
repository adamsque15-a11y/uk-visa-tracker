import { CEFRLevel } from './level';

export interface TestOverviewContent {
  // Real exam name shown in the facts card, e.g. "IELTS Life Skills A1".
  examName: string;
  // One line explaining which visa stage this level applies to.
  stageContext: string;
  lengthMinutes: string;
  part1Description: string;
  part2Description: string;
  // Only set for B1 — the citizenship-specific note about the separate
  // Life in the UK Test tying into the "Knowledge of Life and Language"
  // requirement.
  citizenshipNote?: string;
}

export const TEST_OVERVIEW_CONTENT: Record<CEFRLevel, TestOverviewContent> = {
  a1: {
    examName: 'IELTS Life Skills A1',
    stageContext:
      'Required for an initial family or spouse visa application — this is usually the first English test most applicants need to pass.',
    lengthMinutes: 'About 16–20 minutes in total.',
    part1Description:
      "The examiner asks you and your partner questions on familiar, everyday topics — things like your routine, family, and preferences.",
    part2Description:
      "You'll listen to a short recording together, take notes, and then discuss a related theme with the examiner and your partner.",
  },
  a2: {
    examName: 'IELTS Life Skills A2',
    stageContext:
      'Required when extending a family visa — the level steps up from A1, so questions expect a bit more detail, reasoning, and past-tense description.',
    lengthMinutes: 'About 16–20 minutes in total.',
    part1Description:
      "The examiner asks you and your partner about familiar topics, but expects fuller answers than A1 — for example, explaining why, comparing options, or describing something that happened.",
    part2Description:
      "You'll listen to a slightly longer recording together, take notes, and discuss it in more depth than at A1 — giving opinions and reasons, not just facts.",
  },
  b1: {
    examName: 'IELTS Life Skills B1',
    stageContext:
      'Required for settlement (Indefinite Leave to Remain) and, alongside the separate Life in the UK Test, for citizenship naturalisation.',
    lengthMinutes: 'About 22 minutes in total — slightly longer than A1/A2.',
    part1Description:
      "The examiner asks about familiar topics but expects extended, well-reasoned answers — explaining decisions, describing processes, and discussing more abstract topics like community, work, and civic life.",
    part2Description:
      "You'll listen to a longer, more detailed recording together, take notes, and discuss it in depth — reasoning through hypothetical situations and giving considered opinions, not just describing things.",
    citizenshipNote:
      'If you\'re working towards citizenship: passing an English test at B1 or above is only one part of the "Knowledge of Life and Language" requirement — you\'ll also need to pass the separate Life in the UK Test, which covers British history, traditions, and how government works. Always confirm current requirements on GOV.UK.',
  },
};
