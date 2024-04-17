# Codeword Solver

Designed to help solve codeword type puzzles in newspapers and the like.

## TODO

### Bugs

- First letter box does not auto focus
- All letters go blank when you add a letter to a box
- Guesses don't update until blurr
- Guesses don't update when you modify the Alphabet grid
- You can keep adding numbers and letters when a question mark is showing

### Possible Features

- You should be able to enter a letter first if you want to
  - You should get guesses even if you don't enter a number
  - The keyboard is not suitable for letter first
- Remember previous words that we'ren't comeplete and keep trying to match them or use them to reduce possibilities

### Refactoring

- The whole focus thing is so messy
- Remove any logic from the number / letter field itself
