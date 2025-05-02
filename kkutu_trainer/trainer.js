const input = document.getElementById('input');
const status = document.getElementById('status');
const firstChar = document.getElementById('firstChar');
const lengthHint = document.getElementById('lengthHint');
const timerDisplay = document.getElementById('timer');

let words = [];
let currentWord = "";
let startTime = Date.now();

// Timer with milliseconds
setInterval(() => {
  const elapsed = (Date.now() - startTime) / 1000;
  timerDisplay.textContent = `Time: ${elapsed.toFixed(3)}s`;
}, 50);

function showNewWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  firstChar.textContent = currentWord[0];
  lengthHint.textContent = currentWord.length;
  input.value = "";
  status.textContent = currentWord;
  status.className = "gray-text";
  input.classList.remove("green-pulse", "red-pulse", "black-text", "red-text");
}

input.addEventListener("input", () => {
  const typed = input.value;
  if (typed === "") {
    input.classList.remove("red-text", "black-text");
    return;
  }

  if (currentWord.startsWith(typed)) {
    input.classList.add("black-text");
    input.classList.remove("red-text");
  } else {
    input.classList.add("red-text");
    input.classList.remove("black-text");
  }
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (input.value === currentWord) {
      status.textContent = "Correct!";
      status.className = "green-pulse";
      input.classList.remove("red-text", "black-text");
      input.classList.add("green-pulse");
      setTimeout(showNewWord, 1000);
    } else {
      status.textContent = "Wrong!";
      status.className = "red-pulse";
    }
  }
});

fetch("words.txt")
  .then(res => res.text())
  .then(text => {
    words = text.split(/\r?\n/).filter(w => w.trim().length > 0);
    if (words.length > 0) {
      showNewWord();
    } else {
      firstChar.textContent = "No words";
    }
  })
  .catch(() => {
    firstChar.textContent = "Error loading file.";
  });
