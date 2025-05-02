l_first = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
l_mid = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ']
l_end = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']

function compose(ch) {
  k = ch.charCodeAt(0)-44032;
  if (k < 0 || k >= 11172) return [ch]
  return [l_first[~~(k/588)], l_mid[~~(k/28)%21], l_end[k%28]];
}

function composemultiple(str) {
  res = ''
  for (let i = 0; i < str.length; i++) compose(str.charAt(i)).forEach(e => res += e);
  return res;
}

window.onload = () => {
  const prepare = document.getElementById('prepare');
  const pressany = document.getElementById('pressany');

  const game = document.getElementById('main-game');
  const input = document.getElementById('input');
  const status = document.getElementById('status');
  const firstChar = document.getElementById('firstChar');
  const lengthHint = document.getElementById('lengthHint');
  const timerDisplay = document.getElementById('timer');
  
  let currentWord = "";
  let currentWordCompose = "";
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
    input.style.transitionDuration = "1s";
    input.style.width = 0;
    currentWordCompose = composemultiple(currentWord);
  }
  
  input.addEventListener("input", () => {
    input.value = input.value.trim();
    const typed = input.value;
    if (typed === "") {
      input.classList.remove("red-text", "black-text");
      return;
    }
    
    input.style.transitionDuration = "0.3s";
    input.style.width = (typed.length+1)*1.3 + "rem";
  
    console.log(composemultiple(typed));
    console.log(currentWordCompose);
    if (currentWordCompose.startsWith(composemultiple(typed))) {
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
        setTimeout(() => {status.textContent = currentWord}, 1000);
      }
    }
  });

  let isPlaying = false;
  
  game.classList.add('hidden');
  window.addEventListener("keydown", (e) => {
    if (e.code == 'Space' && !isPlaying) {      
      prepare.classList.add('hidden');
      game.classList.remove('hidden');
      focus(input.focus());
      showNewWord();
      isPlaying = true;
    }
  });
}