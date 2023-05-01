const tableBody = document.querySelector('tbody');
const showFormBtn = document.querySelector('#show-form');
const form = document.querySelector('form');
const inputTitle = document.querySelector('#title');
const inputAuthor = document.querySelector('#author');
const inputPages = document.querySelector('#pages');
const inputRead = document.querySelector('#read');
const inputs = document.querySelectorAll('input');
const closeBtn = document.querySelector('#close');
const tableHeaders = document.querySelectorAll('th');
const showButtons = document.querySelectorAll('#filter-buttons > button');
const booksArr = JSON.parse(localStorage.getItem('books')) || [];
const options = JSON.parse(localStorage.getItem('options')) || {
  show: 'all',
  category: 'added',
  ascendant: false,
};

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

/* I know that I shouldn't use setPrototypeOf with created
objects, but this is the first time I use localStorage and
the JSON object, and didn't know how else to link them,
since the values on localStorage must be strings. */

if (!(booksArr[0] instanceof Book)) {
  booksArr.forEach((book) => {
    Object.setPrototypeOf(book, Book.prototype);
  });
}

function addBookToLibrary(title, author, pages, read = false) {
  booksArr.push(new Book(title, author, pages, read));
}

// Mark the active ordering on th HTML
function activeOrder() {
  showButtons.forEach((btn) => {
    if (btn.textContent.toLowerCase() === options.show) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  tableHeaders.forEach((header) => {
    if (header.textContent.toLowerCase() === options.category) {
      header.classList.remove(...header.classList);
      header.classList.add(options.ascendant ? 'asc' : 'des');
    } else {
      header.classList.remove('asc', 'des');
    }
  });
}

function sortBooks() {
  activeOrder();
  let filteredBooksArr = [...booksArr];
  if (options.show !== 'all') {
    filteredBooksArr = booksArr.filter((book) => (options.show === 'read' ? book.read : !book.read));
  }
  return filteredBooksArr.sort((a, b) => {
    if (a[options.category] > b[options.category]) {
      return options.ascendant ? 1 : -1;
    }
    return options.ascendant ? -1 : 1;
  });
}

function renderizeBooks() {
  tableBody.innerHTML = '';
  const sortedBooksArr = sortBooks();
  sortedBooksArr.forEach((book) => {
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
  const stringifiedArr = JSON.stringify(booksArr);
  const stringifiedOpts = JSON.stringify(options);
  localStorage.setItem('books', stringifiedArr);
  localStorage.setItem('options', stringifiedOpts);
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

closeBtn.addEventListener('click', () => {
  form.style.display = 'none';
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

tableHeaders.forEach((header, idx) => {
  if (idx <= 3) {
    header.addEventListener('click', (e) => {
      options.category = e.target.textContent.toLowerCase();
      options.ascendant = !e.ctrlKey;
      renderizeBooks();
    });
  }
});

showButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    options.show = e.target.textContent.toLowerCase();
    renderizeBooks();
  });
});

// Hard coded books
if (!booksArr.length) {
  addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 295);
  addBookToLibrary('Harry Potter and the Philosopher\'s Stone', 'J.K. Rowling', 223, true);
  // To avoid repeating the same ID
  booksArr[1].added += 1;
}
renderizeBooks();
