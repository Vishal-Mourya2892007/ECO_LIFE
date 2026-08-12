document.addEventListener('DOMContentLoaded', () => {
    const sidebarContainer = document.getElementById('sidebar-container');

    // 1. Fetch Sidebar HTML
    if (sidebarContainer) {
        fetch('sidebar.html')
            .then(res => {
                if (!res.ok) throw new Error("Sidebar file not loaded!");
                return res.text();
            })
            .then(html => {
                sidebarContainer.innerHTML = html;
                setActiveTab();
            })
            .catch(err => {
                console.error("Error:", err);
            });
    }

    // 2. Click Handler for Menu Toggle & Outside Click
    document.addEventListener('click', (e) => {
        const menuBtn = e.target.closest('#menu-btn, .menu-btn');
        const sidebar = document.getElementById('sidebar');

        // Menu button clicked
        if (menuBtn) {
            e.stopPropagation();
            if (sidebar) {
                sidebar.classList.toggle('open');
            } else {
                console.warn("#sidebar element DOM Not Found!");
            }
            return;
        }

        // Clicked outside sidebar -> Close it
        if (sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });

    // 3. Active Link Highlight Logic
    function setActiveTab() {
        let currentPage = window.location.pathname.split('/').pop().toLowerCase();
        if (!currentPage || currentPage === '') currentPage = 'index.html';

        const links = document.querySelectorAll('#sidebar li');

        links.forEach(li => {
            const attr = li.getAttribute('onclick');
            if (attr && attr.toLowerCase().includes(currentPage)) {
                li.classList.add('active');
            }
        });
    }
});