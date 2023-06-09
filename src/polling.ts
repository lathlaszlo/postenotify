import { handleEmailNotification } from "./bot.js";
import { getConfigValue } from "./config_helper.js";
import { getEmailStats, getMappedEmails, handleEmailDeltaCalculation } from "./email_api.js";

export async function intervalFunction() {
  let polling_start = Date.now()
  console.log(`> polling megkezdve.`)
  for (let email of getMappedEmails()) {
    let raw = await getEmailStats(email)
    if (raw === null) continue
    
    let stats = Object.entries(raw).slice(-1)[0][1]
    
    let change = handleEmailDeltaCalculation(email, stats.in)
    if (change !== 0) {
      handleEmailNotification(email, change, Date.now())
    }
  }
  console.log(`> polling befejezve > ${Date.now() - polling_start} ms.`)
}

setInterval(intervalFunction, getConfigValue("polling_interval_ms"))