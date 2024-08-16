const { StatusCode, writeFile, getBody, readJsonFileSync } = require("../../utils.js");

function validateUser(data) {
    const dataJSON = readJsonFileSync("data/login.json");
    console.log("Data in JSON file:", dataJSON);
    console.log("User to validate:", data);

    for (let i = 0; i < dataJSON.length; i++) {
        console.log(`Username : ${data.username}`);
        console.log(`Password : ${data.password}`);
        const user = dataJSON[i];
        console.log("Checking user:", user);

        // Log each comparison
        const usernameMatch = String(user.username).trim() === String(data.username).trim();
        const passwordMatch = String(user.password).trim() === String(data.password).trim();

        console.log(`Username match: ${usernameMatch}`);
        console.log(`Password match: ${passwordMatch}`);

        if (usernameMatch && passwordMatch) {
            console.log("User matched");
            return true;
        }
    }

    console.log("No match found");
    return false;
}



async function login(request, response) {
    try {
        const body = await getBody(request);
        console.log("Body received:", body); // Log the body to verify its structure


        const isValidUser = validateUser(body);

        if (isValidUser) {
            response.writeHead(StatusCode.OK, {
                "Content-Type": "application/json",
            });
            response.end(JSON.stringify({ "token": "token here" }));
        } else {
            response.writeHead(StatusCode.UNAUTHORIZED, {
                "Content-Type": "application/json",
            });
            response.end(JSON.stringify({ "error": "unauthorized user" }));
        }
        
    } catch (error) {
        console.error("Can't read body", error);
        response.writeHead(StatusCode.INTERNAL_SERVER_ERROR, {
            "Content-Type": "application/json",
        });
        response.end(JSON.stringify({ "error": "internal server error" }));
    }
}

module.exports = {
    login,
    validateUser
};
