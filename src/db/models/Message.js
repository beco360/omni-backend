/** Dependencies */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/** Relations */
const Chat = require("./Chat");
const User = require("./User");

const messageSchema = new Schema(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: Chat.modelName,
      required: true
    },
    transmitter: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: true
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: User.modelName,
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    messageType: {
      type: String,
      required: true,
      enum: ["Text", "Image", "File", "Video"]
    }
  },
  { timestamps: true }
);

const Message = mongoose.model("messages", messageSchema);

module.exports = Message;
