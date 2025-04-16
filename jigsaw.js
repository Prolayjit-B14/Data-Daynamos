let theme = "animals";

document.addEventListener("DOMContentLoaded", () => {
  createPuzzle();
});

function changeTheme(selected) {
  theme = selected;
  createPuzzle();
}

function createPuzzle() {
  const piecesContainer = document.getElementById("pieces");
  const slotsContainer = document.getElementById("slots");
  piecesContainer.innerHTML = "";
  slotsContainer.innerHTML = "";

  // Add 4 slots and 4 shuffled pieces
  let indexes = [1, 2, 3, 4];
  let shuffled = [...indexes].sort(() => Math.random() - 0.5);

  for (let i = 0; i < 4; i++) {
    // Slots
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.index = i + 1;
    slot.ondragover = (e) => e.preventDefault();
    slot.ondrop = drop;
    slot.setAttribute("tabindex", "0");
    slotsContainer.appendChild(slot);

    // Pieces
    const img = document.createElement("img");
    img.src = `images/${theme}/${shuffled[i]}.png`;
    img.alt = `${theme} puzzle piece ${shuffled[i]}`;
    img.className = "puzzle-piece";
    img.draggable = true;
    img.dataset.index = shuffled[i];
    img.ondragstart = drag;
    img.setAttribute("tabindex", "0");
    img.onkeydown = (e) => {
      if (e.key === "Enter") {
        img.focus();
        dragData = img;
      }
    };
    piecesContainer.appendChild(img);
  }
}

let dragData = null;

function drag(e) {
  dragData = e.target;
}

function drop(e) {
  if (!dragData) return;
  if (e.target.tagName !== "DIV") return;

  const slot = e.target;
  const correct = dragData.dataset.index === slot.dataset.index;

  if (correct) {
    slot.appendChild(dragData);
    playSystemFeedback("correct");
    dragData.setAttribute("draggable", false);
    dragData.style.border = "3px solid green";
    document.getElementById("status").innerText = "✅ Great Job!";
  } else {
    playSystemFeedback("incorrect");
    document.getElementById("status").innerText = "❌ Try Again!";
  }

  dragData = null;
}

function playSystemFeedback(type) {
  const speech = new SpeechSynthesisUtterance();
  speech.lang = "en-US";
  
  if (type === "correct") {
    speech.text = "Correct! Well done!";
  } else {
    speech.text = "Incorrect. Please try again.";
  }
  
  window.speechSynthesis.speak(speech);
}

function resetPuzzle() {
  createPuzzle();
  document.getElementById("status").innerText = "";
}
