import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";

export let boardsManager = {
  loadBoards: async function () {
    document.getElementById("root").innerHTML=""
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
      domManager.addEventListener(
          `.save-title[data-board-id="${board.id}"]`,
          "click",
          renameBoard
      )
    }
  },
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
};


async function deleteColumn(clickEvent){
  let click = clickEvent.target.parentElement
  console.log(click)
  if (click.classList.contains("board-column-remove")){
    let columnId = click.parentElement.getAttribute("data-column-id")
    await dataHandler.deleteStatus(columnId)
    click.parentElement.remove()
    }
}


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
  targetInput.onfocus = this.selectionStart = this.selectionEnd = this.value.length;
  toggleSaveButtonForElement(targetInput);
}


// create board
const newBoardButton = document.getElementById("new-board")
const newBoardDiv = document.getElementById("new-board-div")


newBoardButton.addEventListener("click", function (){
  newBoardButton.style.display='none';
  newBoardDiv.hidden = false;
})

document.getElementById("save-board").addEventListener("click", async function (){
  let response = await dataHandler.createNewBoard(document.getElementById("board-title").value);
  console.log(response);
  boardsManager.loadBoards();
  newBoardButton.style.display='block';
  newBoardDiv.hidden = true;
})


function toggleSaveButtonForElement(element) {
  const saveButton = document.querySelector(`.save-title[data-board-id="${element.dataset.boardId}"]`)
  if (saveButton) {
    saveButton.hidden === true ? saveButton.hidden = false : saveButton.hidden = true;
  } else {
    console.log('no save button found')
  }
}

async function renameBoard(clickEvent) {
  const boardId = clickEvent.target.dataset.boardId;
  const newTitle = document.querySelector(`input[data-board-id="${boardId}"]`)
  await dataHandler.renameBoard(newTitle.value, boardId)
  newTitle.readOnly === true ? newTitle.readOnly = false : newTitle.readOnly = true;
  toggleSaveButtonForElement(newTitle)
}