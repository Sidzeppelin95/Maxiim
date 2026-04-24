document.addEventListener("DOMContentLoaded", function(){

console.log("✅ Chatbot JS Loaded");

// =================
// CONFIG
// =================
const FORM_ENDPOINT = "https://formspree.io/f/xqewgayj";

// =================
// ELEMENTS
// =================
const icon = document.getElementById("mx-icon");
const panel = document.getElementById("mx-panel");
const closeBtn = document.getElementById("mx-close");
const messages = document.getElementById("mx-messages");
const input = document.getElementById("mx-input");
const send = document.getElementById("mx-send");

// =================
// STATE
// =================
let step = 0;
let formMode = false;
let isSubmitting = false;

// =================
// FLOATING LABEL
// =================
const label = document.createElement("div");
label.id = "mx-label";
label.innerText = "Talk to us";
document.body.appendChild(label);

// =================
// MESSAGE FUNCTIONS
// =================
function bot(msg){
  messages.innerHTML += `<div class="mx-bot">${msg}</div>`;
  messages.scrollTop = messages.scrollHeight;
}

function user(msg){
  messages.innerHTML += `<div class="mx-user">${msg}</div>`;
  messages.scrollTop = messages.scrollHeight;
}

// =================
// VALIDATION
// =================
function validEmail(email){
  return email.includes("@") && email.includes(".");
}

function validPhone(phone){
  return /^[0-9]+$/.test(phone);
}

// =================
// FORM UI
// =================
function showForm(){
  formMode = true;

  messages.insertAdjacentHTML("beforeend", `
    <div class="mx-bot">
      Please fill out this form:

      <div style="margin-top:10px">
        <input id="f-name" placeholder="Name" style="width:100%;margin-bottom:6px;padding:8px"/>

        <input id="f-email" placeholder="Email" style="width:100%;margin-bottom:4px;padding:8px"/>
        <div id="f-email-error" style="color:red;font-size:12px;"></div>

        <input id="f-phone" placeholder="Phone" style="width:100%;margin-bottom:4px;padding:8px"/>
        <div id="f-phone-error" style="color:red;font-size:12px;"></div>

        <textarea id="f-msg" placeholder="Message" style="width:100%;padding:8px"></textarea>

        <button id="f-submit" style="margin-top:8px;width:100%;background:#0072ff;color:#fff;padding:10px;border:none;cursor:pointer">
          Submit
        </button>
      </div>
    </div>
  `);

  messages.scrollTop = messages.scrollHeight;

  setTimeout(() => {
    document.getElementById("f-submit").onclick = submitForm;
  }, 0);
}

// =================
// FORM SUBMIT
// =================
function submitForm(){

  if(isSubmitting) return;

  const name = document.getElementById("f-name").value.trim();
  const email = document.getElementById("f-email").value.trim();
  const phone = document.getElementById("f-phone").value.trim();
  const msg = document.getElementById("f-msg").value.trim();

  const emailError = document.getElementById("f-email-error");
  const phoneError = document.getElementById("f-phone-error");

  emailError.innerText = "";
  phoneError.innerText = "";

  let valid = true;

  if(!validEmail(email)){
    emailError.innerText = "Invalid email";
    valid = false;
  }

  if(!validPhone(phone)){
    phoneError.innerText = "Numbers only";
    valid = false;
  }

  if(!valid) return;

  isSubmitting = true;

  const btn = document.getElementById("f-submit");
  btn.innerText = "Submitting...";
  btn.disabled = true;

  fetch(FORM_ENDPOINT,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({name,email,phone,message:msg})
  })
  .then(()=>{
    bot("✅ Your message has been recorded.");
    bot("Anything else I can help you with?");
    formMode = false;
    step = 1;
    isSubmitting = false;
  })
  .catch(()=>{
    bot("❌ Submission failed. Try again.");
    isSubmitting = false;
    btn.disabled = false;
    btn.innerText = "Submit";
  });
}

// =================
// OPTIONS UI (FIXED STYLE)
// =================
function showOptions(){

  messages.innerHTML += `
    <div class="mx-bot">
      Choose an option:<br><br>

      <span class="mx-link" data-type="invest">Investing</span><br>
      <span class="mx-link" data-type="product">Our UAV Product</span><br>
      <span class="mx-link" data-type="partner">Partnerships</span>
    </div>
  `;

  document.querySelectorAll(".mx-link").forEach(el=>{
    el.style.cursor = "pointer";
    el.style.color = "#0066ff";
    el.style.fontWeight = "700";
    el.style.textDecoration = "underline";
    el.style.display = "block";
    el.style.marginBottom = "6px";

    el.onclick = () => handleOption(el.dataset.type);
  });

  messages.scrollTop = messages.scrollHeight;
}

// =================
// OPTION HANDLER
// =================
function handleOption(type){

  if(type === "invest"){
    bot("We work with global investors in UAV & AI.");
    bot("Let’s connect you with our investment team.");
    showForm();
  }

  else if(type === "product"){
    bot("Our MX-1 UAV offers 10kg payload & long endurance.");
    bot("We provide enterprise-level customization.");
    showForm();
  }

  else if(type === "partner"){
    bot("We collaborate globally on aerospace and UAV deployment.");
    bot("Let’s connect you with our partnerships team.");
    showForm();
  }
}

// =================
// INPUT FLOW (FIXED REPEAT BUG)
// =================
function handleInput(val){

  if(formMode) return;

  user(val);

  if(step === 0){
    showForm();   // ✅ NO duplicate bot message
    step = 1;
  }
  else{
    showOptions();
  }
}

// =================
// EVENTS
// =================
send.onclick = () => {
  const val = input.value.trim();
  if(!val) return;
  input.value = "";
  handleInput(val);
};

input.addEventListener("keypress", function(e){
  if(e.key === "Enter") send.click();
});

icon.onclick = () => {
  panel.classList.toggle("active");

  if(messages.innerHTML === ""){
    bot("<b>Hi! Welcome to MaxiimTech Aerospace.</b>");
    bot("How can I help you today?");
  }
};

closeBtn.onclick = () => panel.classList.remove("active");

});
