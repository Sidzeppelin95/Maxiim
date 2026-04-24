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
        <input id="f-name" placeholder="Name"><br>
        <input id="f-email" placeholder="Email"><br>
        <input id="f-phone" placeholder="Phone"><br>
        <textarea id="f-msg" placeholder="Message"></textarea><br>
        <button id="f-submit">Submit</button>
      </div>
    `;

    const btn = document.getElementById("f-submit");

    btn.onclick = async () => {

      if(isSubmitting) return;

      const email = document.getElementById("f-email").value;
      const phone = document.getElementById("f-phone").value;

      if(!validEmail(email)){
        bot("❌ Invalid email");
        return;
      }

      if(!validPhone(phone)){
        bot("❌ Phone must be numbers only");
        return;
      }

      try{
        isSubmitting = true;
        btn.disabled = true;

        await fetch(FORM_ENDPOINT,{
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({
            name: document.getElementById("f-name").value,
            email,
            phone,
            message: document.getElementById("f-msg").value
          })
        });

        bot("✅ Submitted!");
        bot("Anything else?");

        formMode = false;
        step = 1;

      }catch{
        bot("❌ Failed. Try again.");
        isSubmitting = false;
        btn.disabled = false;
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
