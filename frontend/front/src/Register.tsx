import React, { useState, useRef } from "react";
import account from "./assets/account.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

interface RegisterFormProps {
  onSubmit: (formData: RegistrationFormData, image: File) => void;
}

export interface RegistrationFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  profession: string;
  phoneNumber: string;
  id: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    age: 0,
    profession: "",
    phoneNumber: "",
    id: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, selectedFile as File);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setImgSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  const selectImg = () => {
    fileInputRef.current?.click();
  };

  return (
    <form className="vstack gap-3 col-md-7 mx-auto">
      <h1 className="text-center">הרשמה</h1>
      <div className="d-flex justify-content-center position-relative">
        <img
          src={imgSrc ? imgSrc : account}
          style={{ height: "200px", width: "200px" }}
          className="img-fluid"
        />
      </div>

      <div className="col-md-6 mx-auto" dir="rtl">
        <input
          ref={fileInputRef}
          type="file"
          style={{ direction: "rtl", display: "none"}}
          onChange={handleFileChange}
        />
        <button type="button" className="btn" onClick={selectImg}>
          <FontAwesomeIcon icon={faImage} className="fa-xl" />
        </button>
      </div>

      <div className="col-md-6 mx-auto" dir="rtl">
        <label htmlFor="email" className="form-label">
          מייל
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <div className="col-md-6 mx-auto" dir="rtl">
        <label htmlFor="password" className="form-label">
          סיסמה
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <div className="col-md-6 mx-auto" dir="rtl">
        <label htmlFor="firstName" className="form-label">
          שם פרטי
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <div className="col-md-6 mx-auto" dir="rtl">
        <label htmlFor="lastName" className="form-label">
          שם משפחה
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <div className="col-md-6 mx-auto" dir="rtl">
        <label htmlFor="age" className="form-label">
          גיל
        </label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <div className="col-md-6 mx-auto" dir="rtl">
        <label htmlFor="profession" className="form-label">
          מקצוע
        </label>
        <input
          type="text"
          name="profession"
          value={formData.profession}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <div className="col-md-6 mx-auto" dir="rtl">
        <label htmlFor="phoneNumber" className="form-label">
          מספר טלפון
        </label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <div className="col-md-6 mx-auto" dir="rtl">
        <label htmlFor="id" className="form-label">
          תעודת זהות
        </label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="col-md-6 mx-auto">
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          הרשמה
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
