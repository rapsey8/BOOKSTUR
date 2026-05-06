<?php
require_once 'include/config.php';
require_once 'include/auth_checker.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Cart | SSCR-C Bookstore</title>
    <link rel="stylesheet" href="cart-style.css">
    <link rel="stylesheet" href="component/navbar/navbar.css">
    <link rel="stylesheet" href="component/searchbar/searchbar.css">
    <link rel="stylesheet" href="component/footer/footer.css">
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</head>

<body>

    <?php include 'component/navbar/navbar.php' ?>

    <main class="hero-section">
        <div class="hero-overlay"></div>
        <div class="bg-text bg-text-top">Caritas et Scientia</div>
        <div class="bg-text bg-text-bottom">SSCR-C<br>Bookstore</div>

        <div class="cart-box">
            <h1>Your Shopping Cart</h1>

            <div class="table-container">
                <table class="cart-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="cart-items-body">
                        <tr>
                            <td colspan="6" class="empty-msg">Your cart is empty</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="cart-summary">
                <h2 id="grand-total">Total: ₱0.00</h2>
                <div class="button-group">
                    <button class="btn btn-clear">Clear Cart</button>
                    <button class="btn btn-checkout" onclick="openModal()">Checkout</button>
                </div>
            </div>
        </div>
    </main>

    <?php include 'component/footer/footer.php' ?>

    <!-- Simplified Modal from earlier version for functionality -->
    <div id="checkoutModal" class="modal">
        <div class="modal-content">
            <span class="close-btn" onclick="closeModal()">&times;</span>
            <h2>Checkout Details</h2>
            <form id="checkoutForm">
                <p>Proceed with your order?</p>
                <button type="button" class="btn btn-checkout" onclick="processOrder()">CONFIRM ORDER</button>
            </form>
        </div>
    </div>

    <script src="component/navbar/nav.js"></script>
    <script>
        function openModal() { document.getElementById("checkoutModal").style.display = "flex"; }
        function closeModal() { document.getElementById("checkoutModal").style.display = "none"; }
        function processOrder() {
            alert("Order Confirmed! Thank you for choosing SSCR-C Bookstore.");
            window.location.href = "pages/dashboard/dashboard.php";
        }
        window.onclick = function (event) {
            let modal = document.getElementById("checkoutModal");
            if (event.target == modal) { closeModal(); }
        }
    </script>

</body>

</html>