import { Scene } from '~/components/scene';
import { createKeyGenerator } from '~/core/scene/key-generator';
import { parseScript } from '~/core/script/script-parser';

import { SceneSequence } from './core/scene/scene-sequence';
import scriptJson from './script.json';

const keyGenerator = createKeyGenerator();
const sequences = parseScript(scriptJson as unknown as string).map(
  (scene) => new SceneSequence(scene, keyGenerator)
);

function App() {
  return (
    <>
      <div className='flex flex-col gap-y-8 p-8'>
        {sequences.map((sequence) => (
          <Scene key={sequence.key} sequence={sequence} />
        ))}
      </div>
    </>
  );
}

export default App;
