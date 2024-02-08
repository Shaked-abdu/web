import axios from "axios";
import { API_URL } from "../config";
import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React from "react";

export interface IPost {
  title: string;
  content: string;
  owner?: string;
  _id?: string;
}

interface IProps {
  post: IPost;
  accessToken: string;
  logedInUserId: string;
  onDelete: () => void;
  onEdit: (id: string, title: string, content: string) => void;
}

const Post: React.FC<IProps> = ({
  post,
  accessToken,
  logedInUserId,
  onDelete,
  onEdit,
}) => {
  const [ownerName, setOwnerName] = useState<string>("");
  const [comments, setComments] = useState<number>(0);
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState("");
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [imageUrl, setImageUrl] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    loadOwnerName();
    loadComments();
    handleGetImage();
  }, []);

  const handleGetImage = () => {
    const imageEndpoint = `${API_URL}/images/${post?._id}`;
    axios
      .get(imageEndpoint, { responseType: "blob" })
      .then((response) => {
        setImageUrl(URL.createObjectURL(new Blob([response.data])));
      })
      .catch((error) => console.error(error));
  };

  const handleCloseComment = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setComment(e.target.value);
  const handleOnComment = () => {
    const commentEndpoint = `${API_URL}/comments`;
    axios
      .post(
        commentEndpoint,
        {
          content: comment,
          postId: post._id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => {
        setComment("");
        handleCloseComment();
        loadComments();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadOwnerName = () => {
    const ownerEndpoint = `${API_URL}/users/${post.owner}`;
    axios
      .get(ownerEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const owner = response.data.lastName
          ? response.data.firstName + " " + response.data.lastName
          : response.data.firstName;
        setOwnerName(owner);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadComments = () => {
    const commentsEndpoint = `${API_URL}/comments/post/${post._id}`;
    axios
      .get(commentsEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setComments(response.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePostClick = () => {
    navigate(`/post/${post._id}`);
  };

  const handleDelete = () => {
    const deleteEndpoint = `${API_URL}/posts/${post._id}`;

    axios
      .delete(deleteEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        onDelete();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleEditTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setEditTitle(e.target.value);
  const handleEditContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setEditContent(e.target.value);
  const handleCloseEdit = () => setEditing(false);

  const handleOnEdit = () => {
    const editEndpoint = `${API_URL}/posts/${post._id}`;
    axios
      .put(
        editEndpoint,
        {
          title: editTitle,
          content: editContent,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => {
        onEdit(post._id as string, editTitle, editContent);
        handleCloseEdit();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="card" style={{ background: "#E4F2FF", marginTop:"20px", marginBottom: "20px" }} >
        <div onClick={handlePostClick}>
          <div className="card-header">
            <h2> {ownerName} </h2>
          </div>
          <div className="card-body">
            <img src={imageUrl} alt="profile" style={{height: "400px", width: "700px"}}/>
          </div>
          <div className="card-body">
            <h3> {post.title} </h3>
          </div>
          <div className="card-body">
            <p> {post.content} </p>
          </div>
        </div>
        <div className="card-footer">
          <div>
            <p> {comments} תגובות </p>
          </div>
          <div dir="ltr" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <button className="btn btn-primary" onClick={handleShow}>
              הגב
            </button>
            {post.owner === logedInUserId && (
            <div dir="rtl">
              <button className="btn btn-danger" onClick={handleDelete}>
                מחק
              </button>
            </div>
          )}
          {post.owner === logedInUserId && (
            <div dir="ltr">
              <button className="btn btn-success" onClick={handleEdit}>
                ערוך
              </button>
            </div>
          )}
          </div>
        </div>
        <Modal show={show} onHide={handleCloseComment} dir="rtl">
          <Modal.Header>
            <div >
              <Modal.Title >תגובה חדשה</Modal.Title>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={handleCommentChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleOnComment}>
              הגב
            </Button>
            <Button variant="secondary" onClick={handleCloseComment}>
              ביטול
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={editing} onHide={handleCloseEdit}  dir="rtl">
          <Modal.Header>
            <div >
              <Modal.Title>עריכת פוסט</Modal.Title>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              as="textarea"
              rows={1}
              value={editTitle}
              onChange={handleEditTitleChange}
            />
            <Form.Control
              as="textarea"
              rows={10}
              value={editContent}
              onChange={handleEditContentChange}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={handleOnEdit}>
              אישור
            </Button>
            <Button variant="secondary" onClick={handleCloseEdit}>
              ביטול
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Post;
