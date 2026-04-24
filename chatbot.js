document.addEventListener("DOMContentLoaded", function(){

  const FORM_ENDPOINT = "https://formspree.io/f/xqewgayj";

  let isSubmitting = false;
  let step = 0;
  let formMode = false;

  // CREATE UI
  const root = document.createElement("div");
  root.id = "mx-chat-root";

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

  document.body.appendChild(root);

  // NOW elements exist
  const icon = document.getElementById("mx-icon");
  const panel = document.getElementById("mx-panel");
  const closeBtn = document.getElementById("mx-close");
  const messages = document.getElementById("mx-messages");
  const input = document.getElementById("mx-input");
  const send = document.getElementById("mx-send");

  function bot(msg){
    messages.innerHTML += `<div class="mx-bot">${msg}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  function user(msg){
    messages.innerHTML += `<div class="mx-user">${msg}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  function validEmail(e){ return e.includes("@") && e.includes("."); }
  function validPhone(p){ return /^[0-9]+$/.test(p); }

  function showForm(){
  formMode = true;

  messages.innerHTML += `
    <div class="mx-bot">
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">

        <input id="f-name" placeholder="Name" class="mx-input"/>
        <input id="f-email" placeholder="Email" class="mx-input"/>
        <input id="f-phone" placeholder="Phone" class="mx-input"/>
        <textarea id="f-msg" placeholder="Message" class="mx-input" style="height:70px"></textarea>

        <button id="f-submit" class="mx-submit">Submit</button>

      </div>
    </div>
  `;

  messages.scrollTop = messages.scrollHeight;

  const btn = document.getElementById("f-submit");

  btn.onclick = async () => {

    if(btn.dataset.locked === "true") return;

    const name = document.getElementById("f-name").value.trim();
    const email = document.getElementById("f-email").value.trim();
    const phone = document.getElementById("f-phone").value.trim();
    const msg = document.getElementById("f-msg").value.trim();

    // ✅ VALIDATION
    if(!name){
      bot("❌ Please enter your name.");
      return;
    }

    if(!email){
      bot("❌ Please enter your email.");
      return;
    }

    if(!email.includes("@") || !email.includes(".")){
      bot("❌ Please enter a valid email.");
      return;
    }

    if(!phone){
      bot("❌ Please enter your phone number.");
      return;
    }

    if(!/^[0-9]+$/.test(phone)){
      bot("❌ Phone must contain only numbers.");
      return;
    }

    try{
      btn.dataset.locked = "true";
      btn.disabled = true;
      btn.innerText = "Submitting...";

      await fetch("https://formspree.io/f/xqewgayj",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({name,email,phone,message:msg})
      });

      // ✅ REMOVE FORM UI (fix stuck issue)
      btn.parentElement.innerHTML = `
        <div style="text-align:center;color:#0072ff;font-weight:600;padding:10px">
          ✔ Submitted Successfully
        </div>
      `;

      bot("Anything else I can help you with?");

      formMode = false;
      step = 1;

    }catch(err){
      bot("❌ Submission failed. Try again.");

      btn.dataset.locked = "false";
      btn.disabled = false;
      btn.innerText = "Submit";
    }
  };
}
  function showOptions(){
    messages.innerHTML += `
      <div class="mx-bot">
        <span class="opt" data="invest">Investing</span><br>
        <span class="opt" data="product">Our UAV Product</span><br>
        <span class="opt" data="partner">Partnerships</span>
      </div>
    `;

    document.querySelectorAll(".opt").forEach(el=>{
      el.style.color="#0072ff";
      el.style.fontWeight="700";
      el.style.textDecoration="underline";
      el.style.cursor="pointer";

      el.onclick = ()=>{
        bot("Let’s help you with that.");
        showForm();
      };
    });
  }

  function sendMessage(){
    const val = input.value.trim();
    if(!val) return;

    user(val);
    input.value = "";

    if(step === 0){
      bot("Please fill out this form.");
      showForm();
    } else {
      showOptions();
    }
  }

  send.onclick = sendMessage;
  input.addEventListener("keypress", e=>{
    if(e.key==="Enter") sendMessage();
  });

  icon.onclick = ()=>{
    panel.classList.add("active");

    if(messages.innerHTML===""){
      bot("<b>Hi! Welcome to MaxiimTech Aerospace</b>");
      bot("How can I help you today?");
      step = 0;
    }
  };

  closeBtn.onclick = ()=>{
    panel.classList.remove("active");
  };

});
