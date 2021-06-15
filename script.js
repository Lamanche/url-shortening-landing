const DOMstuff = (function () {
  const getInput = function () {
    return document.querySelector("#input").value;
  };

  const validateInput = function (data) {
    const input = document.querySelector("#input");
    input.addEventListener("focus", _clearError);
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
    _checkIfErrorExists();
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

  function _clearError() {
    const input = document.querySelector("#input");
    const error = document.getElementById("error");
    error.remove();
    input.style.border = "none";
  }

  function _checkIfErrorExists() {
    const error = document.getElementById("error");
    error && _clearError();
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
                        <button onclick="DOMstuff.copyToClipboard(this)" class="btn copy-btn">Copy</button>
                      `;

    return container;
  };

  const loadingResult = function () {
    const inputBtn = document.querySelector("#input-btn");
    inputBtn.innerHTML = `
      <div class="loading"></div>
    `;
  };

  const finishedLoading = function () {
    const inputBtn = document.querySelector("#input-btn");
    inputBtn.innerText = "Shorten it!";
  };

  const copyToClipboard = function (el) {
    const result = el.parentNode.querySelector(".result-data__right").innerText;
    const temp = document.createElement("textarea");
    temp.value = result;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("Copy");
    document.body.removeChild(temp);
    _copied(el);
  };

  const _copied = function (el) {
    el.innerText = "Copied!";
    el.style.backgroundColor = "var(--primary-dark-violet)";
  };

  return {
    getInput,
    validateInput,
    clearInput,
    createErrorMessage,
    createResult,
    loadingResult,
    finishedLoading,
    copyToClipboard,
  };
})();

function generateHTML() {
  const url = DOMstuff.getInput();
  const validated = DOMstuff.validateInput(url);

  const fetchData = function (url) {
    DOMstuff.loadingResult();
    fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok === true) {
          const resultContainer = document.querySelector(".results-wrapper");
          const result = DOMstuff.createResult(
            url,
            data.result.full_short_link2
          );
          resultContainer.appendChild(result);
          DOMstuff.clearInput();
          DOMstuff.finishedLoading();
          storage.saveData(url, data.result.full_short_link2);
        } else {
          DOMstuff.createErrorMessage(data.error);
          DOMstuff.finishedLoading();
        }
      });
  };

  validated === true ? fetchData(url) : null;
}

const storage = (function () {
  const saveData = function (initial, result) {
    const link = {
      initial: initial,
      result: result,
    };
    let data = JSON.parse(localStorage.getItem("links"));
    if (!data) data = [];
    data.push(link);
    localStorage.setItem("links", JSON.stringify(data));
  };

  const loadData = function () {
    const data = JSON.parse(localStorage.getItem("links"));
    if (data) {
      data.map((link) => {
        const resultContainer = document.querySelector(".results-wrapper");
        const result = DOMstuff.createResult(link.initial, link.result);
        resultContainer.appendChild(result);
      });
    }
  };
  
  return { saveData, loadData };
})();

(function initialize() {
  const inputBtn = document.querySelector("#input-btn");
  inputBtn.addEventListener("click", generateHTML);
  storage.loadData();
})();
