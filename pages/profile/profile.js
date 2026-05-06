document.getElementById("userSearch").addEventListener("keyup", function () {
  let filter = this.value.toLowerCase();
  let rows = document.querySelectorAll(".user-table tbody tr");

  rows.forEach((row) => {
    let studentID = row.cells[0].textContent.toLowerCase();
    let fullName = row.cells[1].textContent.toLowerCase();

    if (studentID.includes(filter) || fullName.includes(filter)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});
function confirmDelete(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this action!",
    icon: "warning",
    showCancelButton: true,

    confirmButtonColor: "#28a745",
    cancelButtonColor: "#d33",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`profile.php?id=${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            Swal.fire({
              title: "Deleted!",
              text: data.msg,
              icon: "success",
              howConfirmButton: false,
              timerProgressBar: true,
              timer: 1500,
            }).then(() => {
              location.reload();
            });
          } else {
            Swal.fire({
              title: "Failed!",
              text: data.msg,
              icon: "error",
              confirmButtonColor: "#d33",
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          Swal.fire("Error!", "Server request failed.", "error");
        });
    }
  });
}
function confirmReset(id) {
  Swal.fire({
    title: "Reset User Password",
    input: "text",
    inputLabel: "Enter new password for this user:",
    inputPlaceholder: "Minimum 8 characters with symbols...",
    showCancelButton: true,
    confirmButtonText: "Update Password",
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#d33",
    reverseButtons: true,
    inputAttributes: {
      autocapitalize: "off",
      autocorrect: "off",
    },
    preConfirm: (newPassword) => {
      if (!newPassword || newPassword.length < 8) {
        Swal.showValidationMessage(
          "Password must be at least 8 characters long",
        );
        return false;
      }
      if (!/[A-Z]/.test(newPassword)) {
        Swal.showValidationMessage(
          "Must include at least one uppercase letter",
        );
        return false;
      }
      if (!/[a-z]/.test(newPassword)) {
        Swal.showValidationMessage(
          "Must include at least one lowercase letter",
        );
        return false;
      }
      if (!/\d/.test(newPassword)) {
        Swal.showValidationMessage("Must include at least one number");
        return false;
      }
      if (!/[$#@!?]/.test(newPassword)) {
        Swal.showValidationMessage(
          "Must include at least one special character ($#@!?)",
        );
        return false;
      }

      return newPassword;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const newPass = result.value;

      fetch(
        `profile.php?reset_id=${id}&new_password=${encodeURIComponent(newPass)}`,
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            Swal.fire("Success!", data.msg, "success");
          } else {
            Swal.fire("Error!", data.msg, "error");
          }
        })
        .catch((error) => {
          Swal.fire("Error!", "Server connection failed.", "error");
        });
    }
  });
}