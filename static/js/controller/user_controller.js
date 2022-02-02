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

function handleSignInUpToggle(){
  let register = document.querySelector(".register");
  let login = document.querySelector(".login");
  if(this.id === "register"){
    login.style.display = "none";
    register.style.display = "block";
  }
  else if(this.id === "login"){
    login.style.display = "block";
    register.style.display = "none";
  }
}

async function initBtnClick(){
  let submitBtn = await document.querySelector(".submit");
  submitBtn.addEventListener('click', handleInvalidUsername);

  let registerBtn = await document.querySelector("#register");
  let loginBtn = await document.querySelector("#login");
  loginBtn.addEventListener('click', handleSignInUpToggle);
  registerBtn.addEventListener('click', handleSignInUpToggle);
}

await initBtnClick();