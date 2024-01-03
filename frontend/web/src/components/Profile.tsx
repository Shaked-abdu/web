import React from 'react';

const Profile: React.FC = () => {
  const username = localStorage.getItem('username');

  return (
    <div className="profile-container">
      {username && <p><strong>Username:</strong> {username}</p>}
      <form className="profile-form">
        {}
      </form>
    </div>
  );
};

export default Profile;
