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
  createNewBoard: async function (boardData) {
    const response = await apiPostForm("/api/create/board/", boardData);
    return response;
    // creates new board, saves it and calls the callback function with its data
  },
  createNewCard: async function (cardTitle, boardId, statusId) {
    let card = {'cardTitle': cardTitle, 'boardId': boardId, 'statusId': statusId}
    const response = await apiPost("/api/create/card/", card)
    return response
    // creates new card, saves it and calls the callback function with its data
  },
  renameBoard: async function (newTitle, boardId) {
    const response = await apiPut(`api/boards/${boardId}/rename/${newTitle}`)
    return response
  },
  deleteCard: async function (cardId){
    await apiDelete(`/api/${cardId}/delete_card/`)
  },
  renameCard: async function (newTitle, cardId) {
      const response = await apiPut()
  },
  renameColumn: async function (newTitle, columnId){
    const response = await apiPut(`/api/column/${columnId}/rename/${newTitle}/`)
    return response
  },
  deleteStatus: async function (statusId){
    await apiDelete(`/api/${statusId}/delete_status/`)
  },
  deleteBoard: async function (statusId){
    await apiDelete(`/api/${statusId}/delete_board/`)
  },
  getArchive: async function (){
    const response = await apiGet("/api/archive")
    return response
  },
  copyAndDeleteFromBoard: async function (cardId){
    await apiDelete(`/api/board/copy_card/${cardId}`)
  },
  copyAndDeleteFromArchive: async function (cardId){
    await apiDelete(`/api/archive/copy_card/${cardId}`)
  },
  is_logged_in: async function(){
    return await apiGet("/api/user/is_login")
  },
  changeCardColumn: async function (cardId, newColumn){
    const response = await apiPut(`/api/board/${newColumn}/${cardId}/update_status`)
    return response
  }
};

export async function apiGet(url) {
  let response = await fetch(url, {
    method: "GET",
  });
  if (response.status === 200) {
    let data = response.json();
    return data;
  }
}

async function apiPost(url, payload) {
  let response = await fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (response.status === 200) {
    return response.json();
  }
}

async function apiPostForm(url, payload) {
  let response = await fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: payload
  });
  if (response.status === 200) {
    return response.json();
  }
}

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

