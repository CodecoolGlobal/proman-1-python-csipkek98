import {dataHandler} from "../data/dataHandler.js";



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
    draggedColumn: null,
};


export function initElements(boardId) {
    ui.cards = document.querySelectorAll(`section[data-board-id="${boardId}"] .card`);
    ui.columns = document.querySelectorAll(`section[data-board-id="${boardId}"] .board-column-content`);
    ui.boardColumnsContainer = document.querySelector(`section[data-board-id="${boardId}"] .board-columns`);
}


export function handleDragStart(e){
    proMan.dragged = e.currentTarget;
    const element = e.currentTarget
    e.stopPropagation()
    if(element.classList.contains("card")){
        console.log(element.parentElement)
        proMan.draggedColumn = element.parentElement.getAttribute("data-status-id")
        const currentBoardId = e.currentTarget.dataset.boardId
        initElements(currentBoardId)
        HighlightDropZones("card")
    }else if(element.classList.contains("board-column")){
        const currentBoardId = element.querySelector(".card").dataset.boardId
        initElements(currentBoardId)
        HighlightDropZones("status")
    }
}


export function handleDragEnd(e){
    const element = e.currentTarget
    e.stopPropagation()
    if(element.classList.contains("card")){
        const currentBoardId = e.currentTarget.dataset.boardId
        initElements(currentBoardId)
        HighlightDropZones("card")
    }else if(element.classList.contains("board-column")){
        const currentBoardId = element.querySelector(".card").dataset.boardId
        initElements(currentBoardId)
        HighlightDropZones("status")
    }
    proMan.dragged = null
}


export function handleDrop(e){
    e.preventDefault();
    let dropzone = e.currentTarget
    if (dropzone.classList.contains("card")){
        dropzone = e.currentTarget.parentElement
    }
    const dropPlace = dropzone.querySelector(".board-column-content")
    dropPlace.appendChild(proMan.dragged)
    const DropZoneColumnId = dropzone.getAttribute("data-column-id")
    if(proMan.draggedColumn !== DropZoneColumnId){
        const cardId = proMan.dragged.getAttribute("data-card-id")
        const newColumnId = DropZoneColumnId
        dataHandler.changeCardColumn(cardId, newColumnId)
        }
}

function HighlightDropZones(elementType){
    if (elementType === "card"){
        for(const dropZone of ui.columns){
            dropZone.classList.toggle("highlight-dropzone")
        }
    }else{
            ui.boardColumnsContainer.classList.toggle("highlight-dropzone")
    }
}