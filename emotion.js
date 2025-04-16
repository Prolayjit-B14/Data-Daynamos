const emotions = {
    "Happy": "😊",
    "Sad": "😢",
    "Angry": "😠",
    "Excited": "🤩",
    "Scared": "😱",
    "Surprised": "😮",
    "Sleepy": "😴",
    "Silly": "😜",
    "Love": "😍",
    "Confused": "😕"
  };
  
  let selectedName = null;
  let selectedEmoji = null;
  
  function speak(text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.9;
    speechSynthesis.cancel(); // Cancel any previous
    speechSynthesis.speak(utter);
  }
  
  function createCards() {
    const namesCol = document.getElementById("names");
    const emojisCol = document.getElementById("emojis");
    namesCol.innerHTML = "";
    emojisCol.innerHTML = "";
    document.getElementById("message").textContent = "";
  
    const keys = Object.keys(emotions);
    const shuffledKeys = [...keys].sort(() => Math.random() - 0.5);
    const shuffledEmojis = shuffledKeys.map(k => emotions[k]).sort(() => Math.random() - 0.5);
  
    shuffledKeys.forEach(name => {
      const card = document.createElement("div");
      card.className = "card name-card";
      card.textContent = name;
      card.draggable = true;
      card.dataset.name = name;
  
      // drag events
      card.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", name);
      });
  
      // click-to-select logic
      card.addEventListener("click", () => {
        selectedName = name;
        checkClickMatch();
      });
  
      namesCol.appendChild(card);
    });
  
    shuffledEmojis.forEach(emoji => {
      const card = document.createElement("div");
      card.className = "card emoji-card";
      card.textContent = emoji;
      card.dataset.emoji = emoji;
  
      // drop events
      card.addEventListener("dragover", e => e.preventDefault());
      card.addEventListener("drop", e => {
        const draggedName = e.dataTransfer.getData("text/plain");
        checkMatch(draggedName, emoji, card);
      });
  
      // click-to-select logic
      card.addEventListener("click", () => {
        selectedEmoji = emoji;
        checkClickMatch();
      });
  
      emojisCol.appendChild(card);
    });
  }
  
  function checkClickMatch() {
    if (selectedName && selectedEmoji) {
      const expectedEmoji = emotions[selectedName];
      const emojiCard = [...document.querySelectorAll(".emoji-card")].find(card => card.textContent === selectedEmoji);
      checkMatch(selectedName, selectedEmoji, emojiCard);
      selectedName = null;
      selectedEmoji = null;
    }
  }
  
  function checkMatch(name, emoji, emojiCard) {
    const expected = emotions[name];
    if (emoji === expected) {
      speak(name);
      document.getElementById("message").textContent = `✅ Matched: ${name} - ${emoji}`;
      emojiCard.classList.add("matched");
      const nameCard = [...document.querySelectorAll(".name-card")].find(card => card.textContent === name);
      nameCard.classList.add("matched");
    } else {
      speak("Try again!");
      document.getElementById("message").textContent = `❌ Try again!`;
    }
  }
  
  document.getElementById("reset").addEventListener("click", createCards);
  window.onload = createCards;
  