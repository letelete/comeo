import { useCallback, useMemo, useState } from 'react';
import Diff from 'diff-match-patch';

import { cn } from '~/lib/utils';

const recipe = [
  {
    description: "In React, to allow components to 'remember' things:",
    code: `
import {} from 'react';
`,
  },
  {
    description: 'We use the useState hook.',
    code: `
import { useState } from 'react';
`,
  },
  {
    description:
      'The useState hook returns a tuple with the current state value and a function to update it.',
    code: `
import { useState } from 'react';

const [value, setValue] = useState(initialValue);
`,
  },
  {
    description: 'The state can be anything, from primitives',
    code: `
const initialValue = 0;
const [value, setValue] = useState(initialValue);
`,
  },
  {
    description: 'The state can be anything, from primitives',
    code: `
const initialValue = 'Hello, world!';
const [value, setValue] = useState(initialValue);
`,
  },
  {
    description: 'to complex objects.',
    code: `
const initialValue = { msg: 'Thanks for watching!' };
const [value, setValue] = useState(initialValue);
`,
  },
  {
    description: 'The state can be anything, from primitives',
    code: `
const initialValue = [
  { key: 0, msg: 'Thanks for watching!' },
  { key: 1, text: 'Consider subscribing 👉👈' }
];
const [value, setValue] = useState(initialValue);
`,
  },
  {
    description: 'The state can be anything, from primitives',
    code: `
const [value, setValue] = useState(initialValue);
`,
  },
  {
    description: "In this example, we'll create a simple counter",
    code: `
const [,] = useState();
`,
  },
  {
    description: 'starting at 0,',
    code: `
const [,] = useState(0);
`,
  },
  {
    description: 'using counter as the state value,',
    code: `
const [counter,] = useState(0);
`,
  },
  {
    description: 'and setCounter as the function to update it.',
    code: `
const [counter, setCounter] = useState(0);
`,
  },
  {
    description: 'Now, in the component,',
    code: `
const [counter, setCounter] = useState(0);

return (
  <>
  </>
);
`,
  },
  {
    description:
      'we can declare buttons to decrement, and increment the counter.',
    code: `
const [counter, setCounter] = useState(0);

return (
  <>
    <button>-1</button>
    <button>+1</button>
  </>
);
`,
  },
  {
    description: `On button click, we'll call the setCounter function, that changes value of the current counter state.`,
    code: `
const [counter, setCounter] = useState(0);

return (
  <>
    <button onClick={() => setCounter(counter - 1)}>-1</button>
    <button onClick={() => setCounter(counter + 1)}>+1</button>
  </>
);
`,
  },
  {
    description: `Since the function that updates state runs asynchronously, we'll use its callback to ensure we work with the latest value.`,
    code: `
const [counter, setCounter] = useState(0);

return (
  <>
    <button onClick={() => setCounter(value => value - 1)}>-1</button>
    <button onClick={() => setCounter(value => value + 1)}>+1</button>
  </>
);
`,
  },
] satisfies { description: string; code: string }[];

const TextDiff = ({
  oldText,
  newText,
  className,
}: {
  oldText: string;
  newText: string;
  className?: string;
}) => {
  const dmp = new Diff();
  const diff = useMemo(() => {
    const diffResult = dmp.diff_main(oldText, newText);

    dmp.Diff_EditCost = 4;
    dmp.diff_cleanupEfficiency(diffResult);

    return diffResult;
  }, [oldText, newText]);

  const renderDiff = useCallback((diff: Diff.Diff[]) => {
    const lines = diff.reduce(
      (acc, [operation, text]) => {
        const chars = [...text];

        const buffer = {
          value: '',
          push(char: string) {
            this.value += char;
          },
          flush() {
            acc.at(-1)?.push([operation, this.value.replace(/ /g, '\u00a0')]);
            this.value = '';
          },
        };

        chars.forEach((char) => {
          if (char === '\n') {
            if (buffer.value) {
              buffer.flush();
            }
            acc.push([]);
          } else {
            buffer.push(char);
          }
        });

        if (buffer.value) {
          buffer.flush();
        }

        return acc;
      },
      [[]] as Diff.Diff[][]
    );

    while (lines.at(0)?.length === 0) {
      lines.shift();
    }
    while (lines.at(-1)?.length === 0) {
      lines.pop();
    }

    console.log({ diff, lines });

    return lines.map((line, i) => (
      <>
        {line.map(([operation, text], j) => (
          <span
            key={`${i}:${j}:${operation}`}
            className={cn(
              operation === -1 && 'bg-red-500/50',
              operation === 1 && 'bg-green-500/50'
            )}
          >
            {text}
          </span>
        ))}
        {'\n'}
      </>
    ));
  }, []);

  return (
    <pre>
      <code className={cn(className)}>{renderDiff(diff)}</code>
    </pre>
  );
};

const TutorialViewer = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((value) => Math.min(recipe.length - 1, value + 1));
  };

  const prevStep = () => {
    setCurrentStep((value) => Math.max(0, value - 1));
  };

  const { description, code } = recipe[currentStep]!;
  const previousCode = currentStep > 0 ? recipe[currentStep - 1]!.code : '';

  return (
    <div className='p-4'>
      <div className='flex flex-col pb-8 text-sm'>
        <nav className='flex gap-x-2'>
          <button
            className='rounded-full bg-slate-300 px-4 py-2 font-semibold'
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            prev
          </button>
          <button
            className='rounded-full bg-slate-300 px-4 py-2 font-semibold'
            onClick={nextStep}
            disabled={currentStep === recipe.length - 1}
          >
            next
          </button>
        </nav>

        <TextDiff className='mt-4' oldText={previousCode} newText={code} />

        <hr />

        <h2 className='mt-4'>
          {`(${currentStep}/${recipe.length - 1})`}
          &nbsp;
          {description}
        </h2>
      </div>

      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
};

export { TutorialViewer, TextDiff };
