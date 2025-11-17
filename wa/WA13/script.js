const newBookBtn = document.querySelector("#js-new-book-button");
const addFavBtn = document.querySelector("#js-add-favorite-button");
const viewFavBtn = document.querySelector("#js-view-favorites-button");
const clearFavBtn = document.querySelector("#js-clear-favorites-button");

const bookText = document.querySelector("#js-book-text");
const favoritesList = document.querySelector("#js-favorites-list");

let currentBook = {
  title: "",
  author: "",
  year: "",
  cover: ""
};

const endpoint = "https://www.googleapis.com/books/v1/volumes?q=subject:fantasy+romance&maxResults=40";

newBookBtn.addEventListener("click", fetchNewBook);
addFavBtn.addEventListener("click", addFavoriteBook);
viewFavBtn.addEventListener("click", viewFavoriteBooks);
clearFavBtn.addEventListener("click", clearFavoriteBooks);

async function fetchNewBook() {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(response.statusText);

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      bookText.textContent = "No books found. Try again!";
      return;
    }

    const randomBook = data.items[Math.floor(Math.random() * data.items.length)];
    const info = randomBook.volumeInfo;

    currentBook.title = info.title || "Unknown Title";
    currentBook.author = info.authors ? info.authors.join(", ") : "Unknown Author";
    currentBook.year = info.publishedDate ? info.publishedDate.slice(0, 4) : "Unknown Year";
    currentBook.cover = info.imageLinks ? info.imageLinks.thumbnail : "";

    displayCurrentBook();
  } catch (err) {
    console.error(err);
    bookText.textContent = "Failed to fetch book data.";
  }
}

function displayCurrentBook() {
  const coverHTML = currentBook.cover
    ? `<img src="${currentBook.cover}" alt="Cover of ${currentBook.title}" style="max-width:120px; display:block; margin:0 auto 10px;">`
    : "";

  bookText.innerHTML = `
    ${coverHTML}
    <strong>"${currentBook.title}"</strong><br>
    by ${currentBook.author} (${currentBook.year})
  `;
}

function addFavoriteBook() {
  if (!currentBook.title) {
    alert("No book to add!");
    return;
  }

  let favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
  favorites.push({ ...currentBook });
  localStorage.setItem("favoriteBooks", JSON.stringify(favorites));
  alert(`Added "${currentBook.title}" to favorites!`);
}

function viewFavoriteBooks() {
  const favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
  favoritesList.innerHTML = "";

  if (favorites.length === 0) {
    favoritesList.innerHTML = "<li>No favorite books added yet.</li>";
    return;
  }

  favorites.forEach(book => {
    const li = document.createElement("li");
    const coverHTML = book.cover ? `<img src="${book.cover}" alt="Cover of ${book.title}" style="width:50px; margin-right:10px;">` : "";
    li.innerHTML = `${coverHTML} <strong>"${book.title}"</strong> by ${book.author} (${book.year})`;
    favoritesList.appendChild(li);
  });
}

function clearFavoriteBooks() {
  localStorage.removeItem("favoriteBooks");
  favoritesList.innerHTML = "";
  alert("Cleared all favorites!");
}

bookText.textContent = "Click 'Get New Book' to fetch a random fantasy romance book.";
