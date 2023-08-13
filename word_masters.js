/* Word masters - Wordle clone js file */
const GET_WORD_URL = "https://words.dev-apis.com/word-of-the-day"
const VALIDATE_WORD_URL = "https://words.dev-apis.com/validate-word"
const wordsEl = document.querySelectorAll('.word')

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
        alert(`Couldn't get the word of the day from ${GET_WORD_URL} API :/`)
        console.error('Error:', error);
    }
}

/* Keypress handling */
function handleKeyPress(event) {
    let keyName = event.key;

    if (!isLetter(keyName)) {
        return;
    }

    keyName = keyName.toUpperCase();
    console.log(keyName);
}

function handleBackSpace(event) {
    let keyName = event.key;

    if (keyName != 'Backspace') {
        return;
    }
    console.log("Got the backspace babe");
}

/* Main Function */
async function init() {
    const wordOfTheDay = await getWordOfTheDay();

    document.addEventListener('keypress', handleKeyPress);
    document.addEventListener('keydown', handleBackSpace);
}

init();
