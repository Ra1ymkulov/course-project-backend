"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./src/app"));
const server = (0, app_1.default)();
const start = () => {
  try {
    const PORT = process.env.PORT || 3000;
    server.listen(
      {
        port: PORT,
        host: "0.0.0.0",
      },
      () => {
        console.log(`${new Date()}`);
        console.log(`Server run in: http://localhost:${PORT}`);
      }
    );
  } catch (error) {
    console.log(`server crush: ${error}`);
    process.exit(1);
  }
};
start();
