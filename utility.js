const parseGJson = data => {
  if (!data) {
    return "";
  }

  return JSON.parse(data.slice(data.indexOf("{"), data.length - 2));
};

const formatResponse = data => {
  const response = `ID:  /id_${data.table.rows[0].c[0].v}
Title : ${data.table.rows[0].c[1].v}
Posted on : ${data.table.rows[0].c[3].v}
URL: ${data.table.rows[0].c[2].v}
  
${data.table.rows[0].c[4].v}
  
`;
  return response;
};

module.exports = {
  parseGJson,
  formatResponse
};
