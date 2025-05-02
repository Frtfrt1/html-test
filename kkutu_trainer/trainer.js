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

  var wordArray = new Array(); 
  
  function showNewWord() {
    if (wordArray.length===words.length) {
        wordArray = Array(); //이걸로 몇 번 돌았는지 계산 가능
    }
    
    while (1) {
      //단어 수 늘어날 수록 오래 걸림
       var random = Math.floor(Math.random() * words.length);
       var flag = 0;
       for (let i=0; i<wordArray.length; i++) {
          if (wordArray[i]===words[random]) { var flag = 1; break; }
       }
       if (flag==0) { break; }
    }
    wordArray.push(words[random]);
    currentWord = words[random];
    
    firstChar.textContent = currentWord[0];
    lengthHint.textContent = currentWord.length;
    input.value = "";
    status.textContent = currentWord;
    status.className = "gray-text";
    input.classList.remove("green-pulse", "red-pulse", "black-text", "red-text");
    input.style.transitionDuration = "1s";
    input.style.width = 0;
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
  
    if (currentWord.startsWith(typed.substring(0, typed.length-1))) {
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
