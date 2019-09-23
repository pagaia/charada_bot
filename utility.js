const parseGJson = data => {
  if (!data) {
    return "";
  }

  return JSON.parse(data.slice(data.indexOf("{"), data.length - 2));
};

const formatResponse = data => {
  const date = new Date(Date.parse(data.table.rows[0].c[3].v));
  const month = date.toLocaleString('en-GB', { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();

  const response = `ID:  /id_${data.table.rows[0].c[0].v}
Title : ${data.table.rows[0].c[1].v}
Posted on : ${month} ${day}, ${year} 
URL: ${data.table.rows[0].c[2].v}
  
${data.table.rows[0].c[4].v}
  
`;
  return response;
};

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const buildQuery = query => {
  const baseUrl = "https://spreadsheets.google.com/tq";
  const sheetId = "1kPwpaTxJK6hYd3JdRFAO3m7BXncRl1LB08N9DtmzuGI";
  const gId = 1025819131;
  const format = "?tqx=out:json";

  const url = `${baseUrl}${format}&key=${sheetId}&gid=${gId}&tq=${encodeURI(
    query
  )}`;

  return url;
};

module.exports = {
  parseGJson,
  formatResponse,
  getRandomArbitrary,
  buildQuery
};
