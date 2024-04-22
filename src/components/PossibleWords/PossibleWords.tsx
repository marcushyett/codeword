import { AlphabetGridItem } from "../AlphabetGrid/AlphabetGridItem";
import { GuessWord, LoadDictionary } from "../../utils/GuessWord";
import "./PossibleWords.css";
import { useEffect, useState } from "react";

var dictionary: { Word: string; Rank: number }[] = [];

const PossibleWords = ({
  knownLetters,
  setKnownLetters,
  partialWord,
  savedWords,
}: {
  knownLetters: AlphabetGridItem[];
  setKnownLetters: (value: AlphabetGridItem[]) => void;
  partialWord: number[];
  savedWords: number[][];
}): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const initialCandiateWords = [] as { Word: string; Rank: number }[];
  const [candidateWords, setCandidateWords] = useState(initialCandiateWords);
  LoadDictionary().then((data) => {
    setLoading(false);
    dictionary = data;
  });

  const updateKnownLetters = (word: string, partialWord: number[]) => {
    const word_array = word?.split("");
    if (word_array !== undefined) {
      const matches = partialWord.map((letter, index) => {
        return { letter: word_array[index], number: letter };
      });
      const newArr = knownLetters.map((item: AlphabetGridItem) => {
        const matched = matches.find((match) => match.number === item.number);
        return {
          ...item,
          letter: matched?.letter.toUpperCase() || item.letter.toUpperCase(),
        };
      });
      setKnownLetters(newArr);
    }
  };
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const word = (e.target as HTMLElement).dataset.word;
    updateKnownLetters(word || "", partialWord);
  };
  useEffect(() => {
    if (partialWord.length > 2) {
      const guesses = GuessWord(partialWord, knownLetters, dictionary);

      setCandidateWords(guesses);
    } else {
      setCandidateWords(initialCandiateWords);
    }
  }, [partialWord]);

  useEffect(() => {
    if (savedWords.length > 0) {
      savedWords.forEach((word) => {
        const guesses = GuessWord(word, knownLetters, dictionary);
        if (guesses.length === 1) {
          updateKnownLetters(guesses[0].Word, word);
        }
      });
    }
  }, [knownLetters]);

  const calculatePopularity = (rank: number): string => {
    if (rank < 1000) {
      return "high";
    } else if (rank < 10000) {
      return "mid";
    }
    return "low";
  };
  if (loading) {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  } else if (candidateWords.length > 0) {
    return (
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Popularity
              </th>
              <th scope="col" className="px-6 py-3">
                Word
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {candidateWords.slice(0, 5).map((guess, index) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={index}
              >
                <th className="px-6 py-4 ">
                  <div className="flex items-center capitalize">
                    <div className={calculatePopularity(guess.Rank)}></div>
                    {calculatePopularity(guess.Rank)}
                  </div>
                </th>
                <td className="px-6 py-4 capitalize">{guess.Word}</td>
                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={handleClick}
                    data-word={guess.Word}
                  >
                    Select
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    return <></>;
  }
};

export default PossibleWords;
