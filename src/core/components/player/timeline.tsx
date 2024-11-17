import {
  createContext,
  forwardRef,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { SceneSequence } from '~/core/lib/scene/scene-sequence';
import { Frame } from '~/core/lib/scene/types';
import { cn } from '~/lib/utils';

interface TimelineContextState {
  sequenceKey: string;
  currentFrame: Frame;
  onTransitionStart: (frame: string) => void;
  onTransitionEnd: (frame: string) => void;
}

const TimelineContext = createContext<TimelineContextState | null>(null);
TimelineContext.displayName = 'TimelineContext';

const useTimelineContext = () => {
  const context = useContext(TimelineContext);

  if (!context) {
    throw new Error(
      `\`TimelineContext\` must be a child of the \`TimelineContextProvider\`.`
    );
  }

  return context;
};
useTimelineContext.displayName = 'useTimelineContext';

const TimelineContextProvider = ({
  children,
  ...props
}: PropsWithChildren<TimelineContextState>) => {
  const contextValue = useMemo(() => ({ ...props }), [props]);

  return (
    <TimelineContext.Provider value={contextValue}>
      {children}
    </TimelineContext.Provider>
  );
};
TimelineContextProvider.displayName = 'TimelineContextProvider';

interface TimelineProps {
  sequence: SceneSequence;
  initialFrame?: string;
  autoplay?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
  className?: string;
}

interface TimelineHandler {
  completed: boolean;
  play: () => void;
  stop: () => void;
  pause: () => void;
  nextFrame: () => void;
  prevFrame: () => void;
}

const Timeline = forwardRef<TimelineHandler, PropsWithChildren<TimelineProps>>(
  (
    {
      sequence,
      initialFrame,
      autoplay = false,
      onStart,
      onComplete,
      onTransitionStart,
      onTransitionEnd,
      children,
      className,
    },
    ref
  ) => {
    const framesMap = useMemo(() => {
      return new Map(sequence.frames.map((frame) => [frame.key, frame]));
    }, [sequence.frames]);

    const initialFrameFallback = sequence.frames[0]?.key;
    if (!initialFrameFallback) {
      throw new Error('Expected at least 1 frame.');
    }

    const [isPlaying, setIsPlaying] = useState(false);

    const [currentFrameKey, setCurrentFrameKey] = useState(
      initialFrame ?? initialFrameFallback
    );

    const currentFrame = useMemo(() => {
      const frame = framesMap.get(currentFrameKey);

      if (!frame) {
        throw new Error(
          `Invalid state. Frame with key \`${currentFrameKey}\` does not exist.`
        );
      }

      return frame;
    }, [currentFrameKey, framesMap]);

    const completed = useMemo(
      () => !isPlaying && !framesMap.get(currentFrameKey)?.next,
      [currentFrameKey, framesMap, isPlaying]
    );

    const handlePlay = useCallback(() => {
      setIsPlaying(true);
    }, []);

    const handleStop = useCallback(() => {
      setIsPlaying(false);
      setCurrentFrameKey(initialFrame ?? initialFrameFallback);
    }, [initialFrame, initialFrameFallback]);

    const handlePause = useCallback(() => {
      setIsPlaying(false);
    }, []);

    const handleNextFrame = useCallback(() => {
      setCurrentFrameKey((currentKey) => {
        const currentFrame = framesMap.get(currentKey);
        return currentFrame?.next ?? currentKey;
      });
    }, [framesMap]);

    const handlePrevFrame = useCallback(() => {
      setCurrentFrameKey((currentKey) => {
        const currentFrame = framesMap.get(currentKey);
        return currentFrame?.prev ?? currentKey;
      });
    }, [framesMap]);

    const handleTransitionStart = useCallback(() => {
      setIsPlaying(true);
      onTransitionStart?.();
    }, [onTransitionStart]);

    const handleTransitionEnd = useCallback(() => {
      setIsPlaying(false);
      onTransitionEnd?.();
      if (autoplay) {
        handleNextFrame();
      }
    }, [autoplay, handleNextFrame, onTransitionEnd]);

    useImperativeHandle(
      ref,
      () => ({
        completed,
        play: handlePlay,
        stop: handleStop,
        pause: handlePause,
        nextFrame: handleNextFrame,
        prevFrame: handlePrevFrame,
      }),
      [
        completed,
        handleNextFrame,
        handlePause,
        handlePlay,
        handlePrevFrame,
        handleStop,
      ]
    );

    useEffect(() => {
      if (isPlaying && !framesMap.get(currentFrameKey)?.prev) {
        onStart?.();
      }
    }, [currentFrameKey, framesMap, isPlaying, onStart]);

    useEffect(() => {
      if (completed) {
        onComplete?.();
      }
    }, [completed, onComplete]);

    return (
      <figure
        className={cn('size-full', className)}
        aria-label='Frame-by-frame animation of the sequence'
        aria-live='polite'
      >
        <TimelineContextProvider
          sequenceKey={sequence.key}
          currentFrame={currentFrame}
          onTransitionStart={handleTransitionStart}
          onTransitionEnd={handleTransitionEnd}
        >
          {children}
        </TimelineContextProvider>
      </figure>
    );
  }
);
Timeline.displayName = 'Timeline';

export { Timeline, useTimelineContext };
