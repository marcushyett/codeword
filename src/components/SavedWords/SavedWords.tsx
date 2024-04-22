import { AlphabetGridItem } from "../AlphabetGrid/AlphabetGridItem";

const AlphabetGrid = ({
  savedWords,
  setSavedWords,
  knownLetters,
}: {
  savedWords: number[][];
  setSavedWords: (value: number[][]) => void;
  knownLetters: AlphabetGridItem[];
}): JSX.Element => {
  const handleRemoveWord = (index: number) => {
    const newSavedWords = savedWords.filter((word, i) => i !== index);
    setSavedWords(newSavedWords);
  };

  if (savedWords.length > 0) {
    return (
      <>
        <h3>Saved Words</h3>
        <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
          {savedWords.map((word, index) => {
            //if GuessWord returns only one result highlight it

            return (
              <li key={index}>
                {word.map((letter, i) => {
                  // find the letter in knownLetters
                  const knownLetter = knownLetters.find(
                    (item) => item.number === letter
                  );

                  return <span key={i}>{knownLetter?.letter || "?"}</span>;
                })}
                <button
                  className="btn btn-red ml-2"
                  onClick={() => handleRemoveWord(index)}
                >
                  x
                </button>
              </li>
            );
          })}
        </ul>
      </>
    );
  } else {
    return <></>;
  }
};

export default AlphabetGrid;
