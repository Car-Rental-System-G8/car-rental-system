const footerContainer = document.getElementById("footer");

fetch("/components/dashboard/footer.html")
  .then(response => response.text())
  .then(html => {
    footerContainer.innerHTML = html;
  })
  .catch(err => {
    console.error("Error loading footer:", err);
  });