const ora = require('ora');
const chalk = require('chalk')
const Spinner = ora({ color: 'red' });
const { prompt } = require('enquirer');
const white = chalk.hex('#FFFFFF');
const red = chalk.hex('#DC143C');








const logo = (`
${chalk.hex('#FFFFFF')("                               ┌┼┐  ╦╔═  ╔═╗  ╔╦╗  ╔═╗  ╔╦╗  ╔╦╗  ╦    ╔═╗")}
${chalk.hex('#8D8C8C')("                               └┼┐  ╠╩╗  ╠═╣   ║║  ╠═╣   ║║   ║║  ║    ║╣")}
${chalk.hex('#DC143C')("                               └┼┘  ╩ ╩  ╩ ╩  ═╩╝  ╩ ╩  ═╩╝  ═╩╝  ╩═╝  ╚═╝")}
`)

console.log(logo)

let originalConsoleLog = console.log;
porn = function() {
        args = [];
        let date = new Date();

        let hours = date.getUTCHours().toString().padStart(2, '0');
        let minutes = date.getUTCMinutes().toString().padStart(2, '0');
        let seconds = date.getUTCSeconds().toString().padStart(2, '0');
        args.push(`${white(`[${red(`${hours}:${minutes}:${seconds}`)}]`)}`);
    for (let i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    originalConsoleLog.apply(console, args);
}









async function Main() {
    const letters = ['$ ', 'K ', 'A ', 'D ', 'A ', 'D ', 'D ', 'L ', 'E'];
    let pusher = "";
    letters.forEach((l, i) => {
        setTimeout(() => {
            pusher += l;
            process.title = pusher;
        }, i * 75);
    })
    let res = await prompt({
        type: 'input',
        name: 'url',
        message: `Please give me a url to start scanning`
    })
    let res2 = await prompt({
        type: 'password',
        name: 'webhook',
        message: `Which webhook would you like the images to be sent?`
    })
    const Discord = require('discord.js');
    res2.webhook = res2.webhook.replace(/https:\/\/discord\.com\/api\/webhooks\//g, '').replace(/https:\/\/canary\.discord\.com\/api\/webhooks\//g, '');
    const Webhook = res2.webhook.split('/')
    const webhook = new Discord.WebhookClient(Webhook[0], Webhook[1])
 
    if (!res.url) return Main()
    const url = res.url;
    const fetch = require('node-fetch')
    const puppeteer = require('puppeteer')
    const options = {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ]
    }
    const browser = await puppeteer.launch(options)

    const page = (await browser.pages())[0] || await browser.newPage()

    const pageDown = async() => {
        const scrollHeight = 'document.body.scrollHeight';
        let previousHeight = await page.evaluate(scrollHeight);
        await page.evaluate(`window.scrollTo(0, ${scrollHeight})`);
        await page.waitForFunction(`${scrollHeight} > ${previousHeight}`, {
            timeout: 30000
        })
    }
    
    Spinner.start(`skadaddle is now scanning ${url}...`)
    await page.goto(url)
    const getPages = () => page.evaluate(() => window.document.querySelectorAll('[data-test-id=pinGrid]')[0].querySelectorAll('img[src]').length)
    let prev = await getPages()
    while (true) {
        await pageDown()
        const pages = await getPages()
        Spinner.text = `skadaddle found ${pages} images within the page`
        if (pages >= 200) {
            break;
        }
        if (prev === pages) {
            break
        }

        prev = pages
    }

    const urls = await page.evaluate(() => Array.from(window.document.querySelectorAll('[data-test-id=pinGrid]')[0].querySelectorAll('img[src]').values()).map(r => r.getAttribute('src')))
    Spinner.succeed(`skadaddle has found ${urls.length} urls to send`)
    console.clear()
    console.log(logo)
    await Promise.all(urls.map(link => {
        return fetch(link).then(res => new Promise((resolve, reject) => {
            webhook.send({
                "content": null,
                "embeds": [
                  {
                    "color": 0,
                    "author": {
                      "name": "Pix's TESTING",
                      "url": `${link}`,
                      "icon_url": `${link}`
                    },
                    "footer": {
                      "text": "powered by skadaddle",
                      "icon_url": "https://cdn.discordapp.com/icons/815155331348561920/eb90ec21afe30f712500eca717cd2133.png?size=4096"
                    },
                    "image": {
                      "url": `${link}`
                    }
                  }
                ],
                "username": "pix",
                "avatarURL": "https://cdn.discordapp.com/attachments/823616607942869042/823626290195202048/image0.jpg"
              },porn(`SENDING » ${red(`${link}`)}`))
    }).catch(e => console.log(`[Error] ${red(e.message)}`)))
}))
}



Main()