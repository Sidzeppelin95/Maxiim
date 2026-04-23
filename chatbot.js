document.addEventListener("DOMContentLoaded", function(){

  const FORM_ENDPOINT = "https://formspree.io/f/xqewgayj";

  const icon = document.getElementById("mx-icon");
  const panel = document.getElementById("mx-panel");
  const closeBtn = document.getElementById("mx-close");
  const messages = document.getElementById("mx-messages");
  const input = document.getElementById("mx-input");
  const send = document.getElementById("mx-send");

  let step = 0;
  let formData = {};

  // SAFETY CHECK
  if(!icon || !panel){
    console.error("Chatbot elements not found");
    return;
  }

  // BOT MESSAGE
  function bot(msg){
    messages.innerHTML += `<div class="mx-bot">${msg}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  // USER MESSAGE
  function user(msg){
    messages.innerHTML += `<div class="mx-user">${msg}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  // FLOW HANDLER
  function nextStep(value){

    if(step === 0){
      formData.name = value;
      bot("Please enter your email:");
    }

    else if(step === 1){
      formData.email = value;
      bot("Enter your phone number:");
    }

    else if(step === 2){
      formData.phone = value;
      bot("What would you like to know?");
    }

    else if(step === 3){
      formData.message = value;

      bot("Submitting your request...");

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      .then(() => {
        bot("✅ Your message has been recorded.");
        bot("Is there anything else I can help you with?");
        step = -1;
        formData = {};
      })
      .catch(() => {
        bot("❌ Submission failed. Please try again.");
      });

      return;
    }

    step++;
  }

  // SEND MESSAGE
  function sendMessage(){
    const val = input.value.trim();
    if(!val) return;

    user(val);
    input.value = "";

    nextStep(val);
  }

  send.addEventListener("click", sendMessage);

  input.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
      sendMessage();
    }
  });

  // OPEN CHAT
  icon.addEventListener("click", () => {
    panel.style.display = "flex";

    if(messages.innerHTML === ""){
      bot("Hi 👋 How can I help you today?");
      bot("Please enter your name:");
    }
  });

  // CLOSE CHAT
  closeBtn.addEventListener("click", () => {
    panel.style.display = "none";
  });

});
