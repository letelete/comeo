import { ElementRef, useRef } from 'react';

import { Player } from '~/components/ player';
import { Sequencer, SequencerDisplay } from '~/components/sequencer';
import { SceneSequence } from '~/core/scene/scene-sequence';
import { cn } from '~/lib/utils';

const Scene = ({
  sequence,
  className,
}: {
  sequence: SceneSequence;
  className?: string;
}) => {
  const handler = useRef<ElementRef<typeof Sequencer>>(null);

  return (
    <div className={cn(className)}>
      <section className='w-full'>
        <div className='flex w-full items-center gap-x-4'>
          <button onClick={() => handler.current?.prevFrame?.()}>prev</button>
          <button onClick={() => handler.current?.nextFrame?.()}>next</button>
        </div>

        <Player className='mt-4 p-8' key={sequence.key} res='fhd' responsive>
          <Sequencer ref={handler} sequence={sequence}>
            <SequencerDisplay />
          </Sequencer>
        </Player>
      </section>
    </div>
  );
};
Scene.displayName = 'Scene';

export { Scene };
