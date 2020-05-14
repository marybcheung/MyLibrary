const button = document.getElementsByTagName("button")[0];
const titleField = document.getElementsByName("title")[0];
const authorField = document.getElementsByName("author")[0];
const pagesField = document.getElementsByName("pages")[0];
const readOptions = document.getElementsByClassName("read-options")[0];
const tabs = document.getElementsByClassName("tab");
const bookViews = document.getElementsByClassName("book-view");
const parser = new DOMParser();
const readBookView = document.getElementById("tab-read");
const unreadBookView = document.getElementById("tab-unread");
let myLibrary = {};

firebase.database().ref('/books/').once('value').then(function(snapshot) {
  let allData = snapshot.val();
  for (let key in allData) {
    let data = allData[key];
    let book = new Book(data.title, data.author, data.pages, data.isRead);
    let bookCard = book.constructElement();
    bookCard.key = key;
    book.key = key;
    if (book.isRead) { // switch on type
      readBookView.appendChild(bookCard);
    } else {
      unreadBookView.appendChild(bookCard);
    }
    myLibrary[key] = book;
  }
});

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

function constructDeleteButton() {
  let deleteButton = document.createElement("IMG");
  deleteButton.className = "delete";
  deleteButton.src = "./deleteBtn.png"
  deleteButton.title = "delete book";
  return deleteButton;
}

function constructReadButton() {
  let readButton = document.createElement("IMG");
  readButton.className = "readBtn";
  readButton.src = "./empty-books.png";
  readButton.title = "change read status";
  return readButton;
}

Book.prototype.constructElement = function () {
  let bookCard = document.createElement("DIV");
  bookCard.className = "book-card";
  bookCard.setAttribute("read", this.isRead);
  let string = `<div class="text">
                    <b>${this.title.toUpperCase()}</b>
                    <br/>BY ${this.author.toUpperCase()}
                    <br/>${this.pages} PAGES
                  </div>`;
  bookCard.innerHTML = string;
  let deleteButton = constructDeleteButton();
  let readButton = constructReadButton();
  bookCard.prepend(deleteButton);
  bookCard.appendChild(readButton);
  bindDeleteEvent(deleteButton, bookCard);
  bindToggleEvent(readButton, bookCard);
  return bookCard;
}

function deleteBookCard(bookCard) {
  if (bookCard.getAttribute("read") === "true") { //switch on type
    readBookView.removeChild(bookCard);
  } else {
    unreadBookView.removeChild(bookCard);
  }
}

function deleteBookFromDatabase(key) {
  let bookRef = firebase.database().ref('books/' + key);
  bookRef.remove();
}

function bindDeleteEvent(button, bookCard) {
  button.addEventListener("click", () => {
    delete myLibrary[bookCard.key];
    deleteBookCard(bookCard);
    deleteBookFromDatabase(bookCard.key);
  });
}

function addBookCard(bookCard) {
  let bookView;
  if (bookCard.getAttribute("read") === "true") { //switch on type
    bookView = readBookView;
  } else {
    bookView = unreadBookView;
  }
  bookView.appendChild(bookCard);
  return bookView.className.includes("active");
}

function updateBookOnDatabase(key) {
  let book = myLibrary[key];
  let updates = {};
  updates['/books/' + key] = book;
  firebase.database().ref().update(updates);
}

function bindToggleEvent(button, bookCard) {
  button.addEventListener("click", () => {
    deleteBookCard(bookCard);
    let isRead = myLibrary[bookCard.key].isRead; 
    myLibrary[bookCard.key].isRead = !isRead;
    bookCard.setAttribute("read", !isRead);
    updateBookOnDatabase(bookCard.key);
    addBookCard(bookCard);
    toggleTabsAndBookViews();
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

function postToDatabase(book) {
  let newBookKey = firebase.database().ref().child('books').push().key;
  let updates = {};
  updates['/books/' + newBookKey] = book;
  firebase.database().ref().update(updates);
  return newBookKey;
}


function addBookToLibrary() {
  let book = getBook();
  if (book) {
    let key = postToDatabase(book);
    let bookCard = book.constructElement();
    bookCard.key = key;
    book.key = key;
    if (!addBookCard(bookCard)){
      toggleTabsAndBookViews();
    }
    myLibrary[key] = book;
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

