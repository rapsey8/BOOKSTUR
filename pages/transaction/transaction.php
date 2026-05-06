<?php
require_once '../../include/config.php';
require_once '../../include/auth_checker.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction History | SSCR-C Bookstore</title>

    <!-- Material Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">

    <!-- Shared site-wide styles -->
    <link rel="stylesheet" href="../../style.css">
    <link rel="stylesheet" href="../../component/navbar/navbar.css">
    <link rel="stylesheet" href="../../component/searchbar/searchbar.css">
    <link rel="stylesheet" href="../../component/adminUtils/adminUtils.css">
    <link rel="stylesheet" href="../../component/addItems/addItems.css">
    <link rel="stylesheet" href="../../component/footer/footer.css">

    <!-- Page-specific styles -->
    <link rel="stylesheet" href="transaction.css">
</head>
<body>

    <!-- ═══════════ NAVBAR ═══════════ -->
    <?php include '../../component/navbar/navbar.php'; ?>

    <!-- ═══════════ HERO HEADER — Inventory style ═══════════ -->
    <header class="page-header tx-hero">
        <div class="tx-hero-content">
            <div class="text-container" style="margin-bottom: 0;">
                <h1>Order <span>Ledger</span></h1>
                <p>Transaction History &amp; Records</p>
            </div>
        </div>
    </header>

    <!-- ── Stat Pills — sit below hero, same pattern as inventory ── -->
    <div class="tx-hero-pills">
        <div class="tx-hero-pill tx-pill-orders">
            <div class="tx-pill-icon">
                <span class="material-icons-outlined">receipt</span>
            </div>
            <div>
                <div class="tx-pill-label">Total Orders</div>
                <div class="tx-pill-value" id="stat-total">0</div>
            </div>
        </div>
        <div class="tx-hero-pill tx-pill-revenue">
            <div class="tx-pill-icon">
                <span class="material-icons-outlined">payments</span>
            </div>
            <div>
                <div class="tx-pill-label">Total Revenue</div>
                <div class="tx-pill-value" id="stat-revenue">&#8369;0</div>
            </div>
        </div>
        <div class="tx-hero-pill tx-pill-completed">
            <div class="tx-pill-icon">
                <span class="material-icons-outlined">check_circle</span>
            </div>
            <div>
                <div class="tx-pill-label">Completed</div>
                <div class="tx-pill-value" id="stat-completed">0</div>
            </div>
        </div>
        <div class="tx-hero-pill tx-pill-pending">
            <div class="tx-pill-icon">
                <span class="material-icons-outlined">pending</span>
            </div>
            <div>
                <div class="tx-pill-label">Pending</div>
                <div class="tx-pill-value" id="stat-pending">0</div>
            </div>
        </div>
    </div>

    <!-- ═══════════ MAIN ═══════════ -->
    <main class="tx-main">

        <!-- ── Section Header + Filters ── -->
        <div class="tx-section-header">
            <div class="tx-section-title-group">
                <h2 class="tx-section-title">Recent Orders</h2>
                <p class="tx-section-sub">Review and track all past bookstore purchases.</p>
            </div>
            <div class="tx-filter-bar">
                <select id="monthFilter" onchange="filterOrders()" class="tx-filter-select">
                    <option value="">All Months</option>
                    <option value="Jan">January</option>
                    <option value="Feb">February</option>
                    <option value="Mar">March</option>
                    <option value="Apr">April</option>
                    <option value="May">May</option>
                    <option value="Jun">June</option>
                    <option value="Jul">July</option>
                    <option value="Aug">August</option>
                    <option value="Sep">September</option>
                    <option value="Oct">October</option>
                    <option value="Nov">November</option>
                    <option value="Dec">December</option>
                </select>
                <select id="yearFilter" onchange="filterOrders()" class="tx-filter-select">
                    <option value="">All Years</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                </select>
                <select id="statusFilter" onchange="filterOrders()" class="tx-filter-select">
                    <option value="">All Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <div class="tx-search-wrap">
                    <span class="material-icons-outlined tx-search-icon">search</span>
                    <input type="text" id="txSearch" onkeyup="filterOrders()"
                        placeholder="Search order ID or item..."
                        class="tx-filter-input">
                </div>
            </div>
        </div>

        <!-- ── Table (desktop) / Cards (mobile) ── -->
        <div class="tx-table-wrap" id="txTableWrap">
            <table class="tx-table" id="mainTable">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Items Summary</th>
                        <th class="hide-sm">Payment</th>
                        <th>Total</th>
                        <th class="text-center">Status</th>
                        <th class="text-right hide-sm">Date</th>
                        <th class="text-center">Details</th>
                    </tr>
                </thead>
                <tbody id="historyTable">

                    <tr data-order="#SSCR-0021"
                        data-items="PE Uniform (Large)"
                        data-method="GCash"
                        data-total="&#8369;1,450.00"
                        data-status="Completed"
                        data-date="Apr 24, 2026"
                        data-notes="Paid via GCash. Ready for pickup.">
                        <td><span class="tx-order-id">#SSCR-0021</span></td>
                        <td><strong>2&times;</strong> PE Uniform (Large)</td>
                        <td class="tx-muted tx-italic hide-sm">GCash</td>
                        <td class="tx-bold tx-dark">&#8369;1,450.00</td>
                        <td class="text-center">
                            <span class="tx-badge tx-badge-completed">
                                <span class="tx-badge-dot"></span>Completed
                            </span>
                        </td>
                        <td class="tx-order-date text-right tx-muted hide-sm">Apr 24, 2026</td>
                        <td class="text-center">
                            <button class="tx-btn-view" onclick="openDetail(this)" title="View Details">
                                <span class="material-icons-outlined">visibility</span>
                            </button>
                        </td>
                    </tr>

                    <tr data-order="#SSCR-0022"
                        data-items="School Blouse (Small)"
                        data-method="Over the Counter"
                        data-total="&#8369;650.00"
                        data-status="Pending"
                        data-date="May 1, 2026"
                        data-notes="Awaiting student pickup at the bookstore window.">
                        <td><span class="tx-order-id">#SSCR-0022</span></td>
                        <td><strong>1&times;</strong> School Blouse (Small)</td>
                        <td class="tx-muted tx-italic hide-sm">Over the Counter</td>
                        <td class="tx-bold tx-dark">&#8369;650.00</td>
                        <td class="text-center">
                            <span class="tx-badge tx-badge-pending">
                                <span class="tx-badge-dot"></span>Pending
                            </span>
                        </td>
                        <td class="tx-order-date text-right tx-muted hide-sm">May 1, 2026</td>
                        <td class="text-center">
                            <button class="tx-btn-view" onclick="openDetail(this)" title="View Details">
                                <span class="material-icons-outlined">visibility</span>
                            </button>
                        </td>
                    </tr>

                    <tr data-order="#SSCR-0023"
                        data-items="Art Appreciation Textbook"
                        data-method="GCash"
                        data-total="&#8369;320.00"
                        data-status="Processing"
                        data-date="May 3, 2026"
                        data-notes="Payment confirmed. Preparing item for pickup.">
                        <td><span class="tx-order-id">#SSCR-0023</span></td>
                        <td><strong>1&times;</strong> Art Appreciation Textbook</td>
                        <td class="tx-muted tx-italic hide-sm">GCash</td>
                        <td class="tx-bold tx-dark">&#8369;320.00</td>
                        <td class="text-center">
                            <span class="tx-badge tx-badge-processing">
                                <span class="tx-badge-dot"></span>Processing
                            </span>
                        </td>
                        <td class="tx-order-date text-right tx-muted hide-sm">May 3, 2026</td>
                        <td class="text-center">
                            <button class="tx-btn-view" onclick="openDetail(this)" title="View Details">
                                <span class="material-icons-outlined">visibility</span>
                            </button>
                        </td>
                    </tr>

                    <tr data-order="#SSCR-0024"
                        data-items="SSC-R Hoodie (Medium)"
                        data-method="Over the Counter"
                        data-total="&#8369;580.00"
                        data-status="Cancelled"
                        data-date="May 4, 2026"
                        data-notes="Order cancelled by student.">
                        <td><span class="tx-order-id">#SSCR-0024</span></td>
                        <td><strong>1&times;</strong> SSC-R Hoodie (Medium)</td>
                        <td class="tx-muted tx-italic hide-sm">Over the Counter</td>
                        <td class="tx-bold tx-dark">&#8369;580.00</td>
                        <td class="text-center">
                            <span class="tx-badge tx-badge-cancelled">
                                <span class="tx-badge-dot"></span>Cancelled
                            </span>
                        </td>
                        <td class="tx-order-date text-right tx-muted hide-sm">May 4, 2026</td>
                        <td class="text-center">
                            <button class="tx-btn-view" onclick="openDetail(this)" title="View Details">
                                <span class="material-icons-outlined">visibility</span>
                            </button>
                        </td>
                    </tr>

                </tbody>
            </table>

            <!-- Empty state -->
            <div id="no-history" class="tx-empty hidden">
                <div class="tx-empty-icon">
                    <span class="material-icons-outlined">search_off</span>
                </div>
                <p class="tx-empty-title">No records found</p>
                <p class="tx-empty-sub">Try adjusting your filters or search term.</p>
            </div>
        </div><!-- /.tx-table-wrap -->

        <!-- ── Mobile card list (built by transaction.js on small screens) ── -->
        <div class="tx-mobile-cards" id="mobileCards"></div>

    </main>

    <!-- ═══════════ DETAIL MODAL ═══════════ -->
    <div id="detailModal" class="tx-modal-overlay" style="display:none;">
        <div class="tx-modal-box">
            <div class="tx-modal-header">
                <div class="tx-modal-header-left">
                    <div class="tx-modal-icon">
                        <span class="material-icons-outlined">receipt_long</span>
                    </div>
                    <div>
                        <h2>Order Details</h2>
                        <p class="tx-modal-sub" id="modal-order-id-sub"></p>
                    </div>
                </div>
                <button class="tx-modal-close" onclick="closeDetail()">
                    <span class="material-icons-outlined">close</span>
                </button>
            </div>

            <div class="tx-modal-body">
                <div class="tx-detail-row">
                    <span class="tx-detail-label">Order ID</span>
                    <span class="tx-detail-value tx-detail-id" id="m-order-id"></span>
                </div>
                <div class="tx-detail-row">
                    <span class="tx-detail-label">Date</span>
                    <span class="tx-detail-value" id="m-date"></span>
                </div>
                <div class="tx-detail-row">
                    <span class="tx-detail-label">Items</span>
                    <span class="tx-detail-value" id="m-items"></span>
                </div>
                <div class="tx-detail-row">
                    <span class="tx-detail-label">Payment</span>
                    <span class="tx-detail-value" id="m-method"></span>
                </div>
                <div class="tx-detail-row">
                    <span class="tx-detail-label">Total Paid</span>
                    <span class="tx-detail-value tx-detail-total" id="m-total"></span>
                </div>
                <div class="tx-detail-row">
                    <span class="tx-detail-label">Status</span>
                    <span class="tx-detail-value" id="m-status"></span>
                </div>
                <div class="tx-detail-row">
                    <span class="tx-detail-label">Notes</span>
                    <span class="tx-detail-value tx-detail-notes" id="m-notes"></span>
                </div>
            </div>

            <div class="tx-modal-footer">
                <button class="tx-btn-close-modal" onclick="closeDetail()">Close</button>
            </div>
        </div>
    </div>

    <!-- ═══════════ ADMIN UTILS + ADD ITEM MODALS ═══════════ -->
    <?php include '../../component/adminUtils/adminUtils.php'; ?>
    <?php include '../../component/addItems/addItems.php'; ?>

    <!-- ═══════════ FOOTER ═══════════ -->
    <?php include '../../component/footer/footer.php'; ?>

    <!-- ═══════════ SCRIPTS ═══════════ -->
    <script src="../../icons/sweetalert2.all.min.js"></script>
    <script src="../../component/addItems/addItems.js"></script>
    <script src="../../component/adminUtils/adminUtils.js"></script>
    <script src="../../component/navbar/nav.js"></script>
    <script src="transaction.js"></script>
</body>
</html>