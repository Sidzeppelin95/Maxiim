document.addEventListener("DOMContentLoaded", function(){

  const FORM_ENDPOINT = "https://formspree.io/f/xqewgayj";

  let step = 0;
  let formMode = false;

  // ================= CREATE UI =================
  const root = document.getElementById("mx-chat-root") || document.createElement("div");
  root.id = "mx-chat-root";

  if(!root.hasChildNodes()){
    const label = document.createElement("div");
    label.id = "mx-label";
    label.textContent = "Talk to us";

    const botIcon = document.createElement("div");
    botIcon.id = "mx-icon";
    botIcon.textContent = "🤖";

    const panel = document.createElement("div");
    panel.id = "mx-panel";

    const header = document.createElement("div");
    header.id = "mx-header";
    header.appendChild(document.createTextNode("MaxiimTech AI"));

    const close = document.createElement("span");
    close.id = "mx-close";
    close.textContent = "×";
    header.appendChild(close);

    const msgs = document.createElement("div");
    msgs.id = "mx-messages";

    const inputWrap = document.createElement("div");
    inputWrap.id = "mx-input-wrap";

    const chatInput = document.createElement("input");
    chatInput.id = "mx-input";
    chatInput.placeholder = "Type your message...";

    const sendBtn = document.createElement("button");
    sendBtn.id = "mx-send";
    sendBtn.type = "button";
    sendBtn.textContent = "➤";

    inputWrap.append(chatInput, sendBtn);
    panel.append(header, msgs, inputWrap);
    root.append(label, botIcon, panel);
  }

  if (!root.parentElement) {
    document.body.appendChild(root);
  }

  // ================= ELEMENTS =================
  const icon = document.getElementById("mx-icon");
  const panel = document.getElementById("mx-panel");
  const closeBtn = document.getElementById("mx-close");
  const messages = document.getElementById("mx-messages");
  const input = document.getElementById("mx-input");
  const send = document.getElementById("mx-send");

  // ================= UI HELPERS =================
  function appendMessage(className, msg){
    const row = document.createElement("div");
    row.className = className;
    row.textContent = msg;
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  function bot(msg){
    appendMessage("mx-bot", msg);
  }

  function user(msg){
    appendMessage("mx-user", msg);
  }

  // ================= FORM =================
  function showForm(){

    formMode = true;

    // 🔥 remove old forms (critical)
    document.querySelectorAll(".mx-form").forEach(f => f.remove());

    const uid = Date.now();

    const botRow = document.createElement("div");
    botRow.className = "mx-bot";

    const form = document.createElement("div");
    form.className = "mx-form";

    const nameInput = document.createElement("input");
    nameInput.id = `f-name-${uid}`;
    nameInput.className = "mx-input";
    nameInput.placeholder = "Name";

    const emailInput = document.createElement("input");
    emailInput.id = `f-email-${uid}`;
    emailInput.className = "mx-input";
    emailInput.placeholder = "Email";

    const phoneInput = document.createElement("input");
    phoneInput.id = `f-phone-${uid}`;
    phoneInput.className = "mx-input";
    phoneInput.placeholder = "Phone";

    const msgInput = document.createElement("textarea");
    msgInput.id = `f-msg-${uid}`;
    msgInput.className = "mx-input";
    msgInput.placeholder = "Message";

    const btn = document.createElement("button");
    btn.id = `f-submit-${uid}`;
    btn.className = "mx-submit";
    btn.type = "button";
    btn.textContent = "Submit";

    form.append(nameInput, emailInput, phoneInput, msgInput, btn);
    botRow.appendChild(form);
    messages.appendChild(botRow);

    messages.scrollTop = messages.scrollHeight;

    const setSubmitState = (state) => {
      if(state === "idle"){
        btn.dataset.locked = "false";
        btn.disabled = false;
        btn.innerText = "Submit";
      } else if(state === "checking"){
        btn.dataset.locked = "true";
        btn.disabled = false;
        btn.innerText = "Checking...";
      } else if(state === "submitting"){
        btn.dataset.locked = "true";
        btn.disabled = false;
        btn.innerText = "Submitting...";
      } else if(state === "done"){
        btn.dataset.locked = "true";
        btn.disabled = true;
        btn.innerText = "Submitted";
      }
    };
    setSubmitState("idle");

    btn.addEventListener("click", async () => {
      if(btn.dataset.locked === "true") return;
      setSubmitState("checking");

      const nameField = document.getElementById(`f-name-${uid}`);
      const emailField = document.getElementById(`f-email-${uid}`);
      const phoneField = document.getElementById(`f-phone-${uid}`);
      const msgField = document.getElementById(`f-msg-${uid}`);

      const name = nameField.value.trim();
      const email = emailField.value.trim();
      const phone = phoneField.value.trim();
      const msg = msgField.value.trim();

      // ========= VALIDATION =========

      if(!name){
        bot("❌ Please enter your name.");
        setSubmitState("idle");
        return;
      }

      if(!email){
        bot("❌ Please enter your email.");
        setSubmitState("idle");
        return;
      }

      if(!email.includes("@") || !email.includes(".")){
        bot("❌ Please enter a valid email.");
        setSubmitState("idle");
        return;
      }

      if(!phone){
        bot("❌ Please enter your phone number.");
        setSubmitState("idle");
        return;
      }

      if(!/^[0-9]+$/.test(phone)){
        bot("❌ Phone must contain only numbers.");
        setSubmitState("idle");
        return;
      }

      // ========= SUBMIT =========

      try{
        setSubmitState("submitting");

        const res = await fetch(FORM_ENDPOINT,{
          method:"POST",
          headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({name,email,phone,message:msg})
        });

        if(!res.ok) throw new Error();

        setSubmitState("done");
        // ✅ remove form
        btn.closest(".mx-form").remove();

        bot("✅ Message submitted successfully!");
        bot("Anything else I can help you with?");

        formMode = false;
        step = 1;

      }catch(err){
        bot("❌ Submission failed. Try again.");
        setSubmitState("idle");
      }
    });
  }

  // ================= OPTIONS =================
  function showOptions(){
    const botRow = document.createElement("div");
    botRow.className = "mx-bot";

    const optionResponses = {
      "Investing": "Thanks for your interest in investing. Our team will share current opportunities and next steps shortly.",
      "Our UAV Product": "Great question. Our UAV product is designed for reliable, mission-ready aerial performance across commercial and defense use cases.",
      "Partnerships": "Awesome — we’re always open to strategic partnerships. Share your goals and our partnerships team will connect with you."
    };
    const options = Object.keys(optionResponses);
    options.forEach((label, idx) => {
      const el = document.createElement("span");
      el.className = "opt";
      el.textContent = label;
      el.style.color="#0072ff";
      el.style.fontWeight="700";
      el.style.textDecoration="underline";
      el.style.cursor="pointer";

      el.onclick = ()=>{
        user(label);
        bot(optionResponses[label]);
        bot("Would you like details on another topic?");
      };
      botRow.appendChild(el);
      if(idx < options.length - 1){
        botRow.appendChild(document.createElement("br"));
      }
    });

    messages.appendChild(botRow);
    messages.scrollTop = messages.scrollHeight;
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

    if(messages.childElementCount === 0){
      bot("Hi! Welcome to MaxiimTech Aerospace");
      bot("How can I help you today?");
      step = 0;
    }
  };

  // ================= CLOSE =================
  closeBtn.onclick = ()=>{
    panel.classList.remove("active");
  };

});
