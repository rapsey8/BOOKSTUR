/* ══════════════════════════════════════════════
   transaction.js — BOOKSTUR Transaction History
══════════════════════════════════════════════ */

/* ── Helpers ── */
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function getBadgeClass(status) {
    const s = (status || '').toLowerCase();
    if (s === 'completed')  return 'tx-badge-completed';
    if (s === 'processing') return 'tx-badge-processing';
    if (s === 'cancelled')  return 'tx-badge-cancelled';
    return 'tx-badge-pending';
}

/* ── Stat counters ── */
function recalcStats() {
    const rows = document.querySelectorAll('#historyTable tr');
    let total = 0, revenue = 0, completed = 0, pending = 0;

    rows.forEach(row => {
        const status   = (row.dataset.status || '').toLowerCase();
        const rawTotal = (row.dataset.total  || '').replace(/[₱\u20B1,]/g, '');
        const amount   = parseFloat(rawTotal) || 0;

        total++;
        revenue   += amount;
        if (status === 'completed')     completed++;
        if (status.includes('pending')) pending++;
    });

    const fmt = n => '&#8369;' + n.toLocaleString('en-PH', { minimumFractionDigits: 0 });

    document.getElementById('stat-total').textContent     = total;
    document.getElementById('stat-revenue').innerHTML     = fmt(revenue);
    document.getElementById('stat-completed').textContent = completed;
    document.getElementById('stat-pending').textContent   = pending;
}

/* ── Build mobile cards from table rows ── */
function buildMobileCards() {
    const container = document.getElementById('mobileCards');
    if (!container) return;

    const rows = document.querySelectorAll('#historyTable tr');
    container.innerHTML = '';

    rows.forEach(row => {
        const order  = row.dataset.order  || '—';
        const items  = row.dataset.items  || '—';
        const method = row.dataset.method || '—';
        const total  = row.dataset.total  || '—';
        const status = row.dataset.status || '—';
        const date   = row.dataset.date   || row.querySelector('.tx-order-date')?.innerText || '—';
        const badgeCls = getBadgeClass(status);

        const card = document.createElement('div');
        card.className = 'tx-card-item';
        card.dataset.status = status;
        card.dataset.date   = date;
        card.dataset.search = (order + ' ' + items).toLowerCase();

        card.innerHTML = `
            <div class="tx-card-top">
                <div>
                    <span class="tx-order-id">${escHtml(order)}</span>
                    <div class="tx-card-meta">${escHtml(date)} &bull; ${escHtml(method)}</div>
                </div>
                <span class="tx-badge ${badgeCls}">
                    <span class="tx-badge-dot"></span>${escHtml(status)}
                </span>
            </div>
            <div style="font-size:13.5px; color:#374151; font-weight:600; margin-bottom:10px;">
                ${escHtml(items)}
            </div>
            <div class="tx-card-body">
                <span class="tx-card-total">${escHtml(total)}</span>
                <button class="tx-btn-view" onclick="openDetailFromCard(this)" title="View Details"
                    data-order="${escHtml(order)}"
                    data-items="${escHtml(items)}"
                    data-method="${escHtml(method)}"
                    data-total="${escHtml(total)}"
                    data-status="${escHtml(status)}"
                    data-date="${escHtml(date)}"
                    data-notes="${escHtml(row.dataset.notes || '')}">
                    <span class="material-icons-outlined">visibility</span>
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

/* ── Filter (table + mobile cards) ── */
function filterOrders() {
    const search = document.getElementById('txSearch').value.toLowerCase();
    const month  = document.getElementById('monthFilter').value;
    const year   = document.getElementById('yearFilter').value;
    const status = document.getElementById('statusFilter').value.toLowerCase();

    /* Desktop table rows */
    const rows = document.querySelectorAll('#historyTable tr');
    let visible = 0;

    rows.forEach(row => {
        const text   = row.innerText.toLowerCase();
        const date   = row.querySelector('.tx-order-date')?.innerText || row.dataset.date || '';
        const rowSt  = (row.dataset.status || '').toLowerCase();

        const ok =
            text.includes(search) &&
            (month  === '' || date.includes(month))  &&
            (year   === '' || date.includes(year))   &&
            (status === '' || rowSt.includes(status));

        row.style.display = ok ? '' : 'none';
        if (ok) visible++;
    });

    /* Mobile cards */
    const cards = document.querySelectorAll('.tx-card-item');
    let mobileVisible = 0;

    cards.forEach(card => {
        const searchText = card.dataset.search || '';
        const date       = card.dataset.date   || '';
        const cardSt     = (card.dataset.status || '').toLowerCase();

        const ok =
            searchText.includes(search) &&
            (month  === '' || date.includes(month))  &&
            (year   === '' || date.includes(year))   &&
            (status === '' || cardSt.includes(status));

        card.style.display = ok ? '' : 'none';
        if (ok) mobileVisible++;
    });

    /* Empty state */
    const emptyEl   = document.getElementById('no-history');
    const tableWrap = document.getElementById('txTableWrap');
    const isMobile  = window.innerWidth <= 600;
    const anyVisible = isMobile ? mobileVisible > 0 : visible > 0;

    if (!anyVisible) {
        emptyEl && emptyEl.classList.remove('hidden');
        if (!isMobile && tableWrap) tableWrap.querySelector('.tx-table').style.display = 'none';
    } else {
        emptyEl && emptyEl.classList.add('hidden');
        if (!isMobile && tableWrap) tableWrap.querySelector('.tx-table').style.display = '';
    }
}

/* ── Open detail modal from TABLE row ── */
function openDetail(btn) {
    const row = btn.closest('tr');

    document.getElementById('m-order-id').textContent         = row.dataset.order  || '—';
    document.getElementById('modal-order-id-sub').textContent = row.dataset.order  || '';
    document.getElementById('m-date').textContent   =
        row.dataset.date || row.querySelector('.tx-order-date')?.innerText || '—';
    document.getElementById('m-items').textContent  = row.dataset.items  || '—';
    document.getElementById('m-method').textContent = row.dataset.method || '—';
    document.getElementById('m-total').textContent  = row.dataset.total  || '—';
    document.getElementById('m-notes').textContent  = row.dataset.notes  || '—';

    const statusText = row.dataset.status || '';
    document.getElementById('m-status').innerHTML =
        `<span class="tx-badge ${getBadgeClass(statusText)}">
            <span class="tx-badge-dot"></span>${escHtml(statusText)}
         </span>`;

    showModal();
}

/* ── Open detail modal from MOBILE CARD button ── */
function openDetailFromCard(btn) {
    document.getElementById('m-order-id').textContent         = btn.dataset.order  || '—';
    document.getElementById('modal-order-id-sub').textContent = btn.dataset.order  || '';
    document.getElementById('m-date').textContent   = btn.dataset.date   || '—';
    document.getElementById('m-items').textContent  = btn.dataset.items  || '—';
    document.getElementById('m-method').textContent = btn.dataset.method || '—';
    document.getElementById('m-total').textContent  = btn.dataset.total  || '—';
    document.getElementById('m-notes').textContent  = btn.dataset.notes  || '—';

    const statusText = btn.dataset.status || '';
    document.getElementById('m-status').innerHTML =
        `<span class="tx-badge ${getBadgeClass(statusText)}">
            <span class="tx-badge-dot"></span>${escHtml(statusText)}
         </span>`;

    showModal();
}

function showModal() {
    const modal = document.getElementById('detailModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeDetail() {
    document.getElementById('detailModal').style.display = 'none';
    document.body.style.overflow = '';
}

/* Close on backdrop click */
document.getElementById('detailModal').addEventListener('click', function (e) {
    if (e.target === this) closeDetail();
});

/* Close on Escape */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDetail();
});

/* ── Navbar scroll — mirrors nav.js exactly ── */
function updateNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
    recalcStats();
    buildMobileCards();

    window.addEventListener('scroll', updateNav);
    updateNav();
});