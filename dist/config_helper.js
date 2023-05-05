import { readFile } from "fs/promises";
import { exit } from "process";
// global variables > start
const necessary_config_values = ["base_url"];
const config_defaults = {
    polling_interval_ms: 16 * 1000
};
let config = await readConfigFile();
// global variables > end
export function getConfigValue(key) {
    return config[key] || null;
}
export async function refreshConfig() {
    config = await readConfigFile();
}
export async function readConfigFile() {
    let raw_json = await readFile("config.json", { encoding: "utf-8" })
        .catch(e => { console.log(`> hiba történt a 'config.json' fájl olvasása közben...`); exit(); });
    try {
        let json_object = JSON.parse(raw_json);
        necessary_config_values.forEach(key => {
            if (!(key in json_object) ||
                json_object[key] === null ||
                json_object[key] === undefined) {
                console.log(`| config.json > hiányzik a '${key}' értéke.`);
                exit();
            }
        });
        Object.entries(config_defaults).forEach(([key, value]) => {
            if (key in json_object ||
                json_object[key] === null ||
                json_object[key] === undefined)
                return;
            json_object[key] = value;
        });
        console.log(`> config betöltve sikeresen!`);
        return json_object;
    }
    catch {
        console.log(`> hiba történt a 'config.json' fájl JSON-é alakítása közben...`);
        exit();
    }
}
