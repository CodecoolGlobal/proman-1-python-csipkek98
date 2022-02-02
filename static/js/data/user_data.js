
export async function validate_user(url, formName){
  let form = new URLSearchParams(new FormData(document.querySelector(formName)));
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