import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";


export let cardsManager = {
  loadCards: async function (boardId) {
    const cards = await dataHandler.getCardsByBoardId(boardId);
    for (let card of cards) {
      const cardBuilder = htmlFactory(htmlTemplates.card);
      const content = cardBuilder(card);
      domManager.addChild(`.board[data-board-id="${boardId}"] [data-status-id="${card.status_id}"]`, content);
      domManager.addEventListener(
        `.card[data-card-id="${card.id}"]`,
        "click",
        deleteButtonHandler
      );
      domManager.addEventListener(
          `input[data-card-id="${card.id}"]`,
          "click",
          toggleInput
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
    document.querySelector(`.save-card[data-board-id="${boardId}"]`).hidden = true
    document.querySelector(`.card-title-input[data-board-id="${boardId}"]`).hidden = true
    document.querySelector(`.board-add[data-board-id="${boardId}"]`).style.display = 'block'
    location.reload()
  }

};

function deleteButtonHandler(clickEvent) {
  let click = clickEvent.target.parentElement
  if(click.classList.contains("card-remove")){
    dataHandler.deleteCard(click.parentElement.getAttribute("data-card-id"))
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
