import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import img from "./assets/img.png";



interface IProps {
  accessToken: string;
  reloadPosts: () => void;
  reloadUserPosts: () => void;
}

const AddPost: React.FC<IProps> = ({
  accessToken,
  reloadPosts,
  reloadUserPosts,
}) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContent(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    axios
      .post(
        `${API_URL}/posts`,
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        const formData = new FormData();
        formData.append("image", selectedFile as Blob);

        const uploadEndpoint = `${API_URL}/images/uploads/${res.data._id}`;
        axios
          .post(uploadEndpoint, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            setTitle("");
            setContent("");
            navigate("/posts");
            reloadPosts();
            reloadUserPosts();
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
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
    <form onSubmit={handleSubmit} dir="rtl" style={{padding: "50px"}} className="vstack gap-3 col-md-7 mx-auto">
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          נושא
        </label>
        <input
          type="text"
          id="title"
          value={title}
          className="form-control"
          onChange={handleTitleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="form-label">תוכן</label>
        <input
          type="text"
          id="description"
          value={content}
          className="form-control"
          onChange={handleDescriptionChange}
          required
        />
      </div>
      <div className="mb-3">
      <div className="d-flex justify-content-center position-relative">
        <img
          src={imgSrc ? imgSrc : img}
          style={{ height: "300px", width: "500px" }}
          className="img-fluid"
        />
      </div>  
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
      <button type="submit" className="btn btn-primary">
        פרסם
      </button>
    </form>
  );
};

export default AddPost;
