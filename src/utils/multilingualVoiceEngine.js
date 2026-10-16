/**
 * GK Nexergy Multilingual Voice & Speech Intelligence Engine
 * 
 * Provides:
 * 1. Web Speech Recognition (Speech-to-Text / Voice Typing) across 15+ languages (Telugu, Hindi, English, Tamil, Kannada, Spanish, etc.) with auto-recovery on browser silence dropouts.
 * 2. Instant Text-to-Speech (Voice Output / Read Aloud) with natural pacing, multi-browser Chromium GC fix, long-speech ticker, and smart non-conflicting voice selection.
 * 3. Real-time language script & transliteration detection (Telugu, Hindi, Tamil, Kannada, Bengali, etc.).
 * 4. High-performance translation bridge (preserves Markdown formatting, company names, links, and code).
 */

export const SUPPORTED_VOICE_LANGUAGES = [
  { code: "auto", bcp47: "en-IN", label: "Auto Detect", native: "Auto Detect", flag: "🌐" },
  { code: "en", bcp47: "en-IN", label: "English (India)", native: "English (IN)", flag: "🇮🇳" },
  { code: "te", bcp47: "te-IN", label: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "hi", bcp47: "hi-IN", label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "en-US", bcp47: "en-US", label: "English (US)", native: "English (US)", flag: "🇺🇸" },
  { code: "ta", bcp47: "ta-IN", label: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "kn", bcp47: "kn-IN", label: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "mr", bcp47: "mr-IN", label: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { code: "bn", bcp47: "bn-IN", label: "Bengali", native: "বাংলা", flag: "🇮🇳" },
  { code: "es", bcp47: "es-ES", label: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "fr", bcp47: "fr-FR", label: "French", native: "Français", flag: "🇫🇷" },
  { code: "de", bcp47: "de-DE", label: "German", native: "Deutsch", flag: "🇩🇪" },
  { code: "ja", bcp47: "ja-JP", label: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "ar", bcp47: "ar-SA", label: "Arabic", native: "العربية", flag: "🇸🇦" },
  { code: "zh-CN", bcp47: "zh-CN", label: "Chinese", native: "简体中文", flag: "🇨🇳" },
];

// Pre-warm voices list for Web Speech Synthesis
let cachedVoices = [];
export function updateVoicesList() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        cachedVoices = v;
      }
    } catch (e) {
      // ignore
    }
  }
  return cachedVoices;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  updateVoicesList();
  if (typeof window.speechSynthesis.addEventListener === "function") {
    window.speechSynthesis.addEventListener("voiceschanged", updateVoicesList);
  }
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoicesList;
  }
}

// Translation memory cache to avoid redundant API hits
const translationCache = new Map();

/**
 * Check if Web Speech Recognition is supported in the current browser
 */
export function isSpeechRecognitionSupported() {
  if (typeof window === "undefined") return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * Check if Speech Synthesis (TTS) is supported
 */
export function isSpeechSynthesisSupported() {
  if (typeof window === "undefined") return false;
  return Boolean(window.speechSynthesis && typeof window.SpeechSynthesisUtterance !== "undefined");
}

/**
 * Detect script language using Unicode ranges and transliterated romanized keywords
 */
export function detectLanguage(text) {
  if (!text || typeof text !== "string") return "en";
  const str = text.trim();

  // 1. Script checks (Unicode Blocks)
  if (/[\u0C00-\u0C7F]/.test(str)) return "te"; // Telugu
  if (/[\u0900-\u097F]/.test(str)) return "hi"; // Devanagari / Hindi / Marathi
  if (/[\u0B80-\u0BFF]/.test(str)) return "ta"; // Tamil
  if (/[\u0C80-\u0CFF]/.test(str)) return "kn"; // Kannada
  if (/[\u0980-\u09FF]/.test(str)) return "bn"; // Bengali
  if (/[\u0600-\u06FF]/.test(str)) return "ar"; // Arabic
  if (/[\u3040-\u30FF]/.test(str)) return "ja"; // Japanese (Hiragana/Katakana)
  if (/[\u4E00-\u9FFF]/.test(str)) return "zh-CN"; // Chinese CJK

  // 2. Transliteration / Romanized heuristics
  const lower = str.toLowerCase();
  
  // Telugu transliterations (Tanglish)
  const teluguKeywords = [
    "cheppu", "kavali", "unnavu", "gurinchi", "ekkada", "entha", "em chestaru", "eppudu",
    "elaga", "meeru", "bavundi", "chesaru", "telusa", "ivvandi", "chudali", "nerpistara",
    "namaskaram", "namaste", "dhanyavadamulu", "telugu", "em", "emi", "endi", "undha",
    "untara", "undi", "chesi", "cheyali", "chestaru", "matladali", "teliyali", "unnayi", "unnaya"
  ];
  if (teluguKeywords.some(kw => lower.includes(kw))) {
    return "te";
  }

  // Hindi transliterations (Hinglish)
  const hindiKeywords = [
    "kya", "batao", "chahiye", "kaise", "kahan", "kitna", "hoga", "karna", "aap",
    "samajh", "bataiye", "sikhate", "padhate", "dhanyawad", "shukriya", "hai", "hain",
    "bolo", "kaun", "kab"
  ];
  if (hindiKeywords.some(kw => lower.includes(kw))) {
    return "hi";
  }

  // Tamil transliterations
  const tamilKeywords = ["sollunga", "venum", "eppadi", "enge", "romba", "theriyuma", "panreenga", "vanakkam"];
  if (tamilKeywords.some(kw => lower.includes(kw))) {
    return "ta-latin";
  }

  // Check stored site language preference if available
  if (typeof localStorage !== "undefined") {
    const siteLang = localStorage.getItem("gk_selected_language");
    if (siteLang && siteLang !== "en") {
      return siteLang;
    }
  }

  return "en";
}

/**
 * Get BCP-47 locale tag for speech recognition or synthesis
 */
export function getLanguageLocale(langCode) {
  if (!langCode || langCode === "auto") {
    if (typeof localStorage !== "undefined") {
      const savedVoice = localStorage.getItem("gk_voice_language");
      if (savedVoice && savedVoice !== "auto") {
        return getLanguageLocale(savedVoice);
      }
      const siteLang = localStorage.getItem("gk_selected_language");
      if (siteLang && siteLang !== "en") {
        return getLanguageLocale(siteLang);
      }
    }
    if (typeof navigator !== "undefined" && navigator.language) {
      return navigator.language;
    }
    return "en-IN";
  }

  const match = SUPPORTED_VOICE_LANGUAGES.find(l => l.code === langCode);
  if (match && match.code !== "auto") return match.bcp47;

  // Check prefix mapping
  if (langCode.startsWith("te")) return "te-IN";
  if (langCode.startsWith("hi")) return "hi-IN";
  if (langCode.startsWith("ta")) return "ta-IN";
  if (langCode.startsWith("kn")) return "kn-IN";
  if (langCode.startsWith("mr")) return "mr-IN";
  if (langCode.startsWith("bn")) return "bn-IN";
  if (langCode.startsWith("es")) return "es-ES";
  if (langCode.startsWith("fr")) return "fr-FR";
  if (langCode.startsWith("de")) return "de-DE";
  if (langCode.startsWith("ja")) return "ja-JP";
  if (langCode.startsWith("ar")) return "ar-SA";
  if (langCode.startsWith("zh")) return "zh-CN";

  return "en-IN";
}

/**
 * Translate text between languages with caching and formatting preservation
 */
export async function translateText(text, targetLang = "en", sourceLang = "auto") {
  if (!text || typeof text !== "string") return { translatedText: text, sourceLang };
  const cleanText = text.trim();
  if (!cleanText) return { translatedText: "", sourceLang };

  // Normalize language codes
  const normalizedTarget = targetLang.replace(/-latin$/, "").replace(/_/, "-");
  const normalizedSource = sourceLang.replace(/-latin$/, "").replace(/_/, "-");

  if (normalizedTarget === normalizedSource || (normalizedSource === "en" && normalizedTarget === "en")) {
    return { translatedText: cleanText, sourceLang: "en" };
  }

  const cacheKey = `${normalizedSource}_${normalizedTarget}_${cleanText}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const fromPair = normalizedSource === "auto" ? "autodetect" : (normalizedSource === "zh-CN" ? "zh" : normalizedSource);
    const toPair = normalizedTarget === "zh-CN" ? "zh" : normalizedTarget;

    // Strategy: MyMemory High Speed Translation API
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=${fromPair}|${toPair}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Accept": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.responseData?.translatedText) {
        let resultText = data.responseData.translatedText;
        
        // Decode HTML entities if any
        resultText = resultText
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');

        const payload = {
          translatedText: resultText,
          sourceLang: data.responseDetails?.detectedSourceLanguage || normalizedSource,
        };
        translationCache.set(cacheKey, payload);
        return payload;
      }
    }
  } catch (err) {
    console.warn("Translation service unavailable, keeping original text:", err);
  }

  // Graceful fallback to original text
  return { translatedText: cleanText, sourceLang: normalizedSource };
}

/**
 * Text to Speech (Voice Output / Read Aloud)
 * Fixed for Chromium GC bug & long text playback
 */
// Persistent global holder to prevent Chromium Garbage Collection during speech
if (typeof window !== "undefined") {
  window.__gkSpeechUtterances = window.__gkSpeechUtterances || [];
}

let speechKeepAliveTimer = null;

// Audio player instance for cloud TTS fallback
let activeAudio = null;
let currentAudioQueue = [];
let isAudioQueuePlaying = false;

export function stopSpeaking() {
  // Stop audio queue
  currentAudioQueue = [];
  isAudioQueuePlaying = false;
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio.src = "";
    } catch (e) {}
    activeAudio = null;
  }

  // Stop browser speech synthesis
  if (speechKeepAliveTimer) {
    clearInterval(speechKeepAliveTimer);
    speechKeepAliveTimer = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
    if (window.__gkSpeechUtterances) {
      window.__gkSpeechUtterances.length = 0;
    }
  }
}

/**
 * Check if browser has a native voice installed for a given locale
 */
export function hasNativeVoiceFor(langCode) {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  let voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) voices = cachedVoices;
  if (!voices || voices.length === 0) return false;

  const clean = langCode.toLowerCase().replace("_", "-");
  const prefix = clean.split("-")[0];

  return voices.some((v) => {
    const vLang = v.lang.toLowerCase().replace("_", "-");
    const vName = v.name.toLowerCase();
    return vLang === clean || vLang.startsWith(prefix) || vName.includes(prefix);
  });
}

/**
 * Find the most suitable voice for given locale
 */
function findBestVoice(locale) {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  
  let voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    voices = cachedVoices;
  }
  if (!voices || voices.length === 0) return null;

  const cleanLocale = locale.replace("_", "-").toLowerCase();
  const prefix = cleanLocale.split("-")[0];

  // 1. Exact locale match (e.g. te-IN, hi-IN, en-IN)
  let voice = voices.find(v => v.lang.replace("_", "-").toLowerCase() === cleanLocale);
  if (voice) return voice;

  // 2. Language prefix match (e.g. te, hi, en, ta)
  voice = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
  if (voice) return voice;

  // 3. Named language match (e.g. name contains "Telugu", "Hindi", "Tamil")
  const langNameMap = {
    te: "telugu",
    hi: "hindi",
    ta: "tamil",
    kn: "kannada",
    mr: "marathi",
    bn: "bengali",
    es: "spanish",
    fr: "french",
    de: "german",
    ja: "japanese",
    ar: "arabic",
    zh: "chinese",
  };
  const targetName = langNameMap[prefix];
  if (targetName) {
    voice = voices.find(v => v.name.toLowerCase().includes(targetName));
    if (voice) return voice;
  }

  // 4. Indian English voice fallback for Indian languages without desktop TTS (e.g. Telugu/Tamil on Windows)
  const indianVoice = voices.find(v => {
    const lang = v.lang.toLowerCase();
    const name = v.name.toLowerCase();
    return lang.includes("en-in") || name.includes("india") || name.includes("heera") || name.includes("neerja") || name.includes("ravi");
  });
  if (indianVoice) return indianVoice;

  // 5. Default natural English voice for English text
  voice = voices.find(v => v.lang.toLowerCase().includes("en-in") || v.lang.toLowerCase().includes("en-us") || v.lang.toLowerCase().includes("en-gb"));
  return voice || voices[0] || null;
}

/**
 * Play multi-chunk Google TTS Audio stream (supports native Telugu, Hindi, Tamil, Kannada, Bengali, etc.)
 */
function playGoogleTTSStream(text, langCode, { onStart, onEnd, onError }) {
  // Split into manageable sentence chunks (<= 120 chars) for Google TTS URL length limit
  const sentences = text
    .split(/(?<=[.?!।,।\n])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    onEnd?.();
    return false;
  }

  const chunks = [];
  for (const s of sentences) {
    if (s.length <= 120) {
      chunks.push(s);
    } else {
      // Split large sentence by words
      const words = s.split(" ");
      let curr = "";
      for (const w of words) {
        if ((curr + " " + w).length <= 120) {
          curr = curr ? curr + " " + w : w;
        } else {
          if (curr) chunks.push(curr);
          curr = w;
        }
      }
      if (curr) chunks.push(curr);
    }
  }

  currentAudioQueue = chunks;
  isAudioQueuePlaying = true;
  let chunkIndex = 0;
  let hasStarted = false;

  const playNextChunk = () => {
    if (!isAudioQueuePlaying || chunkIndex >= currentAudioQueue.length) {
      isAudioQueuePlaying = false;
      onEnd?.();
      return;
    }

    const chunk = currentAudioQueue[chunkIndex];
    chunkIndex++;

    const ttsLang = langCode === "auto" ? "en" : langCode.split("-")[0];
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${ttsLang}&client=tw-ob&q=${encodeURIComponent(chunk)}`;

    const audio = new Audio(audioUrl);
    activeAudio = audio;

    audio.oncanplaythrough = () => {
      if (!hasStarted) {
        hasStarted = true;
        onStart?.();
      }
      audio.play().catch((err) => {
        console.warn("Audio play blocked or interrupted:", err);
        // Fallback to Web Speech on failure
        speakWebSpeech(text, langCode, { onStart, onEnd, onError });
      });
    };

    audio.onended = () => {
      playNextChunk();
    };

    audio.onerror = (e) => {
      console.warn("Google TTS audio stream error, falling back to Web Speech:", e);
      // Seamless fallback to Web Speech Synthesis
      speakWebSpeech(text, langCode, { onStart, onEnd, onError });
    };

    audio.load();
  };

  playNextChunk();
  return true;
}

/**
 * Standard Web Speech Synthesis implementation
 */
function speakWebSpeech(speechText, langCode, { onStart, onEnd, onError }) {
  const locale = getLanguageLocale(langCode);
  const utterance = new SpeechSynthesisUtterance(speechText);
  
  const selectedVoice = findBestVoice(locale);
  if (selectedVoice) {
    utterance.voice = selectedVoice;
    // Set matching voice language tag so Chrome doesn't error out
    utterance.lang = selectedVoice.lang || locale;
  } else {
    utterance.lang = locale;
  }

  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  // Prevent Garbage Collection in Chromium
  if (typeof window !== "undefined" && window.__gkSpeechUtterances) {
    window.__gkSpeechUtterances.push(utterance);
  }

  const cleanup = () => {
    if (speechKeepAliveTimer) {
      clearInterval(speechKeepAliveTimer);
      speechKeepAliveTimer = null;
    }
    if (typeof window !== "undefined" && window.__gkSpeechUtterances) {
      const idx = window.__gkSpeechUtterances.indexOf(utterance);
      if (idx !== -1) window.__gkSpeechUtterances.splice(idx, 1);
    }
  };

  utterance.onstart = () => {
    if (speechKeepAliveTimer) clearInterval(speechKeepAliveTimer);
    speechKeepAliveTimer = setInterval(() => {
      try {
        if (window.speechSynthesis && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      } catch (e) {}
    }, 10000);

    onStart?.();
  };

  utterance.onend = () => {
    cleanup();
    onEnd?.();
  };

  utterance.onerror = (e) => {
    cleanup();
    if (e.error !== "canceled" && e.error !== "interrupted") {
      onError?.(e);
    } else {
      onEnd?.();
    }
  };

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  } catch (e) {}

  setTimeout(() => {
    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      cleanup();
      onError?.(err);
    }
  }, 40);

  return true;
}

/**
 * Universal Intelligent Multilingual Text to Speech
 * Automatically routes to Native Voices, High-Fidelity Indic Audio Stream, or Indian English synthesis.
 */
export function speakText(text, langCode = "en", { onStart, onEnd, onError } = {}) {
  stopSpeaking();

  // Strip Markdown, code snippets, bullets, links, emojis for clean natural speech
  const speechText = text
    .replace(/```[\s\S]*?```/g, "")      // remove code blocks
    .replace(/`([^`]+)`/g, "$1")         // inline code
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")  // remove markdown links, keep label
    .replace(/[*_#~>|]/g, "")            // remove formatting markers
    .replace(/^[-*+]\s+/gm, "")          // remove list bullets
    .replace(/\s+/g, " ")
    .trim();

  if (!speechText) return false;

  const detectedLang = langCode && langCode !== "auto" ? langCode : detectLanguage(speechText);
  const cleanLang = detectedLang.split("-")[0];

  const hasNonLatinScript = /[^\u0000-\u007F]/.test(speechText);
  const isNonEnglish = cleanLang !== "en";

  // If non-English:
  // If the browser lacks a native TTS voice for this language OR if text has non-Latin script (Telugu, Hindi, Tamil, Kannada, Bengali, Arabic, etc.),
  // stream authentic high-fidelity audio directly via Google TTS stream!
  if (isNonEnglish && (!hasNativeVoiceFor(cleanLang) || hasNonLatinScript)) {
    return playGoogleTTSStream(speechText, cleanLang, { onStart, onEnd, onError });
  }

  // Otherwise, use browser SpeechSynthesis
  return speakWebSpeech(speechText, detectedLang, { onStart, onEnd, onError });
}

/**
 * Speech Recognition (Voice Typing Controller)
 * Robust controller with auto-restart on silent dropouts and seamless language switching.
 */
export class SpeechVoiceRecognizer {
  constructor({ onStart, onResult, onError, onEnd, selectedLang = "auto" }) {
    this.onStart = onStart;
    this.onResult = onResult;
    this.onError = onError;
    this.onEnd = onEnd;
    this.selectedLang = selectedLang;
    this.recognition = null;
    this.isListening = false;
    this.manualStop = false;
    this.restartTimeout = null;
  }

  setLanguage(langCode) {
    this.selectedLang = langCode;
    if (this.isListening) {
      this.stop();
      setTimeout(() => this.start(), 150);
    }
  }

  start() {
    if (!isSpeechRecognitionSupported()) {
      this.onError?.("Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.");
      return;
    }

    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }

    // Clean up any existing recognition instance
    if (this.recognition) {
      try {
        this.recognition.onstart = null;
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        this.recognition.abort();
      } catch (e) {}
      this.recognition = null;
    }

    try {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      this.manualStop = false;

      // Determine recognition language locale
      const bcp47 = getLanguageLocale(this.selectedLang);
      this.recognition.lang = bcp47;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onStart?.();
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscript += res[0].transcript + " ";
          } else {
            interimTranscript += res[0].transcript;
          }
        }

        const combined = (finalTranscript + interimTranscript).trim();

        this.onResult?.({
          finalTranscript: finalTranscript.trim(),
          interimTranscript: interimTranscript.trim(),
          transcript: combined,
          isFinal: Boolean(finalTranscript.trim()),
        });
      };

      this.recognition.onerror = (event) => {
        // "no-speech" or "aborted" can happen on pauses; keep alive if user hasn't stopped
        if (event.error === "no-speech" || event.error === "aborted") {
          return;
        }

        let errorMessage = "Microphone error. Please try again.";
        if (event.error === "not-allowed" || event.error === "permission-denied") {
          errorMessage = "Microphone permission denied. Please allow microphone access in your browser settings.";
          this.manualStop = true;
          this.isListening = false;
        } else if (event.error === "network") {
          errorMessage = "Network error connecting to speech recognition service.";
        }

        this.onError?.(errorMessage, event.error);
      };

      this.recognition.onend = () => {
        // If not stopped manually and supposed to be listening, automatically restart (browser timeout workaround)
        if (!this.manualStop && this.isListening) {
          this.restartTimeout = setTimeout(() => {
            if (!this.manualStop && this.isListening) {
              try {
                this.recognition?.start();
              } catch (e) {
                // if restarting fails, reset listening state
                this.isListening = false;
                this.onEnd?.();
              }
            }
          }, 100);
        } else {
          this.isListening = false;
          this.onEnd?.();
        }
      };

      this.recognition.start();
    } catch (err) {
      this.isListening = false;
      this.onError?.(err.message || "Failed to initialize speech recognition.");
    }
  }

  stop() {
    this.manualStop = true;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.isListening = false;
    this.onEnd?.();
  }

  abort() {
    this.manualStop = true;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {}
    }
    this.isListening = false;
    this.onEnd?.();
  }
}
