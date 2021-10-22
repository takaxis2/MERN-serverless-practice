import express from "express";
import todoListsCtrl from "./todoLists.controller.js";
import ReviewsCtrl from "./reviews.controller.js";

const router = express.Router();

router.route("/").get(todoListsCtrl.apiGettodoLists);
router.route("/id/:id").get(todoListsCtrl.apiGettodoListsById);
router.route("/cuisines").get(todoListsCtrl.apiGettodoListCuisines);

router
  .route("/review")
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview);

export default router;
