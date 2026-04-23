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

    document.getElementById("f-submit").onclick = submitForm;
  }

  function validEmail(email){
    return email.includes("@") && email.includes(".");
  }

  function validPhone(phone){
    return /^[0-9]+$/.test(phone);
  }

  function submitForm(){
    const email = document.getElementById("f-email").value.trim();
    const phone = document.getElementById("f-phone").value.trim();

    if(!validEmail(email)){
      bot("❌ Invalid email");
      return;
    }

    if(!validPhone(phone)){
      bot("❌ Phone must be numbers only");
      return;
    }

    fetch(FORM_ENDPOINT,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        name: document.getElementById("f-name").value,
        email,
        phone,
        message: document.getElementById("f-msg").value
      })
    })
    .then(()=>{
      bot("✅ Submitted successfully");
      bot("Anything else I can help you with?");
      formMode = false;
      step = 1;
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
