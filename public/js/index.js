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
  // Hämta alla queryparametrar från URL:en
  const urlParams = new URLSearchParams(window.location.search);

  // Fyll fälten med de aktuella queryparametrarna om de finns
  const authorInput = document.querySelector("input[name='author']");
  const titleInput = document.querySelector("input[name='title']");
  const subjectInput = document.querySelector("input[name='subject']");
  const limitButtons = document.querySelectorAll(".items-per-page button");

  // För fylla in "author" och "title"
  if (authorInput) authorInput.value = urlParams.get("author") || "";
  if (titleInput) titleInput.value = urlParams.get("title") || "";
  if (subjectInput) subjectInput.value = urlParams.get("subject") || "";

  // Markera den knappen som är vald för "Items per page"
/*   limitButtons.forEach((button) => {
    if (button.value === urlParams.get("limit")) {
      button.classList.add("active"); // Lägg till "active" class för den valda knappen
    } else {
      button.classList.remove("active");
    }
  }); */
});
