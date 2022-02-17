import { reloadPage } from "./controller/boardsManager.js";

const socket = io();

socket.on("edit", async data => {
  await reloadPage();
});
