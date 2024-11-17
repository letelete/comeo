import { useCallback, useState } from 'react';

import { Editor } from '~/core/components/editor';
import { Scene } from '~/core/components/player/scene';
import { SceneSequence } from '~/core/lib/scene/scene-sequence';
import { cn } from '~/lib/utils';

interface WorkspaceProps {
  className?: string;
}

const Workspace = ({ className }: WorkspaceProps) => {
  const [content, setContent] = useState<'editor' | 'player'>('editor');

  const [sequence, setSequence] = useState<SceneSequence | null>(null);
  const [value, setValue] = useState('');

  const handleScriptSave = useCallback(() => {
    const lines = value.split(/\n\r/);
  }, []);

  return (
    <div className={cn('', className)}>
      <header className='flex flex-nowrap gap-x-2'>
        <button onClick={() => setContent('editor')}>Editor</button>
        <button onClick={() => setContent('player')}>Player</button>
      </header>

      <main>
        {content === 'editor' ? (
          <div>
            <Editor value={value} onChange={(e) => setValue(e.target.value)} />
            <button onClick={handleScriptSave}>Save</button>
          </div>
        ) : sequence ? (
          <Scene sequence={sequence} />
        ) : null}
      </main>
    </div>
  );

  
};
Workspace.displayName = 'Workspace';

export { Workspace };
export type { WorkspaceProps };

