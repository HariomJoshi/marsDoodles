const mongoose = require("mongoose");
const User = require("./User");
const chatmodel = mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    iscorrectans: {
      type: boolean,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
