import React, { useContext, useEffect, useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { privateAxios } from "../services/AxiosService";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../services/UserService";
import Select from "react-select";
import { UserContext } from "../context/UserContext";
const AddUserForm = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    gender: "Male",
    password: "",
    about: "",
    imageName: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      getUserById(id)
        .then((data) => {
          setUser({ ...data });
        })
        .catch((error) => {
          toast.error("ERROR while fetching user");
        });
    }
  }, [id]);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.name == undefined || user.name.trim() == "") {
      toast.error("name cannot be blank");
      return;
    }
    if (user.email == undefined || user.email.trim() == "") {
      toast.error("email cannot be blank");
      return;
    }

    try {
      if (id) {
        updateUser(user, id)
          .then((data) => {
            toast.success("User Updated");
            navigate("/admin-dashboard");
          })
          .catch((error) => {
            toast.error("error occured");
          });
      } else {
        privateAxios
          .post("/users", user)
          .then((response) => {
            if (response.data) {
              toast.success("User data submitted successfully!");
              navigate("/admin-dashboard");
              // Add any additional logic you want to perform on success
            } else {
              toast.error("Internal Server Error or User already present");
              // Handle error cases
            }
          })
          .catch((error) => {
            console.log(error);
            if (error.response.data) {
              if (error.response.data.status == "INTERNAL_SERVER_ERROR") {
                toast.error(
                  "Internal Server Error or User Already there with same Email"
                );
              } else {
                Object.values(error.response.data).map((data) => {
                  toast.error(data);
                });
              }
            } else {
              toast.error(
                "Internal Server Error or User Already there with same Email"
              );
            }
          });
      }
    } catch (error) {
      console.error(
        "Error occurred while submitting user data:",
        error.message
      );
      // Handle network or other errors
    }
  };
  const roleOptions = [
    { roleName: "ROLE_NORMAL", roleId: "abcd6789" },
    { roleName: "ROLE_ADMIN", roleId: "abcd1245" },
    // Add more role options as needed
  ];

  const handleRoleChange = (selectedRoles) => {
    const formattedRoles = selectedRoles.map((role) => ({
      roleId: role.value,
      roleName: role.label,
    }));
    setUser({ ...user, roles: formattedRoles });
  };
  const userContext=useContext(UserContext)
  return userContext.isLogin ? (
    <Container>
      <Card className="p-3 my-4">
        <h5 className="fw-bold">Add User Form</h5>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              name="name"
              value={user.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formGender">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              value={user.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              name="password"
              value={user.password}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formAbout">
            <Form.Label>About</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Tell us about yourself"
              name="about"
              value={user.about}
              onChange={handleChange}
            />
          </Form.Group>
          {id && (
            <Form.Group controlId="formRoles">
              <Form.Label>Roles</Form.Label>
              <Select
                isMulti
                options={roleOptions.map((role) => ({
                  value: role.roleId,
                  label: role.roleName,
                }))}
                onChange={handleRoleChange}
              />
            </Form.Group>
          )}

          <Button className="mt-2" variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Card>
    </Container>
  ):<Navigate to="/login"/>;
};

export default AddUserForm;
