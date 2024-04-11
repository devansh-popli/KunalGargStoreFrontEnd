import { Edit, Settings } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Button,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import RoleModal from "../components/RoleModal";
import { BASE_URL } from "../services/AxiosService";
import { saveScreenPermissions } from "../services/UserService";
import { Card, Container, Table } from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false); // State f

  // Fetch users from API
  useEffect(() => {
    // Replace this with your API endpoint
    fetch(`${BASE_URL}/users`)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.content);
        setFilteredUsers(data.content);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);
  const handleSettingsClick = (user) => {
    setSelectedUser(user); // Set the selected user
    setIsRoleModalOpen(true); // Open the modal
  };

  // Handle search
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);
  const getColorForRole = (role) => {
    const roleColorMap = {
      ROLE_ADMIN: "success",
      ROLE_NORMAL: "primary",
      // Add more role-color mappings as needed
    };

    return roleColorMap[role] || "secondary"; // Default color if role not found
  };
  const userContext = useContext(UserContext);
  return userContext.isLogin ? (
    <Container>
      <div className="d-flex justify-content-between">
        <div className="text-start my-4">
          <h4 className=" fw-bold">User Management</h4>
        </div>
        <div className="text-end d-flex justify-content-end align-items-center">
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ margin: "16px" }}
            autoComplete="off"
          />
          <input type="text" style={{ display: "none" }} autoComplete="off" />
          <Button
            variant="contained"
            color="primary"
            size="small"
            className="mx-2"
            as={Link}
            to={"/add-user-form"}
          >
            Add User
          </Button>
        </div>
      </div>
      <Card className="rounded p-3 shadow border-0 my-3">
        <div>
          <Table responsive >
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>About</th>
                <th>Roles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.userId}>
                  <td className="d-flex justify-content-center align-items-center flex-column">
                    <Avatar alt={user.name} src={user.imageName} />
                    {user.name}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.gender}</td>
                  <td>{user.about}</td>
                  <td>
                    {user.roles.map((role) => (
                      <div>
                        <Badge
                          className=""
                          key={role.roleId}
                          color={getColorForRole(role.roleName)}
                          badgeContent={role.roleName}
                        ></Badge>
                      </div>
                    ))}
                  </td>
                  <td>
                    <Tooltip title="Modify Roles">
                      <IconButton onClick={() => handleSettingsClick(user)}>
                        <Settings />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Update User">
                      <IconButton
                        as={Link}
                        to={"/add-user-form/" + user.userId}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))}
              <RoleModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                user={selectedUser} // Pass the selected user to the modal
                onSave={(userId, screenPermissions) => {
                  // Handle saving updated roles to the backend
                  //// //                  console.log(
                  //                     "Updated roles:",
                  //                     screenPermissions,
                  //                     "and id:",
                  //                     userId
                  //                   );
                  saveScreenPermissions(userId, screenPermissions)
                    .then((data) => {
                      if (userId === userContext.userData.userId) {
                        Swal.fire({
                          title: "Permissions Updated",
                          text: "Please log in again to apply the changes.",
                          icon: "success",
                          confirmButtonText: "OK",
                        });
                      } else {
                        Swal.fire({
                          title: "Success",
                          text: data,
                          icon: "success",
                          toast: true,
                          position: "top-end",
                          showConfirmButton: false,
                          timer: 3000,
                        });
                      }
                    })
                    .catch((error) => {
                      console.error(error);
                      toast.error("Error Occured");
                    });
                  setIsRoleModalOpen(false); // Close the modal after saving
                }}
              />
            </tbody>
          </Table>
        </div>
      </Card>
    </Container>
  ) : (
    <Navigate to="/login" />
  );
};

export default React.memo(UserManagement);
