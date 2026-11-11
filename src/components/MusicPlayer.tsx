"use client";

import { useEffect, useRef, useState } from "react";

export function MusicPlayer({
  src,
  autoplay,
}: {
  src: string;
  autoplay: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!autoplay) return;

    function handleOpen() {
      const audio = audioRef.current;
      if (!audio) return;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }

    window.addEventListener("thiep-opened", handleOpen, { once: true });
    return () => window.removeEventListener("thiep-opened", handleOpen);
  }, [autoplay]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(
        () => setPlaying(true),
        () => setPlaying(false)
      );
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        type="button"
        onClick={togglePlay}
        aria-pressed={playing}
        aria-label={playing ? "Tắt nhạc nền" : "Bật nhạc nền"}
        className="fixed right-4 bottom-4 z-40 flex size-11 cursor-pointer items-center justify-center rounded-full bg-(--t-primary) text-(--t-bg) shadow-lg transition-opacity hover:opacity-90"
      >
        <span aria-hidden="true" className="text-lg leading-none">
          {playing ? "❚❚" : "♪"}
        </span>
      </button>
    </>
  );
}

