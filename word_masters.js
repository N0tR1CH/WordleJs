/* Word masters - Wordle clone js file */
const GET_WORD_URL = "https://words.dev-apis.com/word-of-the-day";
const VALIDATE_WORD_URL = "https://words.dev-apis.com/validate-word";
const wordsEl = document.querySelectorAll(".word");
const loadingSymbol = document.querySelector(".loading-symbol");

/* Current user word */
let currentUserWord = '';

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

/* Validate word */
async function isWordValid() {
  try {
    const promise = await fetch(VALIDATE_WORD_URL, {
      method: 'POST',
      body: JSON.stringify({ "word": currentUserWord })
    })
    const processedResponse = await promise.json();
    return processedResponse.validWord;
  } catch {
    alert(`Couldn't validate the word using ${VALIDATE_WORD_URL} API :/`);
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

  currentUserWord += keyName;

  console.log(keyName);
  console.log(currentCursorPosition);
  console.log(currentUserWord);
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
      handleEnter();
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

  currentUserWord = currentUserWord.slice(0, -1);

  console.log(currentCursorPosition.currentWordPosition);
}

async function handleEnter() {
  if (currentCursorPosition.currentWordPosition != 5) {
    return;
  }

  loadingSymbol.classList.remove('loading-off');

  const result = await isWordValid();

  console.log(result);

  if (!result) {
    handleWrongResult();

    return;
  }

  loadingSymbol.classList.add('loading-off');
}

function handleWrongResult() {
  loadingSymbol.classList.add('loading-off');

  for (let i = 0; i < 5; i++) {
    wordsEl[currentCursorPosition.currentWordIndex].children[i].classList.add('red-border');
    setTimeout(() => {
      wordsEl[currentCursorPosition.currentWordIndex].children[i].classList.remove('red-border');
    }, 1000)
  }
}

/* Main Function */
async function init() {
  wordOfTheDay = await getWordOfTheDay();

  enableKeypressHandling();
}

init();
