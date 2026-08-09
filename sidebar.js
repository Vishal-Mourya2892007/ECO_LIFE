document.addEventListener("DOMContentLoaded", () => {
fetch("sidebar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("sidebar").innerHTML = data;
        const sidebar = document.querySelector(".sidebar");
        const menuBtn = document.getElementById("menu-toggle");
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.toggle("open");
        });
        document.addEventListener("click", (e) => {
            if (
                !sidebar.contains(e.target)
                &&
                !menuBtn.contains(e.target)
            ) {
                sidebar.classList.remove("open");
            }
        });
    });
});