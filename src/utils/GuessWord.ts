// const { default: dictionary } = await import("./words.json.gz");
import axios from "axios";
import { AlphabetGridItem } from "../components/AlphabetGrid/AlphabetGridItem";

const LoadDictionary = async () => {
  const { data } = await axios.get("words.json", {
    responseType: "json",
  });
  return data;
};

const GuessWord = (
  partial_word: number[],
  knownLetters: AlphabetGridItem[],
  dictionary: { Word: string; Rank: number }[]
): {
  Word: string;
  Rank: number;
}[] => {
  const partial_to_regexp = (
    partial_word: number[],
    known_letters: AlphabetGridItem[]
  ) => {
    var regexp = "^";
    var repeated_letters: number[] = [];
    var known_letters_string = known_letters
      .filter((letter) => letter.letter !== "")
      .map((letter) => letter.letter)
      .join();
    var remaining_letters = `(?![${known_letters_string}])[A-Z]`;

    partial_word.forEach((letter, index) => {
      // if letter is in known_letters, add it to the regexp
      if (
        known_letters.some(
          (item) => item.number === letter && item.letter !== ""
        )
      ) {
        //get letter from known_letters where letter matches number
        const known_letter = known_letters.find(
          (item) => item.number === letter
        );
        regexp += known_letter?.letter;
      } else {
        if (repeated_letters.includes(letter)) {
          regexp += `\\${repeated_letters.indexOf(letter) + 1}`;
        } else if (partial_word.indexOf(letter, index + 1) === -1) {
          regexp += `${remaining_letters}`;
        } else {
          regexp += `(${remaining_letters})`;
          repeated_letters.push(letter);
        }
      }
    });
    return new RegExp(regexp + "$", "i");
  };

  const analyze = (regexp: RegExp, partial_word: number[]) => {
    var candidates: {
      Word: string;
      Rank: number;
    }[] = [];
    console.log(partial_word);
    dictionary.forEach((word: { Word: string; Rank: number }) => {
      // console.log("Checking", word["Word"]);

      if (word["Word"].length === partial_word.length) {
        if (word["Word"].match(regexp)) {
          // Create an object which matches each item in partial_word array with a letter from the word["Wod"] matching on each index
          const word_array = word["Word"].split("");
          const matches = partial_word.map((letter, index) => {
            return { letter: word_array[index], number: letter };
          });
          // find any matches where the same letter has two different numbers
          const duplicates = matches.filter(
            (item, index) =>
              matches.findIndex((i) => i.letter === item.letter) !== index
          );

          const bad_duplicates = duplicates.filter(
            (item) =>
              duplicates.findIndex(
                (i) => i.letter === item.letter && i.number !== item.number
              ) > -1
          );
          if (bad_duplicates.length > 0) {
            console.log(word, bad_duplicates);
          }
          if (bad_duplicates.length === 0) {
            candidates.push(word);
          }
        }
      }
    });
    return candidates;
  };

  const regex = partial_to_regexp(partial_word, knownLetters);
  const guesses = analyze(regex, partial_word);

  return guesses;
};

export { GuessWord, LoadDictionary };
