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
    <div dir="rtl" className="vstack gap-3 col-md-7 mx-auto" style={{marginTop: "10px"}}>
      <div className="card" style={{ width: "80%", margin: "0 auto", background: "#E4F2FF" }}>
        <div className="card-header">
          <h1>פרופיל</h1>
        </div>
        <div className="card-body">
          <img src={imageUrl} alt="profile" />
        </div>
        <div className="card-body">
        {<b className="card-text">מייל</b>}
        {<p className="card-text">{user?.email}</p>}
        </div>
        <div className="card-body">
        <b className="card-text">שם פרטי</b>
          {isEditing ? (
            <div style={{ display: "flex", alignItems: "center" }}>
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
            <p className="card-text">{user?.firstName}</p>
          )}
        </div>
        <div className="card-body">
        <b className="card-text">שם משפחה</b>
          {isEditing ? (
            <div style={{ display: "flex", alignItems: "center" }}>
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
            <p className="card-text">{user?.lastName}</p>
          )}
        </div>
        <div className="card-body">
        <h1 className="card-text">גיל</h1>
          {isEditing ? (
            <div style={{ display: "flex", alignItems: "center" }}>
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
            <p className="card-text">{user?.age}</p>
          )}
        </div>
        <div className="card-body">
        <b className="card-text">מקצוע</b>
          {isEditing ? (
            <div style={{ display: "flex", alignItems: "center" }}>
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
            <p className="card-text">{user?.profession}</p>
          )}
        </div>
        <div className="card-body">
        <b className="card-text">מספר טלפון</b>
          {isEditing ? (
            <div style={{ display: "flex", alignItems: "center" }}>
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
            <p className="card-text">{user?.phoneNumber}</p>
          )}
        </div>
        <div className="card-body">
        <b className="card-text">תעודת זהות</b>
          {isEditing ? (
            <div style={{ display: "flex", alignItems: "center" }}>
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
            <p className="card-text">{user?.id}</p>
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
