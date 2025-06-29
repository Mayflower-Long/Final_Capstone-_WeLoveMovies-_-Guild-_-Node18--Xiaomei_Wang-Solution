const db = require("../db/connection");
const mapProperties = require("../utils/map-properties");

async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

async function read(movie_id) {
  return db("movies").select("*").where({ movie_id }).first();
}

async function listTheaters(movie_id) {
  return db("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .select("t.*", "mt.is_showing", "mt.movie_id")
    .where({ "mt.movie_id": movie_id });
}

const reduceCritic = mapProperties({
  "critic_id": ["critic", "critic_id"],
  "preferred_name": ["critic", "preferred_name"],
  "surname": ["critic", "surname"],
  "organization_name": ["critic", "organization_name"],
  "created_at": ["critic", "created_at"],
  "updated_at": ["critic", "updated_at"],
});

async function listReviews(movie_id) {
  return db("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "r.*",
      "c.critic_id",
      "c.preferred_name",
      "c.surname",
      "c.organization_name",
      "c.created_at as critic_created_at",
      "c.updated_at as critic_updated_at"
    )
    .where({ "r.movie_id": movie_id })
    .then((reviews) =>
      reviews.map((review) =>
        addCritic({
          ...review,
          created_at: review.created_at, // review created_at
          updated_at: review.updated_at, // review updated_at
          critic_created_at: review.critic_created_at,
          critic_updated_at: review.critic_updated_at,
        })
      )
    );
}

const addCritic = mapProperties({
  "critic_id": ["critic", "critic_id"],
  "preferred_name": ["critic", "preferred_name"],
  "surname": ["critic", "surname"],
  "organization_name": ["critic", "organization_name"],
  "created_at": ["critic", "created_at"],
  "updated_at": ["critic", "updated_at"],
});

module.exports = {
  list,
  read,
  listTheaters,
  listReviews,
};