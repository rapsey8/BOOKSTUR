/* ══════════════════════════════════════════════
   Cart.js  — BOOKSTUR Shopping Cart
   Works with localStorage so addToCart() called
   on any product page (library, uniform, apparel,
   other) persists items here.
══════════════════════════════════════════════ */

const CART_KEY = 'bookstur_cart';

/* ── Storage helpers ── */
function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* ══════════════════════════════════════════════
   addToCart()
   Called by the "Add to Cart" buttons on every
   product page:
     onclick="addToCart(id, name, price, image)"
   The product pages only pass what they know;
   image is optional (falls back to placeholder).
══════════════════════════════════════════════ */
function addToCart(productId, productName, price, imagePath) {
    const cart = getCart();
    const existing = cart.find(i => i.id == productId);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id:    productId,
            name:  productName  || 'Product',
            price: parseFloat(price) || 0,
            image: imagePath    || '',
            qty:   1
        });
    }

    saveCart(cart);

    /* Show a quick SweetAlert toast if available, else native alert */
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Added to cart!',
            showConfirmButton: false,
            timer: 1400,
            timerProgressBar: true,
            customClass: { container: 'high-z-index' }
        });
    } else {
        alert((productName || 'Item') + ' added to cart.');
    }

    updateNavCartCount();
}

/* ── Update cart count in the nav link ── */
function updateNavCartCount() {
    const cart  = getCart();
    const total = cart.reduce((s, i) => s + i.qty, 0);
    /* Targets any element with class cart-nav-count */
    document.querySelectorAll('.cart-nav-count').forEach(el => {
        el.textContent = total;
    });
}

/* ════════════════════════════════════════════
   Render cart items from localStorage
════════════════════════════════════════════ */
function renderCart() {
    const cart    = getCart();
    const listEl  = document.getElementById('cartItemsList');
    const emptyEl = document.getElementById('emptyCart');

    if (!listEl) return; // not on cart page

    listEl.innerHTML = '';

    if (cart.length === 0) {
        emptyEl && emptyEl.classList.remove('hidden');
        recalculate();
        return;
    }

    emptyEl && emptyEl.classList.add('hidden');

    cart.forEach(item => {
        const div = document.createElement('div');
        div.className     = 'cart-item';
        div.dataset.id    = item.id;
        div.dataset.price = item.price;

        const imgSrc = item.image
            ? '../../src/uploads/products/' + item.image
            : '../../src/placeholder.jpg';

        div.innerHTML = `
            <div class="cart-item-img">
                <img src="${imgSrc}"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                     alt="${escHtml(item.name)}">
                <span class="material-icons-outlined cart-item-img-placeholder" style="display:none;">inventory_2</span>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${escHtml(item.name)}</div>
                <div class="cart-item-price">&#8369;${item.price.toFixed(2)}</div>
            </div>
            <div class="qty-control">
                <button class="qty-btn" onclick="changeQty(this, -1)" aria-label="Decrease quantity">&#8722;</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(this, 1)" aria-label="Increase quantity">&#43;</button>
            </div>
            <div class="cart-item-subtotal">${formatPHP(item.price * item.qty)}</div>
            <button class="cart-remove-btn" onclick="removeItem(this)" title="Remove item" aria-label="Remove ${escHtml(item.name)}">
                <span class="material-icons-outlined">close</span>
            </button>
        `;

        listEl.appendChild(div);
    });

    recalculate();
}

/* ── Escape HTML to prevent XSS ── */
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/* ── Format currency (Philippine Peso) ── */
function formatPHP(amount) {
    return '&#8369;' + amount.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/* ── Generate order ID ── */
function generateOrderId() {
    return '#SSCR-' + Math.floor(1000 + Math.random() * 9000);
}

/* ════════════════════════════════════════════
   Recalculate totals
════════════════════════════════════════════ */
let promoDiscount = 0;
let promoCode     = '';

function recalculate() {
    const items    = document.querySelectorAll('#cartItemsList .cart-item');
    const emptyEl  = document.getElementById('emptyCart');
    const checkBtn = document.getElementById('checkoutBtn');
    let subtotal   = 0;

    items.forEach(item => {
        const price = parseFloat(item.dataset.price);
        const qty   = parseInt(item.querySelector('.qty-value').textContent);
        const sub   = price * qty;
        const subEl = item.querySelector('.cart-item-subtotal');
        if (subEl) subEl.innerHTML = formatPHP(sub);
        subtotal += sub;
    });

    const discount = promoDiscount > 0 ? Math.round(subtotal * promoDiscount) : 0;
    const total    = subtotal - discount;

    const summaryItemCount = document.getElementById('summaryItemCount');
    const itemCountBadge   = document.getElementById('itemCountBadge');
    const summarySubtotal  = document.getElementById('summarySubtotal');
    const summaryTotal     = document.getElementById('summaryTotal');
    const discRow          = document.getElementById('discountRow');

    if (summaryItemCount) summaryItemCount.textContent        = items.length;
    if (itemCountBadge)   itemCountBadge.textContent          = items.length;
    if (summarySubtotal)  summarySubtotal.innerHTML           = formatPHP(subtotal);
    if (summaryTotal)     summaryTotal.innerHTML              = formatPHP(total);

    if (discRow) {
        if (discount > 0) {
            discRow.style.display = 'flex';
            const discVal   = document.getElementById('discountValue');
            const discBadge = document.getElementById('discountBadge');
            if (discVal)   discVal.innerHTML   = '&#8722;' + formatPHP(discount);
            if (discBadge) discBadge.textContent = promoCode;
        } else {
            discRow.style.display = 'none';
        }
    }

    if (items.length === 0) {
        emptyEl  && emptyEl.classList.remove('hidden');
        if (checkBtn) checkBtn.disabled = true;
    } else {
        emptyEl  && emptyEl.classList.add('hidden');
        if (checkBtn) checkBtn.disabled = false;
    }

    persistQtyChanges();
}

/* ── Persist qty changes back to localStorage ── */
function persistQtyChanges() {
    const cart  = getCart();
    const items = document.querySelectorAll('#cartItemsList .cart-item');

    items.forEach(itemEl => {
        const id    = itemEl.dataset.id;
        const qty   = parseInt(itemEl.querySelector('.qty-value').textContent);
        const entry = cart.find(i => String(i.id) === String(id));
        if (entry) entry.qty = qty;
    });

    saveCart(cart);
}

/* ── Change quantity ── */
function changeQty(btn, delta) {
    const qtyEl = btn.closest('.qty-control').querySelector('.qty-value');
    let qty = parseInt(qtyEl.textContent) + delta;
    if (qty < 1) qty = 1;
    qtyEl.textContent = qty;
    recalculate();
}

/* ── Remove item with animation ── */
function removeItem(btn) {
    const itemEl = btn.closest('.cart-item');
    const id     = itemEl.dataset.id;
    const nameEl = itemEl.querySelector('.cart-item-name');
    const name   = nameEl ? nameEl.textContent : 'Item';

    itemEl.style.transition = 'opacity 0.25s ease, transform 0.25s ease, max-height 0.3s ease';
    itemEl.style.opacity    = '0';
    itemEl.style.transform  = 'translateX(20px)';
    itemEl.style.overflow   = 'hidden';

    setTimeout(() => {
        itemEl.style.maxHeight  = '0';
        itemEl.style.padding    = '0';
        itemEl.style.margin     = '0';
        itemEl.style.border     = '0';
    }, 200);

    setTimeout(() => {
        itemEl.remove();
        const cart = getCart().filter(i => String(i.id) !== String(id));
        saveCart(cart);
        recalculate();
        showToast('"' + name + '" removed from cart');
    }, 380);
}

/* ── Clear entire cart ── */
function clearCart() {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Clear Cart?',
            text: 'All items will be removed from your cart.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc1717',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, clear it',
            cancelButtonText: 'Keep items',
            reverseButtons: true,
            customClass: { container: 'high-z-index' }
        }).then(result => {
            if (result.isConfirmed) {
                document.querySelectorAll('#cartItemsList .cart-item').forEach(el => el.remove());
                saveCart([]);
                recalculate();
                showToast('Cart cleared');
            }
        });
    } else {
        if (!confirm('Clear all items from your cart?')) return;
        document.querySelectorAll('#cartItemsList .cart-item').forEach(el => el.remove());
        saveCart([]);
        recalculate();
        showToast('Cart cleared');
    }
}

/* ── Toast notification ── */
function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    const msgEl = document.getElementById('toastMsg');
    if (msgEl) msgEl.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._toastTimer);
    t._toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ── Payment method selection ── */
function selectPayment(label) {
    document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
    label.classList.add('selected');
}

/* ════════════════════════════════════════════
   PAYMENT PROCESSING OVERLAY
════════════════════════════════════════════ */
function resetPaymentSteps() {
    [
        ['pstep1', 'pstep1dot', '1'],
        ['pstep2', 'pstep2dot', '2'],
        ['pstep3', 'pstep3dot', '3']
    ].forEach(([s, d, n]) => {
        const stepEl = document.getElementById(s);
        const dotEl  = document.getElementById(d);
        if (stepEl) stepEl.className = 'payment-step';
        if (dotEl)  dotEl.textContent = n;
    });

    const titleEl   = document.getElementById('paymentTitle');
    const subEl     = document.getElementById('paymentSub');
    const spinEl    = document.getElementById('paymentSpinner');
    const wrapEl    = document.getElementById('paymentSpinnerWrap');

    if (titleEl) titleEl.textContent = 'Processing Payment';
    if (subEl)   subEl.textContent   = 'Please wait, do not close this window...';
    if (spinEl)  spinEl.className    = 'payment-spinner';
    if (wrapEl)  wrapEl.className    = 'payment-spinner-wrap';
}

function setStep(stepId, dotId, state) {
    const el  = document.getElementById(stepId);
    const dot = document.getElementById(dotId);
    if (el)  el.className = 'payment-step ' + state;
    if (dot && state === 'done') dot.textContent = '✓';
}

/* ── Main checkout trigger ── */
function proceedCheckout() {
    const items = document.querySelectorAll('#cartItemsList .cart-item');
    if (!items.length) return;

    const methodInput = document.querySelector('input[name="payment"]:checked');
    const method      = methodInput ? methodInput.value : 'GCash';
    const totalEl     = document.getElementById('summaryTotal');
    const total       = totalEl ? totalEl.textContent : '₱0.00';

    const chipMethodEl = document.getElementById('paymentChipMethod');
    const chipTotalEl  = document.getElementById('paymentChipTotal');
    const step2LabelEl = document.getElementById('pstep2Label');

    if (chipMethodEl) chipMethodEl.textContent = method;
    if (chipTotalEl)  chipTotalEl.textContent  = total;
    if (step2LabelEl) step2LabelEl.textContent = 'Processing payment via ' + method;

    resetPaymentSteps();

    const btn = document.getElementById('checkoutBtn');
    if (btn) btn.disabled = true;

    const overlay = document.getElementById('paymentOverlay');
    if (overlay) overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    /* Animated steps */
    setTimeout(() => setStep('pstep1', 'pstep1dot', 'active'), 200);
    setTimeout(() => {
        setStep('pstep1', 'pstep1dot', 'done');
        setStep('pstep2', 'pstep2dot', 'active');
    }, 1400);
    setTimeout(() => {
        setStep('pstep2', 'pstep2dot', 'done');
        setStep('pstep3', 'pstep3dot', 'active');
    }, 2800);
    setTimeout(() => {
        setStep('pstep3', 'pstep3dot', 'done');
        const spinEl = document.getElementById('paymentSpinner');
        const wrapEl = document.getElementById('paymentSpinnerWrap');
        const titleEl = document.getElementById('paymentTitle');
        const subEl   = document.getElementById('paymentSub');
        if (spinEl)  spinEl.className  = 'payment-spinner done';
        if (wrapEl)  wrapEl.className  = 'payment-spinner-wrap done';
        if (titleEl) titleEl.textContent = 'Order Confirmed!';
        if (subEl)   subEl.textContent   = 'Redirecting to your order summary...';
    }, 4100);

    setTimeout(() => {
        if (overlay) overlay.classList.add('hidden');
        if (btn) btn.disabled = false;

        /* Snapshot items BEFORE clearing cart */
        openOrderConfirmation();

        /* Clear cart */
        saveCart([]);
    }, 5000);
}

/* ── Order confirmation overlay ── */
function openOrderConfirmation() {
    const methodInput = document.querySelector('input[name="payment"]:checked');
    const payment     = methodInput ? methodInput.value : 'Over the Counter';
    const orderId     = generateOrderId();

    const confirmOrderIdEl = document.getElementById('confirmOrderId');
    if (confirmOrderIdEl) confirmOrderIdEl.textContent = orderId;

    const now = new Date();
    const trackerTimeEl = document.getElementById('trackerTime');
    if (trackerTimeEl) {
        trackerTimeEl.textContent =
            now.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) +
            ' · ' +
            now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
    }

    /* Populate order items from current DOM (before clear) */
    const items  = document.querySelectorAll('#cartItemsList .cart-item');
    const listEl = document.getElementById('confirmItemsList');
    if (listEl) {
        listEl.innerHTML = '';
        items.forEach(item => {
            const nameEl  = item.querySelector('.cart-item-name');
            const qtyEl   = item.querySelector('.qty-value');
            const name    = nameEl ? nameEl.textContent : 'Item';
            const qty     = qtyEl  ? parseInt(qtyEl.textContent) : 1;
            const price   = parseFloat(item.dataset.price) || 0;

            const row = document.createElement('div');
            row.className = 'confirm-item';
            row.innerHTML = `
                <span class="confirm-item-name">${escHtml(name)}</span>
                <span class="confirm-item-qty">&#215;${qty}</span>
                <span class="confirm-item-price">${formatPHP(price * qty)}</span>
            `;
            listEl.appendChild(row);
        });
    }

    const confirmPaymentEl = document.getElementById('confirmPayment');
    const confirmTotalEl   = document.getElementById('confirmTotal');
    const summaryTotalEl   = document.getElementById('summaryTotal');

    if (confirmPaymentEl) confirmPaymentEl.textContent = payment;
    if (confirmTotalEl && summaryTotalEl) {
        confirmTotalEl.textContent = summaryTotalEl.textContent;
    }

    const orderOverlay = document.getElementById('orderOverlay');
    if (orderOverlay) {
        orderOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

/* ── Close overlays when clicking backdrop ── */
function initOverlayClose() {
    const paymentOverlay = document.getElementById('paymentOverlay');
    const orderOverlay   = document.getElementById('orderOverlay');

    if (orderOverlay) {
        orderOverlay.addEventListener('click', function (e) {
            /* Only close if clicking the dark backdrop, not the sheet */
            if (e.target === orderOverlay) {
                orderOverlay.classList.add('hidden');
                document.body.style.overflow = '';
                /* Re-render after cart was cleared */
                renderCart();
            }
        });
    }

    /* Payment overlay should NOT be dismissible — user must wait */
}

/* ── Navbar scroll behaviour ──
   Identical to nav.js — transparent at top,
   solid gradient after scrolling 50px down,
   blends back into header when at the top. ── */
function updateNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

/*try lang boi*/
document.addEventListener('DOMContentLoaded', () => {
    if (getCart().length === 0) {
        saveCart([
            { id: 1, name: 'Art Appreciation Textbook', price: 320.00, image: '', qty: 1 },
            { id: 2, name: 'PE Uniform (Type A)',        price: 725.00, image: '', qty: 2 },
            { id: 3, name: 'SSC-R Hoodie',              price: 580.00, image: '', qty: 1 }
        ]);
    }
    renderCart();
    updateNavCartCount();
    initOverlayClose();
    window.addEventListener('scroll', updateNav);
    updateNav();
});

/* ════════════════════════════════════════════
   INIT
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateNavCartCount();
    initOverlayClose();

    window.addEventListener('scroll', updateNav);
    updateNav();
});