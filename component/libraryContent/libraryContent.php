<?php
$raw_pos = $_SESSION['course'] ?? 'NOT_SET';
$current_position = strtoupper(trim($raw_pos)); 
$isAdmin = ($current_position === 'ADMIN' || $current_position === 'SUPER ADMIN');
$currentTable = $tableName ?? 'books'; 
$query = "SELECT b.*, pt.display_name 
          FROM $currentTable b 
          JOIN product_types pt ON pt.table_name = '$currentTable'"; 

$result = mysqli_query($conn, $query);

if (!$result) {
    die("SQL Error: " . mysqli_error($conn));
}
?>

<main class="product-grid" id="product-grid">
    <?php
    if ($result && mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            $status_class = ($row['status'] === 'Available') ? 'status-available' : 'status-out';
            $image_path = "../../src/uploads/products/" . $row['product_image'];
            $isBook = ($row['display_name'] === 'Books' || $row['display_name'] === 'Academic Tools');

            $productData = [
                "id"           => $row["product_id"],
                "product_name" => $row["product_name"],
                "price"        => $row["price"],
                "category_id"  => $row["category_id"],
                "is_book"      => $isBook,
                "table"        => $currentTable,
                "img"          => $row["product_image"],
                "description"  => $row["description"],
                "stocks"       => [
                    "S"  => $row["stock_quantity"] ?? 0, 
                    "M"  => $row["stock_m"] ?? 0,       
                    "L"  => $row["stock_l"] ?? 0,
                    "XL" => $row["stock_xl"] ?? 0
                ]
            ];
            ?>
            
            <div class="product-card">
                <div class="img-container">
                    <img src="<?php echo $image_path; ?>" 
                         onerror="this.src='../../src/placeholder.jpg';" 
                         alt="<?php echo htmlspecialchars($row['product_name']); ?>">
                    
                    <span class="status-tag <?php echo $status_class; ?>">
                        <?php echo htmlspecialchars($row['status']); ?>
                    </span>
                </div>
                
                <div class="product-details">
                    <small style="color: #888;"><?php echo htmlspecialchars($row['display_name'] ?? 'Category'); ?></small>
                    
                    <h3><?php echo htmlspecialchars($row['product_name']); ?></h3>
                    
                    <p class="price">₱<?php echo number_format($row['price'], 2); ?></p>
                    
                    <p style="font-size: 0.85rem; color: #666; margin-bottom: 10px;">
                        <?php 
                        if ($isBook) {
                            echo "Stock: " . ($row['stock_quantity'] ?? 0);
                        } else {
                            $total = ($row['stock_quantity'] ?? 0) + ($row['stock_m'] ?? 0) + ($row['stock_l'] ?? 0) + ($row['stock_xl'] ?? 0);
                            echo "Total Stock: " . $total;
                        }
                        ?>
                    </p>
                    
                    <?php if ($isAdmin): ?>
                        <button type="button" class="add-btn" 
                                onclick='openEditModal(<?php echo htmlspecialchars(json_encode($productData), ENT_QUOTES, "UTF-8"); ?>)'>
                            Edit
                        </button>
                    <?php else: ?>
                        <button class="add-btn" onclick="addToCart(<?php echo $row['product_id']; ?>)">
                            Add to Cart
                        </button>
                    <?php endif; ?>
                </div>
            </div>

            <?php
        }
    } else {
        echo "<div class='no-products'>No items found for " . htmlspecialchars($currentTable) . ".</div>";
    }
    ?>
</main>