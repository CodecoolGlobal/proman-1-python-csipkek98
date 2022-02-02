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
    dataHandler.createNewCard(cardTitle, boardId, 1)

  }

};

function deleteButtonHandler(clickEvent) {
  let click = clickEvent.target.parentElement
  if(click.classList.contains("card-remove")){
    dataHandler.deleteCard(click.parentElement.getAttribute("data-card-id"))
    click.parentElement.remove()
  }
}




// // create card
// setTimeout(() =>{
//   let newCardButtons = document.querySelectorAll(".board-add");
//   let cardInputs = document.querySelectorAll(".card-title")
//   let saveCards = document.querySelectorAll(".save-card")
//
//
//
// for (let newCardButton of newCardButtons){
// newCardButton.addEventListener("click", function () {
//
//     for (let cardInput of cardInputs ){
//       if (newCardButton.dataset.boardId === cardInput.dataset.boardId){
//     cardInput.hidden = false;
//   }
//   }
//
//     for (let saveCard of saveCards ){
//       if (newCardButton.dataset.boardId === saveCard.dataset.boardId){
//     saveCard.hidden = false;
//   }
//       saveCard.addEventListener('click', function (){
//         for (let cardInput of cardInputs) {
//           if (newCardButton.dataset.boardId === cardInput.dataset.boardId){
//             console.log(cardInput.value)
//           let response = dataHandler.createNewCard(cardInput)
//         }
//         }
//       })
//   }
//
//
//   console.log(newCardButton.dataset.boardId)
//   newCardButton.style.display = 'none';
//
//
// })}
//
// }, 1000)

