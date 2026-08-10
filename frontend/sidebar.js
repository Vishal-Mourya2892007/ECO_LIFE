document.addEventListener('DOMContentLoaded', () => {
    const sidebarContainer = document.getElementById('sidebar-container');

    if (sidebarContainer) {
        fetch('sidebar.html')
            .then(res => res.text())
            .then(html => {
                sidebarContainer.innerHTML = html;
                setActiveTab();
            })
            .catch(err => console.error(err));
    }

    document.addEventListener('click', (e) => {
        const menuBtn = e.target.closest('.menu-btn');
        const sidebar = document.getElementById('sidebar');

        if (menuBtn && sidebar) {
            sidebar.classList.toggle('open');
            return;
        }

        if (sidebar && sidebar.classList.contains('open') && !sidebar.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    function setActiveTab() {
        const currentPage = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
        const links = document.querySelectorAll('#sidebar li');

        links.forEach(li => {
            const attr = li.getAttribute('onclick');
            if (attr && attr.toLowerCase().includes(currentPage)) {
                li.classList.add('active');
            }
        });
    }
});