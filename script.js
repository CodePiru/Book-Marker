const tableBody = document.querySelector('tbody');
const showFormBtn = document.querySelector('#show-form');
const form = document.querySelector('form');
const inputTitle = document.querySelector('#title');
const inputAuthor = document.querySelector('#author');
const inputPages = document.querySelector('#pages');
const inputRead = document.querySelector('#read');
const inputs = document.querySelectorAll('input');
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

Book.prototype.changeReadStatus = function changeReadStatus() {
  this.read = !this.read;
};

function addBookToLibrary(title, author, pages, read = false) {
  booksArr.push(new Book(title, author, pages, read));
}

function renderizeBooks() {
  tableBody.innerHTML = '';
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
    const actions = document.createElement('td');
    actions.innerHTML = '<img src="./img/eye.png" title="Change read status" class="change-status"><img src="./img/trash.png" title="Remove Book" class="remove-book">';
    tableRow.appendChild(actions);
    tableBody.appendChild(tableRow);
  });
  addEventListeners();
}

function addEventListeners() {
  const actionButtons = document.querySelectorAll('td:nth-child(6) > img');
  actionButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const bookId = e.target.parentElement.parentElement.dataset.id;
      const bookIndex = booksArr.findIndex((book) => book.added == bookId);
      if (e.target.classList.value === 'change-status') {
        booksArr[bookIndex].changeReadStatus();
      } else if (e.target.classList.value === 'remove-book') {
        booksArr.splice(bookIndex, 1);
      }
      renderizeBooks();
    });
  });
}

showFormBtn.addEventListener('click', () => {
  form.style.display = 'block';
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addBookToLibrary(inputTitle.value, inputAuthor.value, Number(inputPages.value), inputRead.checked);
  renderizeBooks();
  inputs.forEach((input) => {
    input.value = '';
  });
  inputRead.checked = false;
  form.style.display = 'none';
});

// Hard coded books
addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 295);
addBookToLibrary('Harry Potter and the Philosopher\'s Stone', 'J.K. Rowling', 223, true);
// To avoid repeating the same ID
booksArr[1].added += 1;
renderizeBooks();
