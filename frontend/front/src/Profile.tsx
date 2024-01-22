import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./Profile.css";

interface IProps {
  user: IUser | null;
  accessToken: string;
  reloadUser: () => void;
}

export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  profession: string;
  phoneNumber: string;
  id: string;
  _id?: string;
}
const Profile: React.FC<IProps> = ({ user, accessToken, reloadUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<IUser | null>(user);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    handleGetImage();
  }, []);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedUser((prevUser) => {
      if (prevUser) {
        return { ...prevUser, [name]: value };
      }
      return null;
    });
  };

  const onEdit = () => {
    setIsEditing(true);
  };

  const onSave = () => {
    setIsEditing(false);

    const endpoint = `${API_URL}/users/${user?._id}`;
    const userWithoutId = { ...editedUser };
    delete userWithoutId._id;
    axios
      .put(endpoint, userWithoutId, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        reloadUser();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGetImage = () => {
    const imageEndpoint = `${API_URL}/images/${user?._id}`;
    axios
      .get(imageEndpoint, { responseType: "blob" })
      .then((response) => {
        setImageUrl(URL.createObjectURL(new Blob([response.data])));
      })
      .catch((error) => console.error(error));
  };
  return (
    <div dir="rtl" className="container mt-5">
      <div className="card" style={{ width: "80%", margin: "0 auto", background: "#71bcf3cc" }}>
        <div className="card-header">
          <h1>פרופיל</h1>
        </div>
        <div className="card-body">
          <img src={imageUrl} alt="profile" />
        </div>
        <div className="card-body">
          {<p className="card-text">מייל: {user?.email}</p>}
        </div>
        <div className="card-body">
          {isEditing ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <p className="card-text">שם פרטי</p>
              <div
                style={{ display: "flex", alignItems: "center", width: "50%" }}
              >
                <input
                  type="text"
                  name="firstName"
                  value={editedUser?.firstName}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
          ) : (
            <p className="card-text">שם פרטי: {user?.firstName}</p>
          )}
        </div>
        <div className="card-body">
          {isEditing ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <p className="card-text">שם משפחה</p>
              <div
                style={{ display: "flex", alignItems: "center", width: "50%" }}
              >
                <input
                  type="text"
                  name="lastName"
                  value={editedUser?.lastName}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
          ) : (
            <p className="card-text">שם משפחה: {user?.lastName}</p>
          )}
        </div>
        <div className="card-body">
          {isEditing ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1 className="card-text">גיל</h1>
              <div
                style={{ display: "flex", alignItems: "center", width: "50%" }}
              >
                <input
                  type="text"
                  name="age"
                  value={editedUser?.age}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
          ) : (
            <p className="card-text">גיל: {user?.age}</p>
          )}
        </div>
        <div className="card-body">
          {isEditing ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <p className="card-text">מקצוע</p>
              <div
                style={{ display: "flex", alignItems: "center", width: "50%" }}
              >
                <input
                  type="text"
                  name="profession"
                  value={editedUser?.profession}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
          ) : (
            <p className="card-text">מקצוע: {user?.profession}</p>
          )}
        </div>
        <div className="card-body">
          {isEditing ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <p className="card-text">מספר טלפון</p>
              <div
                style={{ display: "flex", alignItems: "center", width: "50%" }}
              >
                <input
                  type="text"
                  name="phoneNumber"
                  value={editedUser?.phoneNumber}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
          ) : (
            <p className="card-text">מספר טלפון: {user?.phoneNumber}</p>
          )}
        </div>
        <div className="card-body">
          {isEditing ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <p className="card-text">תעודת זהות</p>
              <div
                style={{ display: "flex", alignItems: "center", width: "50%" }}
              >
                <input
                  type="text"
                  name="id"
                  value={editedUser?.id}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
          ) : (
            <p className="card-text">תעודת זהות: {user?.id}</p>
          )}
        </div>
        <div className="card-body" dir="ltr">
          {isEditing && (
            <button className="btn btn-primary" onClick={onSave}>
              שמור
            </button>
          )}
          {!isEditing && (
            <button className="btn btn-primary" onClick={onEdit}>
              ערוך
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
