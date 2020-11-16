// Globala variabler
const wordList = ['distinct', 'underline', 'lung', 'attention', 'cart', 'line', 'expenditure', 'fiction', 'crisis', 'foundation', 'edition', 'soft', 'horror', 'station', 'cool', 'posture', 'yard', 'finance', 'missile', 'ambiguity', 'murder', 'pile', 'loop', 'cupboard', 'publication', 'slant', 'prediction', 'publisher', 'conference', 'brink', 'herd', 'absence', 'clash', 'virgin', 'helicopter', 'flight', 'inhabitant', 'domination', 'bend', 'switch', 'subject', 'beg', 'file', 'cattle', 'soap', 'snake', 'cut', 'movie', 'liberty', 'production'];      // Array: med spelets alla ord
const imageList = ['images/h0.png', 'images/h1.png', 'images/h2.png', 'images/h3.png', 'images/h4.png', 'images/h5.png', 'images/h6.png'];

let selectedWord = '';    // Sträng: ett av orden valt av en slumpgenerator från arrayen ovan
let wordLength = 0;
let guesses = 0;     // Number: håller antalet gissningar som gjorts
let guessedLetterCount = 0;
let wrongGuessesLeft = 6;
let hangmanImg;      // Sträng: sökväg till bild som kommer visas (och ändras) fel svar. t.ex. `/images/h1.png`
let msgHolderEl = document.querySelector('#message');     // DOM-nod: Ger meddelande när spelet är över
let startGameBtnEl = document.querySelector('#startGameBtn');  // DOM-nod: knappen som du startar spelet med
let letterButtonEls = document.querySelectorAll('#letterButtons button'); // Array av DOM-noder: Knapparna för bokstäverna
let letterBoxEls = document.querySelectorAll('#letterBoxes ul li');    // Array av DOM-noder: Rutorna där bokstäverna ska stå
let letterBoxContainerEl = document.querySelector('#letterBoxes ul');
let letterButtonContainerEl = document.querySelector('ul#letterButtons');
let hangmanImgEl = document.querySelector('#hangman');


startGameBtnEl.addEventListener('click', initiateGame);
letterButtonContainerEl.addEventListener('click', guessLetter);

// Funktion som meddelar spelaren att hen vunnit och deaktiverar bokstavsknapparna samt aktiverar startknappen för nytt spel
function gameWasWon(){
    informUser("WELL DONE! YOU WIN!")
    deactivate();
    startGameBtnEl.disabled = false
}
// Funktion som meddelar spelaren att hen förlorat och vilket ord som söktes och deaktiverar bokstavsknapparna samt aktiverar startknappen för nytt spel
function gameWasLost() {
    informUser(`GAME OVER! THE WORD THAT BEAT YOU WAS "${selectedWord}"`)
    deactivate();
    startGameBtnEl.disabled = false
}
// Funktion som ropas vid vinst eller förlust, gör olika saker beroende tillståndet
function checkGameState(lastGuessCorrect) {
    if ((hangmanImgEl.src.slice(-6) === 'h6.png') && !lastGuessCorrect) {
        gameWasLost();
    }
    if (lastGuessCorrect && selectedWord.length === guessedLetterCount){
        gameWasWon();
    }
}
// Funktion som helt enkelt tar bort texten med regler etc
function hideRules(){
    rules = document.querySelector('article');
    rules.innerHTML = "";
}
// Funktion som lägger till en reset game-knapp
function addResetGameBtn(){ 
    const newButton = document.createElement('div');
    newButton.innerHTML = '<button class="btn btn--stripe" type="button" id="resetGameBtn" onclick="resetGame()">Reset game</button>';
    letterButtonContainerEl.insertAdjacentElement("beforebegin", newButton);
}
// Funktion som används för att skicka information till spelaren
function informUser(message) {
    msgHolderEl.innerText = message;
}
// Funktion som körs när du trycker på bokstäverna och gissar bokstav
function guessLetter(e) {
    let lastGuessCorrect;
    if (e.target.tagName !== "BUTTON") {
        return;
    }
    let guessedLetter = e.target.value;
    e.target.disabled = true

    let startIndex = 0, index;
    let searchStrLen = guessedLetter.length;
    if (selectedWord.indexOf(guessedLetter, startIndex) < 0) {
        lastGuessCorrect = false;
        guesses = guesses + 1;
        setHangmanImg(guesses)
        checkGameState(lastGuessCorrect)
        return;
    }

    while ((index = selectedWord.indexOf(guessedLetter, startIndex)) > -1){
        lastGuessCorrect = true;
        letterBoxEls[index].firstElementChild.value = guessedLetter;
        guessedLetterCount++;
        checkGameState(lastGuessCorrect)
        startIndex = index + searchStrLen;
    }
    return;
}

function setHangmanImg(index) {
    hangmanImg = imageList[index];
    hangmanImgEl.setAttribute('src', hangmanImg);
}
// Funktion som slumpar fram ett ord
function randomWord(arr) {
    const randomNumber = Math.floor(Math.random() * arr.length)
    return arr[randomNumber]
}
// Funktion som tar bort de förvalda bokstavsrutorna
function removeLB(){
    letterBoxContainerEl.innerHTML = "";
}
// Funktion som tar fram bokstävernas rutor, antal rutor beror på vilket ord slumptas fram
function generateLB(amount) {
    for (i = 0; i < amount; i++) {
    let newLI = document.createElement('li');
    newLI.innerHTML = '<input type="text" disabled value="&nbsp;"/>';
    letterBoxContainerEl.appendChild(newLI);
    }
    letterBoxEls = document.querySelectorAll('#letterBoxes ul li');
}
// Funktion som aktiverar bokstavsknapparna beroende på vilken del av spelet du är på
function activate() {
    for (let i = 0; i < letterButtonEls.length; i++) {
        letterButtonEls[i].disabled = false
    }
}
// Funktion som inaktiverar bokstavsknapparna beroende på vilken del av spelet du är på
function deactivate() {
    for (let i = 0; i < letterButtonEls.length; i++) {
        letterButtonEls[i].disabled = true
    }
}
// Funktion som inaktiverar/aktiverar bokstavsknapparna beroende på vilken del av spelet du är på
function deactivateLetter(letter) {
    for (let i = 0; i < letterButtonEls.length; i++) {
        if (letter === letterButtonEls[i].value) {
            letterButtonEls[i].disabled = true
        }  
    }
}
// Funktion som avbryter spelet och via andra funktioner återställer status och meddelar förlust och sökt ord
function resetGame(){
    removeLB();
    deactivate();
    startGameBtnEl.disabled = false
    guesses = 0
    wrongGuessesLeft = 6;
    guessedLetterCount = 0;
    setHangmanImg(0);
    gameWasLost();
}

removeLB();
deactivate();
startGameBtnEl.disabled = false
addResetGameBtn();
// Funktion som startar spelet vid knapptryckning, och då tillkallas andra funktioner
function initiateGame() {
    guesses = 0;
    guessedLetterCount = 0;
    wrongGuessesLeft = 6;
    selectedWord = randomWord(wordList).toUpperCase();
    let wordLength = selectedWord.length;
    activate();
    removeLB();
    generateLB(wordLength);
    setHangmanImg(0);
    informUser("");
    hideRules();
    
    startGameBtnEl.disabled = true
}