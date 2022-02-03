const dom = {
    hasClass: function (el, cls) {
        return el.classList.contains(cls);
    },
};

const ui = {
    boardColumnsContainer: null,
    columns: null,
    cards: null,
};

const proMan = {
    dragged: null,
};


export function initElements(boardId) {
    ui.cards = document.querySelectorAll(`section[data-board-id="${boardId}"] .card`);
    ui.columns = document.querySelectorAll(`section[data-board-id="${boardId}"] .board-column-content`);
    ui.boardColumnsContainer = document.querySelector(`section[data-board-id="${boardId}"] .board-columns`);
    console.log(ui.columns)
}


export function check(e){
    const element = e.currentTarget
    const currentBoardId = e.currentTarget.dataset.boardId
    if(element.classList.contains("card")){
        initElements(currentBoardId)
    }
}