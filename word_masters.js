/* Word masters - Wordle clone js file */
const GET_WORD_URL = "https://words.dev-apis.com/word-of-the-day";
const VALIDATE_WORD_URL = "https://words.dev-apis.com/validate-word";
const wordsEl = document.querySelectorAll(".word");

/* Object describing the current cursor position */
let currentCursorPosition = { currentWordIndex: 0, currentWordPosition: 0 };

/* Word of the day */
let wordOfTheDay;

/* Checking if user input is right */
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

/* Getting response from word-of-the-day API */
async function getWordOfTheDay() {
  try {
    const promise = await fetch(GET_WORD_URL);
    const processedResponse = await promise.json();
    return processedResponse.word;
  } catch {
    alert(`Couldn't get the word of the day from ${GET_WORD_URL} API :/`);
    console.error("Error:", error);
  }
}

/* Keypress handling */
function enableKeypressHandling() {
  document.addEventListener("keypress", handleKeyPress);
  document.addEventListener("keydown", handleBackSpaceAndEnter);
}

function handleKeyPress(event) {
  if (currentCursorPosition.currentWordPosition == 5) {
    return;
  }

  let keyName = event.key;

  if (!isLetter(keyName)) {
    return;
  }

  keyName = keyName.toUpperCase();

  wordsEl[currentCursorPosition.currentWordIndex].children[
    currentCursorPosition.currentWordPosition++
  ].innerText = keyName;

  console.log(keyName);
  console.log(currentCursorPosition);
}

function handleBackSpaceAndEnter(event) {
  let keyName = event.key;

  switch (keyName) {
    case "Backspace":
      handleBackSpace();
      break;
    case "Enter":
      console.log("You got enter babe");
      if (currentCursorPosition.currentWordPosition != 5) {
        return;
      }
      break;
    default:
      return;
  }
}

function handleBackSpace() {
  if(currentCursorPosition.currentWordPosition == 0) {
    return;
  }

  wordsEl[currentCursorPosition.currentWordIndex].children[
    --currentCursorPosition.currentWordPosition
  ].innerText = '';

  console.log(currentCursorPosition.currentWordPosition);
}

/* Main Function */
async function init() {
  wordOfTheDay = await getWordOfTheDay();

  enableKeypressHandling();
}

init();
