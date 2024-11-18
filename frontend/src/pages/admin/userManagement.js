import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Pagination, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    totalUsers: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 8,
  });
  const [roleFilter, setRoleFilter] = useState(""); // Bộ lọc theo vai trò
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8090/api/admin/users", {
        params: {
          page: pagination.currentPage,
          limit: pagination.pageSize,
          role_id: roleFilter, // Filter theo role
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(response.data.users);
      setPagination({
        totalUsers: response.data.pagination.totalUsers,
        totalPages: response.data.pagination.totalPages,
        currentPage: response.data.pagination.currentPage,
        pageSize: response.data.pagination.pageSize,
      });
    } catch (error) {
      toast.error(error.response.data.message || "Failed to fetch users.");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (role) => {
    setRoleFilter(role);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset về trang đầu tiên
  };

  const handleBanUser = async (userId) => {
    try {
      await axios.put(
        `http://localhost:8090/api/admin/users/${userId}`,
        { status: "INACTIVE" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchUsers(); 
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error(error.response.data.message || "Failed to ban the user.");
    }
  };
  

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Users</h2>

      {/* Bộ lọc vai trò */}
      <div className="d-flex gap-3 mb-4">
        <Button
          variant={roleFilter === "" ? "primary" : "outline-primary"}
          onClick={() => handleFilter("")}
        >
          All Roles
        </Button>
        <Button
          variant={roleFilter === "2" ? "primary" : "outline-primary"}
          onClick={() => handleFilter("2")}
        >
          Recruiters
        </Button>
        <Button
          variant={roleFilter === "3" ? "primary" : "outline-primary"}
          onClick={() => handleFilter("3")}
        >
          Users
        </Button>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>
                    {(pagination.currentPage - 1) * pagination.pageSize + index + 1}
                  </td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.role_id === 2
                      ? "Recruiter"
                      : user.role_id === 3
                      ? "User"
                      : "Unknown"}
                  </td>
                  <td>{user.isOTPVerified ? "Active" : "Inactive"}</td>
<td>
  {user.isOTPVerified ? (
    <Button
      variant="danger"
      onClick={() => handleBanUser(user.user_id)}
      size="sm" 
    >
      Ban
    </Button>
  ) : (
    <span className="text-muted"></span>
  )}
</td>

                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center mt-4">
  <Pagination>
    {[...Array(pagination.totalPages)].map((_, page) => (
      <Pagination.Item
        key={page + 1}
        active={page + 1 === pagination.currentPage}
        onClick={() =>
          setPagination((prev) => ({ ...prev, currentPage: page + 1 }))
        }
      >
        {page + 1}
      </Pagination.Item>
    ))}
  </Pagination>
</div>

        </>
      )}
    </div>
  );
}
