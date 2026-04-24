function showForm(){
  formMode = true;

  // ✅ REMOVE OLD FORMS (CRITICAL FIX)
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

    // 🔒 HARD LOCK
    if(btn.dataset.locked === "true") return;

    const name = document.getElementById(`f-name-${uid}`).value.trim();
    const email = document.getElementById(`f-email-${uid}`).value.trim();
    const phone = document.getElementById(`f-phone-${uid}`).value.trim();
    const msg = document.getElementById(`f-msg-${uid}`).value.trim();

    // ================= VALIDATION =================

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

    // ================= SUBMIT =================

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

      // ✅ REMOVE FORM CLEANLY
      btn.closest(".mx-form").remove();

      bot("✅ Message submitted successfully!");
      bot("Anything else I can help you with?");

      formMode = false;
      step = 1;

    }catch(err){

      bot("❌ Submission failed. Try again.");

      // 🔓 PROPER UNLOCK
      btn.dataset.locked = "false";
      btn.disabled = false;
      btn.innerText = "Submit";
    }
  });
}
