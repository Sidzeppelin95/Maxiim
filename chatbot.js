const toggle = document.getElementById("chatbot-toggle");
const windowBox = document.getElementById("chatbot-window");
const closeBtn = document.getElementById("chatbot-close");
const messages = document.getElementById("chatbot-messages");

let step = 0;
let formData = {};

// OPEN CHAT
toggle.onclick = () => {
  windowBox.style.display = "flex";
  if(step === 0){
    bot("Hi 👋 How can I help you today?");
    step = 1;
  }
};

closeBtn.onclick = () => {
  windowBox.style.display = "none";
};

// MESSAGE FUNCTIONS
function bot(text){
  messages.innerHTML += `<div class="bot-msg">${text}</div>`;
  messages.scrollTop = messages.scrollHeight;
}

function user(text){
  messages.innerHTML += `<div class="user-msg">${text}</div>`;
  messages.scrollTop = messages.scrollHeight;
}

// SEND MESSAGE
function sendMessage(){
  const input = document.getElementById("chatbot-input");
  const text = input.value.trim();
  if(!text) return;

  user(text);
  input.value = "";

  flow(text);
}

// FLOW LOGIC
function flow(text){

  if(step === 1){
    bot("Sure! Please enter your name:");
    step = 2;
  }

  else if(step === 2){
    formData.name = text;
    bot("Enter your email:");
    step = 3;
  }

  else if(step === 3){
    formData.email = text;
    bot("Enter your phone number:");
    step = 4;
  }

  else if(step === 4){
    formData.phone = text;
    bot("What would you like to know?");
    step = 5;
  }

  else if(step === 5){
    formData.message = text;

    // FILL FORM
    document.getElementById("form-name").value = formData.name;
    document.getElementById("form-email").value = formData.email;
    document.getElementById("form-phone").value = formData.phone;
    document.getElementById("form-message").value = formData.message;

    // SEND WITHOUT REDIRECT
    fetch(document.getElementById("hidden-form").action, {
      method: "POST",
      body: new FormData(document.getElementById("hidden-form")),
      headers: { 'Accept': 'application/json' }
    })
    .then(() => {
      bot("✅ Your message has been recorded.");
      bot("Is there anything else you need to know?");
      step = 6;
    })
    .catch(() => {
      bot("❌ Something went wrong. Please try again.");
    });
  }

  else if(step === 6){
    bot("Our team will get back to you shortly. Feel free to ask more!");
  }
}
