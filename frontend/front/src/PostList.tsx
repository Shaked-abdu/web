import React, { useEffect, useState } from "react";
import Post, { IPost } from "./Post";
import { useNavigate } from "react-router-dom";

interface PostListProps {
  posts: IPost[];
  userPosts: IPost[];
  accessToken: string;
  logedInUserId: string;
  onDelete: () => void;
}
const PostList: React.FC<PostListProps> = ({
  posts,
  userPosts,
  accessToken,
  logedInUserId,
  onDelete
}) => {
  const [allPosts, setAllPosts] = useState<boolean>(true);
  const [displayedPosts, setDisplayedPosts] = useState<IPost[]>([]);

  useEffect(() => {
    setDisplayedPosts(posts);
  }, [posts]);

  const navigate = useNavigate();

  const deletePost = () => {
    onDelete();
    // setDisplayedPosts(displayedPosts.filter((post) => post._id !== id));
  };

  const editpost = (id: string, title: string, content: string) => {
    setDisplayedPosts(
      displayedPosts.map((post) => {
        if (post._id === id) {
          post.title = title;
          post.content = content;
        }
        return post;
      })
    );
  };

  const handleAddPost = () => {
    navigate("/add-post");
  };
  const handleAllPosts = () => {
    setAllPosts(true);
    setDisplayedPosts(posts);
  };
  const handleUserPosts = () => {
    setAllPosts(false);
    setDisplayedPosts(userPosts);
  };
  return (
    <>
      <div className="col-md-6 mx-auto" dir="rtl">
        {displayedPosts.map((post) => (
          <Post
            post={post}
            accessToken={accessToken}
            key={post._id}
            logedInUserId={logedInUserId}
            onDelete={deletePost}
            onEdit={editpost}
          />
        ))}
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ position: "fixed", bottom: "20px", left: "20px" }}>
          {allPosts && (
            <button
              className="btn btn-primary"
              onClick={handleUserPosts}
              style={{ marginRight: "10px" }}
            >
              הפוסטים שלי
            </button>
          )}
          {!allPosts && (
            <button
              className="btn btn-primary"
              onClick={handleAllPosts}
              style={{ marginRight: "10px" }}
            >
              כל הפוסטים
            </button>
          )}
          <button onClick={handleAddPost} className="btn btn-primary">
            פוסט חדש
          </button>
        </div>
      </div>
    </>
  );
};

export default PostList;
