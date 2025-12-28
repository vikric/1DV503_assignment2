document.addEventListener("DOMContentLoaded", function () {
  const login = document.querySelector("#email");
  const register = document.querySelector("#firstName");

  if (login) {
    login.focus();
  }
  if (register) {
    register.focus();
  }
});

window.addEventListener("DOMContentLoaded", function () {
  // Get all query params from URL
  const urlParams = new URLSearchParams(window.location.search);

  // Fill field with query params
  const authorInput = document.querySelector("input[name='author']");
  const titleInput = document.querySelector("input[name='title']");
  const subjectInput = document.querySelector("input[name='subject']");

  // Refill input fields"
  if (authorInput) {
    authorInput.value = urlParams.get("author") || "";
  }
  if (titleInput) {
    titleInput.value = urlParams.get("title") || "";
  }
  if (subjectInput) {
    subjectInput.value = urlParams.get("subject") || "";
  }
});
