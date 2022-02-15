import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import * as dragAndDrop from "../view/dragAndDrop.js"

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
      domManager.addEventListener(
        `.board-column[data-column-id="${status.id}"]`,
        "dragstart",
          dragAndDrop.handleDragStart
          );
      domManager.addEventListener(
        `.board-column[data-column-id="${status.id}"]`,
        "dragend",
          dragAndDrop.handleDragEnd
          );
      domManager.addEventListener(
        `.board-column[data-column-id="${status.id}"]`,
        "dragover",
          function(event) {
            event.preventDefault();
            }
          );
      domManager.addEventListener(
        `.board-column[data-column-id="${status.id}"]`,
        "drop",
          dragAndDrop.handleDrop
          );
      // domManager.addEventListener(
      //   `.board-column[data-column-id="${status.id}"]`,
      //   "click",
      //     renameColumn
      //     );
      domManager.addEventListener(
        `.board-column[data-column-id="${status.id}"]`,
        "keydown",
          renameColumn
          );
      domManager.addEventListener(
          `none`,
          'click',
          createColumn
      )
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

async function renameColumn(clickEvent){
  const statusIdd = clickEvent.target.dataset.statusIdd;
  const newTitle = document.querySelector(`input[data-status-idd="${statusIdd}"]`);
  if (clickEvent.key === 'Enter'){
    await dataHandler.renameColumn(newTitle.value, statusIdd);
    newTitle.readOnly === true ? newTitle.readOnly = false : newTitle.readOnly = true;
}
}

async function createColumn(clickEvent){
    const statusName = 1
    const boardID = 1
    await dataHandler.createStatus(statusName, boardID)
}