export let dataHandler = {
  getBoards: async function () {
    const response = await apiGet("/api/boards");
    return response;
  },
  getBoard: async function (boardId) {
    // the board is retrieved and then the callback function is called with the board
  },
  getStatuses: async function (boardId) {
    const response = await apiGet(`/api/statuses/${boardId}`)
    return response
    // the statuses are retrieved and then the callback function is called with the statuses
  },
  getStatus: async function (statusId) {
    // the status is retrieved and then the callback function is called with the status
  },
  getCardsByBoardId: async function (boardId) {
    const response = await apiGet(`/api/boards/${boardId}/cards/`);
    return response;
  },
  getCard: async function (cardId) {
    // the card is retrieved and then the callback function is called with the card
  },
  createNewBoard: async function (boardTitle) {
    // creates new board, saves it and calls the callback function with its data
  },
  createNewCard: async function (cardTitle, boardId, statusId) {
    // creates new card, saves it and calls the callback function with its data
  },
  renameBoard: async function (newTitle, boardId) {
    const response = await apiPut(`api/boards/${boardId}/rename/${newTitle}`)
    return response
  },
  deleteCard: async function (cardId){
    await apiDelete(`/api/${cardId}/delete_card/`)
  },
  deleteStatus: async function (statusId){
    await apiDelete(`/api/${statusId}/delete_status/`)
  }
};

async function apiGet(url) {
  let response = await fetch(url, {
    method: "GET",
  });
  if (response.status === 200) {
    let data = response.json();
    return data;
  }
}

async function apiPost(url, payload) {}

async function apiDelete(url) {
  let response = await fetch(url, {
    method: "DELETE"
  });
}

async function apiPut(url) {
  let response = await fetch(url, {
    method: "PUT",
  });
  if (response.status === 200) {
    let data = response.json();
    return data;
  }
}
