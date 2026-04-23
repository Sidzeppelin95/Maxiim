document.addEventListener("DOMContentLoaded", function(){

  const FORM_ENDPOINT = "https://formspree.io/f/xqewgayj";

  const icon = document.getElementById("mx-icon");
  const panel = document.getElementById("mx-panel");
  const closeBtn = document.getElementById("mx-close");
  const messages = document.getElementById("mx-messages");
  const input = document.getElementById("mx-input");
  const send = document.getElementById("mx-send");

  let step = 0;
  let formData = {};
  let formMode = false;

  // ADD FLOATING LABEL
  const label = document.createElement("div");
  label.innerText = "Talk to us";
  label.style.position = "fixed";
  label.style.bottom = "90px";
  label.style.right = "20px";
  label.style.background = "#0072ff";
  label.style.color = "#fff";
  label.style.padding = "6px 12px";
  label.style.borderRadius = "8px";
  label.style.fontWeight = "700";
  label.style.fontSize = "13px";
  label.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
  label.style.zIndex = "999999";
  document.body.appendChild(label);

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

    document.getElementById("f-submit").onclick = submitForm;
  }

  function validEmail(email){
    return email.includes("@") && email.includes(".");
  }

  function validPhone(phone){
    return /^[0-9]+$/.test(phone);
  }

  function submitForm(){
    const name = document.getElementById("f-name").value.trim();
    const email = document.getElementById("f-email").value.trim();
    const phone = document.getElementById("f-phone").value.trim();
    const msg = document.getElementById("f-msg").value.trim();

    if(!validEmail(email)){
      bot("❌ Please enter a valid email.");
      return;
    }

    if(!validPhone(phone)){
      bot("❌ Phone must contain only numbers.");
      return;
    }

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
    })
    .catch(()=>{
      bot("❌ Submission failed. Try again.");
    });
  }

  function showOptions(){
    messages.innerHTML += `
      <div class="mx-bot">
        Choose an option:<br><br>
        <b class="mx-link" data-type="invest">Investing</b><br>
        <b class="mx-link" data-type="product">Our UAV Product</b><br>
        <b class="mx-link" data-type="partner">Partnerships</b>
      </div>
    `;

    document.querySelectorAll(".mx-link").forEach(el=>{
      el.style.cursor = "pointer";
      el.style.color = "#0044aa";
      el.style.display = "block";
      el.style.marginBottom = "6px";

      el.onclick = () => {
        handleOption(el.dataset.type);
      };
    });

    messages.scrollTop = messages.scrollHeight;
  }

  function handleOption(type){
    if(type === "invest"){
      bot("We are working with global investors in UAV and AI systems.");
      bot("Would you like to connect with our investment team?");
      showForm();
    }
    else if(type === "product"){
      bot("Our MX-1 UAV offers high endurance and 10kg payload.");
      bot("We provide custom configurations for enterprise use.");
      showForm();
    }
    else if(type === "partner"){
      bot("We collaborate globally on aerospace and UAV deployment.");
      bot("Let’s connect you with our partnerships team.");
      showForm();
    }
  }

  function handleInput(val){

    if(formMode) return;

    user(val);

    if(step === 0){
      bot("Please fill out this form.");
      showForm();
    }
    else if(step === 1){
      showOptions();
      step = 2;
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

  closeBtn.onclick = () => panel.classList.remove("active");

});
