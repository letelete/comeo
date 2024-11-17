In React, to allow component “remember” things,

```
import {} from 'react';
```

we use the useState hook.

```
import { useState } from 'react';
```

The useState hook returns a tuple with the current state value and a function to update it.

```
import { useState } from 'react';

const [value, setValue] = useState(initialValue);
```

The state can be anything, from primitives

```
const initialValue = 0;
const [value, setValue] = useState(initialValue);
```

```
const initialValue = 'Hello, world!';
const [value, setValue] = useState(initialValue);
```

to complex objects.

```
const initialValue = { msg: 'Hello, world!' };
const [value, setValue] = useState(initialValue);
```

```
const initialValue = [{ key: 0, text: 'Pls, subscribe 🥺' }];
const [value, setValue] = useState(initialValue);
```

```
const [value, setValue] = useState(initialValue);
```

In this example, we'll create a simple counter

```
const [,] = useState();
```

starting at 0,

```
const [,] = useState(0);
```

using counter as the state value,

```
const [counter,] = useState(0);
```

and setCounter as the function to update it.

```
const [counter, setCounter] = useState(0);
```

Now, in the component,

```
const [counter, setCounter] = useState(0);

return (
  <>
  </>
);
```

we can declare buttons to decrement, and increment the counter.

```
const [counter, setCounter] = useState(0);

return (
  <>
    <button>-1</button>
    <button>+1</button>
  </>
);
```

On button click, we'll call the setCounter function, that changes value of the current counter state.

```
const [counter, setCounter] = useState(0);

return (
  <>
    <button onClick={() => setCounter(counter - 1)}>-1</button>
    <button onClick={() => setCounter(counter + 1)}>+1</button>
  </>
);
```

Since the function that updates state runs asynchronously, we'll use its callback to ensure we work with the latest value.

```
const [counter, setCounter] = useState(0);

return (
  <>
    <button onClick={() => setCounter(value => value - 1)}>-1</button>
    <button onClick={() => setCounter(value => value + 1)}>+1</button>
  </>
);
```
