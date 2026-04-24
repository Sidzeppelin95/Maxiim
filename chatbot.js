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

      messages.innerHTML += `
        <div class="mx-bot">
          Please fill out this form:
          <div style="margin-top:10px">
            <input id="f-name" placeholder="Name" style="width:100%;margin-bottom:6px;padding:8px"/>
            <input id="f-email" placeholder="Email" style="width:100%;margin-bottom:6px;padding:8px"/>
            <input id="f-phone" placeholder="Phone" style="width:100%;margin-bottom:6px;padding:8px"/>
            <textarea id="f-msg" placeholder="Message" style="width:100%;padding:8px"></textarea>
            <button id="f-submit" style="margin-top:8px;width:100%;background:#0072ff;color:#fff;padding:10px;border:none">Submit</button>
          </div>
        </div>
  `;

      messages.scrollTop = messages.scrollHeight;

  // 🔥 IMPORTANT: reset submit lock every time form opens
      isSubmitting = false;

      document.getElementById("f-submit").onclick = submitForm;
  }
  function validEmail(email){
    return email.includes("@") && email.includes(".");
  }

  function validPhone(phone){
    return /^[0-9]+$/.test(phone);
  }

  let isSubmitting = false;

function submitForm(){

  if(isSubmitting) return; // 🔒 prevent double click

  const name = document.getElementById("f-name").value.trim();
  const email = document.getElementById("f-email").value.trim();
  const phone = document.getElementById("f-phone").value.trim();
  const msg = document.getElementById("f-msg").value.trim();
  const btn = document.getElementById("f-submit");

  // VALIDATION
  if(!email.includes("@") || !email.includes(".")){
    bot("❌ Please enter a valid email.");
    return;
  }

  if(!/^[0-9]+$/.test(phone)){
    bot("❌ Phone must contain only numbers.");
    return;
  }

  // LOCK BUTTON
  isSubmitting = true;
  btn.disabled = true;
  btn.innerText = "Submitting...";

  fetch("https://formspree.io/f/xqewgayj",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      name: name,
      email: email,
      phone: phone,
      message: msg
    })
  })
  .then(res => {
    if(!res.ok) throw new Error("Failed");

    bot("✅ Your message has been submitted successfully.");
    bot("Anything else I can help you with?");

    // RESET FLOW
    formMode = false;
    step = 1;

    // OPTIONAL: clear form UI
    document.getElementById("f-name").value = "";
    document.getElementById("f-email").value = "";
    document.getElementById("f-phone").value = "";
    document.getElementById("f-msg").value = "";

  })
  .catch(()=>{
    bot("❌ Submission failed. Please try again.");

    // 🔓 unlock again if failed
    isSubmitting = false;
    btn.disabled = false;
    btn.innerText = "Submit";
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
