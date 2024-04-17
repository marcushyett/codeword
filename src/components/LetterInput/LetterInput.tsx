import "./LetterInput.css";

const LetterInput = ({
  onChange,
  onBlur,
  value,
  superscript_value,
  id,
  inputmode,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>, status: string) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  value: string;
  superscript_value: string;
  id: string;
  inputmode:
    | "search"
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | undefined;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var letter_value = e.target.value;

    //if letter_value is a mix of letters and numbers then return
    if (letter_value.match(/[a-zA-Z]/) && letter_value.match(/[0-9]/)) {
      return;
    }

    //if it contains a question mark with any other stuff then return
    if (letter_value.match(/\?/) && letter_value !== "?") {
      return;
    }

    //if letter_value contains any characters that are not letters or numbers (except for question mark) then return
    if (
      letter_value.match(/[^a-zA-Z0-9?]/) &&
      !letter_value.match(/\?/) &&
      letter_value.length > 0
    ) {
      return;
    }

    // check if letter_value is a number or letter
    if (letter_value.match(/[0-9]/)) {
      // if number is > 26 then alert
      if (Number(letter_value) > 26) {
        onChange(e, "invalid");
      }

      //else if number is > 2 then go to next input
      else if (Number(letter_value) > 2 && Number(letter_value) < 10) {
        onChange(e, "complete");
      }

      //if number is two digits long then go to next input
      else if (letter_value.length === 2) {
        onChange(e, "complete");
      } else {
        onChange(e, "incomplete");
      }
    } else if (letter_value.match(/[a-zA-Z]/)) {
      onChange(e, "letter");
    } else {
      onChange(e, "incomplete");
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur(e);
  };

  return (
    <div className="letter-container">
      <input
        className="letter-input"
        maxLength={2}
        name="letterInput"
        value={value}
        onChange={handleChange}
        id={id}
        onBlur={handleBlur}
        inputMode={inputmode}
      />
      {Number(superscript_value) > 0 ? (
        <span className="letter-superscript">{superscript_value}</span>
      ) : null}
    </div>
  );
};

export default LetterInput;
