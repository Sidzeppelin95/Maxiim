function showForm(){
  formMode = true;

  const uid = Date.now();

  messages.innerHTML += `
    <div class="mx-bot">
      <div class="mx-form" id="form-${uid}">
        <input id="f-name-${uid}" class="mx-field" placeholder="Name">
        <input id="f-email-${uid}" class="mx-field" placeholder="Email">
        <input id="f-phone-${uid}" class="mx-field" placeholder="Phone">
        <textarea id="f-msg-${uid}" class="mx-field" placeholder="Message"></textarea>
        <button id="f-submit-${uid}" class="mx-submit">Submit</button>
      </div>
    </div>
  `;

  messages.scrollTop = messages.scrollHeight;

  const btn = document.getElementById(`f-submit-${uid}`);

  btn.onclick = async () => {

    // 🔒 HARD LOCK CHECK
    if(btn.dataset.locked === "true") return;

    const name = document.getElementById(`f-name-${uid}`).value.trim();
    const email = document.getElementById(`f-email-${uid}`).value.trim();
    const phone = document.getElementById(`f-phone-${uid}`).value.trim();
    const msg = document.getElementById(`f-msg-${uid}`).value.trim();

    let hasError = false;

    // ===== VALIDATION =====
    if(name === ""){
      bot("❌ Please enter your name.");
      hasError = true;
    }
    else if(email === ""){
      bot("❌ Please enter your email.");
      hasError = true;
    }
    else if(!validEmail(email)){
      bot("❌ Please enter a valid email.");
      hasError = true;
    }
    else if(phone === ""){
      bot("❌ Please enter your phone number.");
      hasError = true;
    }
    else if(!validPhone(phone)){
      bot("❌ Phone must contain only numbers.");
      hasError = true;
    }

    // 🚨 CRITICAL FIX: STOP WITHOUT LOCKING
    if(hasError){
      btn.disabled = false;
      btn.dataset.locked = "false";
      return;
    }

    // ===== SUBMIT =====
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

      // ✅ REMOVE FORM
      document.getElementById(`form-${uid}`).remove();

      bot("✅ Message submitted successfully!");
      bot("Anything else I can help you with?");

      formMode = false;
      step = 1;

    }catch(err){

      bot("❌ Submission failed. Try again.");

      // 🔓 FULL RESET
      btn.dataset.locked = "false";
      btn.disabled = false;
      btn.innerText = "Submit";
    }
  };
}
