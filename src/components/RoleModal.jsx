// RoleModal.jsx
import { Cancel } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import React, { useEffect, useState } from "react";
import { Card, Modal } from "react-bootstrap";

const availableScreens = [
  "Dashboard",
  "Ledger Directory",
  "View Stock Item Menu",
  "Employee Directory",
  "Attendance Tracker",
  "Attendance Records",
  "Visitor Form",
  "Vehicle Entry Records",
  "JCB or HYDRA",
];

const permissionTypes = ["Read", "Write", "Update", "Delete"];
const backendPermissions = {
  Read: "canRead",
  Write: "canWrite",
  Update: "canUpdate",
  Delete: "canDelete",
};

const RoleModal = ({ isOpen, onClose, onSave, user }) => {
  const [userRoles, setUserRoles] = useState(
    user?.roles.map((role) => role.roleName) || []
  );
  const [screenPermissions, setScreenPermissions] = useState([]);
  useEffect(() => {
    console.log(user)
    setScreenPermissions(user?.screenPermissions);
  }, [user]);
  const handleRoleToggle = (role) => {
    setUserRoles((prevRoles) =>
      prevRoles.includes(role)
        ? prevRoles.filter((r) => r !== role)
        : [...prevRoles, role]
    );
  };

  const handleScreenPermissionToggle = (screenName, permissionType) => {
    setScreenPermissions((prevPermissions) => {
      if (
        prevPermissions.length === 0 ||
        !prevPermissions.some(
          (permission) => permission.screenName === screenName
        )
      ) {
        // If prevPermissions is empty, add a new permission
        return [
          ...prevPermissions,
          {
            screenName: screenName,
            [permissionType]: true,
            // Set other permission types to false if needed
            // canRead: false,
            // canWrite: false,
            // canUpdate: false,
            // canDelete: false,
          },
        ];
      }

      return prevPermissions.map((permission) =>
        permission.screenName === screenName
          ? { ...permission, [permissionType]: !permission[permissionType] }
          : permission
      );
    });
  };

  const handleSave = () => {
    // You can handle saving updated roles and screen permissions to the backend here
    // ...
    // Notify the parent component about the update
    onSave(user.userId, screenPermissions);

    onClose(); // Close the modal after saving
  };

  return (
    user && screenPermissions && (
      <Modal show={isOpen} onHide={onClose}>
        <Card className="p-2" style={{ minWidth: "600px" }}>
          <div className="d-flex justify-content-between">
            <h4 className="fw-bold">Edit Roles for {user?.name}</h4>
            <IconButton onClick={onClose}>
              <Cancel />
            </IconButton>
          </div>

          {/* Example for screen permissions */}
          <h5>Screen Permissions</h5>
          {availableScreens.map((screen) => (
            <div className="container">
              <div key={screen} className="d-flex align-items-center row">
                <div className="col">
                  <label>{screen}</label>
                </div>
                <div className="col d-flex">
                  {permissionTypes.map((permissionType) => (
                    <div
                      key={`${screen}-${permissionType}`}
                      className="d-flex align-items-center"
                    >
                      <label>{permissionType}</label>

                      <Checkbox
                        checked={screenPermissions?.some(
                          (permission) =>
                            permission.screenName === screen &&
                            permission[backendPermissions[permissionType]]
                        )}
                        onChange={() =>
                          handleScreenPermissionToggle(
                            screen,
                            backendPermissions[permissionType]
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <Button onClick={handleSave}>Save</Button>
        </Card>
      </Modal>
    )
  );
};

export default React.memo(RoleModal);
