import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { IPost } from "./Post";
import "./PostDetails.css";

interface PostDetailsProps {
  accessToken: string;
}

interface IComment {
  _id: string;
  content: string;
  owner: string;
  postId: string;
  __v?: number;
}

const PostDetails: React.FC<PostDetailsProps> = ({ accessToken }) => {
  const { id } = useParams();
  const [post, setPost] = useState<IPost | null>(null);
  const [ownerName, setOwnerName] = useState<string>("");
  const [comments, setComments] = useState<IComment[]>([]);
  const [owners, setOwners] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const loadOwners = async () => {
      const responses = await Promise.all(
        comments.map((comment) => loadOwnerName(comment.owner))
      );
      setOwners(responses);
    };

    loadOwners();
  }, [comments]);

  useEffect(() => {
    loadPost();
  }, [id]);

  useEffect(() => {
    if (post) {
      loadOwner();
      loadComments();
      handleGetImage();
    }
  }, [post])



  const handleGetImage = () => {
    const imageEndpoint = `${API_URL}/images/${post?._id}`;
    axios
      .get(imageEndpoint, { responseType: "blob" })
      .then((response) => {
        setImageUrl(URL.createObjectURL(new Blob([response.data])));
      })
      .catch((error) => console.error(error));
  };


  const loadPost = () => {
    const postEndpoint = `${API_URL}/posts/${id}`;
    axios
      .get(postEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadOwner = () => {
    const ownerEndpoint = `${API_URL}/users/${post?.owner}`;
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
    const commentsEndpoint = `${API_URL}/comments/post/${post?._id}`;
    axios
      .get(commentsEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadOwnerName = async (user_id: string) => {
    const ownerEndpoint = `${API_URL}/users/${user_id}`;

    try {
      const response = await axios.get(ownerEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const owner = response.data.lastName ? response.data.firstName + " " + response.data.lastName : response.data.firstName;
      return owner
    } catch (error) {
      console.log(error);
      return "";
    }
  };
  return (
    <>
      {post && (
        <div className=" col-md-6 mx-auto" style={{marginTop: "10px"}}>
          <div className="card text-right" dir="rtl">
            <div className="card-header">
              <h5> {ownerName} </h5>
            </div>
            <div className="card-body">
            <img src={imageUrl} alt="profile" />
          </div>
            <div className="card-body">
              <h2 className="card-title"> {post.title} </h2>
              <p className="card-text"> {post.content} </p>
            </div>
            <div className="card-footer">
              <div>
                <h5>תגובות</h5>
              </div>
              {comments.length != 0 ? (
                comments.map((comment, index) => (
                  <div className="card-footer" dir="rtl">
                    <p key={index}>
                      {owners[index]}: {comment.content}
                    </p>
                  </div>
                ))
              ) : (
                <p>אין תגובות לפוסט זה</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostDetails;
