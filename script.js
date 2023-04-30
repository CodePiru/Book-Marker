const tableBody = document.querySelector('tbody');
const booksArr = [];

function Book(title, author, pages, read) {
  // Time stamp, will alse serve as the book ID
  this.added = Date.now();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.getFormattedDate = function formatDate() {
  const date = new Date(this.added);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

Book.prototype.getReadStatusSymbol = function formatReadStatus() {
  return this.read ? '☑' : '☒';
};

function addBookToLibrary(title, author, pages, read = false) {
  booksArr.push(new Book(title, author, pages, read));
}

// Hard coded books
addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 295);
addBookToLibrary('Harry Potter and the Philosopher\'s Stone', 'J.K. Rowling', 223, true);
// To avoid repeating the same ID
booksArr[1].added++;

booksArr.forEach((book) => {
  const tableRow = document.createElement('tr');
  tableRow.dataset.id = book.added;

  function addCell(data) {
    const cell = document.createElement('td');
    cell.textContent = data;
    tableRow.appendChild(cell);
  }

  addCell(book.getFormattedDate());
  addCell(book.title);
  addCell(book.author);
  addCell(book.pages);
  addCell(book.getReadStatusSymbol());
  tableBody.appendChild(tableRow);
});
