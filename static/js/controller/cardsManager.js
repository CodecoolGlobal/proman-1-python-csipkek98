import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";

export let cardsManager = {
  loadCards: async function (boardId) {
    const cards = await dataHandler.getCardsByBoardId(boardId);
    for (let card of cards) {
      const cardBuilder = htmlFactory(htmlTemplates.card);
      const content = cardBuilder(card);
      domManager.addChild(`.board[data-board-id="${boardId}"] [data-status-id="${card.status_id}"`, content);
      domManager.addEventListener(
        `.card[data-card-id="${card.id}"]`,
        "click",
        deleteButtonHandler
      );
    }
  },
};

function deleteButtonHandler(clickEvent) {
  let click = clickEvent.target.parentElement
  if(click.classList.contains("card-remove")){
    dataHandler.deleteCard(click.parentElement.getAttribute("data-card-id"))
    click.parentElement.remove()
  }
}


// create card
setTimeout(() =>{
  let newCardButtons = document.querySelectorAll(".board-add");
for (let newCardButton of newCardButtons)
newCardButton.addEventListener("click", function (){
  console.log("newcardbutton")
})
}, 1000)

