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

import { Frame, Sequence } from '~/lib/sequence/types';
import { cn } from '~/lib/utils';

interface SequencerContextState {
  sequenceKey: string;
  currentFrame: Frame;
  onTransitionStart: (frame: string) => void;
  onTransitionEnd: (frame: string) => void;
}

const SequencerContext = createContext<SequencerContextState | null>(null);
SequencerContext.displayName = 'SequencerContext';

const useSequencerContext = () => {
  const context = useContext(SequencerContext);

  if (!context) {
    throw new Error(
      `\`SequencerContext\` must be a child of the \`SequencerContextProvider\`.`
    );
  }

  return context;
};
useSequencerContext.displayName = 'useSequencerContext';

const SequencerContextProvider = ({
  children,
  ...props
}: PropsWithChildren<SequencerContextState>) => {
  const contextValue = useMemo(() => ({ ...props }), [props]);

  return (
    <SequencerContext.Provider value={contextValue}>
      {children}
    </SequencerContext.Provider>
  );
};
SequencerContextProvider.displayName = 'SequencerContextProvider';

interface SequencerProps {
  sequence: Sequence;
  initialFrame?: string;
  autoplay?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
  className?: string;
}

interface SequencerHandler {
  completed: boolean;
  play: () => void;
  stop: () => void;
  pause: () => void;
  nextFrame: () => void;
  prevFrame: () => void;
}

const Sequencer = forwardRef<
  SequencerHandler,
  PropsWithChildren<SequencerProps>
>(
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
    if (!sequence.frames.length) {
      throw new Error('Expected at least 1 frame.');
    }

    const framesMap = useMemo(() => {
      return new Map(sequence.frames.map((frame) => [frame.key, frame]));
    }, [sequence.frames]);

    const initialFrameFallback = sequence.frames[0].key;

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
        <SequencerContextProvider
          sequenceKey={sequence.key}
          currentFrame={currentFrame}
          onTransitionStart={handleTransitionStart}
          onTransitionEnd={handleTransitionEnd}
        >
          {children}
        </SequencerContextProvider>
      </figure>
    );
  }
);
Sequencer.displayName = 'Sequencer';

interface SequencerDisplayProps {
  className?: string;
}

// TODO: support frame Transition
const SequencerDisplay = ({ className }: SequencerDisplayProps) => {
  const context = useSequencerContext();
  const completedTokensCount = useRef<number>(0);
  const hasTriggeredAnimationStart = useRef(false);

  const tokensCount = useMemo(() => {
    return context.currentFrame.blocks
      .map((block) => block.tokens.length)
      .reduce((sum, tokensInBlock) => sum + tokensInBlock, 0);
  }, [context.currentFrame.blocks]);

  const handleTokenAnimationStart = useCallback(() => {
    if (!hasTriggeredAnimationStart.current) {
      hasTriggeredAnimationStart.current = true;
      context.onTransitionStart?.(context.currentFrame.key);
    }
  }, [context]);

  const handleTokenAnimationComplete = useCallback(() => {
    completedTokensCount.current++;
    console.log(completedTokensCount.current, tokensCount);
    if (completedTokensCount.current >= tokensCount) {
      context.onTransitionEnd?.(context.currentFrame.key);
    }
  }, [context, tokensCount]);

  return (
    <div className={cn('relative size-full', className)}>
      <div className='absolute bottom-4 left-4 bg-player-foreground/10 p-2'>
        {context.currentFrame.line}
      </div>

      {context.currentFrame.blocks.map((block) => (
        <motion.pre key={block.key} className='flex flex-wrap' layout>
          <AnimatePresence mode='popLayout'>
            {block.tokens.map((token) => (
              <motion.span
                qa-token-key={token.key}
                key={token.key}
                layoutId={token.key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  type: 'spring',
                  duration: 0.3,
                  bounce: 0,
                }}
                onAnimationStart={handleTokenAnimationStart}
                onAnimationComplete={handleTokenAnimationComplete}
              >
                {token.value}
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.pre>
      ))}
    </div>
  );
};
SequencerDisplay.displayName = 'SequencerDisplay';

export { Sequencer, SequencerDisplay };
