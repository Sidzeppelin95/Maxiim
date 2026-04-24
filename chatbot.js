document.addEventListener("DOMContentLoaded", function(){

  const FORM_ENDPOINT = "https://formspree.io/f/xqewgayj";

  let step = 0;
  let formMode = false;

  // ================= CREATE UI =================
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

  // ================= ELEMENTS =================
  const icon = document.getElementById("mx-icon");
  const panel = document.getElementById("mx-panel");
  const closeBtn = document.getElementById("mx-close");
  const messages = document.getElementById("mx-messages");
  const input = document.getElementById("mx-input");
  const send = document.getElementById("mx-send");

  // ================= UI HELPERS =================
  function bot(msg){
    messages.innerHTML += `<div class="mx-bot">${msg}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  function user(msg){
    messages.innerHTML += `<div class="mx-user">${msg}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  // ================= FORM =================
  function showForm(){

    formMode = true;

    // 🔥 remove old forms (critical)
    document.querySelectorAll(".mx-form").forEach(f => f.remove());

    const uid = Date.now();

    messages.innerHTML += `
      <div class="mx-bot">
        <div class="mx-form">
          <input id="f-name-${uid}" class="mx-input" placeholder="Name">
          <input id="f-email-${uid}" class="mx-input" placeholder="Email">
          <input id="f-phone-${uid}" class="mx-input" placeholder="Phone">
          <textarea id="f-msg-${uid}" class="mx-input" placeholder="Message"></textarea>
          <button id="f-submit-${uid}" class="mx-submit">Submit</button>
        </div>
      </div>
    `;

    messages.scrollTop = messages.scrollHeight;

    const btn = document.getElementById(`f-submit-${uid}`);

    btn.addEventListener("click", async () => {

      if(btn.dataset.locked === "true") return;

      const name = document.getElementById(`f-name-${uid}`).value.trim();
      const email = document.getElementById(`f-email-${uid}`).value.trim();
      const phone = document.getElementById(`f-phone-${uid}`).value.trim();
      const msg = document.getElementById(`f-msg-${uid}`).value.trim();

      // ========= VALIDATION =========

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

      // ========= SUBMIT =========

      try{
        btn.dataset.locked = "true";
        btn.disabled = true;
        btn.innerText = "Submitting...";

        const res = await fetch(FORM_ENDPOINT,{
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({name,email,phone,message:msg})
        });

        if(!res.ok) throw new Error();

        // ✅ remove form
        btn.closest(".mx-form").remove();

        bot("✅ Message submitted successfully!");
        bot("Anything else I can help you with?");

        formMode = false;
        step = 1;

      }catch(err){

        bot("❌ Submission failed. Try again.");

        btn.dataset.locked = "false";
        btn.disabled = false;
        btn.innerText = "Submit";
      }
    });
  }

  // ================= OPTIONS =================
  function showOptions(){
    messages.innerHTML += `
      <div class="mx-bot">
        <span class="opt">Investing</span><br>
        <span class="opt">Our UAV Product</span><br>
        <span class="opt">Partnerships</span>
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

  // ================= INPUT =================
  function sendMessage(){
    const val = input.value.trim();
    if(!val) return;

    user(val);
    input.value = "";

    if(step === 0){
      showForm(); // 🔥 no duplicate text
    } else {
      showOptions();
    }
  }

  send.onclick = sendMessage;

  input.addEventListener("keypress", e=>{
    if(e.key==="Enter") sendMessage();
  });

  // ================= OPEN =================
  icon.onclick = ()=>{
    panel.classList.add("active");

    if(messages.innerHTML===""){
      bot("<b>Hi! Welcome to MaxiimTech Aerospace</b>");
      bot("How can I help you today?");
      step = 0;
    }
  };

  // ================= CLOSE =================
  closeBtn.onclick = ()=>{
    panel.classList.remove("active");
  };

});
