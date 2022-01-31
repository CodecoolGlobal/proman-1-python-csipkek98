export const htmlTemplates = {
    board: 1,
    card: 2
}

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder
        case htmlTemplates.card:
            return cardBuilder
        default:
            console.error("Undefined template: " + template)
            return () => { return "" }
    }
}

function boardBuilder(board) {
    return `<div class="board-container">
        <section class="board" data-board-id=${board.id}>
            <div class="board-header"><span class="board-title">${board.title}</span>
                <button class="board-toggle" data-board-id="${board.id}"><i class="fas fa-chevron-down"></i></button>
            </div>
        </section>
    </div>`;
}

function statusBuilder(status) {
    return `<div class="card" data-card-id="${status.id}">${status.title}</div>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">
                <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                <div class="card-title">${card.title}</div>
            </div>`;
}



