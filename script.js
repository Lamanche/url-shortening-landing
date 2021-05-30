const inputBtn = document.querySelector("#input-btn");

inputBtn.addEventListener("click", generateHTML);

function generateHTML() {
  const url = DOMstuff.getInput();
  const validated = DOMstuff.validateInput(url);

  const fetchData = function (url) {
    fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok === true) {
          console.log(data.result.full_short_link2);
          DOMstuff.clearInput();
        } else {
          DOMstuff.createErrorMessage(data.error);
        }
      });
  };

  validated === true ? fetchData(url) : null;
}

const DOMstuff = (function () {
  const getInput = function () {
    return document.querySelector("#input").value;
  };

  const validateInput = function (data) {
    const input = document.querySelector("#input");
    input.addEventListener("focus", clearError);

    if (data === "") {
      createErrorMessage("Please add a link");
    } else {
      return true;
    }
  };

  const clearInput = function () {
    document.querySelector("#input").value = "";
  };

  const createErrorMessage = function (message) {
    const input = document.querySelector("#input");
    input.style.border = "3px solid red";
    const parent = document.querySelector(".search");
    const element = document.createElement("p");
    element.setAttribute("id", "error");
    element.innerText = message;
    element.style.color = "red";
    parent.appendChild(element);
  };

  function clearError() {
    const input = document.querySelector("#input");
    const error = document.getElementById("error");
    error.remove();
    input.style.border = "none";
  }

  return { getInput, validateInput, clearInput, createErrorMessage };
})();
