# postenotify 🐵
egy **discordos** értesítés rendszer a **poste.io** email szerverekhez.

### navigáció 
* [funkciók](#funkciók)
* [parancsok](#parancsok)
* [config](#config)
* [.env](#.env)
* [telepítés](#telepítés)

### funkciók
- `több e-mail fiók figyelése egyszerre ✅`
- `discord parancsok (nem slash) ✅`
- `gyors feltelepítés ✅`
- `egyszerű használat ✅`

### parancsok
használatukhoz `administrator` permission kell.
- `!set (email-cím) (discord-id)` > beállítja az adatbázisban, hogy melyik felhasználónak küldjön üzenetet, amikor erre az email-címre üzenet érkezik.
- `!remove (email-cím)` > kitörli az adatbázisból az email-címhez rendelt discord id-t.
- `!reset ❌` > reseteli az adatbázis tartalmát
- `!reload_config` > újratölti a configot.
- `!reload_email` > újratölti az email listát.

### config
- `base_url ❗` > 
a **poste.io** webmail url-je, vagy a szervergép publikus ipv4-címe. 
példa: (mail.mestermc.hu). 
az a lényeg, hogy az `A` rekordra legyen rávezetve, ha van domainre rákötve a webmail oldala.
- `polling_interval_ms` > ms-ben megadott időtartam, ami közönként nézi az emailek tartalmát.

### .env
- `token` > a discord bot tokenje.
- `user` > a mail szerver **Mailserver administrator** fiókjának a felhasználó neve. példa (pankix@mestermc.hu)
- `pass` > a mail szerver **Mailserver administrator** fiókjának a jelszava.

### telepítés
- cloneold a repot a gépedre.
- változtasd meg a **config.json**-t a tetszésedre a beállításokat.
- változtasd meg a **.env**-t a te adataidra.
- telepítsd a dependency-ket az `npm install` parancsal.
- indítsd el a botot, az `npm run run` parancsal.
- a **set** parancsal állítsd be az email címedet, és a discord id-det.
- készen vagy! 💝🎊

### hozzájárulás
ha bármilyen hibát találsz, vagy javítani szeretnél a codebasen, kérlek, nyiss egy issue-t, vagy csinálj egy pull requestet. <br>
köszi <3

licensz
ez a szoftver a MIT licensz alatt áll. további információért olvasd el a LICENSE fájlt.
