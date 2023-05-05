import * as dotenv from "dotenv"
dotenv.config()

import { Client, EmbedBuilder, Message } from "discord.js";
import { getValuePairFromKeyInDatabase, removeKeyValuePairFromDatabase, resetDatabase, saveDatabase, saveKeyValuePairIntoDatabase } from "./json_helper.js";
import { refreshConfig } from "./config_helper.js";
import { refreshMappedEmails } from "./email_api.js";

let bot = new Client({ intents: ["Guilds", "GuildMessages", "MessageContent", "DirectMessages"] })
await bot.login(process.env.token)

console.log(`\n> bot bejelentkezett | ${bot.user.username}#${bot.user.discriminator}`)

const handlers = {
  "set": async (e: Message<boolean>, args: string[]) => {
    if (!args[0] || !args[1]) e.reply({ content: `\`nincs elegendő argument...\`` })
    else {
      console.log(`${e.author.id} > '${args[0]}' = '${args[1]}'`)
      await saveKeyValuePairIntoDatabase(args[0], args[1])
      await refreshMappedEmails()
    }
  },
  "remove": async (e: Message<boolean>, args: string[]) => {
    if (!args[0]) e.reply({ content: `\`nincs elegendő argument...\`` })
    else {
      console.log(`${e.author.id} > törölve '${args[0]}'`)
      await removeKeyValuePairFromDatabase(args[0])
      await refreshMappedEmails()
    }
  },
  "reset": (e: Message<boolean>, args: string[]) => {
    resetDatabase()
    console.log(`${e.author.id} > adatbázis resetelve!`)
    e.reply({ content: `\`sikeresen resetelve!\`` })
  },
  "reload_config": (e: Message<boolean>, args: string[]) => {
    refreshConfig()
    console.log(`${e.author.id} > frissítette a configot!`)
    e.reply({ content: `\`sikeresen frissítve!\`` })
  },
  "reload_email": async (e: Message<boolean>, args: string[]) => {
    await refreshMappedEmails()
    console.log(`${e.author.id} > frissítette az emaileket!`)
    e.reply({ content: `\`sikeresen frissítve!\`` })
  }
}

bot.on("messageCreate", async e => {
  if (e.author.bot) return
  if (!e.content.startsWith("!")) return

  let guild = await bot.guilds.fetch(e.guildId)
  if (!(await guild.members.fetch(e.author.id)).permissions.has("Administrator")) return

  let content_split = e.content.split(" ")
  let command = content_split[0].slice(1)
  if (command in handlers) {
    content_split = content_split.splice(1)

    handlers[command](e, content_split)
  } else e.reply({ content: `\`ilyen parancs nem létezik!\`` })
})

export async function handleEmailNotification(email: string, num: number, benchmark: number) {
  let id = getValuePairFromKeyInDatabase(email)
  if (id === null) return

  try {
    let user = await bot.users.fetch(id)
    let dm = await user.createDM(true)
    dm.send({
      embeds: [
        new EmbedBuilder()
          .setTitle(`\\📩 neked új üzeneted érkezett! \\📩`)
          .setDescription([
            `\`📩 email cím: ${email}\``,
            `\`🧾 üzenetek száma: ${num} üzenet\``,
            `\`💀 generálva: ${Date.now() - benchmark} ms\``,
          ].join("\n"))
          .setFooter({ text: `poste.io discord notification - by lath 🐵` })
      ]
    }).catch(e => console.log(`> hiba történt a pm küldésekor.`))
  } catch { console.log(`> failed to dm | ${id}`) }
}