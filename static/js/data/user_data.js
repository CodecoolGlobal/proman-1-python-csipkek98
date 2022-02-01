
const URL = {
  register: "/api/register"
}

async function validate_user(url){
  let form = new URLSearchParams(new FormData(document.querySelector(".register")));
  let data;
  let response = await fetch(url, {
    method: "POST",
    body: form
  });
  if (response.status === 200) {
    data = response.json();
  }
  return data;
}

async function handleInvalidUsername(event){
  event.preventDefault();
  const is_valid = await validate_user(URL.register)
  if(is_valid){
    await this.removeEventListener('click', handleInvalidUsername);
    this.click();
  }
}

function initBtnClick(){
  let submitBtn = document.querySelector(".btn");
  submitBtn.addEventListener('click', handleInvalidUsername)
}

initBtnClick();