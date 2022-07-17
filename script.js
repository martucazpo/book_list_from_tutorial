class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  static displayBooks() {
    let books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }
  static addBookToList(book) {
    const list = document.getElementById("book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
    list.append(row);
  }
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }
  static showAlert(message, className){
    const div = document.createElement("div")
    div.className = `alert alert-${className}`
    div.innerText = message
    const container = document.querySelector(".container")
    const form = document.getElementById("book-form")
    container.insertBefore(div, form)
    setTimeout(()=>document.querySelector(".alert").remove(), 2000)
  }
  static clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

class Store{
    static getBooks(){
        let books
        if(!sessionStorage.getItem("books")){
            books = []
        } else {
            books = JSON.parse(sessionStorage.getItem("books"))
        }
        return books
    }
    static addBook(book){
        const books = Store.getBooks()
        books.push(book)
        sessionStorage.setItem("books",JSON.stringify(books))
    }
    static removeBook(isbn){
        const books = Store.getBooks()
        books.forEach((book,index)=>{
            if(book.isbn === isbn){
                books.splice(index,1)
            }
        })
        sessionStorage.setItem("books", JSON.stringify(books))
    }
}

document.addEventListener("DOMContentLoaded", UI.displayBooks());

document.getElementById("book-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    const book = new Book(title, author, isbn);
    UI.addBookToList(book);
    Store.addBook(book)
    UI.showAlert("Book added", "success")
    UI.clearFields();
  }
});

document.getElementById("book-list").addEventListener("click", (e) => {
  UI.deleteBook(e.target); 
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
  UI.showAlert("Book removed", "success")
});
