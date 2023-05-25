export default {
  mongoURL: process.env.MONGO_URL || "mongodb://localhost:27017/clean-node-api",
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || "E5wVzPvjTqS4dytGaf6Pfcukvp6Sqmy8uwLN",
};
