"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

type AudioScene =
  | "home"
  | "album"
  | "sobres"
  | "figuritas";

type AudioCue =
  | "hover"
  | "objectSelect"
  | "bookOpen"
  | "pageTurn"
  | "packTake"
  | "packTear"
  | "paperReveal"
  | "pasteLift"
  | "pasteSnap"
  | "filterTap"
  | "viewerOpen"
  | "rareSpecial"
  | "rareGold"
  | "rareLegendary"
  | "rareHito";

type CinematicAudioValue = {
  audioReady: boolean;
  setScene: (scene: AudioScene) => void;
  playCue: (cue: AudioCue) => void;
};

type WindowWithWebkitAudio = Window & {
  webkitAudioContext?: typeof AudioContext;
};

const CinematicAudioContext =
  createContext<CinematicAudioValue | null>(null);

const createNoiseBuffer = (
  audioContext: AudioContext,
  duration: number
) => {
  const length = Math.max(
    1,
    Math.floor(audioContext.sampleRate * duration)
  );
  const buffer = audioContext.createBuffer(
    1,
    length,
    audioContext.sampleRate
  );
  const data = buffer.getChannelData(0);

  for (let index = 0; index < length; index++) {
    data[index] = Math.random() * 2 - 1;
  }

  return buffer;
};

const rampGain = (
  gain: GainNode,
  startValue: number,
  peakValue: number,
  endTime: number,
  now: number
) => {
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(startValue, now);
  gain.gain.linearRampToValueAtTime(peakValue, now + 0.035);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + endTime);
};

export function CinematicAudioProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const ambientSourceRef =
    useRef<AudioBufferSourceNode | null>(null);
  const ambientFilterRef = useRef<BiquadFilterNode | null>(null);
  const sceneRef = useRef<AudioScene>("home");
  const [audioReady, setAudioReady] = useState(false);

  const ensureAudio = useCallback(() => {
    if (typeof window === "undefined") {
      return null;
    }

    if (audioContextRef.current) {
      if (audioContextRef.current.state === "suspended") {
        void audioContextRef.current.resume();
      }

      return audioContextRef.current;
    }

    const AudioConstructor =
      window.AudioContext ??
      (window as WindowWithWebkitAudio).webkitAudioContext;

    if (!AudioConstructor) {
      return null;
    }

    const audioContext = new AudioConstructor();
    const masterGain = audioContext.createGain();
    const ambientGain = audioContext.createGain();
    const ambientFilter = audioContext.createBiquadFilter();
    const ambientSource = audioContext.createBufferSource();

    masterGain.gain.value = 0.22;
    ambientGain.gain.value = 0.018;
    ambientFilter.type = "lowpass";
    ambientFilter.frequency.value = 520;
    ambientFilter.Q.value = 0.45;

    ambientSource.buffer = createNoiseBuffer(audioContext, 2.8);
    ambientSource.loop = true;
    ambientSource.playbackRate.value = 0.32;

    ambientSource
      .connect(ambientFilter)
      .connect(ambientGain)
      .connect(masterGain)
      .connect(audioContext.destination);

    ambientSource.start();

    audioContextRef.current = audioContext;
    masterGainRef.current = masterGain;
    ambientGainRef.current = ambientGain;
    ambientSourceRef.current = ambientSource;
    ambientFilterRef.current = ambientFilter;
    setAudioReady(true);

    return audioContext;
  }, []);

  const setScene = useCallback((scene: AudioScene) => {
    sceneRef.current = scene;

    const audioContext = audioContextRef.current;
    const ambientGain = ambientGainRef.current;
    const ambientFilter = ambientFilterRef.current;

    if (!audioContext || !ambientGain || !ambientFilter) {
      return;
    }

    const now = audioContext.currentTime;
    const targetGain =
      scene === "sobres"
        ? 0.014
        : scene === "album"
          ? 0.017
          : scene === "figuritas"
            ? 0.013
            : 0.018;
    const targetFrequency =
      scene === "sobres"
        ? 720
        : scene === "album"
          ? 460
          : scene === "figuritas"
            ? 620
            : 520;

    ambientGain.gain.cancelScheduledValues(now);
    ambientGain.gain.linearRampToValueAtTime(
      targetGain,
      now + 0.8
    );
    ambientFilter.frequency.cancelScheduledValues(now);
    ambientFilter.frequency.linearRampToValueAtTime(
      targetFrequency,
      now + 0.8
    );
  }, []);

  const playNoiseCue = useCallback(
    (
      audioContext: AudioContext,
      duration: number,
      frequency: number,
      gainValue: number,
      type: BiquadFilterType = "bandpass"
    ) => {
      const masterGain = masterGainRef.current;

      if (!masterGain) {
        return;
      }

      const source = audioContext.createBufferSource();
      const filter = audioContext.createBiquadFilter();
      const gain = audioContext.createGain();
      const now = audioContext.currentTime;

      source.buffer = createNoiseBuffer(audioContext, duration);
      filter.type = type;
      filter.frequency.value = frequency;
      filter.Q.value = 0.72;
      rampGain(gain, 0.0001, gainValue, duration, now);

      source
        .connect(filter)
        .connect(gain)
        .connect(masterGain);

      source.start(now);
      source.stop(now + duration + 0.04);
    },
    []
  );

  const playToneCue = useCallback(
    (
      audioContext: AudioContext,
      frequency: number,
      duration: number,
      gainValue: number,
      type: OscillatorType = "sine"
    ) => {
      const masterGain = masterGainRef.current;

      if (!masterGain) {
        return;
      }

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const now = audioContext.currentTime;

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(
        frequency * 1.12,
        now + duration
      );
      rampGain(gain, 0.0001, gainValue, duration, now);

      oscillator.connect(gain).connect(masterGain);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.04);
    },
    []
  );

  const playCue = useCallback(
    (cue: AudioCue) => {
      const audioContext = ensureAudio();

      if (!audioContext) {
        return;
      }

      if (cue === "hover") {
        playNoiseCue(audioContext, 0.08, 980, 0.012);
        return;
      }

      if (cue === "objectSelect") {
        playNoiseCue(audioContext, 0.18, 520, 0.025);
        playToneCue(audioContext, 166, 0.18, 0.018, "triangle");
        return;
      }

      if (cue === "bookOpen") {
        playNoiseCue(audioContext, 0.42, 360, 0.038, "lowpass");
        playToneCue(audioContext, 132, 0.36, 0.016, "sine");
        return;
      }

      if (cue === "pageTurn") {
        playNoiseCue(audioContext, 0.34, 740, 0.032);
        return;
      }

      if (cue === "packTake") {
        playNoiseCue(audioContext, 0.16, 1260, 0.022);
        return;
      }

      if (cue === "packTear") {
        playNoiseCue(audioContext, 0.55, 1680, 0.045);
        playNoiseCue(audioContext, 0.3, 620, 0.02, "lowpass");
        return;
      }

      if (cue === "paperReveal") {
        playNoiseCue(audioContext, 0.22, 820, 0.026);
        return;
      }

      if (cue === "pasteLift") {
        playNoiseCue(audioContext, 0.12, 760, 0.018);
        return;
      }

      if (cue === "pasteSnap") {
        playNoiseCue(audioContext, 0.12, 420, 0.034, "lowpass");
        playToneCue(audioContext, 196, 0.14, 0.014, "triangle");
        return;
      }

      if (cue === "filterTap") {
        playNoiseCue(audioContext, 0.08, 540, 0.014, "lowpass");
        return;
      }

      if (cue === "viewerOpen") {
        playNoiseCue(audioContext, 0.18, 650, 0.018);
        return;
      }

      if (cue === "rareSpecial") {
        playToneCue(audioContext, 392, 0.24, 0.016);
        return;
      }

      if (cue === "rareGold") {
        playToneCue(audioContext, 523.25, 0.34, 0.02);
        playToneCue(audioContext, 659.25, 0.28, 0.012);
        return;
      }

      if (cue === "rareLegendary") {
        playToneCue(audioContext, 196, 0.46, 0.018, "sine");
        playToneCue(audioContext, 392, 0.6, 0.018, "sine");
        return;
      }

      if (cue === "rareHito") {
        playToneCue(audioContext, 174.61, 0.5, 0.018, "triangle");
        playNoiseCue(audioContext, 0.36, 480, 0.016, "lowpass");
      }
    },
    [ensureAudio, playNoiseCue, playToneCue]
  );

  useEffect(() => {
    const unlock = () => {
      ensureAudio();
      setScene(sceneRef.current);
    };

    window.addEventListener("pointerdown", unlock, {
      once: true
    });
    window.addEventListener("keydown", unlock, {
      once: true
    });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [ensureAudio, setScene]);

  useEffect(() => {
    return () => {
      ambientSourceRef.current?.stop();
      void audioContextRef.current?.close();
    };
  }, []);

  const value = useMemo(
    () => ({
      audioReady,
      setScene,
      playCue
    }),
    [audioReady, setScene, playCue]
  );

  return (
    <CinematicAudioContext.Provider value={value}>
      {children}
    </CinematicAudioContext.Provider>
  );
}

export function useCinematicAudio() {
  const context = useContext(CinematicAudioContext);

  if (!context) {
    throw new Error(
      "useCinematicAudio must be used within CinematicAudioProvider"
    );
  }

  return context;
}