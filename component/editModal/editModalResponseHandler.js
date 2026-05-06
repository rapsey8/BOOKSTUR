document.querySelector("#editForm").addEventListener("submit", function (e) {
  e.preventDefault();

  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to make these changes?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#dc3545",
    confirmButtonText: "Save Changes",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      let formData = new FormData(this);

      fetch(this.action, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            Swal.fire({
              icon: "success",
              title: "Saved!",
              text: data.msg,
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 1500,
            }).then(() => {
              this.reset();
              closeModal();
              location.reload();
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: data.msg,
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire({
            icon: "error",
            title: "System Error",
            text: "Error connecting to the server.",
          });
        });
    }
  });
});
function confirmDiscard() {
  Swal.fire({
    title: "Discard changes?",
    text: "Are you sure you want to cancel? Your changes will not be saved.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#28a745",
    confirmButtonText: "Discard Changes",
    cancelButtonText: "Keep Editing",
    reverseButtons: false,
    customClass: {
      container: "high-z-index",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      closeModal();
      document.querySelector("#editForm").reset();
    }
  });
}
