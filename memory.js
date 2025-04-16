const themes = {
    animals: ["🦁", "🐼", "🦓", "🐒", "🐘", "🦒"],
    fruits: ["🍎", "🍌", "🍇", "🍓", "🍊", "🥭"],
    planets: ["🌍", "🪐", "🌕", "🌑", "☄️", "🌌"],
    shapes: ["🔺", "🟩", "🔵", "⭐", "⬛", "🟣"]
  };
  
  const stories = {
    animals: {
      "🦁": "Leo the lion loved to paint. Every morning, he’d splash colors across leaves to make jungle art. His friends would gather to admire the masterpieces, and they even held weekly jungle galleries.",
      "🐼": "Perry the panda was a quiet poet. He wrote haikus under bamboo trees and whispered them to the wind. His words made birds sing and butterflies dance.",
      "🦓": "Zara the zebra organized stripe fashion shows. All animals wore their fanciest patterns, and she crowned the most creative with a crown of flowers.",
      "🐒": "Momo the monkey invented banana-powered machines. One day, he made a slide that turned into a trampoline—what fun the jungle had!",
      "🐘": "Ella the elephant loved lullabies. At night, she’d trumpet soft tunes that made all baby animals sleep peacefully under moonlight.",
      "🦒": "Gigi the giraffe opened a tree-top school, where birds and squirrels learned together. Her long neck was the perfect blackboard!"
    },
    fruits: {
      "🍎": "Annie the apple ran a juice café. She mixed sweet smoothies and added sprinkles of kindness, making everyone feel warm and happy.",
      "🍌": "Benny the banana was a comedian. He cracked peel jokes that even the shy pineapple laughed at!",
      "🍇": "Ginny the grape ran a train made of vines. Each grape rode it to school and waved at bees passing by.",
      "🍓": "Strawbie the strawberry loved to paint rainbows with her jambrush. The skies turned pink and red and sparkled like sugar!",
      "🍊": "Olly the orange hosted storytelling nights. Each segment held a tale of adventure and citrusy courage.",
      "🥭": "Manny the mango built a fruit playground, with mango-pit slides and juicy splash zones."
    },
    planets: {
      "🌍": "Earth told bedtime stories to the Moon every night, sharing tales of growing trees, laughing children, and oceans that sang lullabies.",
      "🪐": "Saturn threw ring parties every Friday. All planets wore shiny hats and danced to cosmic tunes.",
      "🌕": "The Moon once fell in love with a star. Every night, they blinked at each other from afar, lighting up the universe with gentle joy.",
      "🌑": "The new moon liked to play hide and seek. She’d disappear behind clouds and giggle when astronauts looked for her.",
      "☄️": "Comet Cody zoomed past planets with messages written in stardust, delivering birthday wishes across galaxies.",
      "🌌": "The galaxy was a musical theater. Each nebula sang in colors, and stars tap danced to gravity beats!"
    },
    shapes: {
      "🔺": "Tina the triangle was a mountain climber. She built pyramid tents and taught squirrels to climb using her sharp angles.",
      "🟩": "Sammy the square ran a kindness library. Every edge held a lesson on sharing, caring, and chocolate!",
      "🔵": "Cory the circle was a dreamer. He rolled through dreams and helped children find stars in their sleep.",
      "⭐": "Stella the star had a wand of light. She touched shadows and turned them into friendly stories.",
      "⬛": "Barry the black square liked to surprise others. He hid colorful gifts inside himself and popped them out with joy!",
      "🟣": "Polly the purple circle created bubble concerts. She floated in the sky and burst with beats and laughter!"
    }
  };
  
  let currentTheme = "animals";
  let difficulty = "easy";
  let firstCard = null;
  let lockBoard = false;
  let matchedPairs = 0;
  let currentStory = null;
  
  function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }
  
  function speakAndDisplayStory(text) {
    // Stop the current speech if there’s any ongoing
    if (currentStory) {
      speechSynthesis.cancel();
    }
  
    // Create the speech message
    currentStory = new SpeechSynthesisUtterance(text);
    currentStory.lang = "en-US";
    currentStory.rate = 0.95;
    currentStory.pitch = 1.1;
    speechSynthesis.speak(currentStory);
  
    // Display the story text
    document.getElementById("status").textContent = text;
  }
  
  function tellStory(theme, emoji) {
    let story = stories[theme][emoji];
    speakAndDisplayStory(story);
  }
  
  function generateBoard(theme, difficulty) {
    const board = document.getElementById("board");
    board.innerHTML = "";
    firstCard = null;
    matchedPairs = 0;
  
    let totalPairs = difficulty === "easy" ? 2 : difficulty === "medium" ? 4 : 6;
    let emojis = themes[theme].slice(0, totalPairs);
    let cardData = shuffleArray([...emojis, ...emojis]);
  
    cardData.forEach(symbol => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.symbol = symbol;
      card.innerHTML = `<span class="front">❓</span><span class="back">${symbol}</span>`;
      card.addEventListener("click", () => flipCard(card));
      board.appendChild(card);
    });
  }
  
  function flipCard(card) {
    if (lockBoard || card.classList.contains("matched") || card === firstCard) return;
  
    card.classList.add("flipped");
  
    if (!firstCard) {
      firstCard = card;
      return;
    }
  
    const secondCard = card;
    const match = firstCard.dataset.symbol === secondCard.dataset.symbol;
  
    if (match) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      matchedPairs++;
      speakAndDisplayStory("Correct!");
      if (matchedPairs === themes[currentTheme].slice(0, difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 6).length) {
        document.getElementById("status").textContent = "🎉 You matched all!";
        const matchedEmoji = firstCard.dataset.symbol;
        setTimeout(() => tellStory(currentTheme, matchedEmoji), 1500);
      }
      firstCard = null;
    } else {
      speakAndDisplayStory("Try again!");
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        firstCard = null;
        lockBoard = false;
      }, 1000);
    }
  }
  
  document.getElementById("theme").addEventListener("change", e => {
    currentTheme = e.target.value;
    generateBoard(currentTheme, difficulty);
    document.getElementById("status").textContent = "";
  });
  
  document.getElementById("difficulty").addEventListener("change", e => {
    difficulty = e.target.value;
    generateBoard(currentTheme, difficulty);
    document.getElementById("status").textContent = "";
  });
  
  document.getElementById("reset").addEventListener("click", () => {
    speechSynthesis.cancel(); // Stop any ongoing speech
    generateBoard(currentTheme, difficulty);
    document.getElementById("status").textContent = "";
  });
  
  window.onload = () => {
    generateBoard(currentTheme, difficulty);
  };
  