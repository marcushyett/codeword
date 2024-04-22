import "./App.css";
import { useState } from "react";
import WordInput from "./components/WordInput/WordInput";
import AlphabetGrid from "./components/AlphabetGrid/AlphabetGrid";
import PossibleWords from "./components/PossibleWords/PossibleWords";
import SavedWords from "./components/SavedWords/SavedWords";

function App() {
  const initalLetters = [
    { letter: "", number: 1 },
    { letter: "", number: 2 },
    { letter: "", number: 3 },
    { letter: "", number: 4 },
    { letter: "", number: 5 },
    { letter: "", number: 6 },
    { letter: "", number: 7 },
    { letter: "", number: 8 },
    { letter: "", number: 9 },
    { letter: "", number: 10 },
    { letter: "", number: 11 },
    { letter: "", number: 12 },
    { letter: "", number: 13 },
    { letter: "", number: 14 },
    { letter: "", number: 15 },
    { letter: "", number: 16 },
    { letter: "", number: 17 },
    { letter: "", number: 18 },
    { letter: "", number: 19 },
    { letter: "", number: 20 },
    { letter: "", number: 21 },
    { letter: "", number: 22 },
    { letter: "", number: 23 },
    { letter: "", number: 24 },
    { letter: "", number: 25 },
    { letter: "", number: 26 },
  ];
  const [knownLetters, setknownLetters] = useState(initalLetters);
  const [partialWord, setPartialWord] = useState<number[]>([]);
  const [savedWords, setSavedWords] = useState<number[][]>([]);
  return (
    <div className="container mx-auto px-4 py-4">
      <h1>Codeword Solver</h1>
      <h3>Known Letters</h3>
      <div className="max-w-md">
        <AlphabetGrid
          knownLetters={knownLetters}
          setKnownLetters={setknownLetters}
        />
      </div>
      <h3>Guess Word</h3>
      <WordInput
        knownLetters={knownLetters}
        setKnownLetters={setknownLetters}
        partialWord={partialWord}
        setPartialWord={setPartialWord}
        setSavedWords={setSavedWords}
      />
      <PossibleWords
        knownLetters={knownLetters}
        setKnownLetters={setknownLetters}
        partialWord={partialWord}
        savedWords={savedWords}
      />
      <SavedWords
        savedWords={savedWords}
        setSavedWords={setSavedWords}
        knownLetters={knownLetters}
      />
    </div>
  );
}

export default App;
