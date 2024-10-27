import { ElementRef, useRef } from 'react';

import { Player } from '~/components/ player';
import { Sequencer, SequencerDisplay } from '~/components/sequencer';
import { cn } from '~/lib/utils';

import scriptJson from './lib/sequence/script.json';
import { buildSequenceFromScene } from './lib/sequence/sequence-builder';
import { Script, Sequence } from './lib/sequence/types';

const script = scriptJson as Script;

const sequences = script.map(buildSequenceFromScene);

function App() {
  return (
    <>
      <div className='flex flex-col gap-y-8 p-8'>
        {sequences.map((sequence) => (
          <SequenceView key={sequence.key} sequence={sequence} />
        ))}
      </div>
    </>
  );
}

const SequenceView = ({
  sequence,
  className,
}: {
  sequence: Sequence;
  className?: string;
}) => {
  const handler = useRef<ElementRef<typeof Sequencer>>(null);

  return (
    <div className={cn(className)}>
      <Player className='p-8' key={sequence.key} res='fhd' responsive>
        <Sequencer ref={handler} sequence={sequence}>
          <SequencerDisplay />
        </Sequencer>
      </Player>

      <div className='mt-4 flex w-full items-center gap-x-4'>
        <button onClick={() => handler.current?.prevFrame?.()}>prev</button>
        <button onClick={() => handler.current?.nextFrame?.()}>next</button>
      </div>
    </div>
  );
};

export default App;
