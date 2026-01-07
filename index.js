async function collectSecurityData() {
  const txtEl = document.getElementById("txt");

  // Helper functions for UI state
  function failUI(message = "Verification failed") {
    if (!txtEl) return;
    txtEl.style.color = "red";
    txtEl.textContent = message;
  }

  function successUI(message = "Verification successful") {
    if (!txtEl) return;
    txtEl.style.color = "limegreen";
    txtEl.textContent = message;
  }
  
  try {
    // 1️⃣ Get IP, country, and timezone info
    const ipRes = await fetch("https://ipapi.co/json/");
    const ipData = await ipRes.json();

    const userIP = ipData.ip;               // Public IP
    const countryCode = ipData.country_code; // ISO country code, e.g. US
    const ipTimezone = ipData.timezone;      // Timezone from IP

    // 2️⃣ Get user's local OS time
    const now = new Date();
    const userHour = now.getHours();
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // 3️⃣ Time mismatch check
    const ipTimeString = new Date().toLocaleString("en-US", { timeZone: ipTimezone });
    const ipHour = new Date(ipTimeString).getHours();

    // Boolean: true if local time roughly matches IP timezone (difference <= 3 hours)
    const timeSafe = Math.abs(userHour - ipHour) <= 3;

    console.log(`https://ipqualityscore.com/api/json/ip/Humq0xy2zgb4492xcx2UZf4HNqthRLb4/${userIP}`)
    const vpnRes = await fetch(`https://ipqualityscore.com/api/json/ip/Humq0xy2zgb4492xcx2UZf4HNqthRLb4/${userIP}`);
    const vpnData = await vpnRes.json();
    const vpnDetected = vpnData.vpn || vpnData.proxy || vpnData.tor || false;

    // 5️⃣ Combine all data
    const securityData = {
      ip: userIP,
      country: countryCode,
      ipTimezone: ipTimezone,
      userTimezone: userTimezone,
      userHour: userHour,
      ipHour: ipHour,
      timeSafe: timeSafe,
      vpnDetected: vpnDetected
    };

    console.log(securityData);

    // Example: send this data to your backend or Discord bot
    /*
    fetch("/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(securityData)
    });
    */
    successUI("Verification successful");
  } catch (err) {
    console.error("Error collecting security data:", err);
    failUI();
  }
}

collectSecurityData();
