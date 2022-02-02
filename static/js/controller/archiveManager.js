import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";

export let archiveManager = {
  loadModal: async function () {
    const archive_cards = await dataHandler.getArchive();
    document.getElementById("modal-card-container").innerHTML=""
    for (let archive_card of archive_cards) {
      const cardBuilder = htmlFactory(htmlTemplates.archive);
      const content = cardBuilder(archive_card);
      domManager.addChild(`#modal-card-container`, content);
      // domManager.addEventListener(
      //   `.card[data-card-id="${card.id}"]`,
      //   "click",
      //   deleteButtonHandler
      // );
    }
  },
};
