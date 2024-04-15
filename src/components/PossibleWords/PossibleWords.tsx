import { AlphabetGridItem } from "../AlphabetGrid/AlphabetGridItem";
import { GuessWord, LoadDictionary } from "../../utils/GuessWord";
import "./PossibleWords.css";

const PossibleWords = ({
  knownLetters,
  setKnownLetters,
  partialWord,
}: {
  knownLetters: AlphabetGridItem[];
  setKnownLetters: (value: AlphabetGridItem[]) => void;
  partialWord: number[];
}): JSX.Element => {
  LoadDictionary();
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
  return (
    <ul className="candidate-words">
      {GuessWord(partialWord, knownLetters)
        .slice(0, 5)
        .map((guess, index) => (
          <li
            key={index}
            className="candidate-word"
            onClick={handleClick}
            data-word={guess.Word}
          >
            {guess.Word}
          </li>
        ))}
    </ul>
  );
};

export default PossibleWords;
