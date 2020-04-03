
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

Book.prototype.getElement = function () {
    let bookCard = document.createElement("DIV");
    bookCard.className = "book-card";
    bookCard.read = this.isRead;
    let string = `<div class="text">
                    <b>${this.title.toUpperCase()}</b>
                    <br/>BY ${this.author.toUpperCase()}
                    <br/>${this.pages} PAGES
                  </div>`;
    bookCard.innerHTML = string;
    return bookCard;
}

function getBook() {
    const title = titleField.value;
    const author = authorField.value;
    const pages = pagesField.value;
    const isRead = readOptions.querySelector("input[name=isRead]:checked").value;
    if (!title || !author || !pages) {
        alert("One or more fields not provided.")
        return null;
    }
    return new Book(title, author, pages, isRead);
}

button.addEventListener("click", () => {
    let book = getBook();
    if (book) {
        // TODO: check if read or not, add to appropriate element
        bookView.appendChild(book.getElement());
    }
});