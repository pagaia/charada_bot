const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const session = require("telegraf/session");
const {
  searchEveryWhere,
  searchEveryWhereCount,
  getPoemById,
  getPoemsList
} = require("./fetchData");

const { reply } = Telegraf;
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

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
bot.hears(/search (.+)/, props => {
  const { match, replyWithMarkdown, reply } = props;

  try {
    const totRes = searchEveryWhereCount(match[1]);
    const results = searchEveryWhere(match[1]);

    results.then(data => {
      totRes.then(data => {
        console.log("Tot Element: ", JSON.stringify(data.table.rows[0].c[0].v));
        replyWithMarkdown(`Results found: ${data.table.rows[0].c[0].v}`);
      });
      console.log("results: ", data.table.rows);
      // build response
      const response = `_ID_ /id_${data.table.rows[0].c[0].v}
_Title_ : ${data.table.rows[0].c[1].v}
_Posted on_ : ${data.table.rows[0].c[3].v}
_Url_ : ${data.table.rows[0].c[2].v}
${data.table.rows[0].c[4].v}
________
`;
      reply(response);
    });
  } catch (err) {
    console.log("error: ", err);
  }
});

// fetch exactly the poem with ID
bot.hears(/id_(.+)/, props => {
  const { match, replyWithMarkdown, reply } = props;
  console.log("Retrieving poem n° ", match);
  replyWithMarkdown(`Retrieving poem n° ${match[1]}`);
  try {
    const results = getPoemById(match[1]);

    results.then(data => {
      // build response
      const response = `*ID*:  ${data.table.rows[0].c[0].v}
*Title* : ${data.table.rows[0].c[1].v}
*Posted on* : ${data.table.rows[0].c[3].v}
*URL*: ${data.table.rows[0].c[2].v}

${data.table.rows[0].c[4].v}

`;
      replyWithMarkdown(response);
    });
  } catch (err) {
    console.log("error: ", err);
  }
});

// fetch exactly the poem with ID
bot.hears("/list", props => {
  const { reply } = props;
  console.log("retrieving list of poems");
  reply("retrieving list of poems");
  try {
    const results = getPoemsList();

    results.then(data => {
      // build response
      console.log("data.table.rows: ", data.table.rows);
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

bot.start(ctx =>
  ctx.replyWithHTML(`Benvenuto su @charada_bot , bot da robot creato da @mrorme  @pagaia 
Tramite questo bot potrai ricercare le poesie da me scritte e che puoi trovare sul blog charada.wordpress.com .
Questo bot è ispirato a @favolealtelefonobot di Gianni Rodari creato da @piersoft . 
Digitando /help otterrai la lista dei comandi o puoi seplicemente digitare una parola per fare una ricerca veloce.
Buona lettura :)
`)
);

bot.help(ctx => ctx.replyWithMarkdown(`Questi sono i comandi che puoi usare:
/start - la descrizione di questo bot
/list - la lista completa delle poesie
/search - search + le parole da cercare
search - oppure semplicemente search e la parola da cercare
`));

// Launch bot
bot.launch();
