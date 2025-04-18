// Function to generate and play letter sound using SpeechSynthesisUtterance
function playSound(letter) {
    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.lang = 'en-US'; // Set language to English (US)
    utterance.rate = 1; // Normal speed
    utterance.pitch = 1; // Normal pitch

    // Speak the letter sound
    window.speechSynthesis.speak(utterance);
}
