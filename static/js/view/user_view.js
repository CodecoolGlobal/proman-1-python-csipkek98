export function createAlertBox(message){
    let user_warning = document.createElement("div");
    user_warning.innerHTML = "<div class=\"alert alert-warning alert-dismissible fade d-flex flex-row show\" role=\"alert\">\n" +
        "  <i class=\"bi bi-exclamation-triangle-fill\"></i>\n" +
        "    <div>\n" +
        message + "\n" +
        "  </div>\n" +
        "    <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\n" +
        "</div>";

    let placeHolder = document.querySelector(".warningPlaceholder");
    placeHolder.appendChild(user_warning);
    setTimeout(function (){
        user_warning.remove();
    }, 3000);
}