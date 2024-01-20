import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

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
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">נושא</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">תוכן</label>
        <input
          type="text"
          id="description"
          value={content}
          onChange={handleDescriptionChange}
          required
        />
      </div>
      <div>
        <button type="submit">פרסם</button>
      </div>
      <div>
        <input type="file" onChange={handleFileChange} />
      </div>
    </form>
  );
};

export default AddPost;
