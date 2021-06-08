function generateHTML() {
  const url = DOMstuff.getInput();
  const validated = DOMstuff.validateInput(url);

  const fetchData = function (url) {
    fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok === true) {
          const resultContainer = document.querySelector(".results-wrapper");
          const result = DOMstuff.createResult(
            data.result.full_short_link2,
            data.result.full_short_link2
          );
          resultContainer.appendChild(result);
          //console.log(data.result.full_short_link2);
          DOMstuff.clearInput();
        } else {
          DOMstuff.createErrorMessage(data.error);
        }
      });
  };

  validated === true ? fetchData(url) : null;
}

const DOMstuff = (function () {
  const inputBtn = document.querySelector("#input-btn");
  inputBtn.addEventListener("click", generateHTML);

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
    checkIfErrorExists();
    const input = document.querySelector("#input");
    input.style.border = "3px solid red";
    const parent = document.querySelector(".search");
    const element = document.createElement("p");
    element.setAttribute("id", "error");
    element.innerText = message;
    element.style.color = "red";
    element.style.position = "absolute";
    parent.appendChild(element);
  };

  function clearError() {
    const input = document.querySelector("#input");
    const error = document.getElementById("error");
    error.remove();
    input.style.border = "none";
  }

  function checkIfErrorExists() {
    const error = document.getElementById("error");
    error && clearError();
  }

  const createResult = function (initial, result) {
    const container = document.createElement("div");
    container.className = "result";
    container.innerHTML = `
                        <div class="result-data">
                          <div class="result-data__left">
                            ${initial}
                          </div>
                          <div class="result-data__right">
                            ${result}
                          </div>
                        </div>
                        <button class="btn copy-btn">Copy</button>
                      `;

    return container;
  };

  return {
    getInput,
    validateInput,
    clearInput,
    createErrorMessage,
    createResult,
  };
})();
