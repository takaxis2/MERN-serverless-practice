import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
let todoLists;

export default class todoListsDAO {
  static async injectDB(conn) {
    if (todoLists) {
      return;
    }
    try {
      todoLists = await conn
        .db(process.env.RESTREVIEWS_NS)
        .collection("todoLists");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in todoListsDAO: ${e}`
      );
    }
  }

  static async gettodoLists({
    filters = null,
    page = 0,
    todoListsPerPage = 20,
  } = {}) {
    let query;
    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters["name"] } };
      } else if ("cuisine" in filters) {
        query = { cuisine: { $eq: filters["cuisine"] } };
      } else if ("zipcode" in filters) {
        query = { "address.zipcode": { $eq: filters["zipcode"] } };
      }
    }

    let cursor;

    try {
      cursor = await todoLists.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { todoListsList: [], totalNumTodoLists: 0 };
    }

    const displayCursor = cursor
      .limit(todoListsPerPage)
      .skip(todoListsPerPage * page);

    try {
      const todoListsList = await displayCursor.toArray();
      const totalNumTodoLists = await todoLists.countDocuments(query);

      return { todoListsList, totalNumTodoLists };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { todoListsList: [], totalNumTodoLists: 0 };
    }
  }

  static async gettodoListByID(id) {
    try {
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "reviews",
            let: {
              id: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["restaurant_id", "$$id"],
                  },
                },
              },
              {
                $sort: {
                  date: -1,
                },
              },
            ],
            as: "reviews",
          },
        },
        {
          $addFields: {
            reviews: "$reviews",
          },
        },
      ];
      return await todoLists.aggregate(pipeline).next();
    } catch (e) {
      console.error(`Something went wrong in gettodoListByID: ${e}`);
      throw e;
    }
  }

  static async getCuisines() {
    let cuisines = [];
    try {
      cuisines = await todoLists.distinct("cuisine");
      return cuisines;
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`);
      return cuisines;
    }
  }
}
/*
나중에 name, contents, 날자 등으로 바꾸기
*/
