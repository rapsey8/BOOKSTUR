<?php 
$productType = $_GET['producttype'] ?? '';
?>
<div id="editModal" class="edit-modal-overlay">
    <div class="edit-modal-box">
        <div class="modal-header">
        <?php 
            $displayTitle = str_replace('_', ' ', $currentTable); 
            $displayTitle = ucwords($displayTitle); 
        ?>
        <h2>
            Update <?php echo htmlspecialchars($displayTitle); ?>
        </h2>
        
        <input type="hidden" name="producttype" value="<?php echo strtolower($displayTitle); ?>">
    </div>

        <form id="editForm" method="POST" action="../../include/editModalFunction.php" enctype="multipart/form-data">
            <input type="hidden" name="product_id" id="edit_id">
            <input type="hidden" name="producttype" id="edit_producttype">
            <input type="hidden" name="table_name" id="edit_table">

            <div class="edit-form-body">
                <div class="edit-upload-section">
                    <div class="edit-img-preview-container" onclick="document.getElementById('edit_file_input').click()">
                        <img id="edit_img_preview" src="" alt="Preview">
                    </div>
                    <input type="file" name="product_image" id="edit_file_input" style="display:none;" onchange="previewEditImage(this)">
                </div>

                <div class="edit-details-section">
                    <div class="edit-row">
                        <div style="grid-column: span 2;">
                            <label>Product Name</label>
                            <input type="text" name="product_name" id="edit_name" class="edit-input-field" required>
                        </div>
                    </div>

                    <div class="edit-row">
                        <div>
                            <label>Price (₱)</label>
                            <input type="number" step="0.01" name="price" id="edit_price" class="edit-input-field" required>
                        </div>
                        <div>
                            <label>Category</label>
                            <select name="category_id" id="edit_category" class="edit-input-field">
                                <?php
                                $cat_query = "SELECT * FROM categories ORDER BY category_name ASC";
                                $cat_result = mysqli_query($conn, $cat_query);
                                while($cat = mysqli_fetch_assoc($cat_result)) {
                                    echo "<option value='".$cat['category_id']."'>".$cat['category_name']."</option>";
                                }
                                ?>
                            </select>
                        </div>
                    </div>
                    <?php if ($productType == 'Books' || $productType == 'Academic tools'):?>
                        <div class="edit-row">
                        <div style="grid-column: span 2;">
                            <label>Quantity</label>
                            <input type="text" name="stocks" id="edit_name" class="edit-input-field" required>
                        </div>
                    </div>
                    <?php else:?>
                    <div class="edit-inventory-section" id="inventorySection">
                        <table class="edit-stock-table">
                            <thead>
                                <tr>
                                    <th>Total Stocks Left</th>
                                    <th></th>
                                    
                                </tr>
                            </thead>
                            <tbody id="stockTableBody">
                                <tr>
                                    <td>Small</td>
                                    <td><input type="number" name="stocks[S]" id="stock_S" class="edit-input-field" min="0" value="0"></td>
                                </tr>
                                <tr>
                                    <td>Medium</td>
                                    <td><input type="number" name="stocks[M]" id="stock_M" class="edit-input-field" min="0" value="0"></td>
                                </tr>
                                <tr>
                                    <td>Large</td>
                                    <td><input type="number" name="stocks[L]" id="stock_L" class="edit-input-field" min="0" value="0"></td>
                                </tr>
                                <tr>
                                    <td>XL</td>
                                    <td><input type="number" name="stocks[XL]" id="stock_XL" class="edit-input-field" min="0" value="0"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <?php endif?>
                  <div class="input-group">
                    <label>Description</label>
                    <textarea id="edit_description" name="description" rows="3" placeholder="Optional details..."></textarea>
                    </div>
                    <hr>
                    <div class="edit-modal-actions">
                        <button type="button" class="edit-btn-cancel" onclick="confirmDiscard()">Cancel</button>
                        <button type="submit" class="edit-btn-save">Save Changes</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>