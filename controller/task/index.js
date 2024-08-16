const taskList = require("../../data/data.json");
const { StatusCode, writeFile, getBody } = require("../../utils.js");
const fs = require("fs");

function getTaskList(request, response) {
  const status = request.url.split("?status=")[1] || "all";
  let statusTaskList = [];
  if (status === "done") {
    statusTaskList = taskList.filter((item) => item.completed === true);
  } else if (status === "undone") {
    statusTaskList = taskList.filter((item) => item.completed === false);
  } else if (status === "all") {
    statusTaskList = taskList;
  }
  response.writeHead(StatusCode.OK, { "Content-Type": "application/json" });
  response.end(JSON.stringify(statusTaskList));
}

async function createTask(request, response) {
  try {
    const body = await getBody(request);
    const { id, name, completed } = JSON.parse(body);
    if (id === undefined || name === undefined || completed === undefined) {
      response.writeHead(StatusCode.BAD_REQUEST, {
        "Content-Type": "text/plain",
      });
      response.end("Bad request");
    } else {
      let task = taskList.find((item) => item.id === id || item.name === name);
      if (task) {
        response.writeHead(StatusCode.BAD_REQUEST, {
          "Content-Type": "text/plain",
        });
        response.end("Bad request");
      } else {
        taskList.push(JSON.parse(body));
        writeFile("./data/data.json", JSON.stringify(taskList));
        response.writeHead(StatusCode.CREATED, {
          "Content-Type": "application/json",
        });
        response.end(JSON.stringify({ id: id }));
      }
    }
  } catch (error) {
    if (error) {
      console.error("cant read body", error);
    }
  }
}

async function updateTask(request, response) {
  try {
    const idFromUrl = request.url.split("?id=")[1];
    const body = await getBody(request);
    const { name, completed } = JSON.parse(body);
    let newTask = taskList.find((item) => item.id === Number(idFromUrl));
    if (newTask) {
      newTask.name = name || newTask.name;
      if (completed !== undefined) {
        newTask.completed = completed;
      }
      writeFile("./data/data.json", JSON.stringify(taskList));
      response.writeHead(StatusCode.NO_CONTENT, {
        "Content-Type": "application/json",
      });
      response.end(JSON.stringify({ newTask }));
    } else {
      response.writeHead(StatusCode.BAD_REQUEST, {
        "Content-Type": "text/plain",
      });
      response.end("Bad requestuest");
    }
  } catch (error) {
    if (error) {
      console.error("cant read body", error);
    }
  }
}

function deleteTask(request, response) {
  const taskId = request.url.split("?id=")[1];
  fs.readFile("./data/data.json", "utf8", (error, data) => {
    if (error) {
      response.writeHead(StatusCode.INTERNAL_SERVER_ERROR, {
        "Content-Type": "application/json",
      });
      response.end("Cannot read data");
      return;
    }
    let currentTasks = JSON.parse(data);
    const newTasks = currentTasks.filter(
      (task) => task.id.toString() !== taskId
    );
    if (currentTasks.length === newTasks.length) {
      handleNotFound(request, response);
      return;
    }
    writeFile("./data/data.json", JSON.stringify(newTasks));
    response.writeHead(StatusCode.NO_CONTENT, {
      "Content-Type": "application/json",
    });
  });
}

function handleNotFound(request, response) {
  response.writeHead(StatusCode.NOT_FOUND, { "Content-Type": "text/plain" });
  response.end("Not Found");
}

module.exports = {
  createTask,
  getTaskList,
  deleteTask,
  handleNotFound,
  updateTask,
};
