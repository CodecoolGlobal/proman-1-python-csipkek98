import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import {reloadBoardData} from "../view/boardRefresh.js";

export let archiveManager = {
  loadModal: async function () {
    const archive_cards = await dataHandler.getArchive();
    document.getElementById("modal-card-container").innerHTML=""
    if(archive_cards.length !== 0){
      for (let archive_card of archive_cards) {
        const cardBuilder = htmlFactory(htmlTemplates.archive);
        const content = cardBuilder(archive_card);
        domManager.addChild(`#modal-card-container`, content);
        domManager.addEventListener(
          `.card-icon[data-id="${archive_card.id}"]`,
          "click",
          buttonHandler
        );
      }
    }else{
      document.getElementById("modal-card-container").innerHTML="<p>No archived cards yet</p>"
    }
  },

};
function buttonHandler(clickEvent) {
  let click = clickEvent.target.parentElement
  if(click.classList.contains("card-icon")){
    let cardId = click.getAttribute("data-id")
    dataHandler.copyAndDeleteFromArchive(cardId)
    document.querySelector(`[data-card-modal-id="${cardId}"]`).remove()
    const boardId = click.closest(".card-modal").getAttribute("data-board-modal-id")
    reloadBoardData(boardId)
  }
}
