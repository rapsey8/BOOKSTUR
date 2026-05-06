document
  .querySelector("#appendItemsForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    let formData = new FormData(this);
    let productType = formData.get("producttype");

    fetch(this.action, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status !== "success") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.msg,
            showConfirmButton: false, 
            timerProgressBar: true,
            timer: 1500,
            customClass: {
              container: "high-z-index",
            },
          });
        }
        else {
          Swal.fire({
            title: "Are you sure?",
            text: "Do you want to add these items?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#dc3545",
            confirmButtonText: "Save Changes",
            cancelButtonText: "Discard Changes",
            reverseButtons: true,
            customClass: {
              container: "high-z-index",
            },
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                icon: "success",
                title: "Saved!",
                text: data.msg,
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 1500,
                customClass: {
                  container: "high-z-index",
                },
              }).then(() => {
                if (productType === "Books") {
                  window.location.href = "../../pages/library/library.php";
                } else if (productType === "Uniforms") {
                  window.location.href = "../../pages/uniform/uniform.php";
                } else if (productType === "Apparel") {
                  window.location.href = "../../pages/apparel/apparel.php";
                } else if (productType === "Academic_Tools") {
                  window.location.href = "../../pages/other/other.php";
                } else {
                  window.location.href = "../../pages/library/library.php";
                }
              });
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "System Error",
          text: "Error connecting to the server.",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            container: "high-z-index",
          },
        });
      });
  });
function updateStockFieldsAppend(type) {
  const container = document.getElementById("dynamicStockSection");
  if (!container) return;

  if (type === "Books" || type === "Academic_Tools") {
    container.innerHTML = `
            <div class="input-group">
                <label>Total Stock</label>
                <input type="number" name="stocks[S]" placeholder="0" min="0" >
            </div>`;
  } else {
    container.innerHTML = `
            <label style="display: block; margin-bottom: 5px; font-size: 0.9rem; font-weight: bold;">Stocks per Size</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div class="input-group">
                    <input type="number" name="stocks[S]" placeholder="S" min="0" value="0">
                </div>
                <div class="input-group">
                    <input type="number" name="stocks[M]" placeholder="M" min="0" value="0">
                </div>
                <div class="input-group">
                    <input type="number" name="stocks[L]" placeholder="L" min="0" value="0">
                </div>
                <div class="input-group">
                    <input type="number" name="stocks[XL]" placeholder="XL" min="0" value="0">
                </div>
            </div>`;
  }
}
function cancelAppend() {
  Swal.fire({
    title: "Cancel Append",
    text: "Exit without saving.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#28a745",
    confirmButtonText: "Cancel",
    cancelButtonText: "Keep Editing",
    reverseButtons: false,
    customClass: {
      container: "high-z-index",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      closeAppendModal();
      document.querySelector("#appendItemsForm").reset();
    }
  });
}
function openAppendModal() {
  const modal = document.getElementById("appendModal");
  if (modal) {
    modal.style.display = "flex";
    const form = document.getElementById("appendItemsForm");
    if (form) form.reset();
    const pt = document.getElementById("productType");
    if (pt) {
      pt.value = "Books";
      updateStockFieldsAppend("Books");
    }
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const productType = document.getElementById("productType");
  if (productType) {
    productType.addEventListener("change", function () {
      updateStockFieldsAppend(this.value);
    });
  }
});

function closeAppendModal() {
  const modal = document.getElementById("appendModal");
  if (modal) {
    modal.style.display = "none";

    const form = document.getElementById("appendForm");
    if (form) form.reset();

    const preview = document.getElementById("preview_container");
    if (preview)
      preview.innerHTML = '<span id="placeholder_text">No Image</span>';
  }
}

function previewProductImage(input) {
  const container = document.getElementById("preview_container");

  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      container.innerHTML = `
      <img src="${e.target.result}" 
      style="max-width: 100%; max-height: 100%; object-fit: contain;"> `;
    };

    reader.readAsDataURL(input.files[0]);
  } else {
    container.innerHTML = '<span id="placeholder_text">No Image</span>';
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const productType = document.getElementById("productType");
  const sizeGroup = document.getElementById("sizeGroup");
  function toggleSize() {
    if (!productType || !sizeGroup) return; 

    const selectedValue = productType.value;
    
    if (selectedValue === "Books" || selectedValue === "Academic_Tools") {
      sizeGroup.style.display = "none";
    } else {
      sizeGroup.style.display = "block";
    }
  }
  productType.addEventListener("change", toggleSize);
  toggleSize();
});
