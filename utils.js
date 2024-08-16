const fs = require("fs");

function writeFile(filename, content) {
  fs.writeFile(filename, content, (error) => {
    if (error) {
      throw error;
    }
  });
}



function readJsonFileSync(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading or parsing the file:', err);
        return null;
    }
}
async function getBody(request) {
  return new Promise((resolve, reject) => {
      let body = '';
      request.on('data', chunk => {
          body += chunk.toString();
      });
      request.on('end', () => {
          try {
              resolve(JSON.parse(body));
          } catch (error) {
              reject(error);
          }
      });
  });
}

const StatusCode = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
});
module.exports = {
  getBody,
  writeFile,
  StatusCode,
  readJsonFileSync
};
