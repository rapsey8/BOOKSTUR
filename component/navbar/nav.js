function updateNav() {
  const nav = document.querySelector("nav");

  /* Pages that always show the solid scrolled navbar —
     add any new pages here following the same pattern  */
  const alwaysScrolled =
    window.location.pathname.includes("profile.php") ||
    window.location.pathname.includes("cart.php");

  if (window.scrollY > 50 || alwaysScrolled) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateNav);
window.addEventListener("DOMContentLoaded", updateNav);