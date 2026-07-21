import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { speakBritish } from '../../../lib/englishPrep/speech';
import Screen from '../../../components/Screen';
import Icon, { IconName } from '../../../components/Icon';
import PremiumGate from '../../../components/PremiumGate';
import Disclaimer from '../../../components/Disclaimer';
import { colors } from '../../../lib/theme';
import { getLessonsForLevel, getLesson } from '../../../lib/englishPrep/lessons';
import {
  MOCK_TEST_BANKS,
  LISTENING_BANKS,
  LISTEN_DISCUSS_BANKS,
  COMMON_QUESTIONS_BY_LEVEL,
  PRACTICE_PLAN,
  EXAM_DAY_TIPS,
} from '../../../lib/englishPrep/questionBanks';
import { QuizQuestion, Lesson } from '../../../lib/englishPrep/types';
import {
  loadEnglishPrepProgress,
  subscribeEnglishPrepProgress,
  recordLessonQuiz,
  recordMockTest,
  recordListeningSession,
  getAverageScore,
  getWeakTopics,
  EnglishPrepProgress,
} from '../../../lib/englishPrep/progress';
import {
  FREE_DAILY_SPEAKING_ATTEMPTS,
  loadSpeakingAttemptsToday,
  subscribeSpeakingAttempts,
  recordSpeakingAttempt,
} from '../../../lib/englishPrep/speakingLimits';
import { generateStudyPlan } from '../../../lib/englishPrep/studyPlan';
import {
  CEFRLevel,
  CEFR_LEVELS,
  LEVEL_LABELS,
  LEVEL_FULL_LABELS,
  LEVEL_STAGE_LABELS,
  setLevelPreference,
} from '../../../lib/englishPrep/level';
import { TEST_OVERVIEW_CONTENT } from '../../../lib/englishPrep/testOverviewContent';
import { useTier } from '../../../hooks/useTier';

type ScreenView =
  | 'hub'
  | 'testOverview'
  | 'lessonList'
  | 'lessonDetail'
  | 'speakingPractice'
  | 'speakingPart1'
  | 'speakingPart2'
  | 'mockTest'
  | 'listening'
  | 'progress'
  | 'practicePlan'
  | 'weakTopicDrill'
  | 'studyPlanGenerator'
  | 'commonQuestions'
  | 'commonQuestionsCategory'
  | 'examTips';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Icon + text page heading, used consistently across every sub-screen.
function ScreenHeading({ icon, children }: { icon: IconName; children: React.ReactNode }) {
  return (
    <View style={styles.headingRow}>
      <Icon name={icon} size={22} color={colors.primary} />
      <Text style={styles.heading}>{children}</Text>
    </View>
  );
}

// A1/A2/B1 pills — shown on the hub and the Progress Tracker (the two
// places the request calls out), both driving the same shared `level`
// state so switching it anywhere keeps Learn/Speaking/Mock
// Test/Listening/Progress all in sync.
function LevelSelector({ selected, onSelect }: { selected: CEFRLevel; onSelect: (level: CEFRLevel) => void }) {
  return (
    <View style={styles.levelSelectorRow}>
      {CEFR_LEVELS.map((lvl) => {
        const active = lvl === selected;
        return (
          <TouchableOpacity
            key={lvl}
            style={[styles.levelPill, active && styles.levelPillSelected]}
            onPress={() => onSelect(lvl)}
            accessibilityLabel={`${LEVEL_FULL_LABELS[lvl]} — ${LEVEL_STAGE_LABELS[lvl]}`}
          >
            <Text style={[styles.levelPillLabel, active && styles.levelPillLabelSelected]}>{LEVEL_FULL_LABELS[lvl]}</Text>
            <Text style={[styles.levelPillStage, active && styles.levelPillStageSelected]}>{LEVEL_STAGE_LABELS[lvl]}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─────────────────────────── Quiz runner (shared by lessons, mock test, listening) ───────────────────────────
function QuizRunner({
  questions,
  isListening,
  onComplete,
}: {
  questions: QuizQuestion[];
  isListening?: boolean;
  onComplete: (correct: number, total: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [revealed, setRevealed] = useState(!isListening);

  const question = questions[index];
  const isLast = index === questions.length - 1;

  function selectOption(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === question.correctIndex) setCorrectCount((c) => c + 1);
  }

  function next() {
    if (isLast) {
      onComplete(correctCount + (selected === question.correctIndex && selected !== null ? 0 : 0), questions.length);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(!isListening);
  }

  function playAudio() {
    speakBritish(question.question);
  }

  return (
    <View>
      <Text style={styles.quizProgress}>
        Question {index + 1} of {questions.length}
      </Text>

      {isListening ? (
        <View style={styles.listeningBox}>
          <TouchableOpacity style={styles.playButton} onPress={playAudio}>
            <Icon name="volume-2" size={16} color={colors.textOnPrimary} />
            <Text style={styles.playButtonText}>Play Audio</Text>
          </TouchableOpacity>
          {revealed ? (
            <Text style={styles.quizQuestion}>{question.question}</Text>
          ) : (
            <TouchableOpacity onPress={() => setRevealed(true)}>
              <Text style={styles.showTranscriptLink}>Show transcript</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <Text style={styles.quizQuestion}>{question.question}</Text>
      )}

      {question.options.map((option, i) => {
        const isCorrect = i === question.correctIndex;
        const isChosen = i === selected;
        const showState = selected !== null;
        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.optionButton,
              showState && isCorrect && styles.optionCorrect,
              showState && isChosen && !isCorrect && styles.optionWrong,
            ]}
            onPress={() => selectOption(i)}
            disabled={selected !== null}
          >
            <View style={styles.optionRow}>
              <Text style={styles.optionText}>
                {String.fromCharCode(65 + i)}. {option}
              </Text>
              {showState && isCorrect && <Icon name="check-circle" size={16} color="#2e7d32" />}
            </View>
          </TouchableOpacity>
        );
      })}

      {selected !== null && (
        <TouchableOpacity style={styles.nextButton} onPress={next}>
          <Text style={styles.nextButtonText}>{isLast ? 'Finish' : 'Next question →'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function ResultsSummary({ correct, total, onDone }: { correct: number; total: number; onDone: () => void }) {
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <View style={styles.resultsCard}>
      <Text style={styles.resultsScore}>
        {correct} / {total}
      </Text>
      <Text style={styles.resultsPercent}>{percent}% correct</Text>
      <TouchableOpacity style={styles.nextButton} onPress={onDone}>
        <Text style={styles.nextButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

// Legacy ?view= deep link support — sub-views stay query-param based (this
// request was only about giving each CEFR level its own URL, not each
// sub-view), but old bookmarked/shared ?view= URLs still work.
const LINKABLE_VIEWS: ScreenView[] = ['testOverview', 'lessonList', 'speakingPractice', 'mockTest', 'listening', 'progress'];

// Pre-renders one static HTML page per level at build time (output:
// "static"), so /ielts-life-skills/a1, /a2, /b1 are each their own
// crawlable, indexable URL rather than one page behind a ?level= query
// param — the previous structure that made this content invisible to
// search engines segmented by level.
export async function generateStaticParams(): Promise<{ level: string }[]> {
  return CEFR_LEVELS.map((level) => ({ level }));
}

const SEO_META: Record<CEFRLevel, { title: string; description: string }> = {
  a1: {
    title: 'IELTS Life Skills A1 Practice — Free Lessons & Mock Test | UK Visa Tracker',
    description:
      'Free IELTS Life Skills A1 practice for your UK family/spouse visa: lessons, speaking practice, a mock test, and listening exercises — everything the real A1 exam covers.',
  },
  a2: {
    title: 'IELTS Life Skills A2 Practice — Free Lessons & Mock Test | UK Visa Tracker',
    description:
      'Free IELTS Life Skills A2 practice for extending your UK family visa: lessons, speaking practice, a mock test, and listening exercises — everything the real A2 exam covers.',
  },
  b1: {
    title: 'IELTS Life Skills B1 Practice — Free Lessons & Mock Test | UK Visa Tracker',
    description:
      'Free IELTS Life Skills B1 practice for UK settlement and citizenship: lessons, speaking practice, a mock test, and listening exercises — everything the real B1 exam covers.',
  },
};

export default function EnglishPrepScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ view?: string; level?: string }>();
  const isValidLevel = params.level === 'a1' || params.level === 'a2' || params.level === 'b1';
  const [view, setView] = useState<ScreenView>('hub');
  const [selectedLessonKey, setSelectedLessonKey] = useState<string | null>(null);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null);
  const [progress, setProgress] = useState<EnglishPrepProgress | null>(null);
  const [showLessonQuiz, setShowLessonQuiz] = useState(false);
  const [mockResult, setMockResult] = useState<{ correct: number; total: number } | null>(null);
  const [listeningResult, setListeningResult] = useState<{ correct: number; total: number } | null>(null);
  const [lessonResult, setLessonResult] = useState<{ correct: number; total: number } | null>(null);
  const [weakDrillResult, setWeakDrillResult] = useState<{ correct: number; total: number } | null>(null);
  const [speakingAttemptsToday, setSpeakingAttemptsToday] = useState(0);
  const [studyPlanWeeks, setStudyPlanWeeks] = useState(4);

  // Which CEFR level (A1/A2/B1) is currently selected — now the URL's own
  // [level] segment is the source of truth (see generateStaticParams above),
  // not a query param, so /ielts-life-skills/a1 and /b1 are distinct,
  // indexable pages rather than one page with query-string state. One
  // shared level for the whole screen (Learn, Speaking, Mock Test,
  // Listening, Progress) rather than a per-view level, so switching level
  // anywhere — including from the Progress Tracker's own pills — navigates
  // to the new level's URL and consistently switches everything.
  const [level, setLevel] = useState<CEFRLevel>(isValidLevel ? (params.level as CEFRLevel) : 'a1');

  const { premium } = useTier();

  // Part 1: Everyday Questions
  const [part1Index, setPart1Index] = useState(0);
  const [part1Elapsed, setPart1Elapsed] = useState(0);
  const [part1ShowAnswer, setPart1ShowAnswer] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Part 2: Listen & Discuss
  const [part2Index, setPart2Index] = useState(0);
  const [part2Notes, setPart2Notes] = useState('');
  const [part2HasPlayed, setPart2HasPlayed] = useState(false);

  const mockQuestions = useMemo(() => shuffle(MOCK_TEST_BANKS[level]).slice(0, 10), [view === 'mockTest', level]);
  const listeningQuestions = useMemo(() => shuffle(LISTENING_BANKS[level]).slice(0, 8), [view === 'listening', level]);
  const part1Pool = useMemo(
    () => shuffle(COMMON_QUESTIONS_BY_LEVEL[level].flatMap((c) => c.questions)),
    [view === 'speakingPart1', level]
  );

  // Real mic recording is only feasible on web (via the browser's own
  // MediaRecorder API) — no recording library is installed for native, so
  // native falls back to the timer-based "practice out loud" mode below.
  const micSupported = Platform.OS === 'web' && typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;

  // Resets the timer, recording, and revealed-answer state each time a new
  // Part 1 question comes up (including on first entering the view).
  useEffect(() => {
    if (view !== 'speakingPart1') return;
    setPart1Elapsed(0);
    setPart1ShowAnswer(false);
    setRecordedUrl(null);
    setIsRecording(false);
    if (!premium) recordSpeakingAttempt().then(setSpeakingAttemptsToday);
    const interval = setInterval(() => setPart1Elapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [view, part1Index]);

  useEffect(() => {
    if (view !== 'speakingPart2') return;
    setPart2Notes('');
    setPart2HasPlayed(false);
    if (!premium) recordSpeakingAttempt().then(setSpeakingAttemptsToday);
  }, [view, part2Index]);

  useEffect(() => {
    loadSpeakingAttemptsToday().then(setSpeakingAttemptsToday);
    const unsubscribe = subscribeSpeakingAttempts(setSpeakingAttemptsToday);
    return () => {
      unsubscribe();
    };
  }, []);

  async function startRecording() {
    if (!micSupported) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      // Mic permission denied or unavailable — the "practice out loud"
      // instructions below still work without it.
      setIsRecording(false);
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }

  function playRecordedAnswer() {
    if (recordedUrl) new Audio(recordedUrl).play();
  }

  useEffect(() => {
    loadEnglishPrepProgress().then(setProgress);
    const unsubscribe = subscribeEnglishPrepProgress(setProgress);
    return () => {
      unsubscribe();
    };
  }, []);

  // The [level] segment is the source of truth for which level to show —
  // keep `level` state in sync if the URL changes underneath this screen
  // (e.g. browser back/forward between /a1 and /b1, which Expo Router
  // re-renders in place rather than remounting).
  useEffect(() => {
    if (isValidLevel) setLevel(params.level as CEFRLevel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.level]);

  function selectLevel(newLevel: CEFRLevel) {
    setLevel(newLevel);
    setLevelPreference(newLevel);
    router.replace({ pathname: '/(tabs)/ielts-life-skills/[level]', params: { level: newLevel } });
  }

  // Legacy support: a ?view= param jumps straight to that view; the bare
  // route (no param) resets back to the hub. See LINKABLE_VIEWS above.
  useEffect(() => {
    const requested = params.view as ScreenView | undefined;
    if (requested && LINKABLE_VIEWS.includes(requested)) {
      setView(requested);
    } else if (!requested) {
      setView('hub');
    }
  }, [params.view]);

  function goHome() {
    setView('hub');
    setSelectedLessonKey(null);
    setSelectedCategoryKey(null);
    setShowLessonQuiz(false);
    setMockResult(null);
    setListeningResult(null);
    setLessonResult(null);
    setWeakDrillResult(null);
  }

  const lessons = getLessonsForLevel(level);
  const lesson = selectedLessonKey ? getLesson(level, selectedLessonKey) : null;
  const category = selectedCategoryKey ? COMMON_QUESTIONS_BY_LEVEL[level].find((c) => c.key === selectedCategoryKey) : null;
  const levelProgress = progress?.levels[level] ?? null;
  const averageScore = progress ? getAverageScore(progress, level) : null;
  const weakTopics = progress ? getWeakTopics(progress, level) : [];
  const weakTopicLessons = weakTopics
    .map((key) => lessons.find((l) => l.key === key))
    .filter((l): l is Lesson => !!l);
  const todayPlanIndex = progress ? progress.streakCount % PRACTICE_PLAN.length : 0;
  const todayPlan = PRACTICE_PLAN[todayPlanIndex];
  const speakingLimitReached = !premium && speakingAttemptsToday >= FREE_DAILY_SPEAKING_ATTEMPTS;

  const weakDrillQuestions = useMemo(
    () => shuffle(weakTopicLessons.flatMap((l) => l.quiz)),
    [view === 'weakTopicDrill', level]
  );

  const studyPlan = useMemo(
    () =>
      generateStudyPlan(
        lessons,
        progress?.levels[level].completedLessons ?? [],
        weakTopicLessons.map((l) => l.title),
        studyPlanWeeks
      ),
    [view === 'studyPlanGenerator', studyPlanWeeks, level]
  );

  // ─────────────────────────── Invalid level ───────────────────────────
  // The [level] segment matched the route but isn't a1/a2/b1 — same
  // "not found" treatment as an unrecognized visa-info/[type], rather than
  // silently guessing which level was meant.
  if (!isValidLevel) {
    return (
      <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <ScreenHeading icon="award">IELTS Life Skills level not found</ScreenHeading>
        <Text style={styles.subheading}>We don't have IELTS Life Skills content for that level.</Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace({ pathname: '/(tabs)/ielts-life-skills/[level]', params: { level: 'a1' } })}
        >
          <Text style={styles.primaryButtonText}>Go to A1</Text>
        </TouchableOpacity>
      </Screen>
    );
  }

  // ─────────────────────────── Lesson detail ───────────────────────────
  if (view === 'lessonDetail' && lesson) {
    return (
      <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <TouchableOpacity onPress={() => setView('lessonList')}>
          <Text style={styles.backLink}>‹ Learn</Text>
        </TouchableOpacity>
        <ScreenHeading icon={lesson.icon}>{lesson.title}</ScreenHeading>

        {!showLessonQuiz ? (
          <>
            <Text style={styles.sectionTitle}>Vocabulary</Text>
            {lesson.vocabulary.map((v, i) => (
              <TouchableOpacity key={i} style={styles.vocabRow} onPress={() => speakBritish(v.word)} accessibilityLabel={`Hear "${v.word}"`}>
                <View style={styles.vocabWordRow}>
                  <Text style={styles.vocabWord}>{v.word}</Text>
                  <Icon name="volume-2" size={14} color={colors.primary} />
                </View>
                <Text style={styles.vocabMeaning}>{v.meaning}</Text>
                <Text style={styles.vocabExample}>"{v.example}"</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>Pronunciation</Text>
            <Text style={styles.bodyText}>{lesson.pronunciationTip}</Text>
            <TouchableOpacity
              style={styles.playButtonSmall}
              onPress={() => speakBritish(lesson.vocabulary.map((v) => v.word).join('. '))}
            >
              <Icon name="volume-2" size={14} color={colors.primary} />
              <Text style={styles.playButtonSmallText}>Hear the vocabulary</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Example Conversation</Text>
            {lesson.conversation.map((line, i) => (
              <Text key={i} style={styles.conversationLine}>
                <Text style={styles.conversationSpeaker}>{line.speaker}: </Text>
                {line.line}
              </Text>
            ))}
            <TouchableOpacity
              style={styles.playButtonSmall}
              onPress={() => speakBritish(lesson.conversation.map((l) => l.line).join('. '))}
            >
              <Icon name="volume-2" size={14} color={colors.primary} />
              <Text style={styles.playButtonSmallText}>Hear the conversation</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButton} onPress={() => setShowLessonQuiz(true)}>
              <Text style={styles.primaryButtonText}>Start Mini Quiz</Text>
            </TouchableOpacity>
          </>
        ) : lessonResult ? (
          <ResultsSummary
            correct={lessonResult.correct}
            total={lessonResult.total}
            onDone={() => {
              setShowLessonQuiz(false);
              setLessonResult(null);
              setView('lessonList');
            }}
          />
        ) : (
          <QuizRunner
            questions={lesson.quiz}
            onComplete={async (correct, total) => {
              await recordLessonQuiz(level, lesson.key, correct, total);
              setLessonResult({ correct, total });
            }}
          />
        )}
      </Screen>
    );
  }

  // ─────────────────────────── Test Overview ───────────────────────────
  if (view === 'testOverview') {
    const overview = TEST_OVERVIEW_CONTENT[level];
    return (
      <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <TouchableOpacity onPress={goHome}>
          <Text style={styles.backLink}>‹ IELTS Life Skills</Text>
        </TouchableOpacity>
        <ScreenHeading icon="info">Test Overview — {LEVEL_LABELS[level]}</ScreenHeading>
        <Text style={styles.subheading}>What to expect from the real {overview.examName} speaking and listening test.</Text>
        <View style={styles.levelContextBox}>
          <Icon name="flag" size={14} color={colors.primary} />
          <Text style={styles.levelContextText}>{overview.stageContext}</Text>
        </View>

        <View style={styles.factsCard}>
          <View style={styles.factRow}>
            <Icon name="mic" size={15} color={colors.primary} />
            <Text style={styles.factText}>
              <Text style={styles.factLabel}>Format: </Text>
              Speaking and Listening only — no reading, no writing, and no multiple choice in the real exam.
            </Text>
          </View>
          <View style={styles.factRow}>
            <Icon name="clock" size={15} color={colors.primary} />
            <Text style={styles.factText}>
              <Text style={styles.factLabel}>Length: </Text>
              {overview.lengthMinutes}
            </Text>
          </View>
          <View style={styles.factRow}>
            <Icon name="users" size={15} color={colors.primary} />
            <Text style={styles.factText}>
              <Text style={styles.factLabel}>Setting: </Text>
              Face-to-face, with an examiner and one other test candidate — you won't be tested alone.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>What's actually assessed</Text>
        <Text style={styles.bodyText}>• Listening and responding to what you hear</Text>
        <Text style={styles.bodyText}>• Making your meaning clear when you speak</Text>
        <Text style={styles.bodyText}>• Talking with other people — the examiner and your fellow candidate</Text>

        <Text style={styles.sectionTitle}>Part 1 — Speaking</Text>
        <Text style={styles.bodyText}>{overview.part1Description}</Text>
        <TouchableOpacity style={styles.playButtonSmall} onPress={() => setView('speakingPart1')}>
          <Icon name="arrow-right" size={14} color={colors.primary} />
          <Text style={styles.playButtonSmallText}>Try Part 1 practice</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Part 2 — Listening and Speaking</Text>
        <Text style={styles.bodyText}>{overview.part2Description}</Text>
        <TouchableOpacity style={styles.playButtonSmall} onPress={() => setView('speakingPart2')}>
          <Icon name="arrow-right" size={14} color={colors.primary} />
          <Text style={styles.playButtonSmallText}>Try Part 2 practice</Text>
        </TouchableOpacity>

        {overview.citizenshipNote && (
          <View style={styles.citizenshipNoteBox}>
            <Icon name="award" size={15} color={colors.primary} />
            <Text style={styles.citizenshipNoteText}>{overview.citizenshipNote}</Text>
          </View>
        )}
      </Screen>
    );
  }

  // ─────────────────────────── Lesson list ───────────────────────────
  if (view === 'lessonList') {
    return (
      <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <TouchableOpacity onPress={goHome}>
          <Text style={styles.backLink}>‹ IELTS Life Skills</Text>
        </TouchableOpacity>
        <ScreenHeading icon="book-open">Learn — {LEVEL_LABELS[level]}</ScreenHeading>
        <Text style={styles.subheading}>Break everything into small lessons.</Text>
        {lessons.map((l) => (
          <TouchableOpacity
            key={l.key}
            style={styles.lessonRow}
            onPress={() => {
              setSelectedLessonKey(l.key);
              setShowLessonQuiz(false);
              setLessonResult(null);
              setView('lessonDetail');
            }}
          >
            <View style={styles.lessonIconWrap}>
              <Icon name={l.icon} size={16} color={colors.primary} />
            </View>
            <Text style={styles.lessonLabel}>{l.title}</Text>
            {levelProgress?.completedLessons.includes(l.key) && <Icon name="check" size={16} color="#2e7d32" />}
            <Text style={styles.lessonChevron}>›</Text>
          </TouchableOpacity>
        ))}
      </Screen>
    );
  }

  // ─────────────────────────── Speaking Practice: hub ───────────────────────────
  if (view === 'speakingPractice') {
    return (
      <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <TouchableOpacity onPress={goHome}>
          <Text style={styles.backLink}>‹ IELTS Life Skills</Text>
        </TouchableOpacity>
        <ScreenHeading icon="mic">Speaking Practice — {LEVEL_LABELS[level]}</ScreenHeading>
        <Text style={styles.subheading}>
          The real exam is spoken, not written — these two parts mirror how the examiner actually tests you.
        </Text>
        {!premium && (
          <Text style={styles.helperNote}>
            Free tier: {Math.max(0, FREE_DAILY_SPEAKING_ATTEMPTS - speakingAttemptsToday)} of {FREE_DAILY_SPEAKING_ATTEMPTS} attempts left today.
          </Text>
        )}

        <HubCard
          icon="message-circle"
          title="Part 1: Everyday Questions"
          description="Answer personal, familiar-topic questions out loud, just like the examiner would ask."
          onPress={() => setView('speakingPart1')}
        />
        <HubCard
          icon="headphones"
          title="Part 2: Listen & Discuss"
          description="Listen to a short clip, take notes, then discuss follow-up questions out loud."
          onPress={() => setView('speakingPart2')}
        />
      </Screen>
    );
  }

  // ─────────────────────────── Speaking Practice: Part 1 ───────────────────────────
  if (view === 'speakingPart1') {
    const q = part1Pool[part1Index % part1Pool.length];
    const minutes = Math.floor(part1Elapsed / 60);
    const seconds = part1Elapsed % 60;

    return (
      <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <TouchableOpacity onPress={() => setView('speakingPractice')}>
          <Text style={styles.backLink}>‹ Speaking Practice</Text>
        </TouchableOpacity>
        <ScreenHeading icon="message-circle">Part 1: Everyday Questions</ScreenHeading>
        <Text style={styles.subheading}>
          Answer out loud, as if the examiner just asked you. There's no pass or fail here — just practice.
        </Text>

        {speakingLimitReached ? (
          <PremiumGate
            icon="mic"
            title="Daily speaking practice limit reached"
            description={`Free tier includes ${FREE_DAILY_SPEAKING_ATTEMPTS} speaking practice attempts a day, resetting tomorrow. Upgrade to Premium for unlimited recordings and attempts.`}
          />
        ) : (
          <>
        <View style={styles.part1TopRow}>
          <Text style={styles.quizProgress}>
            Question {part1Index + 1} of {part1Pool.length}
          </Text>
          <View style={styles.timerRow}>
            <Icon name="clock" size={13} color={colors.textSecondary} />
            <Text style={styles.timerText}>
              {minutes}:{String(seconds).padStart(2, '0')}
            </Text>
          </View>
        </View>

        <View style={styles.part1QuestionCard}>
          <Text style={styles.quizQuestion}>{q.question}</Text>
          <TouchableOpacity style={styles.playButtonSmall} onPress={() => speakBritish(q.question)}>
            <Icon name="volume-2" size={14} color={colors.primary} />
            <Text style={styles.playButtonSmallText}>Hear the question</Text>
          </TouchableOpacity>
        </View>

        {micSupported ? (
          <View style={styles.recordSection}>
            {!isRecording ? (
              <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
                <Icon name="mic" size={16} color={colors.textOnPrimary} />
                <Text style={styles.playButtonText}>Record my answer</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.recordButton, styles.recordButtonActive]} onPress={stopRecording}>
                <Icon name="square" size={16} color={colors.textOnPrimary} />
                <Text style={styles.playButtonText}>Stop recording</Text>
              </TouchableOpacity>
            )}
            {recordedUrl && (
              <TouchableOpacity style={styles.playButtonSmall} onPress={playRecordedAnswer}>
                <Icon name="play-circle" size={14} color={colors.primary} />
                <Text style={styles.playButtonSmallText}>Play my answer back</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={styles.bodyText}>Say your answer out loud, using the timer above to pace yourself.</Text>
        )}

        {part1ShowAnswer ? (
          <View style={styles.exampleAnswerBox}>
            <Text style={styles.exampleAnswerLabel}>Example answer</Text>
            <View style={styles.exampleAnswerRow}>
              <Text style={styles.exampleAnswerText}>{q.exampleAnswer}</Text>
              <TouchableOpacity onPress={() => speakBritish(q.exampleAnswer)} accessibilityLabel="Hear the example answer">
                <Icon name="volume-2" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setPart1ShowAnswer(true)}>
            <Text style={styles.showTranscriptLink}>Show example answer</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.nextButton} onPress={() => setPart1Index((i) => (i + 1) % part1Pool.length)}>
          <Text style={styles.nextButtonText}>Next question →</Text>
        </TouchableOpacity>
          </>
        )}
      </Screen>
    );
  }

  // ─────────────────────────── Speaking Practice: Part 2 ───────────────────────────
  if (view === 'speakingPart2') {
    const listenDiscussBank = LISTEN_DISCUSS_BANKS[level];
    const item = listenDiscussBank[part2Index % listenDiscussBank.length];

    function playClip() {
      speakBritish(item.passage);
      setPart2HasPlayed(true);
    }

    return (
      <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <TouchableOpacity onPress={() => setView('speakingPractice')}>
          <Text style={styles.backLink}>‹ Speaking Practice</Text>
        </TouchableOpacity>
        <ScreenHeading icon="headphones">Part 2: Listen &amp; Discuss</ScreenHeading>
        <Text style={styles.subheading}>Listen to the clip, jot down a few notes, then answer the follow-up questions out loud.</Text>

        {speakingLimitReached ? (
          <PremiumGate
            icon="mic"
            title="Daily speaking practice limit reached"
            description={`Free tier includes ${FREE_DAILY_SPEAKING_ATTEMPTS} speaking practice attempts a day, resetting tomorrow. Upgrade to Premium for unlimited recordings and attempts.`}
          />
        ) : (
          <>
        <Text style={styles.quizProgress}>
          Clip {part2Index + 1} of {listenDiscussBank.length}
        </Text>

        <View style={styles.part1QuestionCard}>
          <Text style={styles.hubCardTitle}>{item.title}</Text>
          <TouchableOpacity style={styles.playButton} onPress={playClip}>
            <Icon name="volume-2" size={16} color={colors.textOnPrimary} />
            <Text style={styles.playButtonText}>{part2HasPlayed ? 'Play again' : 'Play clip'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Your notes</Text>
        <TextInput
          style={styles.notesInput}
          value={part2Notes}
          onChangeText={setPart2Notes}
          placeholder="Jot down a few words while you listen..."
          placeholderTextColor="#999"
          multiline
        />

        {part2HasPlayed ? (
          <>
            <Text style={styles.sectionTitle}>Discuss</Text>
            {item.followUpQuestions.map((question, i) => (
              <View key={i} style={styles.questionCard}>
                <View style={styles.questionRow}>
                  <Text style={styles.questionText}>{question}</Text>
                  <TouchableOpacity onPress={() => speakBritish(question)} accessibilityLabel={`Hear "${question}"`}>
                    <Icon name="volume-2" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <Text style={styles.bodyText}>Answer each question out loud, using your notes above if it helps.</Text>
          </>
        ) : (
          <Text style={styles.bodyText}>Play the clip to reveal the discussion questions.</Text>
        )}

        <TouchableOpacity style={styles.nextButton} onPress={() => setPart2Index((i) => (i + 1) % listenDiscussBank.length)}>
          <Text style={styles.nextButtonText}>Next clip →</Text>
        </TouchableOpacity>
          </>
        )}
      </Screen>
    );
  }

  // ─────────────────────────── Mock Test ───────────────────────────
  if (view === 'mockTest') {
    return (
      <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <TouchableOpacity onPress={goHome}>
          <Text style={styles.backLink}>‹ IELTS Life Skills</Text>
        </TouchableOpacity>
        <ScreenHeading icon="edit-3">Mock Test — {LEVEL_LABELS[level]}</ScreenHeading>
        {mockResult ? (
          <ResultsSummary correct={mockResult.correct} total={mockResult.total} onDone={goHome} />
        ) : (
          <QuizRunner
            questions={mockQuestions}
            onComplete={async (correct, total) => {
              await recordMockTest(level, correct, total);
              setMockResult({ correct, total });
            }}
          />
        )}
      </Screen>
    );
  }

  // ─────────────────────────── Listening ───────────────────────────
  if (view === 'listening') {
    return (
      <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <TouchableOpacity onPress={goHome}>
          <Text style={styles.backLink}>‹ IELTS Life Skills</Text>
        </TouchableOpacity>
        <ScreenHeading icon="headphones">Listening — {LEVEL_LABELS[level]}</ScreenHeading>
        <Text style={styles.subheading}>
          Play the audio, then choose the correct answer — a comprehension exercise to build your ear, not a copy
          of the real exam format.
        </Text>
        {listeningResult ? (
          <ResultsSummary correct={listeningResult.correct} total={listeningResult.total} onDone={goHome} />
        ) : (
          <QuizRunner
            questions={listeningQuestions}
            isListening
            onComplete={async (correct, total) => {
              await recordListeningSession(level, correct, total);
              setListeningResult({ correct, total });
            }}
          />
        )}
      </Screen>
    );
  }

  // ─────────────────────────── Progress Tracker ───────────────────────────
  if (view === 'progress' && progress && levelProgress) {
    return (
      <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <TouchableOpacity onPress={goHome}>
          <Text style={styles.backLink}>‹ IELTS Life Skills</Text>
        </TouchableOpacity>
        <ScreenHeading icon="trending-up">Progress Tracker</ScreenHeading>
        <LevelSelector selected={level} onSelect={selectLevel} />

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <View style={styles.statValueRow}>
              <Icon name="zap" size={16} color={colors.primary} />
              <Text style={styles.statValue}>{progress.streakCount}</Text>
            </View>
            <Text style={styles.statLabel}>Day streak (all levels)</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{levelProgress.completedLessons.length} / {lessons.length}</Text>
            <Text style={styles.statLabel}>{LEVEL_LABELS[level]} lessons completed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{levelProgress.mockTestsTaken}</Text>
            <Text style={styles.statLabel}>{LEVEL_LABELS[level]} mock tests taken</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{averageScore !== null ? `${averageScore}%` : '—'}</Text>
            <Text style={styles.statLabel}>{LEVEL_LABELS[level]} average score</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Weak Topics — {LEVEL_LABELS[level]}</Text>
        {weakTopics.length === 0 ? (
          <Text style={styles.bodyText}>No weak topics yet — keep practising to see where to focus.</Text>
        ) : (
          <>
            {weakTopics.map((topic) => (
              <Text key={topic} style={styles.bodyText}>
                • {lessons.find((l) => l.key === topic)?.title ?? topic}
              </Text>
            ))}
            {premium ? (
              <TouchableOpacity style={styles.drillButton} onPress={() => setView('weakTopicDrill')}>
                <Icon name="zap" size={14} color={colors.textOnPrimary} />
                <Text style={styles.drillButtonText}>Practice My Weak Topics</Text>
              </TouchableOpacity>
            ) : (
              <PremiumGate
                icon="zap"
                title="Personalized weak-topic drills"
                description="Premium builds a custom quiz from the topics you get wrong most often, so your practice time goes straight to what needs work."
              />
            )}
          </>
        )}

        <Text style={styles.sectionTitle}>Recommended Revision</Text>
        <Text style={styles.bodyText}>
          {weakTopics.length > 0
            ? `Focus on: ${weakTopics.map((t) => lessons.find((l) => l.key === t)?.title ?? t).join(', ')}.`
            : levelProgress.completedLessons.length < lessons.length
              ? `Try completing a new ${LEVEL_LABELS[level]} lesson from Learn.`
              : "Great work — take a mock test to keep your skills sharp."}
        </Text>
      </Screen>
    );
  }

  // ─────────────────────────── Practice Plan ───────────────────────────
  if (view === 'practicePlan') {
    return (
      <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <TouchableOpacity onPress={goHome}>
          <Text style={styles.backLink}>‹ IELTS Life Skills</Text>
        </TouchableOpacity>
        <ScreenHeading icon="award">Practice Every Day</ScreenHeading>
        <Text style={styles.subheading}>A 7-day cycle — repeat it until exam day.</Text>
        {PRACTICE_PLAN.map((p, i) => (
          <View key={p.day} style={[styles.planRow, i === todayPlanIndex && styles.planRowToday]}>
            <Text style={styles.planDay}>
              Day {p.day} {i === todayPlanIndex ? '· Today' : ''}
            </Text>
            <Text style={styles.planTitle}>{p.title}</Text>
            <Text style={styles.planDescription}>{p.description}</Text>
          </View>
        ))}
      </Screen>
    );
  }

  // ─────────────────────────── Weak-Topic Drill (Premium) ───────────────────────────
  if (view === 'weakTopicDrill') {
    return (
      <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <TouchableOpacity onPress={goHome}>
          <Text style={styles.backLink}>‹ IELTS Life Skills</Text>
        </TouchableOpacity>
        <ScreenHeading icon="zap">Weak-Topic Drill — {LEVEL_LABELS[level]}</ScreenHeading>
        {!premium ? (
          <PremiumGate
            icon="zap"
            title="Personalized weak-topic drills"
            description="Premium builds a custom quiz from the topics you get wrong most often, so your practice time goes straight to what needs work."
          />
        ) : weakDrillQuestions.length === 0 ? (
          <Text style={styles.bodyText}>
            No weak topics yet — keep practising lessons and mock tests, and a personalized drill will build up here.
          </Text>
        ) : weakDrillResult ? (
          <ResultsSummary correct={weakDrillResult.correct} total={weakDrillResult.total} onDone={goHome} />
        ) : (
          <QuizRunner
            questions={weakDrillQuestions}
            onComplete={(correct, total) => setWeakDrillResult({ correct, total })}
          />
        )}
      </Screen>
    );
  }

  // ─────────────────────────── Study Plan Generator (Premium) ───────────────────────────
  if (view === 'studyPlanGenerator') {
    return (
      <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <TouchableOpacity onPress={goHome}>
          <Text style={styles.backLink}>‹ IELTS Life Skills</Text>
        </TouchableOpacity>
        <ScreenHeading icon="calendar">Study Plan Generator — {LEVEL_LABELS[level]}</ScreenHeading>
        <Text style={styles.subheading}>
          A structured plan built from your remaining lessons and weak topics — pick how many weeks until your exam.
        </Text>

        {!premium ? (
          <PremiumGate
            icon="calendar"
            title="Structured multi-week study plan"
            description="Premium generates a week-by-week plan — new lessons, weak-topic review, mock tests, and listening sessions — sized to how many weeks you have left."
          />
        ) : (
          <>
            <View style={styles.weekPickerRow}>
              {[2, 4, 6, 8].map((w) => (
                <TouchableOpacity
                  key={w}
                  style={[styles.weekChip, studyPlanWeeks === w && styles.weekChipSelected]}
                  onPress={() => setStudyPlanWeeks(w)}
                >
                  <Text style={[styles.weekChipText, studyPlanWeeks === w && styles.weekChipTextSelected]}>
                    {w} weeks
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {studyPlan.map((week) => (
              <View key={week.week} style={styles.planRow}>
                <Text style={styles.planDay}>WEEK {week.week}</Text>
                <Text style={styles.planDescription}>{week.focusNote}</Text>
                {week.lessons.map((l) => (
                  <View key={l.key} style={styles.weekLessonRow}>
                    <Icon name={l.icon} size={13} color={colors.primary} />
                    <Text style={styles.weekLessonText}>{l.title}</Text>
                  </View>
                ))}
                <Text style={styles.weekExtraText}>+ 1 mock test, 1 listening session, daily speaking practice</Text>
              </View>
            ))}
          </>
        )}
      </Screen>
    );
  }

  // ─────────────────────────── Common Questions: category list ───────────────────────────
  if (view === 'commonQuestionsCategory' && category) {
    return (
      <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <TouchableOpacity onPress={() => setView('commonQuestions')}>
          <Text style={styles.backLink}>‹ Common Questions</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>{category.label}</Text>
        {category.questions.map((q, i) => (
          <View key={i} style={styles.questionCard}>
            <View style={styles.questionRow}>
              <Text style={styles.questionText}>{q.question}</Text>
              <TouchableOpacity onPress={() => speakBritish(q.question)} accessibilityLabel={`Hear "${q.question}"`}>
                <Icon name="volume-2" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.exampleAnswerBox}>
              <Text style={styles.exampleAnswerLabel}>Example answer</Text>
              <View style={styles.exampleAnswerRow}>
                <Text style={styles.exampleAnswerText}>{q.exampleAnswer}</Text>
                <TouchableOpacity onPress={() => speakBritish(q.exampleAnswer)} accessibilityLabel={`Hear "${q.exampleAnswer}"`}>
                  <Icon name="volume-2" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </Screen>
    );
  }

  // ─────────────────────────── Common Questions: categories ───────────────────────────
  if (view === 'commonQuestions') {
    return (
      <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <TouchableOpacity onPress={goHome}>
          <Text style={styles.backLink}>‹ IELTS Life Skills</Text>
        </TouchableOpacity>
        <ScreenHeading icon="star">Most Common Questions — {LEVEL_LABELS[level]}</ScreenHeading>
        <Text style={styles.subheading}>Practise saying your answers out loud.</Text>
        {COMMON_QUESTIONS_BY_LEVEL[level].map((c) => (
          <TouchableOpacity
            key={c.key}
            style={styles.lessonRow}
            onPress={() => {
              setSelectedCategoryKey(c.key);
              setView('commonQuestionsCategory');
            }}
          >
            <Text style={styles.lessonLabel}>{c.label}</Text>
            <Text style={styles.lessonChevron}>{c.questions.length} ›</Text>
          </TouchableOpacity>
        ))}
      </Screen>
    );
  }

  // ─────────────────────────── Exam Day Tips ───────────────────────────
  if (view === 'examTips') {
    return (
      <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <TouchableOpacity onPress={goHome}>
          <Text style={styles.backLink}>‹ IELTS Life Skills</Text>
        </TouchableOpacity>
        <ScreenHeading icon="target">Exam Day Tips</ScreenHeading>
        {EXAM_DAY_TIPS.map((tip, i) => (
          <View key={i} style={styles.tipCard}>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.bodyText}>{tip.body}</Text>
          </View>
        ))}
      </Screen>
    );
  }

  // ─────────────────────────── Hub ───────────────────────────
  const meta = SEO_META[level];
  return (
    <Screen style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <ScreenHeading icon="award">IELTS Life Skills — {LEVEL_LABELS[level]}</ScreenHeading>
      <Text style={styles.subheading}>
        UK visas need different English levels at different stages — A1 for a family visa, A2 to extend it, B1 for
        settlement and citizenship. Switch level below if this isn't the one you need.
      </Text>
      <Disclaimer text="Independent practice content, not affiliated with or endorsed by the British Council, IDP, Trinity College London, or UKVI — it doesn't replace the real IELTS Life Skills test or count towards your result." />
      <LevelSelector selected={level} onSelect={selectLevel} />

      {progress && progress.streakCount > 0 && (
        <View style={styles.streakBanner}>
          <Icon name="zap" size={14} color="#c9720a" />
          <Text style={styles.streakBannerText}>{progress.streakCount} day streak — keep it going!</Text>
        </View>
      )}

      <HubCard
        icon="info"
        title="Test Overview"
        description="What the real exam actually involves — format, timing, and what's assessed."
        onPress={() => setView('testOverview')}
      />
      <HubCard
        icon="book-open"
        title="Learn"
        description={`${lessons.length} lessons covering vocabulary, pronunciation, conversations, and mini quizzes.`}
        onPress={() => setView('lessonList')}
      />
      <HubCard
        icon="mic"
        title="Speaking Practice"
        description="Practice the real exam format — answering questions and discussing a listening clip out loud."
        onPress={() => setView('speakingPractice')}
      />
      <HubCard
        icon="edit-3"
        title="Mock Test"
        description="Build your vocabulary and comprehension with multiple-choice practice (the real exam is spoken, not multiple-choice)."
        onPress={() => setView('mockTest')}
      />
      <HubCard
        icon="headphones"
        title="Listening"
        description="Build your listening comprehension by choosing the correct answer — a practice exercise, not the exam format itself."
        onPress={() => setView('listening')}
      />
      <HubCard icon="trending-up" title="Progress Tracker" description="Streaks, scores, and weak topics." onPress={() => setView('progress')} />
      <HubCard icon="award" title="Practice Every Day" description={`Today: ${todayPlan.title}`} onPress={() => setView('practicePlan')} />
      <HubCard
        icon="calendar"
        title="Study Plan Generator"
        description={premium ? 'A structured multi-week plan built around your weak topics.' : 'Premium: a structured multi-week plan built around your weak topics.'}
        onPress={() => setView('studyPlanGenerator')}
      />
      <HubCard icon="star" title="Most Common Questions" description="A growing bank of real speaking questions, by topic." onPress={() => setView('commonQuestions')} />
      <HubCard icon="target" title="Exam Day Tips" description="What to bring, what to expect when you arrive, and common mistakes to avoid." onPress={() => setView('examTips')} />
    </Screen>
  );
}

function HubCard({ icon, title, description, onPress }: { icon: IconName; title: string; description: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.hubCard} onPress={onPress}>
      <View style={styles.hubCardIconWrap}>
        <Icon name={icon} size={22} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.hubCardTitle}>{title}</Text>
        <Text style={styles.hubCardDescription}>{description}</Text>
      </View>
      <Text style={styles.lessonChevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  heading: { fontSize: 24, fontWeight: '700' },
  subheading: { fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 20 },
  backLink: { fontSize: 15, color: '#1a3c6e', fontWeight: '600', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 24, marginBottom: 10 },
  bodyText: { fontSize: 14, color: '#444', lineHeight: 20, marginBottom: 6 },

  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff3e0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  streakBannerText: { fontSize: 13, fontWeight: '700', color: '#c9720a' },

  hubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  hubCardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eef2f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  hubCardTitle: { fontSize: 16, fontWeight: '700', color: '#222' },
  hubCardDescription: { fontSize: 12, color: '#666', marginTop: 3, lineHeight: 16 },

  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lessonIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#eef2f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lessonLabel: { fontSize: 15, fontWeight: '600', color: '#222', flex: 1 },
  lessonDone: { fontSize: 14, color: '#2e7d32', fontWeight: '700', marginRight: 8 },
  lessonChevron: { fontSize: 14, color: '#999', marginLeft: 6 },

  vocabRow: { backgroundColor: '#f7f8fa', borderRadius: 10, padding: 12, marginBottom: 8 },
  vocabWordRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  vocabWord: { fontSize: 15, fontWeight: '700', color: '#1a3c6e' },
  vocabMeaning: { fontSize: 13, color: '#444', marginTop: 2 },
  vocabExample: { fontSize: 12, color: '#777', marginTop: 4, fontStyle: 'italic' },

  conversationLine: { fontSize: 14, color: '#333', lineHeight: 22, marginBottom: 4 },
  conversationSpeaker: { fontWeight: '700', color: '#1a3c6e' },

  playButtonSmall: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, marginBottom: 8 },
  playButtonSmallText: { color: '#1a3c6e', fontWeight: '600', fontSize: 14 },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1a3c6e',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  playButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  primaryButton: { backgroundColor: '#1a3c6e', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 20 },
  primaryButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  quizProgress: { fontSize: 12, color: '#999', marginBottom: 10 },
  quizQuestion: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 16, lineHeight: 24 },
  listeningBox: { alignItems: 'flex-start' },
  showTranscriptLink: { fontSize: 13, color: '#1a3c6e', fontWeight: '600', textDecorationLine: 'underline', marginBottom: 16 },

  factsCard: { backgroundColor: '#f7f8fa', borderRadius: 12, padding: 16, marginBottom: 8, gap: 12 },
  factRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  factText: { flex: 1, fontSize: 14, color: '#333', lineHeight: 20 },
  factLabel: { fontWeight: '700', color: '#1a3c6e' },

  part1TopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  timerText: { fontSize: 12, color: '#666', fontVariant: ['tabular-nums'] },
  part1QuestionCard: { backgroundColor: '#f7f8fa', borderRadius: 12, padding: 16, marginBottom: 14 },

  recordSection: { marginBottom: 6 },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1a3c6e',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  recordButtonActive: { backgroundColor: '#c0392b' },

  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#222',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 8,
  },

  optionButton: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, marginBottom: 10 },
  optionCorrect: { borderColor: '#2e7d32', backgroundColor: '#e8f5e9' },
  optionWrong: { borderColor: '#c0392b', backgroundColor: '#fdecea' },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionText: { fontSize: 15, color: '#222', flex: 1, marginRight: 8 },

  nextButton: { backgroundColor: '#1a3c6e', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 10 },
  nextButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  resultsCard: { backgroundColor: '#f7f8fa', borderRadius: 14, padding: 24, alignItems: 'center', marginTop: 20 },
  resultsScore: { fontSize: 32, fontWeight: '700', color: '#1a3c6e' },
  resultsPercent: { fontSize: 14, color: '#666', marginTop: 4, marginBottom: 20 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statBox: { width: '47%', backgroundColor: '#f7f8fa', borderRadius: 12, padding: 14 },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statValue: { fontSize: 20, fontWeight: '700', color: '#1a3c6e' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },

  planRow: { backgroundColor: '#f7f8fa', borderRadius: 12, padding: 14, marginBottom: 10 },
  planRowToday: { backgroundColor: '#eef2f8', borderWidth: 1, borderColor: '#1a3c6e' },
  planDay: { fontSize: 12, fontWeight: '700', color: '#8a8471', letterSpacing: 0.4 },
  planTitle: { fontSize: 16, fontWeight: '700', color: '#222', marginTop: 4 },
  planDescription: { fontSize: 13, color: '#666', marginTop: 2, lineHeight: 18 },

  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: 14,
    marginBottom: 10,
  },
  questionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: { fontSize: 14, fontWeight: '600', color: '#222', flex: 1, marginRight: 10, lineHeight: 20 },
  exampleAnswerBox: {
    backgroundColor: '#f7f8fa',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  exampleAnswerLabel: { fontSize: 11, fontWeight: '700', color: '#1a3c6e', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 },
  exampleAnswerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exampleAnswerText: { fontSize: 14, color: '#333', flex: 1, marginRight: 10, lineHeight: 20, fontStyle: 'italic' },

  tipCard: { backgroundColor: '#f7f8fa', borderRadius: 12, padding: 16, marginBottom: 12 },
  tipTitle: { fontSize: 15, fontWeight: '700', color: '#1a3c6e', marginBottom: 6 },

  helperNote: { fontSize: 12, color: '#8a6d00', marginTop: 4, marginBottom: 4, fontWeight: '600' },
  drillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#1a3c6e',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  drillButtonText: { color: '#fff', fontWeight: '600', fontSize: 13.5 },
  weekPickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10, marginBottom: 16 },
  weekChip: { borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14 },
  weekChipSelected: { backgroundColor: '#1a3c6e', borderColor: '#1a3c6e' },
  weekChipText: { fontSize: 13, color: '#333' },
  weekChipTextSelected: { color: '#fff', fontWeight: '600' },
  weekLessonRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  weekLessonText: { fontSize: 13, color: '#333' },
  weekExtraText: { fontSize: 12, color: '#888', marginTop: 8, fontStyle: 'italic' },

  levelSelectorRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  levelPill: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  levelPillSelected: { backgroundColor: '#1a3c6e', borderColor: '#1a3c6e' },
  levelPillLabel: { fontSize: 12.5, fontWeight: '700', color: '#222', textAlign: 'center' },
  levelPillLabelSelected: { color: '#fff' },
  levelPillStage: { fontSize: 10.5, color: '#888', marginTop: 2, textAlign: 'center' },
  levelPillStageSelected: { color: '#cfe0f5' },

  levelContextBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#eef2f8',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  levelContextText: { flex: 1, fontSize: 13, color: '#1a3c6e', lineHeight: 18, fontWeight: '600' },

  citizenshipNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#fff8e1',
    borderRadius: 10,
    padding: 14,
    marginTop: 20,
  },
  citizenshipNoteText: { flex: 1, fontSize: 13, color: '#6b5900', lineHeight: 19 },
});
