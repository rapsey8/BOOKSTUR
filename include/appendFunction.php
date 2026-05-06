<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

$status = "error"; 
$msg_text = "";

if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    $product_type_input = strtolower($_POST['producttype'] ?? ''); 
    $product_name = trim($_POST['product_name'] ?? '');
    $category_id = isset($_POST['category_id']) ? intval($_POST['category_id']) : 0;
    $description = trim($_POST['description'] ?? '');
    $stock_s = intval($_POST['stocks']['S'] ?? 0);
    $stock_m = intval($_POST['stocks']['M'] ?? 0);
    $stock_l = intval($_POST['stocks']['L'] ?? 0);
    $stock_xl = intval($_POST['stocks']['XL'] ?? 0);
    $price = floatval($_POST['price'] ?? 0);

    $stmt_check = mysqli_prepare($conn, "SELECT table_name FROM product_types WHERE LOWER(table_name) = ?");
    mysqli_stmt_bind_param($stmt_check, "s", $product_type_input);
    mysqli_stmt_execute($stmt_check);
    $result_check = mysqli_stmt_get_result($stmt_check);

    if (mysqli_num_rows($result_check) == 0) {
        $msg_text = "Invalid product type: [" . htmlspecialchars($product_type_input) . "]";
    }
    elseif(empty($product_name)){
        $msg_text = "Product name is required";
    }
    else {
        $targetTable = $product_type_input; 
        $image_file_name = 'placeholder.jpg'; 
        
        if (isset($_FILES['product_image']) && $_FILES['product_image']['error'] == 0) {
            $upload_dir = __DIR__ . "/../src/uploads/products/";
            if (!is_dir($upload_dir)) { mkdir($upload_dir, 0777, true); }
            $file_ext = strtolower(pathinfo($_FILES['product_image']['name'], PATHINFO_EXTENSION));
            $new_file_name = time() . '_' . preg_replace("/[^a-zA-Z0-9]/", "_", $product_name) . '.' . $file_ext;
            if (move_uploaded_file($_FILES['product_image']['tmp_name'], $upload_dir . $new_file_name)) {
                $image_file_name = $new_file_name; 
            }
        }

       try {
            $price_val = floatval($price);
            $stock_val = intval($stock_s); 
            $status_db = ($stock_val + $stock_m + $stock_l + $stock_xl > 0) ? 'Available' : 'Out of Stock';
            $size_placeholder = "N/A"; 

            if ($targetTable === 'books' || $targetTable === 'academic_tools') {
                $query = "INSERT INTO $targetTable (category_id, product_name, description, status, price, stock_quantity, product_image) VALUES (?, ?, ?, ?, ?, ?, ?)";
                $stmt = mysqli_prepare($conn, $query);
                if ($stmt) {
                    mysqli_stmt_bind_param($stmt, "isssdss", $category_id, $product_name, $description, $status_db, $price_val, $stock_val, $image_file_name);
                }
            } 
            else {
                $query = "INSERT INTO $targetTable (category_id, product_name, description, status, price, stock_quantity, stock_m, stock_l, stock_xl, size, product_image) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                
                $stmt = mysqli_prepare($conn, $query);
                if ($stmt) {
                    mysqli_stmt_bind_param($stmt, "isssdiiiiss", 
                        $category_id,    
                        $product_name,   
                        $description,   
                        $status_db,      
                        $price_val,      
                        $stock_s,       
                        $stock_m,        
                        $stock_l,        
                        $stock_xl,      
                        $size_placeholder, 
                        $image_file_name   
                    );
                }
            }
            
            if ($stmt && mysqli_stmt_execute($stmt)) {
                $status = "success";
                $msg_text = "Product successfully added to " . ucfirst($targetTable) . "!";
            } else {
                $msg_text = "SQL Error: " . mysqli_error($conn) . " | Statement Error: " . mysqli_stmt_error($stmt);
            }
        } catch (Exception $e) {
            $msg_text = "Error: " . $e->getMessage();
        }
    }

    echo json_encode(['status' => $status, 'msg' => $msg_text]);
    exit;
}