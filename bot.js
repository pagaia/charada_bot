const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const session = require("telegraf/session");
const {
  searchEveryWhere,
  searchEveryWhereCount,
  getPoemById,
  getPoemsList,
  getRandomPoem
} = require("./fetchData");
const { formatResponse } = require("./utility");

const { reply } = Telegraf;
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const TelegrafInlineMenu = require("telegraf-inline-menu");

const menu = new TelegrafInlineMenu(ctx => `Hey ${ctx.from.first_name}!`);
menu.setCommand("start");

menu.simpleButton("I am excited!", "a", {
  doFunc: ctx => ctx.reply("As am I!")
});

const mainMenu = new TelegrafInlineMenu("Main Menu");
const fooMenu = new TelegrafInlineMenu("Foo Menu");
const barMenu = new TelegrafInlineMenu("Bar Menu");

mainMenu.submenu("Open Foo Menu", "foo", fooMenu);
fooMenu.submenu("Open Bar Menu", "bar", barMenu);
barMenu.simpleButton("Hit me", "something", {
  doFunc: ctx => ctx.reply("Done something!")
});

bot.use(mainMenu.init());

// // Register session middleware
bot.use(session());

// Register logger middleware
bot.use((ctx, next) => {
  const start = new Date();
  return next().then(() => {
    const ms = new Date() - start;
    console.log("response time %sms", ms);
    console.log("MSG: ", ctx.message);
  });
});

// Wow! RegEx
bot.hears(/search(@?.*) (.+)/, props => {
  const { match, replyWithHTML, reply } = props;

  const param = match[2];
  try {
    const totRes = searchEveryWhereCount(param);
    const results = searchEveryWhere(param);

    results.then(all => {
      totRes.then(data => {
        console.log("Tot Element: ", JSON.stringify(data.table.rows[0].c[0].v));
        reply(`Poems which cointains ${param}: ${data.table.rows[0].c[0].v}`);

        const response = all.table.rows
          .map(poem => {
            return `/id_${poem.c[0].v} ${poem.c[1].v}`;
          })
          .join("\n");
        reply(response);
      });
    });
  } catch (err) {
    console.log("error: ", err);
  }
});

// fetch exactly the poem with ID
bot.hears(/id_(.+)(@?.*)/, props => {
  const { match, replyWithHTML, reply } = props;
  console.log("Retrieving poem n° ", match);
  reply(`Retrieving poem n° ${match[1]}`);
  try {
    const results = getPoemById(match[1]);

    results.then(data => {
      replyWithHTML(formatResponse(data));
    });
  } catch (err) {
    console.log("error: ", err);
  }
});

// list all the poems titles with IDs
bot.hears(/\/list(@?.*)/, props => {
  const { reply } = props;
  console.log("retrieving list of poems");
  reply("retrieving list of poems");
  try {
    const results = getPoemsList();

    results.then(data => {
      // build response
      const response = data.table.rows
        .map(poem => {
          return `/id_${poem.c[0].v} ${poem.c[1].v}`;
        })
        .join("\n");
      reply(response);
    });
  } catch (err) {
    console.log("error: ", err);
  }
});

// get a random poem
bot.hears(/\/random(@?.*)/, props => {
  const { replyWithHTML, reply } = props;
  console.log("retrieving one poem");
  reply("retrieving a random poem ");
  try {
    const results = getRandomPoem();

    results.then(data => {
      replyWithHTML(formatResponse(data));
    });
  } catch (err) {
    console.log("error: ", err);
  }
});
bot.start(ctx =>
  ctx.replyWithHTML(`Benvenuto su @charada_bot , bot da robot creato da @mrorme  @pagaia 
Tramite questo bot potrai ricercare le poesie da me scritte e che puoi trovare sul blog charada.wordpress.com .
Questo bot è ispirato a @favolealtelefonobot di Gianni Rodari creato da @piersoft . 
Digitando /help otterrai la lista dei comandi o puoi seplicemente digitare una parola per fare una ricerca veloce.
Buona lettura :)
`)
);

bot.help(ctx =>
  ctx.replyWithMarkdown(`Questi sono i comandi che puoi usare:
/start - la descrizione di questo bot
/list - la lista completa delle poesie
/search - search + le parole da cercare
search - oppure semplicemente search e la parola da cercare
`)
);

// Launch bot
bot.launch();
