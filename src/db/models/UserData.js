/** Dependencies */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

/** Relations */
const User = require("./User");

const userDataSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          if (!v) {
            return true;
          } else {
            return v.length > 3;
          }
        },
        message: props => `${props.value} is not a valid name!`
      }
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
    },
    socket: {
      type: String,
      index: { unique: true, dropDups: true },
    }
  },
  { timestamps: true }
);

const UserData = mongoose.model("users-data", userDataSchema);

(
  async function (params) {
    await UserData.init();
  }
)();

module.exports = UserData;