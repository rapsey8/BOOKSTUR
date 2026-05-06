<?php
$raw_pos = $_SESSION['course'] ?? 'NOT_SET';
echo "";

$current_position = strtoupper(trim($raw_pos)); 
$isAdmin = ($current_position === 'ADMIN' || $current_position === 'SUPER ADMIN');
?>
<?php if ($isAdmin):?>
<div class="ubuntu-fab-container">
    <div class="ubuntu-menu" id="ubuntuMenu">
        
        <button class="ubuntu-item" onclick="openAppendModal()">
            <span class="material-symbols-outlined">auto_stories</span>
            Add to Library
        </button>

         <button class="ubuntu-item" onclick="window.location.href='/BOOKSTUR/pages/inventory/inventory.php'">
            <span class="material-symbols-outlined">inventory_2</span>
            Inventory
        </button>

        <button class="ubuntu-item" onclick="window.location.href='/BOOKSTUR/pages/transaction/transaction.php'">
            <span class="material-symbols-outlined">receipt_long</span>
    Transaction History
        </button>
        
        <button class="ubuntu-item" onclick="confirmLogout()">
            <span class="material-symbols-rounded">logout</span>
            Logout
        </button>
    </div>

    <button class="ubuntu-launcher" id="launcherBtn">
        <span class="material-symbols-rounded">grid_view</span>
    </button>
</div>
<?php endif?>