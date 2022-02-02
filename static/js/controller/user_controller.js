import { validate_user } from "../data/user_data.js"
import { createAlertBox } from "../view/user_view.js"

const URL = {
  register: "/api/register",
  login: "/api/login"
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

async function handleInvalidPassword(event){
  event.preventDefault();
  const is_valid = await validate_user(URL.login, ".login");
  if(is_valid){
    await this.removeEventListener('click', handleInvalidPassword);
    this.click();
  }
  else {
    createAlertBox("Invalid username or password, please try again.");
  }
}

async function initBtnClick(){
  let registerBtn = await document.querySelector(".submit-register");
  let loginBtn = await document.querySelector(".submit-login");
  if(registerBtn) {
    registerBtn.addEventListener('click', handleInvalidUsername);
  }
  if(loginBtn) {
    loginBtn.addEventListener('click', handleInvalidPassword);
  }
}

await initBtnClick();