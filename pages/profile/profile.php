<?php
require_once '../../include/config.php';
require_once '../../include/auth_checker.php';

$status = "error";
$msg_text = "";

$total_result = mysqli_query($conn, "SELECT COUNT(*) as total FROM users");
$row_total = mysqli_fetch_assoc($total_result);
$total_users = $row_total['total'];

$online_query = "SELECT COUNT(*) as online_count FROM users WHERE last_seen >= DATE_SUB(NOW(), INTERVAL 1 HOUR)";
$result_online = mysqli_query($conn, $online_query);
$row_online = mysqli_fetch_assoc($result_online);
$online_now = $row_online['online_count'];

$new_this_week_query = "SELECT COUNT(*) as new_count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
$result_new_users = mysqli_query($conn, $new_this_week_query);
$row_new_users = mysqli_fetch_assoc($result_new_users);
$new_user = $row_new_users['new_count'];

$users_list_query = "SELECT * FROM users ORDER BY created_at DESC";
$users_result = mysqli_query($conn, $users_list_query);

if (isset($_GET['id'])){
    $id = $_GET['id'];
    $delete_query = $conn->prepare("DELETE FROM users WHERE id = ?");
    $delete_query->bind_param("i", $id);
    if($delete_query->execute()){
        $status = "success";
        $msg_text = "User has been deleted successfully";
    }
    else{
        $status = "error";
        $msg_text = "Error: this user cannot be deleted";
    }header('Content-Type: application/json');
        echo json_encode([
            'status' => $status,
            'msg' => $msg_text
        ]);
        exit; 
}
// Magkasama dapat ito sa taas ng profile.php kasama ng Delete logic
if (isset($_GET['reset_id']) && isset($_GET['new_password'])) {
    $id = (int)$_GET['reset_id'];
    $new_pass = $_GET['new_password'];
    
    // I-hash ang bagong password
    $hashed_password = password_hash($new_pass, PASSWORD_DEFAULT);
    
    $update_query = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
    $update_query->bind_param("si", $hashed_password, $id);
    
    $status = "error";
    $msg_text = "Failed to update password.";

    if ($update_query->execute()) {
        $status = "success";
        $msg_text = "Password updated successfully.";
    }

    header('Content-Type: application/json');
    echo json_encode(['status' => $status, 'msg' => $msg_text]);
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../component/navbar/navbar.css">
    <link rel="stylesheet" href="../../component/footer/footer.css">
    <link rel="stylesheet" href="../../component/adminUtils/adminUtils.css">
    <link rel="stylesheet" href="../../component/addItems/addItems.css">
    <link rel="stylesheet" href="profile.css">
    <link href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined" rel="stylesheet">
    <title>User Profile | SSCR-C Bookstore</title>
</head>
<body>
    <?php include '../../component/navbar/navbar.php' ?>

    <main class="profile-container">
        <header class="profile-header" style="background-image: url('../../src/admin_banner.jpg'); background-size: cover; background-position: center;">
            <div class="header-overlay"></div>
            <div class="profile-main-info">
                <div class="user-titles">
                    <h1 style="text-shadow: 2px 2px 15px rgba(0,0,0,0.9);"><?php echo 'User Account'; ?> <span style="color: var(--gold); text-shadow: 2px 2px 15px rgba(0,0,0,0.9);">Management</span></h1>
                    <p class="student-id" style="text-shadow: 1px 1px 10px rgba(0,0,0,0.9);">Admin Control Panel</p>
                </div>
            </div>
        </header>

        <div class="stats-grid">
            <div class="stat-card">
                <span class="material-icons-outlined">people</span>
                <div>
                    <h3><?php echo number_format($total_users)?></h3>
                    <p>Total Registered</p>
                </div>
            </div>
            <div class="stat-card">
                <span class="material-icons-outlined">verified_user</span>
                <div>
                    <h3><?php echo number_format($online_now)?></h3>
                    <p>Active Accounts</p>
                </div>
            </div>
            <div class="stat-card">
                <span class="material-icons-outlined">person_add</span>
                <div>
                    <h3><?php echo number_format($new_user)?></h3>
                    <p>New This Week</p>
                </div>
            </div>
        </div>

        <section class="management-section">
            <div class="section-header">
                <h2><span class="material-icons-outlined">group</span> Registered Accounts</h2>
                <div class="search-bar-alt">
                    <span class="material-icons-outlined">search</span>
                    <input type="text" id="userSearch" placeholder="Search by name or ID...">
                </div>
            </div>

            <div class="table-responsive">
                <table class="user-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Full Name</th>
                            <th>Course</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php 
                    if(mysqli_num_rows($users_result) > 0) {
                        while($user = mysqli_fetch_assoc($users_result)) {
                            $is_admin = (strtolower($user['course']) == 'admin');
                            $role_class = $is_admin ? 'admin' : 'student';
                            $role_label = $is_admin ? 'Admin' : 'Student';
                    ?>
                        <tr>
                            <td><?php echo htmlspecialchars($user['student_number'] ?? 'N/A'); ?></td>
                            <td><?php echo htmlspecialchars($user['full_name'] ?? 'N/A'); ?></td>
                            <td><?php echo htmlspecialchars($user['course'] ?? 'N/A'); ?></td>
                            <td><span class="role-tag <?php echo $role_class; ?>"><?php echo $role_label; ?></span></td>
                            <td class="action-btns">
                                <button class="action-btn reset" title="Reset Password" onclick="confirmReset(<?php echo $user['id']; ?>)">
                                    <span class="material-icons-outlined">lock_reset</span>
                                </button>
                                    <button class="action-btn delete" type="submit" title="Delete Account" onclick="confirmDelete(<?php echo $user['id']; ?>)">
                                    <span class="material-icons-outlined">delete_outline</span>
                                </button>
                            </td> 
                        </tr>
                    <?php 
                        } 
                    } else {
                        echo "<tr><td colspan='5' style='text-align:center;'>No Registered Accounts Found</td></tr>";
                    }
                    ?>
                </tbody>
                </table>
            </div>
        </section>
    </main>
    <?php include '../../component/adminUtils/adminUtils.php' ?>
    <?php include '../../component/addItems/addItems.php' ?>
    <?php include '../../component/footer/footer.php' ?>
    
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../../component/addItems/addItems.js"></script>
    <script src="../../component/adminUtils/adminUtils.js"></script>
    <script src="../../component/navbar/nav.js"></script>
    <script src="profile.js"></script>
</body>
</html>
