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
};

const endpoint = "https://openlibrary.org/search.json?subject=fantasy+romance&limit=100";

newBookBtn.addEventListener("click", fetchNewBook);
addFavBtn.addEventListener("click", addFavoriteBook);
viewFavBtn.addEventListener("click", viewFavoriteBooks);
clearFavBtn.addEventListener("click", clearFavoriteBooks);

async function fetchNewBook() {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    console.log(data);
    if (!data.docs || data.docs.length === 0) {
      bookText.textContent = "No books found. Try again!";
      return;
    }

    const randomBook = data.docs[Math.floor(Math.random() * data.docs.length)];
    currentBook.title = randomBook.title || "Unknown Title";
    currentBook.author = randomBook.author_name
      ? randomBook.author_name.join(", ")
      : "Unknown Author";
    currentBook.year = randomBook.first_publish_year || "Unknown Year";

    displayCurrentBook();
  } catch (err) {
    console.error(err);
    bookText.textContent = "Failed to fetch book data.";
  }
}

function displayCurrentBook() {
  bookText.textContent = `"${currentBook.title}" by ${currentBook.author} (${currentBook.year})`;
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

  favorites.forEach((book, index) => {
    const li = document.createElement("li");
    li.textContent = `"${book.title}" by ${book.author} (${book.year})`;
    favoritesList.appendChild(li);
  });
}

function clearFavoriteBooks() {
  localStorage.removeItem("favoriteBooks");
  favoritesList.innerHTML = "";
  alert("Cleared all favorites!");
}

bookText.textContent = "Click 'Get New Book' to fetch a random fantasy romance book.";
