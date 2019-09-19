const { parseGJson, getRandomArbitrary, buildQuery } = require("./utility");
const fetch = require("node-fetch");

const getPoemById = async id => {
  const query = `SELECT A, B, C, D, G WHERE A = ${id}`;
  const url = buildQuery(query);
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
  const query = `SELECT A, B WHERE B CONTAINS '${text}' OR G CONTAINS '${text}'`;
  const url = buildQuery(query);

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
  const query = `SELECT A, B`;
  const url = buildQuery(query);

  console.log("URL: ", url);

  try {
    const response = await fetch(url);
    const json = await response.text();
    return parseGJson(json);
  } catch (err) {
    console.error("Error: ", err);
  }
};

const getRandomPoem = async text => {
  const queryTot = `SELECT max(A)`;
  const url = buildQuery(queryTot);

  console.log("URL: ", url);

  try {
    const response = await fetch(url);
    const json = await response.text();
    const parsedJson = parseGJson(json);
    const totRows = parsedJson.table.rows[0].c[0].v;
    const randomId = Math.floor(getRandomArbitrary(1, totRows + 1));
    console.log("randomId: ", randomId);

    const poem = await getPoemById(randomId);
    console.log("Tot rows: ", totRows);
    return poem;
   // return parseGJson(json);
  } catch (err) {
    console.error("Error: ", err);
  }
};

const searchEveryWhereCount = async text => {
  const query = `SELECT count(A) WHERE B CONTAINS '${text}' OR G CONTAINS '${text}' `;
  const url = buildQuery(query);

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
  getPoemsList,
  getRandomPoem
};
