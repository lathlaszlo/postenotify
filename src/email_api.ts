import * as dotenv from "dotenv"
dotenv.config()

import axios from "axios";
import { BoxRequest, BoxStats } from "./email_types";
import { exit } from "process";
import { getValuePairFromKeyInDatabase } from "./json_helper.js";
import { intervalFunction } from "./polling.js";

// global variables > start
let first_launch = false

let axios_client = axios.create({
  auth: { username: process.env.user, password: process.env.password, },
  baseURL: `https://mail.lath.hu/admin/api/v1`
})

let all_emails = await setAndGetMappedEmails()

if (!first_launch) {
  intervalFunction()
  first_launch = true
}

let delta_ins = {}

// global variables > end

export async function setAndGetMappedEmails(): Promise<string[]> {
  let raw_emails = await getAllEmails()
  if (raw_emails === null) { console.log(`> emaileket nem tudtuk betölteni :( - api probléma`); exit() }

  console.log(`> emailek betöltése...`)

  let parsed_emails = raw_emails.results.map(mail => mail.address).map(email => {
    let id = getValuePairFromKeyInDatabase(email)
    let spaced_email = `'${email}'`.padEnd(32)
    if (!id) console.log(`| email > ${spaced_email} > nincs :/`)
    else console.log(`| email > ${spaced_email} > ${id}`)
  
    return [email, id]
  }).filter(value => value[1] !== null).map(mail_and_discord => mail_and_discord[0])
  
  console.log(`> ${parsed_emails.length} email lett sikeresen betöltve!`)

  return parsed_emails
}

export function getMappedEmails(): string[] {
  return all_emails
}

export async function refreshMappedEmails(): Promise<void> {
  all_emails = await setAndGetMappedEmails()
}

// delta calculations

export function handleEmailDeltaCalculation(email: string, num: number): number {

  if (num === 0) {
    delta_ins[email] = 0
    return 0
  }
  
  if (!(email in delta_ins)) {

    delta_ins[email] = num
    console.log(`> ${email} deltája beállítva > ${num}`)
    return 0

  } else {

    if (delta_ins[email] !== num) {
      let delta = num - delta_ins[email]
      delta_ins[email] = num
      return delta
    }

    return 0
  }
}

// api requests

export async function getAllEmails(): Promise<BoxRequest> | null {
  try {
    let request = await axios_client.get("/boxes?page=1&paging=100")
    return request.data
  } catch { return null }
}

export async function getEmailStats(email: string): Promise<BoxStats> | null {
  try {
    let request = await axios_client.get(`/boxes/${email}/stats`)
    return request.data
  } catch { return null }
}