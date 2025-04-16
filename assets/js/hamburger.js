document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger-menu");
  const menu = document.querySelector(".navbar-menu");
  const icons = document.querySelector(".icon-social");

  hamburger.addEventListener("click", function (e) {
    e.preventDefault();

    // Toggle class untuk animasi atau responsif
    menu.classList.toggle("show-menu");
    icons.classList.toggle("show-menu");
  });
});
