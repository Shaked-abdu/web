import React from 'react';

const Profile = () => {
  const username = localStorage.getItem('username');

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      {}
      {username && <p><strong>Username:</strong> {username}</p>}
      <form className="profile-form">
        {}
      </form>
    </div>
  );
};

export default Profile;
