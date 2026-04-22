const button = document.getElementById("chatbot-button");
const box = document.getElementById("chatbot-box");
const body = document.getElementById("chatbot-body");

let step = 0;
let formData = {};

// OPEN CHAT
button.onclick = () => {
  box.style.display = box.style.display === "flex" ? "none" : "flex";

  if(step === 0){
    botMessage("Hi 👋 How can I help you today?");
    step = 1;
  }
};

// BOT MESSAGE
function botMessage(msg){
  body.innerHTML += `<div><b>Bot:</b> ${msg}</div>`;
  body.scrollTop = body.scrollHeight;
}

// USER MESSAGE
function userMessage(msg){
  body.innerHTML += `<div><b>You:</b> ${msg}</div>`;
  body.scrollTop = body.scrollHeight;
}

// SEND MESSAGE
function sendMessage(){
  const input = document.getElementById("chatbot-input");
  const text = input.value.trim();
  if(!text) return;

  userMessage(text);
  input.value = "";

  handleFlow(text);
}

// FLOW
function handleFlow(text){

  if(step === 1){
    botMessage("Please enter your Name:");
    step = 2;
  }

  else if(step === 2){
    formData.name = text;
    botMessage("Enter your Email:");
    step = 3;
  }

  else if(step === 3){
    formData.email = text;
    botMessage("Enter your Phone Number:");
    step = 4;
  }

  else if(step === 4){
    formData.phone = text;
    botMessage("Enter your Message:");
    step = 5;
  }

  else if(step === 5){
    formData.message = text;

    // FILL FORM
    document.getElementById("form-name").value = formData.name;
    document.getElementById("form-email").value = formData.email;
    document.getElementById("form-phone").value = formData.phone;
    document.getElementById("form-message").value = formData.message;

    // SUBMIT FORM
    document.getElementById("hidden-form").submit();

    botMessage("✅ Your message has been recorded. We'll contact you soon.");

    step = 6;
  }
}
