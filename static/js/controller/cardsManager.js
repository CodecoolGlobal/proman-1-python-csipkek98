import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import * as dragAndDrop from "../view/dragAndDrop.js"
import { reloadBoardData } from "../view/boardRefresh.js";

export let cardsManager = {
  loadCards: async function (boardId) {
    const cards = await dataHandler.getCardsByBoardId(boardId);
    let logged_in = await dataHandler.is_logged_in();
    for (let card of cards) {
      const cardBuilder = htmlFactory(htmlTemplates.card);
      const content = cardBuilder(card, logged_in);
      domManager.addChild(`.board[data-board-id="${boardId}"] [data-status-id="${card.status_id}"]`, content);
      domManager.addEventListener(
        `.card[data-card-id="${card.id}"]`,
        "click",
        cardButtonsHandler
      );
      domManager.addEventListener(
          `input[data-card-id="${card.id}"]`,
          "click",
          toggleInput
      )
      domManager.addEventListener(
          `.card[data-card-id="${card.id}"]`,
          "dragstart",
          dragAndDrop.handleDragStart
      )
      domManager.addEventListener(
          `.card[data-card-id="${card.id}"]`,
          "dragend",
          dragAndDrop.handleDragEnd
      )
    }
  },

  showInputCard: function (clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    document.querySelector(`.save-card[data-board-id="${boardId}"]`).hidden = false
    document.querySelector(`.card-title-input[data-board-id="${boardId}"]`).hidden = false
    document.querySelector(`.board-add[data-board-id="${boardId}"]`).style.display = 'none'
  },

  saveCard: function (clickEvent){
    const boardId = clickEvent.target.dataset.boardId;
    let cardTitle = document.querySelector(`.card-title-input[data-board-id="${boardId}"]`).value
    dataHandler.createNewCard(cardTitle, boardId)
    reloadBoardData(boardId)
    document.querySelector(`.save-card[data-board-id="${boardId}"]`).hidden = true
    document.querySelector(`.card-title-input[data-board-id="${boardId}"]`).hidden = true
    document.querySelector(`.board-add[data-board-id="${boardId}"]`).style.display = 'block'
  }

};

function cardButtonsHandler(clickEvent) {
  let click = clickEvent.target.parentElement
  if(click.classList.contains("card-remove")){
    dataHandler.deleteCard(click.parentElement.getAttribute("data-card-id"))
    click.parentElement.remove()
  }
  if(click.classList.contains("card-archive")){
    dataHandler.copyAndDeleteFromBoard(click.parentElement.getAttribute("data-card-id"))
    click.parentElement.remove()
  }
}

async function renameCard(clickEvent) {
  const cardId = clickEvent.target.dataset.cardId;
  const newTitle = document.querySelector(`input[data-card-id="${cardId}"]`);
  await dataHandler.renameCard(newTitle.value, cardId);
  newTitle.readOnly === true ? newTitle.readOnly = false : newTitle.readOnly = true;
}

function toggleInput(clickEvent) {
  const targetInput = clickEvent.target;
  targetInput.readOnly === true ? targetInput.readOnly = false : targetInput.readOnly = true;
  targetInput.onfocus = this.selectionStart = this.selectionEnd = this.value.length;
}
