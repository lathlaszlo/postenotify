import { readFile, writeFile } from "fs/promises";

let database = JSON.parse(await readFile("data.json", { encoding: "utf-8" }))

export function saveDatabase() {
  writeFile("data.json", JSON.stringify(database), { encoding: "utf-8" })
    .then(e => console.log(`| successfully saved database > data.json`))
    .catch(e => console.log(`| error while saving database > data.json | ${e.message}`))
}

// risky ahh. 💀
export function resetDatabase() {
  database = {}
  writeFile("data.json", JSON.stringify({}), { encoding: "utf-8" })
    .then(e => console.log(`| successfully reseted database > data.json`))
    .catch(e => console.log(`| error while reseting database > data.json | ${e.message}`))
}

export function saveKeyValuePairIntoDatabase(key: string, value: string) {
  database[key] = value
  console.log(`| set key '${key}' to '${value}'`)
  saveDatabase()
}

export function removeKeyValuePairFromDatabase(key: string) {
  if (database[key]) {
    delete database[key]
    console.log(`| removed key '${key}'`)
    saveDatabase()
  }
}

export function getValuePairFromKeyInDatabase(key: string) {
  if (database[key]) return database[key]

  return null
}