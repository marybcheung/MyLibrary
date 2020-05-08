
const button = document.getElementsByTagName("button")[0];
// const bookView = document.getElementsByClassName("book-view")[0]; //fix
const titleField = document.getElementsByName("title")[0];
const authorField = document.getElementsByName("author")[0];
const pagesField = document.getElementsByName("pages")[0];
const readOptions = document.getElementsByClassName("read-options")[0];
const tabs = document.getElementsByClassName("tab");
const bookViews = document.getElementsByClassName("book-view");
const parser = new DOMParser();
const readBookView = document.getElementById("tab-read");
const unreadBookView = document.getElementById("tab-unread");
let myLibrary = [];

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
  this.element = this.constructElement();
}

Book.prototype.constructElement = function () {
  // TODO: refactor lol
  let bookCard = document.createElement("DIV");
  bookCard.className = "book-card";
  bookCard.setAttribute("read", this.isRead);
  let string = `<div class="text">
                    <b>${this.title.toUpperCase()}</b>
                    <br/>BY ${this.author.toUpperCase()}
                    <br/>${this.pages} PAGES
                  </div>`;
  bookCard.innerHTML = string;
  bookCard.book = this;
  let deleteButton = document.createElement("IMG");
  deleteButton.className = "delete";
  deleteButton.src = "./deleteBtn.png"
  deleteButton.title = "delete book"
  let readButton = document.createElement("IMG");
  readButton.className = "readBtn";
  readButton.src = "./empty-books.png";
  readButton.title = "change read status"
  bookCard.prepend(deleteButton);
  bookCard.appendChild(readButton);
  bindDeleteEvent(deleteButton, bookCard);
  bindToggleEvent(readButton, bookCard);
  return bookCard;
}

function deleteBookCard(bookCard) {
  if (bookCard.book.isRead) { //switch on type
    readBookView.removeChild(bookCard);
  } else {
    unreadBookView.removeChild(bookCard);
  }
}

function bindDeleteEvent(button, bookCard) {
  button.addEventListener("click", () => {
    let idx = myLibrary.indexOf(bookCard.book);
    myLibrary.splice(idx, 1);
    deleteBookCard(bookCard);
  });
}

function addBookCard(bookCard) {
  if (bookCard.book.isRead) { //switch on type
    readBookView.appendChild(bookCard);
  } else {
    unreadBookView.appendChild(bookCard);
  }
}

function bindToggleEvent(button, bookCard) {
  button.addEventListener("click", () => {
    deleteBookCard(bookCard);
    bookCard.book.isRead = !bookCard.book.isRead;
    bookCard.setAttribute("read", bookCard.book.isRead);
    addBookCard(bookCard);
  })
}

function getBook() {
  const title = titleField.value;
  const author = authorField.value;
  const pages = pagesField.value;
  const isRead = readOptions.querySelector("input[name=isRead]:checked").value === "true";
  if (!title || !author || !pages) {
    alert("One or more fields not provided.")
    return null;
  }
  return new Book(title, author, pages, isRead);
}

function addBookToLibrary() {
  let book = getBook();
  if (book) {
    if (book.isRead) {
      readBookView.appendChild(book.element);
    } else {
      unreadBookView.appendChild(book.element);
    }
    myLibrary.push(book);
  }
}

function toggleTabsAndBookViews() {
  for (let tab of tabs) {
    if (tab.className.includes("active")) {
      tab.className = "tab";
    } else {
      tab.className = "tab active";
    }
  }
  for (let bookView of bookViews) {
    if (bookView.className.includes("active")) {
      bookView.className = "book-view";
    } else {
      bookView.className = "book-view active";
    }
  }
}

button.addEventListener("click", addBookToLibrary);

for (let tab of tabs) {
  tab.addEventListener("click", () => {
    if (!tab.className.includes("active")) {
     toggleTabsAndBookViews();
    }
  });
}

