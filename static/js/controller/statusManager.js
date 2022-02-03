import {dataHandler} from "../data/dataHandler";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory";
import {domManager} from "../view/domManager";

export let statusManager = {
loadColumns : async function (boardId) {
    const statuses = await dataHandler.getStatuses(boardId);      // only uses default values
    for (let status of statuses) {
      const columnBuilder = htmlFactory(htmlTemplates.column);
      const content = columnBuilder(status);
      domManager.addChild(`.board[data-board-id="${boardId}"] .board-columns`, content);
      domManager.addEventListener(
        `.board-column[data-column-id="${status.id}"]`,
        "click",
          deleteColumn
          );
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