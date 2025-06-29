const router = require("express").Router({ mergeParams: true });
const controller = require("./reviews.controller");

router.route("/:reviewId")
  .put(controller.update)
  .delete(controller.destroy);

router.route("/")
  .get(controller.list);

module.exports = router;