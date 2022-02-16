export const htmlTemplates = {
    board: 1,
    card: 2,
    column: 3,
    archive: 4,
}

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder
        case htmlTemplates.card:
            return cardBuilder
        case htmlTemplates.column:
            return columnBuilder
        case htmlTemplates.archive:
            return modalBuilder
        default:
            console.error("Undefined template: " + template)
            return () => { return "" }
    }
}

function boardBuilder(board, logged_in=false) {
    let editPart = ''
    if(logged_in){
        editPart = `<input class="card-title-input" data-board-id="${board.id}" value="Card title" hidden>
                    <button class="save-title" data-board-id="${board.id}" hidden>Save</button>
                    <button class="save-card" data-board-id="${board.id}" hidden>Save card</button>
                    <button class="board-add" data-board-id="${board.id}" style="display: none">Add card</button>                    
                    <button class="board-toggle" data-board-remove="${board.id}"><i class="fas fa-trash-alt" data-board-id="${board.id}"></i></button>
                    
                    <input class="status-title-input" data-board-id="${board.id}" value="Status title">
                    <button class="status-add" data-board-id="${board.id}">add column</button>
                   `
    }
    return `<div class="board-container">
            <section class="board" data-board-id=${board.id}>
                <div class="board-header">
                    <form id="board-title-form" onsubmit="return false" data-board-id="${board.id}">
                    <input class="board-title" value="${board.title}" data-board-id="${board.id}" readonly>
                    </form>
                    ${editPart}
                    <button class="board-toggle" data-board-id="${board.id}"><i class="fas fa-chevron-down" data-board-id="${board.id}"></i></button>                                     
                </div>
                <div class="board-columns"></div>
                <div class="board-archive"></div>
            </section>
            </div>`;
}


function columnBuilder(status, logged_in=false) {
    let editPart = ''
    if(logged_in){
        editPart = `<form id="board-column-form" onsubmit="return false">
                      <input class="board-column-title" value="${status.title}" data-status-idd="${status.id}" >
                    </form>
                    <div class="board-column-remove"><i class="fas fa-trash-alt"></i></div>`
    }
    else {
        editPart = `<div class="board-column-title">${status.title}`
    }
    return `<div class="board-column" data-column-id="${status.id}">
              <div class="board-column-header">
                ${editPart}</div>
                <div class="board-column-content" data-status-id="${status.id}"></div>
            </div>`;
}

function cardBuilder(card, logged_in=false) {
    let editPart = ''
    if(logged_in){
        editPart = `<div class="card" draggable="true" data-card-id="${card.id}" data-board-id="${card.board_id}">
                <div class ="card-archive"><i class="fas fa-archive" aria-hidden="true"></i></div>
                <div class="card-remove"><i class="fas fa-trash-alt"></i></div>`
    }
    else {
        editPart = `<div class="card" draggable="false" data-card-id="${card.id}" data-board-id="${card.board_id}">`
    }
    return `${editPart}
                <div class="card-title">
                <form id="card-title-form" onsubmit="return false"><input data-card-id="${card.id}" value="${card.title}" readonly>
                </form></div>
            </div>`;
}

function modalBuilder(archive) {
    return`<div class="card-modal" data-card-modal-id="${archive.id}" data-board-modal-id="${archive.board_id}">
                <div class="header-modal">
                  <div class="card-text">From: ${archive.board}; ${archive.status}<div class="card-icon" data-id="${archive.id}"><i class="fa fa-arrow-circle-left" aria-hidden="true"></i></div></div>
                </div>
                 <div class="container-modal">
                  <p>${archive.title}</p>
                </div>
          </div>`
}

