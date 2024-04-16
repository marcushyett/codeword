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
        return {
          ...item,
          letter: matched?.letter.toUpperCase() || item.letter.toUpperCase(),
        };
      });
      setKnownLetters(newArr);
    }
  };
  useEffect(() => {
    if (partialWord.length > 2) {
      const guesses = GuessWord(partialWord, knownLetters, dictionary);
      setCandidateWords(guesses);
    }
  }, [partialWord]);

  const calculatePopularity = (rank: number): string => {
    if (rank < 1000) {
      return "high";
    } else if (rank < 10000) {
      return "mid";
    }
    return "low";
  };
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
          {!loading ? (
            candidateWords.slice(0, 5).map((guess, index) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={index}
              >
                <th className="px-6 py-4 ">
                  <div className="flex items-center">
                    <div className={calculatePopularity(guess.Rank)}></div>
                    {calculatePopularity(guess.Rank)}
                  </div>
                </th>
                <td className="px-6 py-4">{guess.Word}</td>
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
            ))
          ) : (
            <tr>Loading</tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PossibleWords;
