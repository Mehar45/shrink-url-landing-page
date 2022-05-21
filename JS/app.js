// Hamburger
document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("toggle");
});

// Shortlinks
const form = document.querySelector("form");
const err = document.querySelector(".err");
const shrinkedLinks = document.querySelector(".shortened-links .container");

const setLocalStorage = (key, value) => {
  let data = [];
  if (localStorage.getItem(key)) {
    data = JSON.parse(localStorage.getItem(key));
  }
  data.push(value);
  if (data.length > 3) {
    data.shift();
    data;
  }
  localStorage.setItem(key, JSON.stringify(data));
};

const getLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const appendLinksToTheDOM = () => {
  shrinkedLinks.innerHTML = "";
  if (getLocalStorage("linksList")) {
    const linksObj = getLocalStorage("linksList");
    for (let i = 0; i < linksObj.length; i++) {
      shrinkedLinks.innerHTML += ` <div class="link">
    <span>${linksObj[i].originalLink}</span>
    <div class="copy-link">
      <span>${linksObj[i].shortenedLink}</span>
      <button class="btn">Copy</button>
    </div>
    </div>`;
    }
  }
};

appendLinksToTheDOM();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = form.url.value;
  if (url) {
    err.style.visibility = "hidden";
    form.url.style.outline = "";
    form.shrinkBtn.textContent = "Please wait...";
    fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
      .then((data) => {
        console.log(data);
        return data.json();
      })
      .then((data) => {
        const links = {
          originalLink: url,
          shortenedLink: data.result.short_link,
        };
        form.shrinkBtn.textContent = "Shorten it!";
        setLocalStorage("linksList", links);
        appendLinksToTheDOM();
      })
      .catch((err) => {
        console.log("Promise rejected:", err);
      });
    form.url.value = "";
  } else {
    err.style.visibility = "visible";
    form.url.style.outline = "2px solid var(--red)";
  }
});

shrinkedLinks.addEventListener("click", (e) => {
  if (e.target.matches(".btn")) {
    const link = shrinkedLinks.querySelector(".copy-link span").textContent;
    navigator.clipboard.writeText(link);
    e.target.textContent = "Copied!";
    e.target.classList.add("change-background");
    setTimeout(() => {
      e.target.textContent = "Copy!";
      e.target.classList.remove("change-background");
    }, 1500);
  }
});
