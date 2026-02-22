let itemsPerPage = 8;
let currentPage = 1;
let allProducts = [];
let filteredProducts = [];

let URL = "https://dummyjson.com/products";

let searchInput = document.getElementById("search");
let searchBtn = document.getElementById("btn");
let mainCard = document.getElementById("product-cards");
let pageText = document.getElementById("page");
let prevBtn = document.getElementById("prev");
let nextBtn = document.getElementById("next");
let historyList = document.getElementById("historyList");
let clearHistoryBtn = document.getElementById("clearHistory");

function showSearchHistory() {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    historyList.innerHTML = "";

    history.forEach((item) => {
        let li = document.createElement("li");
        li.innerText = item;
        li.style.cursor = "pointer";

        li.addEventListener("click", () => {
            searchInput.value = item;
            performSearch(item);
        });

        historyList.appendChild(li);
    });
}

//new file

function saveSearchHistory(query) {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    if (!history.includes(query)) {
        history.push(query);
        localStorage.setItem("searchHistory", JSON.stringify(history));
    }
}

function performSearch(query) {
    filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase())
    );

    currentPage = 1;
    showProducts();
}

function showProducts() {
    mainCard.innerHTML = "";

    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;

    let pageData = filteredProducts.slice(start, end);

    pageData.forEach((product) => {
        let card = document.createElement("div");
        card.className = "product-card";

        let title = document.createElement("h3");
        title.innerText = product.title;

        let img = document.createElement("img");
        img.src = product.thumbnail;

        let description = document.createElement("p");
        description.innerText = product.description;

        card.append(title, img, description);
        mainCard.appendChild(card);
    });

    pageText.innerText = `Page ${currentPage}`;

    if (currentPage === 1 && searchInput.value !== "") {
        prevBtn.innerText = "Back";
    } else {
        prevBtn.innerText = "Prev";
    }
}
async function getData() {
    try {
        let res = await fetch(URL);
        let data = await res.json();

        allProducts = data.products;
        filteredProducts = allProducts;
        showProducts();
    } catch (error) {
        console.log("Error fetching data", error);
    }
}
searchBtn.addEventListener("click", () => {
    let searchValue = searchInput.value.trim();
    if (searchValue === "") return;
    saveSearchHistory(searchValue);
    performSearch(searchValue);
    showSearchHistory();
});
searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

nextBtn.addEventListener("click", () => {
    let totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        showProducts();
    }
});

prevBtn.addEventListener("click", () => {
    if (currentPage === 1 && searchInput.value !== "") {
        searchInput.value = "";
        filteredProducts = allProducts;
        showProducts();
        return;
    }
    if (currentPage > 1) {
        currentPage--;
        showProducts();
    }
});
clearHistoryBtn.addEventListener("click", () => {
    localStorage.removeItem("searchHistory");
    historyList.innerHTML = "";
});
showSearchHistory();
getData();
