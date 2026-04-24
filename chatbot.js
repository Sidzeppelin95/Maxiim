document.addEventListener("DOMContentLoaded", function(){

  const FORM_ENDPOINT = "https://formspree.io/f/xqewgayj";

  const root = document.getElementById("mx-chat-root");

  root.innerHTML = `
    <div id="mx-label">Talk to us</div>

    <div id="mx-icon">🤖</div>

    <div id="mx-panel">
      <div id="mx-header">
        MaxiimTech AI
        <span id="mx-close">×</span>
      </div>

      <div id="mx-messages"></div>

      <div id="mx-input-wrap">
        <input id="mx-input" placeholder="Type your message..." />
        <button id="mx-send">➤</button>
      </div>
    </div>
  `;

  const icon = document.getElementById("mx-icon");
  const panel = document.getElementById("mx-panel");
  const closeBtn = document.getElementById("mx-close");
  const messages = document.getElementById("mx-messages");
  const input = document.getElementById("mx-input");
  const send = document.getElementById("mx-send");

  let step = 0;
  let formMode = false;

  function bot(msg){
    messages.innerHTML += `<div class="mx-bot">${msg}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  function user(msg){
    messages.innerHTML += `<div class="mx-user">${msg}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  function showForm(){
  formMode = true;

  const formHTML = `
    <div class="mx-bot" id="mx-form">
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
  `;

  messages.insertAdjacentHTML("beforeend", formHTML);
  messages.scrollTop = messages.scrollHeight;

  // ✅ ALWAYS bind fresh listener
  setTimeout(() => {
    const btn = document.getElementById("f-submit");
    if(btn){
      btn.onclick = submitForm;
    }
  }, 0);
}
  function validEmail(email){
    return email.includes("@") && email.includes(".");
  }

  function validPhone(phone){
    return /^[0-9]+$/.test(phone);
  }

  let isSubmitting = false;

  let isSubmitting = false;

function submitForm(){

  if(isSubmitting) return;

  const name = document.getElementById("f-name").value.trim();
  const email = document.getElementById("f-email").value.trim();
  const phone = document.getElementById("f-phone").value.trim();
  const msg = document.getElementById("f-msg").value.trim();

  const emailError = document.getElementById("f-email-error");
  const phoneError = document.getElementById("f-phone-error");

  // RESET ERRORS
  emailError.innerText = "";
  phoneError.innerText = "";

  let valid = true;

  if(!validEmail(email)){
    emailError.innerText = "Invalid email format";
    valid = false;
  }

  if(!validPhone(phone)){
    phoneError.innerText = "Only numbers allowed";
    valid = false;
  }

  // ❗ IMPORTANT: DO NOT LOCK STATE ON ERROR
  if(!valid){
    isSubmitting = false;
    return;
  }

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
    bot("Is there anything else I can help you with?");
    formMode = false;
    step = 1;
    isSubmitting = false;
  })
  .catch(()=>{
    bot("❌ Submission failed. Try again.");
    isSubmitting = false;
    btn.innerText = "Submit";
    btn.disabled = false;
  });
}

  function showOptions(){
    bot(`
      <b>Choose:</b><br>
      <span class="mx-link" data="invest">Investing</span><br>
      <span class="mx-link" data="product">Our UAV Product</span><br>
      <span class="mx-link" data="partner">Partnerships</span>
    `);

    document.querySelectorAll(".mx-link").forEach(el=>{
      el.style.cursor="pointer";
      el.onclick=()=>handleOption(el.getAttribute("data"));
    });
  }

  function handleOption(type){
    if(type==="invest"){
      bot("We are working with global investors.");
    }
    if(type==="product"){
      bot("Our UAV supports 10kg payload & AI navigation.");
    }
    if(type==="partner"){
      bot("We collaborate globally.");
    }
  }

  function handleInput(val){

    if(formMode) return;

    user(val);

    if(step===0){
      bot("Please fill out this form.");
      showForm();
    }
    else{
      showOptions();
    }
  }

  function sendMessage(){
    const val=input.value.trim();
    if(!val) return;
    input.value="";
    handleInput(val);
  }

  send.onclick=sendMessage;

  input.addEventListener("keypress",(e)=>{
    if(e.key==="Enter") sendMessage();
  });

  icon.onclick=()=>{
    panel.classList.toggle("active");

    if(messages.innerHTML===""){
      bot("<b>Hi! Welcome to MaxiimTech Aerospace</b>");
      bot("How can I help you today?");
    }
  };

  closeBtn.onclick=()=>panel.classList.remove("active");

});
