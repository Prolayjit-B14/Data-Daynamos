let theme = "animals";
let dragData = null;
let touchData = null;

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

  // Add 4 slots
  const indexes = [1, 2, 3, 4];
  const shuffled = [...indexes].sort(() => Math.random() - 0.5); // Shuffle the puzzle pieces

  for (let i = 0; i < 4; i++) {
    // Create slots for the puzzle pieces
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.index = i + 1;
    slot.ondragover = (e) => e.preventDefault();
    slot.ondrop = drop;
    slot.setAttribute("tabindex", "0");
    slotsContainer.appendChild(slot);

    // Create puzzle pieces and place them randomly
    const img = document.createElement("img");
    img.src = `images/${theme}/${shuffled[i]}.png`;
    img.alt = `${theme} puzzle piece ${shuffled[i]}`;
    img.className = "puzzle-piece";
    img.dataset.index = shuffled[i];
    img.draggable = true;
    img.ondragstart = drag;
    img.setAttribute("tabindex", "0");
    img.onkeydown = (e) => {
      if (e.key === "Enter") {
        img.focus();
        dragData = img;
      }
    };

    // Touch events for mobile
    img.ontouchstart = (e) => touchStart(e, img);
    img.ontouchmove = (e) => touchMove(e, img);
    img.ontouchend = (e) => touchEnd(e, img);

    piecesContainer.appendChild(img);
  }
}

function drag(e) {
  dragData = e.target;
}

function touchStart(e, img) {
  touchData = img;
  e.preventDefault(); // Prevent default touch behavior
}

function touchMove(e, img) {
  e.preventDefault();
  const touch = e.touches[0];
  const imgRect = img.getBoundingClientRect();
  
  // Move the image with touch
  img.style.position = "absolute";
  img.style.left = `${touch.clientX - imgRect.width / 2}px`;
  img.style.top = `${touch.clientY - imgRect.height / 2}px`;
}

function touchEnd(e, img) {
  e.preventDefault();
  touchData = null;

  // Check if the piece is dropped in the correct slot
  const slot = getSlotFromTouchPosition(e.changedTouches[0]);

  if (slot && slot.dataset.index === img.dataset.index) {
    slot.appendChild(img);
    playSystemFeedback("correct");
    img.style.position = "static";
    img.style.border = "3px solid green";
    document.getElementById("status").innerText = "✅ Great Job!";
  } else {
    img.style.position = "static";
    playSystemFeedback("incorrect");
    document.getElementById("status").innerText = "❌ Try Again!";
  }
}

function getSlotFromTouchPosition(touch) {
  const slots = document.querySelectorAll(".slot");
  for (let slot of slots) {
    const rect = slot.getBoundingClientRect();
    if (
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom
    ) {
      return slot;
    }
  }
  return null;
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

  // Provide visual feedback
  const pieces = document.querySelectorAll('.puzzle-piece');
  pieces.forEach(piece => {
    piece.style.border = piece.dataset.index === dragData?.dataset.index && type === 'correct' ? '3px solid green' : '3px solid red';
  });

  // Update the status
  document.getElementById("status").innerText = type === "correct" ? "✅ Great Job!" : "❌ Try Again!";
}

function resetPuzzle() {
  createPuzzle();
  document.getElementById("status").innerText = "";
}
