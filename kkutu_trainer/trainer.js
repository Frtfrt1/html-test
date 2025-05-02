l_first = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
l_mid = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅗㅏ','ㅗㅐ','ㅗㅣ','ㅛ','ㅜ','ㅜㅔ','ㅜㅔ','ㅜㅣ','ㅠ','ㅡ','ㅡㅣ','ㅣ']
l_end = ['','ㄱ','ㄲ','ㄱㅅ','ㄴ','ㄴㅈ','ㄴㅎ','ㄷ','ㄹ','ㄹㄱ','ㄹㅁ','ㄹㅂ','ㄹㅅ','ㄹㅌ','ㄹㅍ','ㄹㅎ','ㅁ','ㅂ','ㅂㅅ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']

function compose(ch) {
  k = ch.charCodeAt(0)-44032;
  if (k < 0 || k >= 11172) return ch
  return '' + l_first[~~(k/588)] + l_mid[~~(k/28)%21] + l_end[k%28];
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
    input.classList.add("black-text");
    input.style.transitionDuration = "1s";
    input.style.width = 0;
  }
  
  input.addEventListener("input", () => {
    input.value = input.value.trim();
    const typed = input.value;
    if (typed === "") {
      input.classList.remove("red-text", "black-text");
      input.classList.add("black-text");
      return;
    }
    
    input.style.transitionDuration = "0.3s";
    input.style.width = (typed.length+1)*1.3 + "rem";

    console.log(currentWord);
    console.log(typed.substring(0, typed.length-1));
    console.log(compose(currentWord.charAt(typed.length-1)));
    console.log(compose(typed.charAt(typed.length-1)));
    if ((typed.length == 1 || currentWord.startsWith(typed.substring(0, typed.length-1))) 
      && (compose(currentWord.charAt(typed.length-1))+compose(currentWord.charAt(typed.length))).startsWith(compose(typed.charAt(typed.length-1)))) {
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
        if (status.classList == "red-pulse") return;
        status.textContent = "Wrong!";
        status.className = "red-pulse";
        setTimeout(() => {status.classList.remove("red-pulse"); status.textContent = currentWord;},600);
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