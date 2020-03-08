/** Dependencies */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const permissionSchema = new Schema(
  {
    may: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

const Permission = mongoose.model("permissions", permissionSchema);

module.exports = Permission;