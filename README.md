This tool enables the rapid creation of animated code-change sequences, ideal for embedding in presentation slides or coding tutorials.

It accepts a human-readable JSON script that defines each step of code modifications, tokenizes the code, and uses a diffing algorithm to animate transformations.

The output is an MP4 video clip, generated with a WebAssembly-based FFmpeg implementation, ready for integration into your tutorials or presentations. Users can also manually control transitions between steps.

## Table of contents

- [Table of contents](#table-of-contents) (you're here)
- [Key Features](#key-features)
- [Comparison with Alternatives](#comparison-with-alternatives)
- [Usage:](#usage)
  - [Script structure](#script-structure)
  - [Example](#example)
- [Roadmap](#roadmap)
  - [Proof-of-Concept (PoC) \[✅ Done\]](#proof-of-concept-poc--done)
  - [Minimal Viable Product (MVP) \[🚧 In-Progress\]](#minimal-viable-product-mvp--in-progress)
  - [Post MVP \[🔜 Soon\]](#post-mvp--soon)

## Key Features

- Human-Readable JSON Scripts: Easily define code-change animations step-by-step.
- Automatic Video Generation: Quickly convert animations to MP4 format for embedding.
- Manual Controls: Transition between steps manually for greater flexibility in presentations.

## Comparison with Alternatives

While tools like [kodemo](https://kodemo.com/) are available, they lack:

1. Custom Tokenization: Tailor tokenization to fit specific coding requirements.
2. Script-Based Interface: Efficient scripting approach for developers who prefer to work directly in code rather than a GUI.
3. Context-Aware Transitions: Smoothly animate changes within individual lines of code.

## Usage:

You write a **Script** in the JSON format, the tool tokenizes your input and creates animated transitions automatically. The tool allows you to manually preview the generated transition or generate a video out of transition automatically.

### Script structure

- A movie **Script** is a sequence of **Scenes**.
- A **Scene** represents a sequence of **Actions** that share the same context.
- Each **Action** contains:
  - **Blocks**: Each block represents a section of code (often multiple lines).
  - **Line**: A description of the action, explaining each code change (useful for timing the video).

### Example

The example below demonstrates a script containing one scene with six actions:

```JSON
[
  [
    {
      "line": "In React, to allow component “remember” things,",
      "blocks": [
        "import {} from 'react';"
      ]
    },
    {
      "line": "we use the useState hook.",
      "blocks": [
        "import { useState } from 'react';",
        "const [] = useState();"
      ]
    },
    {
      "line": "The useState hook returns a tuple with the current state value,",
      "blocks": [
        "import { useState } from 'react';",
        "const [value] = useState();"
      ]
    },
    {
      "line": "and a function to update it.",
      "blocks": [
        "import { useState } from 'react';",
        "const [value, setValue] = useState();"
      ]
    },
    {
      "line": "The state can be anything, from primitives to complex objects.",
      "blocks": [
        "import { useState } from 'react';",
        "const [value, setValue] = useState(initialState);"
      ]
    },
    {
      "line": "In our example, we'll create a counter component with a counter as the state value and setCounter as the function to update it.",
      "blocks": [
        "import { useState } from 'react';",
        "const [counter, setCounter] = useState(0);"
      ]
    }
  ]
]
```

## Roadmap

### Proof-of-Concept (PoC) [🟢 Done]

- [x] Tokenize JSON-based script
- [x] Provide a customizable container for running animations (Player)
- [x] Provide a component that reads tokenized code, and displays it in a viewable format (Sequencer)
- [x] Allow to preview the animation step-by-step

### Minimal Viable Product (MVP) [🟡 In-Progress]

- [ ] Script upload
- [ ] Transitions run smoothly and can be customized
- [ ] Diff transitions are predictable (meaning: no unpleasant transitions, token jumps)
- [ ] Generate mp4 video from the transition
- [ ] Controls:
  - [x] Frame-by-frame navigation
  - [ ] Play
  - [ ] Stop
  - [ ] Pause
  - [ ] Resume
  - [ ] Loop
- [ ] Keyboard navigation
- [ ] Context-aware controls
- [ ] Syntax highlighting

### Post MVP [🔴 Soon]

- [ ] JSON-editor for Script
- [ ] Option to **Highlight** lines of Block that changed in the step
- [ ] Option to **Dim** unchanged lines of Block in the step
- [ ] Highly customizable theming including *green-screen* background
