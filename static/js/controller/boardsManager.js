import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";

export let boardsManager = {
  loadBoards: async function () {
    const boards = await dataHandler.getBoards();
    for (let board of boards) {
      const boardBuilder = htmlFactory(htmlTemplates.board);
      const content = boardBuilder(board);
      domManager.addChild("#root", content);
      domManager.addEventListener(
        `.board-toggle[data-board-id="${board.id}"]`,
        "click",
        showHideButtonHandler
      );
      domManager.addEventListener(
          `.board[data-board-id="${board.id}"] input`,
          "click",
          toggleInput
      );
    }
  },
  loadColumns : async function (boardId) {
    const statuses = await dataHandler.getStatuses();      // only uses default values
    for (let status of statuses) {
      const columnBuilder = htmlFactory(htmlTemplates.column);
      const content = columnBuilder(status);
      domManager.addChild(`.board[data-board-id="${boardId}"] .board-columns`, content);
      // column event listeners here if needed
    }
  }
};

async function showHideButtonHandler(clickEvent) {
  const boardId = clickEvent.target.dataset.boardId;
  const openBoard = await document.querySelector(`.board[data-board-id="${boardId}"] .board-columns`);
  if (openBoard.hasChildNodes())
  {
    while (openBoard.hasChildNodes())
    {
      openBoard.removeChild(openBoard.lastChild);
    }
  }
  else
  {
    await boardsManager.loadColumns(boardId);
    await cardsManager.loadCards(boardId);
  }
}

function toggleInput(clickEvent) {
  const targetInput = clickEvent.target;
  targetInput.readOnly === true ? targetInput.readOnly = false : targetInput.readOnly = true;
  toggleSaveButtonForElement(targetInput);
}

function toggleSaveButtonForElement(element) {
  const saveButton = document.querySelector(`.save-title[data-board-id="${element.dataset.boardId}"]`)
  if (saveButton) {
    saveButton.hidden === true ? saveButton.hidden = false : saveButton.hidden = true;
  } else {
    console.log('no save button found')
  }

}