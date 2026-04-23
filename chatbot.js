document.addEventListener("DOMContentLoaded", function(){

  const FORM_ENDPOINT = "https://formspree.io/f/xqewgayj";

  const root = document.getElementById("mx-chat-root");

  // 🔥 BUILD UI (CRITICAL FIX)
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
    const div = document.createElement("div");
    div.className = "mx-bot";
    div.innerHTML = msg;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function user(msg){
    const div = document.createElement("div");
    div.className = "mx-user";
    div.textContent = msg;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function validEmail(email){
    return email.includes("@") && email.includes(".");
  }

  function validPhone(phone){
    return /^[0-9]+$/.test(phone);
  }

  function showForm(){
    formMode = true;

    const wrapper = document.createElement("div");
    wrapper.className = "mx-bot";

    wrapper.innerHTML = `
      <b>Please fill out this form:</b><br><br>
      <input id="f-name" placeholder="Name" style="width:100%;margin-bottom:6px;padding:8px"/>
      <input id="f-email" placeholder="Email" style="width:100%;margin-bottom:6px;padding:8px"/>
      <input id="f-phone" placeholder="Phone" style="width:100%;margin-bottom:6px;padding:8px"/>
      <textarea id="f-msg" placeholder="Message" style="width:100%;padding:8px"></textarea>
      <button id="f-submit" style="margin-top:8px;width:100%;background:#0072ff;color:#fff;padding:10px;border:none">Submit</button>
    `;

    messages.appendChild(wrapper);

    document.getElementById("f-submit").onclick = function(){

      const name = document.getElementById("f-name").value.trim();
      const email = document.getElementById("f-email").value.trim();
      const phone = document.getElementById("f-phone").value.trim();
      const msg = document.getElementById("f-msg").value.trim();

      if(!validEmail(email)){
        bot("❌ Enter valid email.");
        return;
      }

      if(!validPhone(phone)){
        bot("❌ Phone must be numbers only.");
        return;
      }

      fetch(FORM_ENDPOINT,{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({name,email,phone,message:msg})
      })
      .then(()=>{
        bot("✅ Submitted successfully.");
        bot("Anything else I can help you with?");
        formMode = false;
        step = 1;
      });
    };
  }

  function showOptions(){
    const div = document.createElement("div");
    div.className = "mx-bot";

    div.innerHTML = `
      <b>Select an option:</b><br><br>
      <span class="mx-link" data-type="invest">Investing</span><br>
      <span class="mx-link" data-type="product">Our UAV Product</span><br>
      <span class="mx-link" data-type="partner">Partnerships</span>
    `;

    messages.appendChild(div);

    document.querySelectorAll(".mx-link").forEach(el=>{
      el.style.cursor = "pointer";
      el.style.color = "#0044aa";
      el.style.fontWeight = "600";
      el.onclick = () => handleOption(el.dataset.type);
    });
  }

  function handleOption(type){
    if(type === "invest") bot("We are open to strategic investors.");
    if(type === "product") bot("MX-1 UAV: 10kg payload, long endurance.");
    if(type === "partner") bot("We collaborate globally.");

    showForm();
  }

  function handleInput(val){
    if(formMode) return;

    user(val);

    if(step === 0){
      bot("Please fill out this form.");
      showForm();
    } else {
      showOptions();
    }
  }

  function sendMessage(){
    const val = input.value.trim();
    if(!val) return;
    input.value = "";
    handleInput(val);
  }

  send.addEventListener("click", sendMessage);
  input.addEventListener("keypress", e => {
    if(e.key === "Enter") sendMessage();
  });

  // ✅ FIXED CLICK
  icon.onclick = () => {
    panel.classList.add("active");

    if(messages.innerHTML === ""){
      bot("<b>Hi! Welcome to MaxiimTech Aerospace</b>");
      bot("How can I help you today?");
    }
  };

  closeBtn.onclick = () => panel.classList.remove("active");

});
