
const button = document.getElementsByTagName("button")[0];
const bookView = document.getElementsByClassName("book-view")[0];
const titleField = document.getElementsByName("title")[0];
const authorField = document.getElementsByName("author")[0];
const pagesField = document.getElementsByName("pages")[0];
const readOptions = document.getElementsByClassName("read-options")[0];
const parser = new DOMParser();
let myLibrary = [];

function Book(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}

Book.prototype.info = function () {
    let readMsg = "not read yet";
    if (this.isRead) readMsg = "read";
    return `${this.title}, ${this.author}, ${this.pages} pages, ${readMsg}`;
}

function getBook() {
    let bookCard = document.createElement("DIV");
    const title = titleField.value;
    const author = authorField.value;
    const pages = pagesField.value;
    // check if fields empty
    if (!title || !author || !pages) {
        alert("One or more fields not provided.")
        return null;
    }
    const isRead = readOptions.querySelector("input[name=isRead]:checked").value;
    bookCard.className = "book-card";
    bookCard.read = isRead;
    // get string
    let string = `<div class="text"><b>${title.toUpperCase()}</b><br/>BY ${author.toUpperCase()}<br/>${pages} PAGES</div>`;
    bookCard.innerHTML = string;
    return bookCard;
}

button.addEventListener("click", () => {
    let bookCard = getBook();
    if (bookCard) {
        bookView.appendChild(bookCard);
    }
});