# Signal

A simple reactive data library using `Signal` and `Computed` to manage state and trigger updates on value changes.

## Features

- **Signal**: A reactive data object that allows tracking and responding to value changes.
- **Computed**: A reactive computed value that automatically updates when its dependencies change.
- Efficient and lightweight.
- Supports effects to run functions when values change.

## Installation

You can install this package via NPM:

```bash
npm install @dhlx/signal
```

Or via Yarn:

```bash
yarn add @dhlx/signal
```

## Usage

### Creating a Signal

A `Signal` is a reactive data object that holds a value and notifies listeners when the value changes.

```javascript
import { signal } from '@dhlx/signal'
// Create a signal with an initial value
const temperature = signal(20)

// Access the value
console.log(temperature.value) // 20

// Update the value
temperature.value = 25

promise.resolve().then(() => {
  console.log(temperature.value) // 25
})

console.log(temperature.value) //20;
```

### Using Effects

You can register effects to react to changes in a `Signal` value.

```javascript
temperature.effect(() => {
  console.log(`Temperature changed to: ${temperature.value}`);
});

// Update the signal and trigger the effect
temperature.value = 30; // Output: Temperature changed to: 30
```

### Creating a Computed Value

A `Computed` value depends on one or more `Signal` values and automatically updates when its dependencies change.

```javascript
import { computed } from '@dhlx/signal';

// Create two signals
const temperature = signal(20);
const humidity = signal(50);

// Create a computed value based on the signals
const comfortIndex = computed((temp, humid) => temp + humid, [temperature, humidity]);

console.log(comfortIndex.value); // 70

// Update the signals and the computed value will automatically update
temperature.value = 25;

Promise.resolve().then(() => {
  console.log(comfortIndex.value); // 75
})

```

### Removing Effects

You can remove effects using the function returned by `effect`.

```javascript
const stopLogging = temperature.effect(() => {
  console.log(`Temperature is now: ${temperature.value}`);
});

// Stop listening for changes
stopLogging();

temperature.value = 35; // No output, effect has been removed
```

## API

### `signal(initialValue)`

Creates a new `Signal` object.

- `initialValue`: The initial value of the signal.

#### Properties:

- `value`: Get or set the value of the signal.

#### Methods:

- `effect(fn)`: Registers a function that runs when the signal value changes. Returns a function to remove the effect.

### `computed(fn, deps)`

Creates a new `Computed` object that automatically updates based on its dependencies.

- `fn`: A function that returns the computed value based on its dependencies.
- `deps`: An array of `Signal` objects that the computed value depends on.

#### Properties:

- `value`: The current computed value, updated automatically when dependencies change.

## License

MIT License

