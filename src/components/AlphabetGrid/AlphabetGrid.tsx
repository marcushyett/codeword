import "./AlphabetGrid.css";
import { AlphabetGridItem } from "./AlphabetGridItem";

const AlphabetGrid = ({
  knownLetters,
  setKnownLetters,
}: {
  knownLetters: AlphabetGridItem[];
  setKnownLetters: (value: AlphabetGridItem[]) => void;
}): JSX.Element => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var value = e.target.value;
    const id = e.target.id;

    // If letter is lowercase, convert to uppercase
    if (value.match(/[a-z]/)) {
      value = value.toUpperCase();
    }
    // if the value is not a letter don't update (but allow empty values)
    if (value != "" && !value.match(/[A-Z]/)) {
      console.log("Invalid letter");
      return;
    }
    // if the letter is already in the knownLetters array do not update
    if (knownLetters.some((item) => item.letter === value) && value != "") {
      console.log("Letter alreay in use");
      return;
    }

    const newArr = knownLetters.map((item: AlphabetGridItem) => {
      if ("ag-" + item.number.toString() === id) {
        return { ...item, letter: value };
      }

      return item;
    });
    setKnownLetters(newArr);
  };
  return (
    <div className="alphabet-grid">
      {knownLetters.map((item: AlphabetGridItem, i: number) => {
        return (
          <div className="alphabet-grid-item" key={i.toString()}>
            <input
              className="alphabet-grid-letter"
              value={item.letter}
              onChange={handleChange}
              id={"ag-" + item.number.toString()}
              maxLength={1}
            />
            <span className="alphabet-grid-number">{item.number}</span>
          </div>
        );
      })}
    </div>
  );
};

export default AlphabetGrid;
