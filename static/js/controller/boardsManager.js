import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { archiveManager } from "./archiveManager.js";
import { statusManager } from "./statusManager.js";
import * as dragAndDrop from "../view/dragAndDrop.js"


export let boardsManager = {
  loadBoards: async function () {
    document.getElementById("root").innerHTML=""
    const boards = await dataHandler.getBoards();
    let logged_in = await dataHandler.is_logged_in();
    for (let board of boards) {
      const boardBuilder = htmlFactory(htmlTemplates.board);
      const content = boardBuilder(board, logged_in);
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
      domManager.addEventListener(
          `form[data-board-id="${board.id}"]`,
          "focusout",
          resetForm

      )
    }
  }
};




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
  let addBtn = document.querySelector(`.board-add[data-board-id="${boardId}"]`);
  if (openBoard.hasChildNodes())
  {
    while (openBoard.hasChildNodes())
    {
      if(addBtn){
        addBtn.style.display = 'none';
      }
      if(document.querySelector(`.save-card[data-board-id="${boardId}"]`)){
        document.querySelector(`.save-card[data-board-id="${boardId}"]`).hidden = true
      }
      if(document.querySelector(`.card-title-input[data-board-id="${boardId}"]`)){
        document.querySelector(`.card-title-input[data-board-id="${boardId}"]`).hidden = true
      }
      openBoard.removeChild(openBoard.lastChild);
    }
  }
  else
  {
    if (addBtn){
        addBtn.style.display = 'block'
    }
    await statusManager.loadColumns(boardId);
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
async function initCreateBtn(){
  const newBoardButton = await document.getElementById("new-board");
  const newBoardDiv = await document.getElementById("new-board-div");
  const cancelNewBoard = await document.querySelector("#cancel-create-board");

  if(newBoardButton) {
    cancelNewBoard.addEventListener("click", function () {
      newBoardButton.style.display = 'block';
      newBoardDiv.style.display = "none";
    });

    newBoardButton.addEventListener("click", function () {
      newBoardButton.style.display = 'none';
      newBoardDiv.style.display = "flex";
    })

    document.getElementById("save-board").addEventListener("click", async function () {
      let response = await dataHandler.createNewBoard(await getBoardData());
      console.log(response);
      boardsManager.loadBoards();
      newBoardButton.style.display = 'block';
      newBoardDiv.style.display = "none";
    })
  }
}

initCreateBtn();

async function getBoardData(){
  let boardData = await new FormData;
  boardData.append("title", document.getElementById("board-title").value);
  if(document.querySelector("#public").checked){
      boardData.append("status", "public");
  }
  else{
      boardData.append("status", "private");
  }
  return new URLSearchParams(boardData);
}

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

function resetForm() {
  let allForms = document.querySelectorAll("form");
  for (let form of allForms) {
    form.reset()
  }
}