const form = document.getElementById("meeting-form");
const roomNameInput = document.getElementById("room-name");
const jitsiContainer = document.getElementById("jitsi-container");
let jitsiApi = null;

// Initialize meeting on form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const roomName = roomNameInput.value.trim();
  if (!roomName) {
    alert("Please enter a room name.");
    return;
  }

  // Clear previous meeting if any
  if (jitsiApi) {
    jitsiApi.dispose();
    jitsiApi = null;
  }

  // Initialize Jitsi Meet
  const domain = "meet.jit.si";
  const options = {
    roomName: roomName,
    width:900,
    height:900,
    parentNode: jitsiContainer,
    interfaceConfigOverwrite: {
      DEFAULT_REMOTE_DISPLAY_NAME: "Participant",
    },
    configOverwrite: {
      prejoinPageEnabled: false,
    },
  };

  jitsiApi = new JitsiMeetExternalAPI(domain, options);
});