import { createKeyGenerator } from '~/core/lib/scene/key-generator';
import {
  Change,
  Diff,
  Frame,
  IdentifiableChange,
} from '~/core/lib/scene/types';
import { Scene } from '~/core/lib/script/types';

import { SceneSequence } from './scene-sequence';

describe('random key', () => {
  it('should assign a random key with the same keyGenerator instance', () => {
    const keyGenerator = createKeyGenerator();
    const scene = [
      {
        line: 'In React, to allow component “remember” things,',
        blocks: ["import {} from 'react';"],
      },
      {
        line: 'we use the useState hook.',
        blocks: ["import { useState } from 'react';", 'const [] = useState();'],
      },
    ] satisfies Scene;

    const sequence1 = new SceneSequence(scene, keyGenerator);
    const sequence2 = new SceneSequence(scene, keyGenerator);

    expect(sequence1.key).toBeDefined();
    expect(sequence2.key).toBeDefined();

    expect(sequence1.key).not.toBe(sequence2.key);
  });

  it('should assign a random key with the new keyGenerator instance', () => {
    const scene = [
      {
        line: 'In React, to allow component “remember” things,',
        blocks: ["import {} from 'react';"],
      },
      {
        line: 'we use the useState hook.',
        blocks: ["import { useState } from 'react';", 'const [] = useState();'],
      },
    ] satisfies Scene;

    const sequence1 = new SceneSequence(scene);
    const sequence2 = new SceneSequence(scene);

    expect(sequence1.key).toBeDefined();
    expect(sequence2.key).toBeDefined();

    expect(sequence1.key).not.toBe(sequence2.key);
  });
});

describe('transition', () => {
  describe('transition changes', () => {
    it('should make first transition.initial.changes empty', () => {
      const scene = [
        {
          line: 'In React, to allow component “remember” things,',
          blocks: ["import {} from 'react';"],
        },
      ] satisfies Scene;

      const sequence = new SceneSequence(scene);
      const it = createFramesIterator(sequence.frames);

      it.next();
      expect(it.current().transition.initial.changes).toEqual([]);
    });

    it('should make first transition.animate.changes cover entire block', () => {
      const scene = [
        {
          line: 'In React, to allow component “remember” things,',
          blocks: [
            "import { useState } from 'react';",
            'const [] = useState();',
          ],
        },
      ] satisfies Scene;

      const sequence = new SceneSequence(scene);
      const it = createFramesIterator(sequence.frames);

      it.next();
      expect(it.current().transition.animate.changes[0]).toMatchObject({
        value: "import { useState } from 'react';\nconst [] = useState();",
        added: true,
        removed: false,
        unchanged: false,
      } satisfies Change);
    });

    it('should respect frames length', () => {
      const scene = [
        {
          line: 'In React, to allow component “remember” things,',
          blocks: ["import {} from 'react';"],
        },
        {
          line: 'we use the useState hook.',
          blocks: ["import { useState } from 'react';"],
        },
        {
          line: 'The useState hook returns a tuple with the current state value,',
          blocks: [
            "import { useState } from 'react';",
            'const [value] = useState();',
          ],
        },
        {
          line: 'and a function to update it.',
          blocks: [
            "import { useState } from 'react';",
            'const [value, setValue] = useState();',
          ],
        },
        {
          line: 'The state can be anything, from primitives to complex objects.',
          blocks: [
            "import { useState } from 'react';",
            'const [value, setValue] = useState(initialState);',
          ],
        },
        {
          line: "In our example, we'll create a counter component with counter as the state value and setCounter as the function to update it.",
          blocks: [
            "import { useState } from 'react';",
            'const [counter, setCounter] = useState(0);',
          ],
        },
      ] satisfies Scene;

      const sequence = new SceneSequence(scene);
      const frames = sequence.frames;

      expect(frames.length).toBe(6);
    });

    it('should respect changes length', () => {
      const scene = [
        {
          line: 'In React, to allow component “remember” things,',
          blocks: ["import {} from 'react';"],
        },
        {
          line: 'we use the useState hook.',
          blocks: ["import { useState } from 'react';"],
        },
        {
          line: 'The useState hook returns a tuple with the current state value,',
          blocks: [
            "import { useState } from 'react';",
            'const [value] = useState();',
          ],
        },
        {
          line: 'and a function to update it.',
          blocks: [
            "import { useState } from 'react';",
            'const [value, setValue] = useState();',
          ],
        },
        {
          line: 'The state can be anything, from primitives to complex objects.',
          blocks: [
            "import { useState } from 'react';",
            'const [value, setValue] = useState(initialState);',
          ],
        },
        {
          line: "In our example, we'll create a counter component with counter as the state value and setCounter as the function to update it.",
          blocks: [
            "import { useState } from 'react';",
            'const [counter, setCounter] = useState(0);',
          ],
        },
      ] satisfies Scene;

      const sequence = new SceneSequence(scene);
      const it = createFramesIterator(sequence.frames);

      // line: 'In React, to allow component “remember” things,'
      it.next();
      expect(it.current().transition.initial.changes.length).toBe(0);
      expect(it.current().transition.animate.changes.length).toBe(1);

      // line: 'we use the useState hook.'
      it.next();
      expect(it.current().transition.initial.changes.length).toBe(2);
      expect(it.current().transition.animate.changes.length).toBe(3);

      // line: 'The useState hook returns a tuple with the current state value,'
      it.next();
      expect(it.current().transition.initial.changes.length).toBe(1);
      expect(it.current().transition.animate.changes.length).toBe(2);

      // line: 'and a function to update it.'
      it.next();
      expect(it.current().transition.initial.changes.length).toBe(2);
      expect(it.current().transition.animate.changes.length).toBe(3);
    });

    it('should have all keys unique in initial transition', () => {
      const scene = [
        {
          line: 'In React, to allow component “remember” things,',
          blocks: ["import {} from 'react';"],
        },
        {
          line: 'we use the useState hook.',
          blocks: ["import { useState } from 'react';"],
        },
        {
          line: 'The useState hook returns a tuple with the current state value,',
          blocks: [
            "import { useState } from 'react';",
            'const [value] = useState();',
          ],
        },
        {
          line: 'and a function to update it.',
          blocks: [
            "import { useState } from 'react';",
            'const [value, setValue] = useState();',
          ],
        },
        {
          line: 'The state can be anything, from primitives to complex objects.',
          blocks: [
            "import { useState } from 'react';",
            'const [value, setValue] = useState(initialState);',
          ],
        },
        {
          line: "In our example, we'll create a counter component with counter as the state value and setCounter as the function to update it.",
          blocks: [
            "import { useState } from 'react';",
            'const [counter, setCounter] = useState(0);',
          ],
        },
      ] satisfies Scene;

      const sequence = new SceneSequence(scene);
      const it = createFramesIterator(sequence.frames);

      while (!it.next().done) {
        const { initial } = it.current().transition;
        const keysSet = new Set(initial.changes.map((change) => change.key));
        expect(keysSet.size).toBe(initial.changes.length);
      }
    });

    it('should have all keys unique in animate transition', () => {
      const scene = [
        {
          line: 'In React, to allow component “remember” things,',
          blocks: ["import {} from 'react';"],
        },
        {
          line: 'we use the useState hook.',
          blocks: ["import { useState } from 'react';"],
        },
        {
          line: 'The useState hook returns a tuple with the current state value,',
          blocks: [
            "import { useState } from 'react';",
            'const [value] = useState();',
          ],
        },
        {
          line: 'and a function to update it.',
          blocks: [
            "import { useState } from 'react';",
            'const [value, setValue] = useState();',
          ],
        },
        {
          line: 'The state can be anything, from primitives to complex objects.',
          blocks: [
            "import { useState } from 'react';",
            'const [value, setValue] = useState(initialState);',
          ],
        },
        {
          line: "In our example, we'll create a counter component with counter as the state value and setCounter as the function to update it.",
          blocks: [
            "import { useState } from 'react';",
            'const [counter, setCounter] = useState(0);',
          ],
        },
      ] satisfies Scene;

      const sequence = new SceneSequence(scene);
      const it = createFramesIterator(sequence.frames);

      while (!it.next().done) {
        const { animate } = it.current().transition;
        const keysSet = new Set(animate.changes.map((change) => change.key));
        expect(keysSet.size).toBe(animate.changes.length);
      }
    });

    it('should keep same key between unchanged tokens in one line', () => {
      const scene = [
        {
          line: 'In React, to allow component “remember” things,',
          blocks: ["import {} from 'react';"],
        },
        {
          line: 'we use the useState hook.',
          blocks: ["import { useState } from 'react';"],
        },
        {
          line: 'You can import even more stuff from React...',
          blocks: ["import { ..., useState, useRef, ... } from 'react';"],
        },
      ] satisfies Scene;

      const sequence = new SceneSequence(scene);
      const it = createFramesIterator(sequence.frames);

      while (!it.next().done) {
        expectKeyToBeSharedWhenChangeNotAdditive(
          it.current().transition.initial.changes,
          it.current().transition.animate.changes
        );
      }
    });

    it('should tokenize changes in single line block', () => {
      const scene = [
        {
          line: 'In React, to allow component “remember” things,',
          blocks: ["import {} from 'react';"],
        },
        {
          line: 'we use the useState hook.',
          blocks: ["import { useState } from 'react';"],
        },
        {
          line: 'You can import even more stuff from React...',
          blocks: ["import { ..., useState, useRef, ... } from 'react';"],
        },
      ] satisfies Scene;

      const sequence = new SceneSequence(scene);

      const expected = [
        {
          line: 'In React, to allow component “remember” things,',
          initialTokens: [],
          animateTokens: ["import {} from 'react';"],
        },
        {
          line: 'we use the useState hook.',
          initialTokens: ['import { ', "} from 'react';"],
          animateTokens: ['import { ', 'useState ', "} from 'react';"],
        },
        {
          line: 'You can import even more stuff from React...',
          initialTokens: ['import { ', 'useState', "} from 'react';"],
          animateTokens: [
            'import { ',
            '..., ',
            'useState',
            ', useRef, ... ',
            "} from 'react';",
          ],
        },
      ];

      expectSequenceToHaveExactTokens(sequence, expected);
    });

    it('should tokenize changes in multiline block', () => {
      const scene = [
        {
          line: 'In React, to allow component “remember” things,',
          blocks: ["import {} from 'react';"],
        },
        {
          line: 'we use the useState hook.',
          blocks: [
            "import { useState } from 'react';",
            'const [] = useState();',
          ],
        },
        {
          line: 'The useState hook returns a tuple with the current state value,',
          blocks: [
            "import { useState } from 'react';",
            'const [value] = useState();',
          ],
        },
        {
          line: 'and a function to update it.',
          blocks: [
            "import { useState } from 'react';",
            'const [value, setValue] = useState();',
          ],
        },
        {
          line: 'The state can be anything, from primitives to complex objects.',
          blocks: [
            "import { useState } from 'react';",
            'const [value, setValue] = useState(initialState);',
          ],
        },
        {
          line: "In our example, we'll create a counter component with counter as the state value and setCounter as the function to update it.",
          blocks: [
            "import { useState } from 'react';",
            'const [counter, setCounter] = useState(0);',
          ],
        },
      ] satisfies Scene;

      const sequence = new SceneSequence(scene);

      const expected = [
        {
          line: 'In React, to allow component “remember” things,',
          initialTokens: [],
          animateTokens: ["import {} from 'react';"],
        },
        {
          line: 'we use the useState hook.',
          initialTokens: ['import { ', "} from 'react';\n"],
          animateTokens: [
            'import { ',
            'useState ',
            "} from 'react';\n",
            'const [] = useState();',
          ],
        },
        {
          line: 'The useState hook returns a tuple with the current state value,',
          initialTokens: [
            "import { useState } from 'react';\nconst [",
            '] = useState();',
          ],
          animateTokens: [
            "import { useState } from 'react';\nconst [",
            'value',
            '] = useState();',
          ],
        },
        {
          line: 'and a function to update it.',
          initialTokens: [
            "import { useState } from 'react';\nconst [value",
            '] = useState();',
          ],
          animateTokens: [
            "import { useState } from 'react';\nconst [value",
            ', setValue',
            '] = useState();',
          ],
        },
        {
          line: 'The state can be anything, from primitives to complex objects.',
          initialTokens: [
            "import { useState } from 'react';\nconst [value, setValue] = useState(",
            ');',
          ],
          animateTokens: [
            "import { useState } from 'react';\nconst [value, setValue] = useState(",
            'initialState',
            ');',
          ],
        },
        {
          line: "In our example, we'll create a counter component with counter as the state value and setCounter as the function to update it.",
          initialTokens: [
            "import { useState } from 'react';\nconst [",
            ', ',
            '] = useState(',
            ');',
          ],
          animateTokens: [
            "import { useState } from 'react';\nconst [",
            'counter',
            ', ',
            'setCounter',
            '] = useState(',
            '0',
            ');',
          ],
        },
      ];

      expectSequenceToHaveExactTokens(sequence, expected);
    });
  });

  describe('transition value', () => {
    it('should make transition.animate.value a single string value when scene has a single block', () => {
      const scene = [
        {
          line: 'In React, to allow component “remember” things,',
          blocks: ["import {} from 'react';"],
        },
      ] satisfies Scene;

      const sequence = new SceneSequence(scene);

      expect(sequence.frames[0]?.transition.animate.value).toBe(
        "import {} from 'react';"
      );
    });

    it('should make transition.animate.value a single string value when scene has a multiline block', () => {
      const scene = [
        {
          line: 'we use the useState hook.',
          blocks: [
            "import { useState } from 'react';",
            'const [] = useState();',
          ],
        },
      ] satisfies Scene;

      const sequence = new SceneSequence(scene);

      expect(sequence.frames[0]?.transition.animate.value).toBe(
        "import { useState } from 'react';\nconst [] = useState();"
      );
    });

    it('should make transition.animate.value a single string value and preserve whitespace when scene has a multiline block', () => {
      const scene = [
        {
          line: 'we use the useState hook.',
          blocks: [
            '',
            "import { useState } from 'react';",
            '',
            '...',
            '',
            'const [] = useState();',
            '',
          ],
        },
      ] satisfies Scene;

      const sequence = new SceneSequence(scene);

      expect(sequence.frames[0]?.transition.animate.value).toBe(
        "\nimport { useState } from 'react';\n\n...\n\nconst [] = useState();\n"
      );
    });
  });
});

function expectDiffChangesToHaveDefinedKeys(diff: Diff) {
  diff.changes.forEach((change) => {
    expect(change.key).toBeDefined();
  });
}

function expectKeyToBeSharedWhenChangeNotAdditive(
  initialChanges: IdentifiableChange[],
  animateChanges: IdentifiableChange[]
) {
  animateChanges.forEach((change) => {
    expect(change.key).toBeDefined();

    if (change.added) {
      const initialSameValueOrSameKeyToken = initialChanges.find(
        (initialChange) =>
          initialChange.value === change.value ||
          initialChange.key === change.key
      );
      expect(initialSameValueOrSameKeyToken).toBeUndefined();
    } else {
      const initialSameValueToken = initialChanges.find(
        (initialChange) => initialChange.value === change.value
      );
      expect(initialSameValueToken).toBeDefined();
      expect(initialSameValueToken?.key).toBe(change.key);
    }
  });
}

function expectSequenceToHaveExactTokens(
  sequence: SceneSequence,
  expected: { line: string; initialTokens: string[]; animateTokens: string[] }[]
) {
  const actual = sequence.frames.map((frame) => {
    return {
      line: frame.line,
      initialTokens: getTokens(frame.transition.initial.changes),
      animateTokens: getTokens(frame.transition.animate.changes),
    };
  });

  expect(actual).toEqual(expected);
}

const getTokens = (changes: IdentifiableChange[]) => {
  return changes.map((change) => change.value);
};

function createFramesIterator(frames: Frame[]) {
  let index = 0;

  function* createInnerIterator() {
    while (index++ < frames.length) {
      yield frames[index]!;
    }
    return undefined;
  }

  const innerIterator = createInnerIterator();

  return {
    next() {
      return innerIterator.next();
    },
    current() {
      const result = frames[this.index()];
      if (!result) {
        throw new Error('Invalid state. Current value is undefined.');
      }
      return result;
    },
    index() {
      if (index === 0) {
        throw new Error('Invalid state. `index()` call before initialization.');
      }
      if (index > frames.length) {
        throw new Error('Invalid state. `index()` call after completion.');
      }
      return index - 1;
    },
  };
}
