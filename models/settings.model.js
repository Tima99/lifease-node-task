const mongoose = require("mongoose");
const { FORMAT_ENUMS, GENDER_ENUMS } = require("./match.model");

const Schema = mongoose.Schema;

const createEnumSchema = (enums, ...rest) => {
  // return single object to define schema with enums key and their default importance value
  return Object.keys(enums).reduce((acc, key, index) => {
    acc[key] = {
      type: Number,
      default: rest?.[index] || 1,
    };
    return acc;
  }, {});
};

const settingSchema = new Schema({
  format: {
    ...createEnumSchema(FORMAT_ENUMS, 1, 0.5),
    factor: {
      type: Number,
      required: true,
    },
  },

  gender: {
    ...createEnumSchema(GENDER_ENUMS, 1, 0.5),
    factor: {
      type: Number,
      required: true,
    },
  },

  venue: {
    factor: {
      type: Number,
      required: true,
    },
  },

  teams: {
    factor: {
      type: Number,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    index: true,
  },
});

// Pre-save hook to ensure only one document has status "Active"
settingSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("status")) {
    if (this.status === "Active") {
      // Ensure all other documents have status "Inactive"
      await this.constructor.updateMany(
        { _id: { $ne: this._id } }, // Exclude current document
        { $set: { status: "Inactive" } }
      );
    }
  }
  next();
});

const Settings = mongoose.model("setting", settingSchema);

module.exports = Settings;
