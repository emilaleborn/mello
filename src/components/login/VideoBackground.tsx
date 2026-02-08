'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

const VIDEOS = ['/videos/stage-led.mp4', '/videos/stage-aurora.mp4'];
const CROSSFADE_DURATION = 1.5; // seconds

export default function VideoBackground() {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [activeIndex, setActiveIndex] = useState(0); // 0 = A is visible, 1 = B is visible
  const [ready, setReady] = useState(false);
  const crossfadingRef = useRef(false);

  const startCrossfade = useCallback((fromIndex: number) => {
    if (crossfadingRef.current) return;
    crossfadingRef.current = true;

    const nextIndex = fromIndex === 0 ? 1 : 0;
    const nextVideo = nextIndex === 0 ? videoARef.current : videoBRef.current;

    if (nextVideo) {
      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});
    }

    setActiveIndex(nextIndex);

    // Reset crossfade lock after transition completes
    setTimeout(() => {
      crossfadingRef.current = false;
    }, CROSSFADE_DURATION * 1000);
  }, []);

  const handleTimeUpdate = useCallback(
    (videoIndex: number) => (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      if (
        videoIndex === activeIndex &&
        video.duration > 0 &&
        video.duration - video.currentTime <= CROSSFADE_DURATION
      ) {
        startCrossfade(videoIndex);
      }
    },
    [activeIndex, startCrossfade]
  );

  useEffect(() => {
    const videoA = videoARef.current;
    if (!videoA) return;

    // Attempt autoplay
    videoA.play().then(() => {
      setReady(true);
    }).catch(() => {
      // Autoplay blocked — fail gracefully, dark bg shows through
    });
  }, []);

  const videoClass =
    'absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out';
  const transitionDuration = `${CROSSFADE_DURATION * 1000}ms`;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        ref={videoARef}
        src={VIDEOS[0]}
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate(0)}
        className={videoClass}
        style={{
          opacity: ready ? (activeIndex === 0 ? 1 : 0) : 0,
          transitionDuration,
        }}
      />
      <video
        ref={videoBRef}
        src={VIDEOS[1]}
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate(1)}
        className={videoClass}
        style={{
          opacity: ready ? (activeIndex === 1 ? 1 : 0) : 0,
          transitionDuration,
        }}
      />
    </div>
  );
}
