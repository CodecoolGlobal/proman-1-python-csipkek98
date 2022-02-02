import { validate_user } from "../data/user_data.js"
import { createAlertBox } from "../view/user_view.js"

const URL = {
  register: "/api/register"
}

async function handleInvalidUsername(event){
  event.preventDefault();
  const is_valid = await validate_user(URL.register, ".register");
  if(is_valid){
    await this.removeEventListener('click', handleInvalidUsername);
    this.click();
  }
  else {
    createAlertBox("This username or e-mail is already taken, please choose another one.");
  }
}

async function initBtnClick(){
  let submitBtn = await document.querySelector(".submit");
  submitBtn.addEventListener('click', handleInvalidUsername);
}

await initBtnClick();