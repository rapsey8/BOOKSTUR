function openEditModal(product) {
  const modal = document.getElementById("editModal");
  document.getElementById("edit_id").value = product.product_id || product.id;

  const tableInput =
    document.getElementById("edit_producttype") ||
    document.getElementById("edit_table");
  if (tableInput) {
    tableInput.value = product.table; 
  }

  document.getElementById("edit_name").value = product.product_name;
  document.getElementById("edit_price").value = product.price;
  document.getElementById("edit_category").value = product.category_id;
  document.getElementById("edit_description").value = product.description || "";

  const stockTableBody = document.getElementById("stockTableBody");

  if (
    product.is_book ||
    product.table === "books" ||
    product.table === "academic_tools"
  ) {
    stockTableBody.innerHTML = `
      <tr>
        <td><strong>Quantity</strong></td>
        <td><input type="number" name="stocks[S]" id="stock_S" class="edit-input-field" min="0" value="${product.stocks.S || 0}"></td>
      </tr>
    `;
  } else {
    stockTableBody.innerHTML = `
      <tr><td>Small</td><td><input type="number" name="stocks[S]" id="stock_S" class="edit-input-field" value="${product.stocks.S || 0}"></td></tr>
      <tr><td>Medium</td><td><input type="number" name="stocks[M]" id="stock_M" class="edit-input-field" value="${product.stocks.M || 0}"></td></tr>
      <tr><td>Large</td><td><input type="number" name="stocks[L]" id="stock_L" class="edit-input-field" value="${product.stocks.L || 0}"></td></tr>
      <tr><td>XL</td><td><input type="number" name="stocks[XL]" id="stock_XL" class="edit-input-field" value="${product.stocks.XL || 0}"></td></tr>
    `;
  }

  const preview = document.getElementById("edit_img_preview");
  const path = "../../src/uploads/products/";
  const imgName = product.product_image || product.img;
  preview.src = imgName ? path + imgName : "../../src/placeholder.jpg";

  modal.classList.add("is-active");
}

function previewEditImage(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("edit_img_preview").src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function closeModal() {
  document.getElementById("editModal").classList.remove("is-active");
}

window.onclick = function (event) {
  const modal = document.getElementById("editModal");
  if (event.target == modal) {
    closeModal();
  }
};
