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
    return processedResponse.word.toUpperCase();
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
}

function handleBackSpaceAndEnter(event) {
  let keyName = event.key;

  switch (keyName) {
    case "Backspace":
      handleBackSpace();
      break;
    case "Enter":
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
}

async function handleEnter() {
  if (currentCursorPosition.currentWordPosition != 5) {
    return;
  }

  loadingSymbol.classList.remove('loading-off');

  const result = await isWordValid();

  if (!result) {
    handleWrongResult();
    return;
  }

  handleRightResult();

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

function handleRightResult() {
  let howMuchAnsweredRight = 0;
  let yellowGuesses = "";

  for (let i = 0; i < currentUserWord.length; i++) {
    if (currentUserWord[i] === wordOfTheDay[i]) {
      howMuchAnsweredRight++;
      wordsEl[currentCursorPosition.currentWordIndex].children[i].classList.add('green-letter');
    } else {
      if (wordOfTheDay.includes(currentUserWord[i])) {
        if (!yellowGuesses.includes(currentUserWord[i])) {
          wordsEl[currentCursorPosition.currentWordIndex].children[i].classList.add('orange-letter');
        } else {
          wordsEl[currentCursorPosition.currentWordIndex].children[i].classList.add('gray-letter');
        }
      } else {
        wordsEl[currentCursorPosition.currentWordIndex].children[i].classList.add('gray-letter');
        yellowGuesses += currentUserWord[i];
      }
    }
  }

  currentUserWord = '';

  if (howMuchAnsweredRight == 5) {
    win();
  } else {
    currentCursorPosition.currentWordIndex++;
    currentCursorPosition.currentWordPosition = 0;
    if (currentCursorPosition.currentWordIndex == 6) {
      lose();
    }
  }
}

function win() {
  document.querySelector('.game-title').classList.add('rainbow-text');
  alert('you win');
}

function lose() {
  alert(`you lose, the word was ${wordOfTheDay}`);
}

/* Main Function */
async function init() {
  wordOfTheDay = await getWordOfTheDay();

  enableKeypressHandling();
}

init();
