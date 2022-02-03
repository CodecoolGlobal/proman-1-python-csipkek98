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

function boardBuilder(board) {
    return `<div class="board-container">
            <section class="board" data-board-id=${board.id}>
                <div class="board-header">
                    <form id="board-title-form" data-board-id="${board.id}">
                    <input class="board-title" value="${board.title}" data-board-id="${board.id}" readonly>
                    </form>
                    <input class="card-title-input" data-board-id="${board.id}" value="Card title" hidden>
                    <button class="save-title" data-board-id="${board.id}" hidden>Save</button>
                    <button class="save-card" data-board-id="${board.id}" hidden>Save card</button>
                    <button class="board-add" data-board-id="${board.id}" style="display: none">Add card</button>
                    <button class="board-toggle" data-board-remove="${board.id}"><i class="fas fa-trash-alt" data-board-id="${board.id}"></i></button>
                    <button class="board-toggle" data-board-id="${board.id}"><i class="fas fa-chevron-down" data-board-id="${board.id}"></i></button>                                     
                </div>
                <div class="board-columns"></div>
                <div class="board-archive"></div>
            </section>
            </div>`;
}

function columnBuilder(status) {
    return `<div class="board-column" data-column-id="${status.id}">
                <div class="board-column-remove"><i class="fas fa-trash-alt"></i></div>
                <div class="board-column-title">${status.title}
                <div class="board-column-content" data-status-id="${status.id}"></div>
            </div>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">
                <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                <div class="card-title"><input data-card-id="${card.id}" value="${card.title}" readonly></div>
            </div>`;
}

function modalBuilder(archive) {
    return`<div class="card-modal" data-card-modal-id="${archive.id}">
                <div class="header-modal">
                  <p>From ${archive.board}: ${archive.status}</p>
                </div>
                 <div class="container-modal">
                  <p>${archive.title}</p>
                </div>
          </div>`
}

