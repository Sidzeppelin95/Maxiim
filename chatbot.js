const chatbot = document.getElementById("chatbot");
const icon = document.getElementById("chatbot-icon");
const closeBtn = document.getElementById("chatbot-close");
const messages = document.getElementById("chatbot-messages");

let step = 0;
let formData = {};

// TOGGLE PANEL
icon.onclick = () => {
  chatbot.classList.add("active");
  if(step === 0){
    bot("Hi 👋 How can I help you today?");
    step = 1;
  }
};

closeBtn.onclick = () => {
  chatbot.classList.remove("active");
};

// MESSAGE FUNCTIONS
function bot(text){
  messages.innerHTML += `<div class="msg bot">${text}</div>`;
  messages.scrollTop = messages.scrollHeight;
}

function user(text){
  messages.innerHTML += `<div class="msg user">${text}</div>`;
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

// FLOW
function flow(text){

  if(step === 1){
    bot("Sure. Please enter your name:");
    step = 2;
  }

  else if(step === 2){
    formData.name = text;
    bot("Enter your email:");
    step = 3;
  }

  else if(step === 3){
    formData.email = text;
    bot("Enter your phone:");
    step = 4;
  }

  else if(step === 4){
    formData.phone = text;
    bot("What would you like to know?");
    step = 5;
  }

  else if(step === 5){
    formData.message = text;

    document.getElementById("form-name").value = formData.name;
    document.getElementById("form-email").value = formData.email;
    document.getElementById("form-phone").value = formData.phone;
    document.getElementById("form-message").value = formData.message;

    fetch(document.getElementById("hidden-form").action,{
      method:"POST",
      body:new FormData(document.getElementById("hidden-form")),
      headers:{'Accept':'application/json'}
    })
    .then(()=>{
      bot("✅ Message submitted successfully.");
      bot("Anything else you'd like to know?");
      step = 6;
    })
    .catch(()=>{
      bot("❌ Submission failed. Try again.");
    });
  }

  else if(step === 6){
    bot("Our team will reach out shortly.");
  }
}
