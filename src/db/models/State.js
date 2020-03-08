/**
 *  Modelo para manejar la cantidad de tiempo que
 *  cada agente estuvo en algún estado.
 */

/** Dependencies */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/** Relations */
const User = require("./User");

const stateSchema = new Schema(
  {
    state: {
      type: String,
      required: true,
      enum: ["Online", "Break", "Occupied", "Offline"]
    },
    agent: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: true
    },
    totalTime: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const State = mongoose.model("states", stateSchema);

module.exports = State;
