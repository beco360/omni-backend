/** Dependencies */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/** Relations */
const User = require("./User");

const chatSchema = new Schema(
  {
    channel: {
      type: String,
      required: true,
      enum: ["Whatsapp", "Facebook Messenger", "Webchat"]
    },
    subscribers: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: User.modelName,
          required: true
        },
        subscription_date: {
          type: Date,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

/** Middlewares */
chatSchema.pre("save", function(next) {
  if (!this.subscription_date) {
    this.subscription_date = new Date();
  }
  next();
});

const Chat = mongoose.model("chats", chatSchema);

module.exports = Chat;
