var routerMethods = require("../methods");

var routes = require("../routes.js");
const {
  createTask,
  getTaskList,
  deleteTask,
  handleNotFound,
  updateTask,
} = require("../../controller/task");

const {
  login,
} = require("../../controller/login/");

var userRouter = {
  run(req, res) {
    routerMethods.get(req, res, routes.tasks.value, getTaskList);
    routerMethods.post(req, res, routes.tasks.value, createTask);
    routerMethods.delete(req, res, routes.tasks.value, deleteTask);
    routerMethods.patch(req, res, routes.tasks.value, updateTask);

    
    routerMethods.post(req, res, routes.login.value, login);
  },
};

module.exports = userRouter;
