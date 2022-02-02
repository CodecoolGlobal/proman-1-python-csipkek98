import { validate_user } from "../data/user_data.js"
import { createAlertBox } from "../view/user_view.js"

const URL = {
  register: "/api/register"
}

async function handleInvalidUsername(event){
  event.preventDefault();
  const is_valid = await validate_user(URL.register);
  if(is_valid){
    await this.removeEventListener('click', handleInvalidUsername);
    this.click();
  }
  else {
    createAlertBox("This username or e-mail is already taken, please choose another one.");
  }
}

function initBtnClick(){
  let submitBtn = document.querySelector(".btn");
  submitBtn.addEventListener('click', handleInvalidUsername)
}

initBtnClick();