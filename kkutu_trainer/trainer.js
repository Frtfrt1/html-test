l_first = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
l_mid = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅗㅏ','ㅗㅐ','ㅗㅣ','ㅛ','ㅜ','ㅜㅔ','ㅜㅔ','ㅜㅣ','ㅠ','ㅡ','ㅡㅣ','ㅣ']
l_end = ['','ㄱ','ㄲ','ㄱㅅ','ㄴ','ㄴㅈ','ㄴㅎ','ㄷ','ㄹ','ㄹㄱ','ㄹㅁ','ㄹㅂ','ㄹㅅ','ㄹㅌ','ㄹㅍ','ㄹㅎ','ㅁ','ㅂ','ㅂㅅ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']

function compose(ch) {
  k = ch.charCodeAt(0)-44032;
  if (k < 0 || k >= 11172) return ch
  return '' + l_first[~~(k/588)] + l_mid[~~(k/28)%21] + l_end[k%28];
}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}


const setting_keys = ['show-words','partially-hide']
const setting_meta = {
  'show-words': {
    'type': 'enum',
    'values': ['all', 'consonant', 'none'],
    'default': 'all',
  },
  'partially-hide': {
    'type': 'bool',
    'default': '0',
  },
}
const lang_key = {
  'show-words': '단어 보이기',
  'show-consonant': '초성 보이기',
  'partially-hide': '글자 일부분 숨기기',
  'all': '전부',
  'consonant': '초성만',
  'none': '숨김',
}

const icon_on = "\uE86C";
const icon_off = "\uE5C9";
const arrow_left = "\uE5DE";
const arrow_right = "\uE5DF";

window.onload = () => {
  setting_keys.forEach(e => {
    if (getCookie(e) == undefined) setCookie(e, setting_meta[e].default);
  })

  const prepare = document.getElementById('prepare');
  const game = document.getElementById('main-game');
  const input = document.getElementById('input');
  const status = document.getElementById('status');
  const firstChar = document.getElementById('firstChar');
  const lengthHint = document.getElementById('lengthHint');
  const timerDisplay = document.getElementById('timer');
  
  const header = document.getElementById('header');
  const settings = document.getElementById('settings');
  
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
    status.className = "gray-text";
    input.classList.remove("green-pulse", "red-pulse", "black-text", "red-text");
    input.classList.add("black-text");
    input.style.transitionDuration = "1s";
    input.style.width = 0;
    setWord(currentWord);
  }
  
  function setWord(word) {
    const showWords = getCookie('show-words');
    let content = '';
    if (showWords == 'all') {
      content = word;
    } else if (showWords == 'consonant') {
      for (let i = 0; i < word.length; i++) content += compose(word[i])[0]
    } else {
      content = '';
    }
    if (getCookie('partially-hide') == '1') {
      let v = '';
      let r = 0;
      for (let i = 0; i < content.length; i++) {
        if (r < 0.5 || content[i] == ' ') v += content[i];
        else v += '□';
        r = (r + Math.random()*0.5) % 1;
      }
      content = v;
    }
    status.textContent = content;
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

  
  function update_setting(key, value) {
    setCookie(key, value);
    if (key == 'show-words' || key == 'partially-hide') {
      setWord(currentWord);
    }
  }


  setting_keys.forEach(key => {
    if (setting_meta[key].type == 'bool') {
      const icon = document.createElement("span");
      icon.className = 'material-symbols-outlined';
      icon.textContent = (getCookie(key) == '1') ? icon_on : icon_off;
      const description = document.createElement('span');
      description.textContent = lang_key[key];
      settings.append(icon, description);
      icon.addEventListener('click', e => {
        if (getCookie(key) == '1') {
          update_setting(key, 0);
          icon.textContent = icon_off;
        } else {
          update_setting(key, 1);
          icon.textContent = icon_on;
        }
      });
    } else if (setting_meta[key].type == 'enum') {
      const left = document.createElement("span");
      left.className = 'material-symbols-outlined';
      left.textContent = arrow_left;
      const right = document.createElement("span");
      right.className = 'material-symbols-outlined';
      right.textContent = arrow_right;
      const value = document.createElement('span');
      value.textContent = lang_key[getCookie(key)];
      value.style.width = '200px';
      value.style.textAlign = 'center';
      value.style.fontSize = '1.1rem'
      const obj = document.createElement('span');
      obj.append(left, value, right);
      const description = document.createElement('span');
      description.textContent = lang_key[key];
      settings.append(obj, description);

      right.addEventListener('click', e => {
        const values = setting_meta[key].values
        let v = getCookie(key);
        v = values[(values.indexOf(v)+1) % (values.length)]
        value.textContent = lang_key[v];
        update_setting(key, v);
      });

      left.addEventListener('click', e => {
        const values = setting_meta[key].values
        let v = getCookie(key);
        v = values[(values.indexOf(v)-1+values.length) % (values.length)]
        value.textContent = lang_key[v];
        update_setting(key, v);
      });
    }
  });
}
