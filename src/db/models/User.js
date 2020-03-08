/** Dependencies */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

/** Relations */
const Rol = require("./Rol");

const userSchema = new Schema(
  {
    email: {
      type: String,
      index: { unique: true, dropDups: true },
      required: true,
      validate: {
        validator: function (email) {
          if (!email) {
            return true;
          } else {
            var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(String(email).toLowerCase());
          }
        },
        message: props => `${props.value} is not a valid email!`
      }
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (password) {
          // The password must contain at least 6 characters with an uppercase letter and a number.
          if (password.length < 6 || !this.haveACapitalLetter(password) || !this.haveALowerCase(password) || !this.haveANumber(password)) return false;
        },
        message: props => `The password is not correct`
      }
    },
    rol: {
      type: Schema.Types.ObjectId,
      ref: Rol.modelName,
      required: true
    },
  },
  { timestamps: true }
);

/** Methods */
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) callback(err);
    callback(null, isMatch);
  });
};

userSchema.methods.haveACapitalLetter = function (word) {
  let lettersOfword = word.split("");
  let returnValue = false;
  lettersOfword.forEach(letter => {
    if (letter === letter.toUpperCase() && isNaN(letter)) {
      returnValue = true;
    }
  });
  return returnValue;
}

userSchema.methods.haveALowerCase = function (word) {
  let lettersOfword = word.split("");
  let returnValue = false;
  lettersOfword.forEach(letter => {
    if (letter === letter.toLowerCase() && isNaN(letter)) {
      returnValue = true;
    }
  });
  return returnValue;
}

userSchema.methods.haveANumber = function (word) {
  let lettersOfword = word.split("");
  let returnValue = false;
  lettersOfword.forEach(letter => {
    if (!isNaN(letter)) returnValue = true
  });
  return returnValue;
}

/** Middlewares */
userSchema.pre("save", function (next) {
  var user = this;
  if (!user.password) {
    next();
  } else {
    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    // generate a salt
    const SALT_WORK_FACTORY = 10;
    bcrypt.genSalt(SALT_WORK_FACTORY, function (err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
      });
    });
  }
});

const User = mongoose.model("users", userSchema);

(
  async function (params) {
    await User.init();
  }
)();

module.exports = User;