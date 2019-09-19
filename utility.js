function parseGJson(data) {
  if (!data) {
    return "";
  }

  return JSON.parse(data.slice(data.indexOf("{"), data.length - 2));
}

module.exports = parseGJson;
