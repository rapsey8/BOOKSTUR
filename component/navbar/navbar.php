<?php
$current_page = $_SERVER['PHP_SELF'];
$is_dashboard = (strpos($current_page, 'dashboard.php') !== false);
$home_url = $is_dashboard ? 'javascript:window.scrollTo({top: 0, behavior: \'smooth\'});' : '/BOOKSTUR/pages/dashboard/dashboard.php';
?>
<nav id="top">
    <div class="logo">
        <a href="<?php echo $home_url; ?>">
            <img class="display-on-mobile" src="../../src/SSCRLogo1.png" width="68" height="68"
                style="vertical-align: middle;">
            <h2 class="hide-on-mobile" style="font-size: 20px; color: white; 
                text-shadow:
                1px 1px 0 black,
                1px 1px 0 black,
                1px 1px 0 black,
                1px 1px 0 rgb(255, 255, 255);">
                <img src="../../src/SSCRLogo1.png" width="68" height="68" style="vertical-align: middle; ">
                San Sebastian College - Recoletos de Cavite
            </h2>
        </a>
    </div>

    <ul class="nav-links">
        <li>
            <a class="hide-on-mobile" href="<?php echo $home_url; ?>">
                <span class="material-icons-outlined">home</span> Home
            </a>
        </li>
        <li>
            <a class="hide-on-mobile" href="#footer">
                <span class="material-icons-outlined">phone</span> Contact us
            </a>
        </li>
        <li>
            <a class="hide-on-mobile" href="../../pages/cart/cart.php">
                <span class="material-icons-outlined">shopping_bag</span> Cart (0)
            </a>
        </li>
        <li>
            <a class="hide-on-mobile" href="../../pages/profile/profile.php">
                <span class="material-icons-outlined">person</span> User
            </a>
        </li>
    </ul>
</nav>