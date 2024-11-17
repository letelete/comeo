import { ElementRef, useRef } from 'react';

import { Source } from '~/core/components/player/source';
import { SourceMonitor } from '~/core/components/player/source-monitor';
import { Timeline } from '~/core/components/player/timeline';
import { SceneSequence } from '~/core/lib/scene/scene-sequence';
import { cn } from '~/lib/utils';

const Scene = ({
  sequence,
  className,
}: {
  sequence: SceneSequence;
  className?: string;
}) => {
  const handler = useRef<ElementRef<typeof Timeline>>(null);

  return (
    <div className={cn(className)}>
      <section className='w-full'>
        <div className='flex w-full items-center gap-x-4'>
          <button onClick={() => handler.current?.prevFrame?.()}>prev</button>
          <button onClick={() => handler.current?.nextFrame?.()}>next</button>
        </div>

        <SourceMonitor className='mt-4 p-8' key={sequence.key} res='fhd'>
          <Timeline ref={handler} sequence={sequence}>
            <Source />
          </Timeline>
        </SourceMonitor>
      </section>
    </div>
  );
};
Scene.displayName = 'Scene';

export { Scene };
