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

function addBookToLibrary() {
    
}

let book = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);
console.log("\n" + book.info() + "\n");