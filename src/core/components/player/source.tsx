import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useTimelineContext } from '~/core/components/player/timeline';
import { cn } from '~/lib/utils';

interface SourceProps {
  className?: string;
}

const Source = ({ className }: SourceProps) => {
  const context = useTimelineContext();
  const hasTriggeredAnimationStart = useRef(false);

  const frame = context.currentFrame;

  const [animate, setAnimate] = useState(false);
  const diff = useMemo(() => {
    return animate ? frame.transition.animate : frame.transition.initial;
  }, [animate, frame.transition.animate, frame.transition.initial]);

  const handleTokenAnimationStart = useCallback(() => {
    if (!hasTriggeredAnimationStart.current) {
      hasTriggeredAnimationStart.current = true;
      context.onTransitionStart?.(context.currentFrame.key);
    }
  }, [context]);

  const handleTokenAnimationComplete = useCallback(() => {
    if (diff.value === frame.transition.animate.value) {
      context.onTransitionEnd?.(context.currentFrame.key);
    }
  }, [context, diff.value, frame.transition.animate.value]);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  });

  return (
    <div className={cn('relative size-full', className)}>
      <div className='absolute bottom-4 left-4 bg-player-foreground/10 p-2'>
        <span>{`(${context.currentFrame.index + 1})`}</span>
        {context.currentFrame.line}
      </div>

      <motion.pre className='flex w-full flex-col'>
        <motion.p layout='position'>
          <AnimatePresence mode='popLayout'>
            {diff.changes.map((change) => (
              <motion.span
                qa-token-key={change.key}
                key={change.key}
                layoutId={change.key}
                initial={{ opacity: change.unchanged ? 1 : 0 }}
                animate={{
                  opacity: 1,
                  transition: {
                    delay: change.unchanged ? 0 : 0.3,
                    type: 'spring',
                    duration: change.unchanged ? 0 : 0.5,
                    bounce: 0,
                  },
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: animate ? 0 : 0.3,
                    type: 'spring',
                    bounce: 0,
                  },
                }}
                onAnimationStart={handleTokenAnimationStart}
                onAnimationComplete={handleTokenAnimationComplete}
              >
                {change.value}
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.p>
      </motion.pre>
    </div>
  );
};
Source.displayName = 'Source';

export { Source };
