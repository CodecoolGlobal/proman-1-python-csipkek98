import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let statusManager = {
loadColumns : async function (boardId) {
    const statuses = await dataHandler.getStatuses(boardId);      // only uses default values
    let logged_in = await dataHandler.is_logged_in();
    for (let status of statuses) {
      const columnBuilder = htmlFactory(htmlTemplates.column);
      const content = columnBuilder(status, logged_in);
      domManager.addChild(`.board[data-board-id="${boardId}"] .board-columns`, content);
      domManager.addEventListener(
        `.board-column[data-column-id="${status.id}"]`,
        "click",
          deleteColumn
          );
      // domManager.addEventListener(
      //   `.board-column[data-column-id="${status.id}"]`,
      //   "click",
      //     renameColumn
      //     );
    }
  }
  }


  async function deleteColumn(clickEvent){
  let click = clickEvent.target.parentElement
  if (click.classList.contains("board-column-remove")){
    let columnId = click.parentElement.getAttribute("data-column-id")
    await dataHandler.deleteStatus(columnId)
    click.parentElement.remove()
    }
}

// function renameColumn(clickEvent){
//     const targetInput = clickEvent.target;
//     if (click.classList.contains("board-column-title")){
//
//     }
//
//     console.log("title click")
// }