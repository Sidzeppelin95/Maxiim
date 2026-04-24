document.addEventListener("DOMContentLoaded", function(){

  const FORM_ENDPOINT = "https://formspree.io/f/xqewgayj";

  let isSubmitting = false;
  let step = 0;
  let formMode = false;

  // CREATE CHATBOT UI (NO HTML REQUIRED)
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

  function validEmail(email){
    return email.includes("@") && email.includes(".");
  }

  function validPhone(phone){
    return /^[0-9]+$/.test(phone);
  }

  // ================= FORM =================
  function showForm(){
    formMode = true;

    messages.innerHTML += `
      <div class="mx-bot">
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

    const submitBtn = document.getElementById("f-submit");

    submitBtn.onclick = async function(){

      if(isSubmitting) return;

      const name = document.getElementById("f-name").value.trim();
      const email = document.getElementById("f-email").value.trim();
      const phone = document.getElementById("f-phone").value.trim();
      const msg = document.getElementById("f-msg").value.trim();

      if(!validEmail(email)){
        bot("❌ Enter valid email");
        return;
      }

      if(!validPhone(phone)){
        bot("❌ Phone must be numbers only");
        return;
      }

      try{
        isSubmitting = true;
        submitBtn.innerText = "Submitting...";
        submitBtn.disabled = true;

        await fetch(FORM_ENDPOINT,{
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({name,email,phone,message:msg})
        });

        bot("✅ Submitted successfully!");
        bot("Anything else I can help you with?");

        formMode = false;
        step = 1;

      }catch(err){
        bot("❌ Submission failed. Try again.");
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit";
        isSubmitting = false;
      }
    };
  }

  // ================= OPTIONS =================
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
      el.style.color = "#0072ff";
      el.style.fontWeight = "700";
      el.style.textDecoration = "underline";
      el.style.display = "block";
      el.style.marginBottom = "6px";

      el.onclick = () => handleOption(el.dataset.type);
    });

    messages.scrollTop = messages.scrollHeight;
  }

  function handleOption(type){
    if(type === "invest"){
      bot("We work with global investors in UAV & AI.");
    }
    if(type === "product"){
      bot("Our MX-1 UAV supports 10kg payload with high endurance.");
    }
    if(type === "partner"){
      bot("We partner globally for UAV deployment.");
    }

    showForm();
  }

  // ================= INPUT FLOW =================
  function handleInput(val){

    if(formMode) return;

    user(val);

    if(step === 0){
      bot("Please fill out this form.");
      showForm();
    }
    else{
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

  input.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
      sendMessage();
    }
  });

  icon.onclick = () => {
    panel.classList.add("active");

    if(messages.innerHTML === ""){
      bot("<b style='color:#003366'>Hi! Welcome to MaxiimTech Aerospace.</b>");
      bot("How can I help you today?");
      step = 0;
    }
  };

  closeBtn.onclick = () => {
    panel.classList.remove("active");
  };

});
