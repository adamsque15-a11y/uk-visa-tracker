import * as Speech from 'expo-speech';

// Slower than the 1.0 default — this is for language learners, not native
// speakers, so clarity matters more than natural pace.
const SPEECH_RATE = 0.7;

// Real named voices (not the character "persona" voices like Eddy/Flo/Grandma/
// Grandpa/Reed/Rocko/Sandy/Shelley, which read as more novelty than natural)
// that sound clearest for language learners, in preference order. Used as a
// tie-breaker when nothing on the device is explicitly flagged Enhanced/Premium.
const PREFERRED_VOICE_NAMES = ['Daniel', 'Serena', 'Kate', 'Stephanie', 'Arthur', 'Martha', 'Malcolm'];

let cachedBritishVoiceId: string | null | undefined; // undefined = not looked up yet

async function getBritishVoiceId(): Promise<string | null> {
  if (cachedBritishVoiceId !== undefined) return cachedBritishVoiceId;

  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const britishVoices = voices.filter((v) => v.language?.toLowerCase().startsWith('en-gb'));

    // Prefer a device voice explicitly flagged as higher quality. Note: on
    // web, expo-speech always reports quality "Default" (the browser's
    // Speech Synthesis API doesn't expose this), so this only has an effect
    // on iOS/Android — and even there, "Enhanced"/"Premium" voices only show
    // up if the user has downloaded them (Settings > Accessibility >
    // Spoken Content > Voices on iOS). Without one, TTS has a quality
    // ceiling no amount of tuning here can fully fix.
    const isHighQuality = (v: Speech.Voice) =>
      /enhanced|premium|neural|natural|wavenet/i.test(v.quality ?? '') || /enhanced|premium|neural|natural|wavenet/i.test(v.name ?? '');

    const byPreferredName = (v: Speech.Voice) => PREFERRED_VOICE_NAMES.findIndex((name) => v.name?.includes(name));

    const ranked = [...britishVoices].sort((a, b) => {
      const qualityDiff = Number(isHighQuality(b)) - Number(isHighQuality(a));
      if (qualityDiff !== 0) return qualityDiff;
      const aRank = byPreferredName(a);
      const bRank = byPreferredName(b);
      return (aRank === -1 ? Infinity : aRank) - (bRank === -1 ? Infinity : bRank);
    });

    cachedBritishVoiceId = ranked[0]?.identifier ?? null;
  } catch {
    cachedBritishVoiceId = null;
  }

  return cachedBritishVoiceId;
}

/** Speaks text slowly with a British English accent, used across the English Prep pages. */
export async function speakBritish(text: string) {
  const voice = await getBritishVoiceId();
  Speech.speak(text, {
    language: 'en-GB',
    rate: SPEECH_RATE,
    ...(voice ? { voice } : {}),
  });
}
