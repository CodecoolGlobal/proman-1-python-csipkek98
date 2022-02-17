import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import * as dragAndDrop from "../view/dragAndDrop.js";
import {reloadBoardData} from "../view/boardRefresh.js";

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
      domManager.addEventListener(
        `.board-column[data-column-id="${status.id}"] input`,
        "keydown",
          renameColumn
          );
      domManager.addEventListener(
          `.board-column[data-column-id="${status.id}"] input`,
          "focusout",
          resetForm
      )
      domManager.addEventListener(
          `.status-add[data-board-id="${boardId}"]`,
          'click',
          createColumn
      )
    }
  }
  }


async function deleteColumn(clickEvent){
    let click = clickEvent.target.parentElement
    let boardId = click.closest("[data-board-id]").getAttribute("data-board-id")
    if (click.classList.contains("board-column-remove")){
        let columnId = click.closest("[data-column-id]").getAttribute("data-column-id")
        await dataHandler.deleteStatus(columnId)
        reloadBoardData(boardId)
    }
}

// async function renameColumn(e){
    // const targetInput = e.target;
    // const statusIdd = e.target.dataset.statusIdd;
    // const newTitle = document.querySelector(`input[data-status-idd="${statusIdd}"]`);
    // let boardId = targetInput.closest("[data-board-id]").getAttribute("data-board-id")
    // if (e.keyCode === 13){
        // await dataHandler.renameColumn(newTitle.value, statusIdd);
        // newTitle.readOnly === true ? newTitle.readOnly = false : newTitle.readOnly = true;
        // reloadBoardData(boardId)
    // }
    // targetInput.readOnly === true ? targetInput.readOnly = false : targetInput.readOnly = true;
    // targetInput.onfocus = this.selectionStart = this.selectionEnd = this.value.length;
// }

async function renameColumn(e) {
    const targetInput = e.target;
    targetInput.onfocus = this.selectionStart = this.selectionEnd = this.value.length;
    if (e.keyCode === 13) {
        const boardId = targetInput.closest(".board").dataset.boardId;
        const statusIdd = targetInput.dataset.statusIdd;
        const newTitle = document.querySelector(`input[data-status-idd="${statusIdd}"]`);
        await dataHandler.renameColumn(newTitle.value, statusIdd);
        newTitle.readOnly === true ? newTitle.readOnly = false : newTitle.readOnly = true;
        reloadBoardData(boardId);
    }
}

function resetForm() {
  let allForms = document.querySelectorAll("form");
  for (let form of allForms) {
    form.reset()
  }
}

async function createColumn(clickEvent){
    const boardId = clickEvent.currentTarget.getAttribute("data-board-id")
    const statusName = clickEvent.currentTarget.parentElement.querySelector(".status-title-input").value
    await dataHandler.createStatus(statusName, boardId)
    reloadBoardData(boardId)
}