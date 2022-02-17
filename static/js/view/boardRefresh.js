import { loadTableData } from "../controller/boardsManager.js";

export function reloadBoardData(boardId){
    const boardColumns = document.querySelector(`.board[data-board-id="${boardId}"] .board-columns`)
    if(boardColumns.hasChildNodes()){
      boardColumns.innerHTML = ""
      loadTableData(boardId)
      }
}
