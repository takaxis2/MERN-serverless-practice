import todoListsDAO from "../dao/todoListsDAO.js";

export default class todoListController {
  static async apiGettodoLists(req, res, next) {
    const todoListsPerPage = req.query.todoListsPerPage
      ? parseInt(req.query.todoListsPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine;
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode;
    } else if (req.query.name) {
      filters.name = req.query.name;
    }

    const { todoListsList, totalNumTodoLists } =
      await todoListsDAO.gettodoLists({
        filters,
        page,
        todoListsPerPage,
      });

    let response = {
      todoLists: todoListsList,
      page: page,
      filters: filters,
      entries_per_page: todoListsPerPage,
      total_results: totalNumTodoLists,
    };
    res.json(response);
  }

  static async apiGettodoListsById(req, res, next) {
    try {
      let id = req.params.id || {};
      let todoList = await todoListsDAO.apiGettodoListsById(id);
      if (!todoList) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(todoList);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGettodoListCuisines(req, res, next) {
    try {
      let cuisines = await todoListsDAO.getCuisines();
      res.json(cuisines);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
