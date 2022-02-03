import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { archiveManager } from "./archiveManager.js";

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
      domManager.addEventListener(
          `.board-toggle[data-board-remove="${board.id}"]`,
          "click",
          deleteBoard
      )
      domManager.addEventListener(
          "#myBtn",
          "click",
          archiveManager.loadModal
      )
      domManager.addEventListener(
          `.board-add[data-board-id="${board.id}"]`,
          "click",
          cardsManager.showInputCard
      )
      domManager.addEventListener(
          `.save-card[data-board-id="${board.id}"]`,
          "click",
          cardsManager.saveCard
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
  if (click.classList.contains("board-column-remove")){
    let columnId = click.parentElement.getAttribute("data-column-id")
    await dataHandler.deleteStatus(columnId)
    click.parentElement.remove()
    }
}

async function deleteBoard(clickEvent){
  let click = clickEvent.target
  let boardId = ""
  if(click.classList.contains("fa-trash-alt")){
    click = clickEvent.target.parentElement
    }
  if(click.hasAttribute("data-board-remove")){
    boardId = click.getAttribute("data-board-remove")
    }
  await dataHandler.deleteBoard(boardId)
  click.parentElement.parentElement.parentElement.remove() //remove the whole board container
}


async function showHideButtonHandler(clickEvent) {
  const boardId = clickEvent.target.dataset.boardId;
  const openBoard = await document.querySelector(`.board[data-board-id="${boardId}"] .board-columns`);
  if (openBoard.hasChildNodes())
  {
    while (openBoard.hasChildNodes())
    {
      document.querySelector(`.board-add[data-board-id="${boardId}"]`).style.display = 'none'
      document.querySelector(`.save-card[data-board-id="${boardId}"]`).hidden = true
      document.querySelector(`.card-title-input[data-board-id="${boardId}"]`).hidden = true
      openBoard.removeChild(openBoard.lastChild);
    }
  }
  else
  {
    document.querySelector(`.board-add[data-board-id="${boardId}"]`).style.display = 'block'
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