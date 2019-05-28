const xss = require("xss");
const bcrypt = require("bcryptjs");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  getAllUsers(knex) {
    return knex.select("*").from("users");
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("users")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from("users")
      .select("*")
      .where("id", id)
      .first();
  },
  deleteUser(knex, id) {
    return knex("users")
      .where({ id })
      .delete();
  },
  updateUser(knex, id, newUserFields) {
    return knex("users")
      .where({ id })
      .update(newUserFields);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return "Password must be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password must be less than seventy-two characters";
    }

    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with a space";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain at least one uppercase, lowercase, number and special character";
    }
    return null;
  },
  hasUserWithUserName(db, username) {
    return db("users")
      .where({ username })
      .first()
      .then(user => !!user);
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      id: user.id,
      full_name: xss(user.full_name),
      user_name: xss(user.user_name),
      nickname: xss(user.nick_name),
      date_created: new Date(user.date_created),
    };
  },
};

module.exports = UsersService;
