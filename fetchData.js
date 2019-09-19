const {parseGJson} = require("./utility");
const fetch = require("node-fetch");

const getPoemById = async id => {
  const baseUrl = "https://spreadsheets.google.com/tq";
  const sheetId = "1kPwpaTxJK6hYd3JdRFAO3m7BXncRl1LB08N9DtmzuGI";
  const gId = 1025819131;
  const format = "?tqx=out:json";
  const query = `SELECT A, B, C, D, G WHERE A = ${id}`;

  const url = `${baseUrl}${format}&key=${sheetId}&gid=${gId}&tq=${encodeURI(
    query
  )}`;
  console.log("URL: ", url);

  try {
    const response = await fetch(url);
    const json = await response.text();
    return parseGJson(json);
  } catch (err) {
    console.error("Error: ", err);
  }
};

const searchEveryWhere = async text => {
  const baseUrl = "https://spreadsheets.google.com/tq";
  const sheetId = "1kPwpaTxJK6hYd3JdRFAO3m7BXncRl1LB08N9DtmzuGI";
  const gId = 1025819131;
  const format = "?tqx=out:json";
  const query = `SELECT A, B, C, D, G WHERE B CONTAINS '${text}' OR G CONTAINS '${text}' LIMIT 5`;

  const url = `${baseUrl}${format}&key=${sheetId}&gid=${gId}&tq=${encodeURI(
    query
  )}`;
  console.log("URL: ", url);

  try {
    const response = await fetch(url);
    const json = await response.text();
    return parseGJson(json);
  } catch (err) {
    console.error("Error: ", err);
  }
};

const getPoemsList = async text => {
  const baseUrl = "https://spreadsheets.google.com/tq";
  const sheetId = "1kPwpaTxJK6hYd3JdRFAO3m7BXncRl1LB08N9DtmzuGI";
  const gId = 1025819131;
  const format = "?tqx=out:json";
  const query = `SELECT A, B`;

  const url = `${baseUrl}${format}&key=${sheetId}&gid=${gId}&tq=${encodeURI(
    query
  )}`;
  console.log("URL: ", url);

  try {
    const response = await fetch(url);
    const json = await response.text();
    return parseGJson(json);
  } catch (err) {
    console.error("Error: ", err);
  }
};

const searchEveryWhereCount = async text => {
  const baseUrl = "https://spreadsheets.google.com/tq";
  const sheetId = "1kPwpaTxJK6hYd3JdRFAO3m7BXncRl1LB08N9DtmzuGI";
  const gId = 1025819131;
  const format = "?tqx=out:json";
  const query = `SELECT count(A) WHERE B CONTAINS '${text}' OR G CONTAINS '${text}' `;

  const url = `${baseUrl}${format}&key=${sheetId}&gid=${gId}&tq=${encodeURI(
    query
  )}`;
  console.log("URL: ", url);

  try {
    const response = await fetch(url);
    const json = await response.text();
    console.log("JSON: ", json);
    return parseGJson(json);
  } catch (err) {
    console.error("Error: ", err);
  }
};

module.exports = {
  searchEveryWhere,
  searchEveryWhereCount,
  getPoemById,
  getPoemsList
};
