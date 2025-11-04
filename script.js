// ===== Librarian Data =====
const librarians = [
  { username: "Roshan", password: "1234" },
  { username: "Nikhil", password: "2345" },
  { username: "Pavan", password: "3456" },
  { username: "Punith", password: "4567" }
];

// ===== CAPTCHA =====
function generateCaptcha() {
  return Math.floor(1000 + Math.random() * 9000);
}

let currentCaptcha = generateCaptcha();
document.addEventListener("DOMContentLoaded", () => {
  const captchaText = document.getElementById("captchaText");
  if (captchaText) captchaText.textContent = currentCaptcha;
});

// ===== LOGIN =====
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const captchaInput = document.getElementById("captchaInput").value.trim();

  if (!username || !password || !captchaInput) {
    alert("Please fill all fields.");
    return;
  }

  if (parseInt(captchaInput) !== currentCaptcha) {
    alert("Invalid CAPTCHA. Please try again.");
    currentCaptcha = generateCaptcha();
    document.getElementById("captchaText").textContent = currentCaptcha;
    return;
  }

  const librarian = librarians.find(
    (lib) => lib.username === username && lib.password === password
  );

  if (librarian) {
    localStorage.setItem("loggedInUser", librarian.username);
    window.location.href = "dashboard.html";
  } else {
    alert("Incorrect username or password.");
  }
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// ===== DASHBOARD INIT =====
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("loggedInUser");
  const nameSpan = document.getElementById("librarianName");
  if (nameSpan) nameSpan.textContent = user ? `Welcome, ${user}` : "Welcome, Librarian";

  setupTabs();
  loadIssuedBooks();
  loadReturnedBooks();
});

// ===== TABS =====
function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll(".tab-section");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));

      tab.classList.add("active");
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add("active");
    });
  });
}

// ===== BOOK ISSUING =====
function issueBook() {
  const borrower = document.getElementById("borrowerName").value.trim();
  const genre = document.getElementById("genre").value;
  const book = document.getElementById("book").value;
  const issueDate = document.getElementById("issueDate").value;
  const dueDate = document.getElementById("dueDate").value;

  if (!borrower || !genre || !book || !issueDate || !dueDate) {
    alert("Please fill in all fields before issuing a book.");
    return;
  }

  const issuedBooks = JSON.parse(localStorage.getItem("issuedBooks") || "[]");
  issuedBooks.push({
    borrower,
    genre,
    book,
    issueDate,
    dueDate,
    issuedBy: localStorage.getItem("loggedInUser"),
  });
  localStorage.setItem("issuedBooks", JSON.stringify(issuedBooks));
  alert("Book issued successfully!");
  loadIssuedBooks();
}

// ===== VIEW ISSUED BOOKS =====
function loadIssuedBooks() {
  const issuedBooks = JSON.parse(localStorage.getItem("issuedBooks") || "[]");
  const tbody = document.getElementById("issuedBooksTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  issuedBooks.forEach((b, i) => {
    const row = `
      <tr>
        <td>${i + 1}</td>
        <td>${b.borrower}</td>
        <td>${b.genre}</td>
        <td>${b.book}</td>
        <td>${b.issueDate}</td>
        <td>${b.dueDate}</td>
        <td>${b.issuedBy}</td>
        <td><button onclick="returnBook(${i})">Return</button></td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// ===== RETURN BOOK =====
function returnBook(index) {
  const issuedBooks = JSON.parse(localStorage.getItem("issuedBooks") || "[]");
  const returnedBooks = JSON.parse(localStorage.getItem("returnedBooks") || "[]");

  const returned = issuedBooks.splice(index, 1)[0];
  returned.returnedDate = new Date().toISOString().split("T")[0];

  returnedBooks.push(returned);

  localStorage.setItem("issuedBooks", JSON.stringify(issuedBooks));
  localStorage.setItem("returnedBooks", JSON.stringify(returnedBooks));

  alert("Book marked as returned!");
  loadIssuedBooks();
  loadReturnedBooks();
}

// ===== RETURN HISTORY =====
function loadReturnedBooks() {
  const returnedBooks = JSON.parse(localStorage.getItem("returnedBooks") || "[]");
  const tbody = document.getElementById("returnedBooksTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  returnedBooks.forEach((b, i) => {
    const row = `
      <tr>
        <td>${i + 1}</td>
        <td>${b.borrower}</td>
        <td>${b.genre}</td>
        <td>${b.book}</td>
        <td>${b.issueDate}</td>
        <td>${b.dueDate}</td>
        <td>${b.returnedDate}</td>
        <td>${b.issuedBy}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// ===== SEARCH =====
function searchBooks() {
  const input = document.getElementById("searchBar").value.toLowerCase();
  const rows = document.querySelectorAll("#issuedBooksTable tr");

  rows.forEach((row) => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(input) ? "" : "none";
  });
}
