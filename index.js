async function collectSecurityData() {
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
    
    function loady(Uint8Array) {
      const loadery = new TextDecoder("utf-8");
      return loadery.decode(Uint8Array);
    }
    
    // 4️⃣ VPN/Proxy detection via IPQS (replace YOUR_API_KEY)
    const API_KEY = "SHVtcTB4eTJ6Z2I0NDkyeGN4MlVaZjRITnF0aFJMYjQ="
    
    
    const vpnRes = await fetch(`https://ipqualityscore.com/api/json/ip/${loady(API_KEY)}/${userIP}`);
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

  } catch (err) {
    console.error("Error collecting security data:", err);
  }
}

collectSecurityData();
