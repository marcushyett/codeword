import { AlphabetGridItem } from "../AlphabetGrid/AlphabetGridItem";
import { GuessWord, LoadDictionary } from "../../utils/GuessWord";
import "./PossibleWords.css";
import { useEffect, useState } from "react";

var dictionary: { Word: string; Rank: number }[] = [];

const PossibleWords = ({
  knownLetters,
  setKnownLetters,
  partialWord,
}: {
  knownLetters: AlphabetGridItem[];
  setKnownLetters: (value: AlphabetGridItem[]) => void;
  partialWord: number[];
}): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const initialCandiateWords = [] as { Word: string; Rank: number }[];
  const [candidateWords, setCandidateWords] = useState(initialCandiateWords);
  LoadDictionary().then((data) => {
    console.log(data);
    console.log("Dictionary loaded with " + data.length.toString() + " words");
    setLoading(false);
    dictionary = data;
  });
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const word = (e.target as HTMLElement).dataset.word;
    const word_array = word?.split("");
    if (word_array !== undefined) {
      const matches = partialWord.map((letter, index) => {
        return { letter: word_array[index], number: letter };
      });
      const newArr = knownLetters.map((item: AlphabetGridItem) => {
        const matched = matches.find((match) => match.number === item.number);
        return { ...item, letter: matched?.letter || item.letter };
      });
      setKnownLetters(newArr);
    }
  };
  useEffect(() => {
    console.log("Partial word changed", partialWord);
    if (partialWord.length > 2) {
      const guesses = GuessWord(partialWord, knownLetters, dictionary);
      setCandidateWords(guesses);
      console.log(guesses);
    }
  }, [partialWord]);
  return (
    <ul className="candidate-words">
      {!loading ? (
        candidateWords.slice(0, 5).map((guess, index) => (
          <li
            key={index}
            className="candidate-word"
            onClick={handleClick}
            data-word={guess.Word}
          >
            {guess.Word}
          </li>
        ))
      ) : (
        <li>Loading</li>
      )}
    </ul>
  );
};

export default PossibleWords;
