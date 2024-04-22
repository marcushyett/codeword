import { AlphabetGridItem } from "../AlphabetGrid/AlphabetGridItem";
import { useEffect, useState } from "react";
import LetterInput from "../LetterInput/LetterInput";
import "./WordInput.css";

const getElementByIdAsync = (id: string): Promise<HTMLElement> =>
  new Promise((resolve) => {
    const getElement = () => {
      const element = document.getElementById(id);
      if (element) {
        resolve(element);
      } else {
        requestAnimationFrame(getElement);
      }
    };
    getElement();
  });

const WordInput = ({
  knownLetters,
  setKnownLetters,
  partialWord,
  setPartialWord,
  setSavedWords,
}: {
  knownLetters: AlphabetGridItem[];
  setKnownLetters: (value: AlphabetGridItem[]) => void;
  partialWord: number[];
  setPartialWord: (value: number[]) => void;
  setSavedWords: (value: number[][]) => void;
}) => {
  const inputArr = [
    {
      id: 1,
      value: "",
      letter_number: 0,
    },
  ];

  const [arr, setArr] = useState(inputArr);
  const [showAdd, setShowAdd] = useState(false);

  const addInput = () => {
    setArr((s) => {
      return [
        ...s,
        {
          id: s.length + 1,
          value: "",
          letter_number: 0,
        },
      ];
    });
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    status: string
  ) => {
    e.preventDefault();
    if (status === "invalid") {
      return;
    }

    const index = parseInt(e.target.id, 10);
    setArr((s) => {
      const newArr = s.slice();
      newArr[index].value = e.target.value;
      return newArr;
    });

    if (status === "complete") {
      // if this is the last index in the array then add another input
      if (parseInt(e.target.id, 10) === arr.length - 1) {
        addInput();
      }

      // focus on the next input
      const index = parseInt(e.target.id, 10);
      const nextIndex = index + 1;
      const nextInput = await getElementByIdAsync(nextIndex.toString());
      // ensure value has also changed before moving on to the next field
      // if (
      //   nextInput &&
      //   e.target.value !== arr[parseInt(e.target.id, 10)].value
      // ) {
      nextInput.focus();
      // }
      setArr((s) => {
        const newArr = s.slice();
        //if e.targetvalue is a number in known_letters then set the value to the letter
        // newArr[index].value = "?";
        knownLetters.forEach((item) => {
          if (item.number === Number(e.target.value)) {
            if (item.letter === "") {
              newArr[index].value = "?";
            } else {
              newArr[index].value = item.letter;
            }
          }
        });
        //if value is a number then set letter_number to the value
        if (e.target.value.match(/[0-9]/)) {
          newArr[index].letter_number = Number(e.target.value);
        }
        return newArr;
      });
    }
    if (status === "letter") {
      // if the letter_number is set for this input then set the letter as the value
      if (arr[index].letter_number) {
        var value = "?";
        // if the letter is already in known letters then return
        if (knownLetters.some((item) => item.letter === e.target.value)) {
          alert("Letter already in use");
        } else {
          value = e.target.value;
        }

        // SetArr for every value in the array with the same letter_number to have the same value
        setArr((s) => {
          const newArr = s.slice();
          newArr.forEach((item) => {
            if (item.letter_number === arr[index].letter_number) {
              item.value = value;
            }
          });
          return newArr;
        });

        // update knownLetters with the new letter
        const newArr = knownLetters.map((item: AlphabetGridItem) => {
          if (item.number === arr[index].letter_number) {
            return { ...item, letter: e.target.value };
          }
          return item;
        });
        setKnownLetters(newArr);
        //
      } else {
        setArr((s) => {
          const newArr = s.slice();
          newArr[index].value = "";
          return newArr;
        });
        alert("Please enter a number first");
      }
    }

    if (status === "incomplete") {
      setShowAdd(true);
    }
  };

  //Listen for blur on the last input and if it is blurred remove it
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      e.target.id === (arr.length - 1).toString() &&
      arr.length > 1 &&
      e.target.value === ""
    ) {
      setArr((s) => {
        return s.slice(0, s.length - 1);
      });
      setShowAdd(true);
    } else {
      handleChange(e, "complete");
    }
  };

  const handleReset = () => {
    setArr(inputArr);
    setPartialWord([]);
  };

  // useeffect to update the arr if known_letters changes
  useEffect(() => {
    setArr((s) => {
      const newArr = s.slice();
      newArr.forEach((item) => {
        knownLetters.forEach((letter) => {
          if (letter.number === item.letter_number && letter.letter != "") {
            item.value = letter.letter;
          }
        });
      });
      return newArr;
    });
  }, [knownLetters]);

  const handleSave = () => {
    // update savedWords with the value of partialWord
    setSavedWords((s: number[][]) => {
      return [...s, partialWord];
    });
  };

  useEffect(() => {
    // set partial word to be a string of all the letters in the array
    // remove any itmes with letter_number = 0
    const word = arr
      .filter((item) => item.letter_number !== 0)
      .map((item) => item.letter_number);
    setPartialWord(word);
  }, [arr]);

  return (
    <>
      <div>
        {arr.map((item, i) => {
          return (
            <LetterInput
              onChange={handleChange}
              value={item.value}
              superscript_value={item.letter_number.toString()}
              key={i.toString()}
              id={i.toString()}
              onBlur={handleBlur}
              inputmode={item.letter_number === 0 ? "numeric" : "text"}
            />
          );
        })}
        {showAdd ? (
          <button className="btn btn-blue" onClick={addInput}>
            +
          </button>
        ) : null}
      </div>
      <div>
        <div className="inline-block">
          <button className="btn btn-gray my-2" onClick={handleReset}>
            Clear Word
          </button>
        </div>
        <div className="inline-block">
          {arr.length > 2 ? (
            <button className="btn btn-gray my-2" onClick={handleSave}>
              Save for Later
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default WordInput;
