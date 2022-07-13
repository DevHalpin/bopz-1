import "./UserProfile.css";
import { useState, useEffect } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';

const UserProfile = (props) => {
  const [followedStatus, updateFollowedStatus] = useState();
  const [followData, setFollowData] = useState({});

  const { id } = useParams();
  console.log('useParams id', id); 

  let userObject = {
    myUsername: sessionStorage.getItem("user_name"),
    friendUsername: id
  }

  const getFollowedStatus = (userObject) => {
    axios.post('http://localhost:8080/profile/follow/status', userObject)
    .then(response => {
      console.log('getFollowedStatus', response);

      if (response.data.rows[0]) {
        updateFollowedStatus(true);
      } else {
        updateFollowedStatus(false);
      }
    })
  };

  console.log('after followedstatus api call and update', followedStatus)
  useEffect(() => {
    getFollowedStatus(userObject)
  }, [followedStatus]);


  const getFollowCounts = () => {
    let url1 = "http://localhost:8080/profile/following";
    let url2 = "http://localhost:8080/profile/followed";

    const promise1 = axios.post(url1, userObject);
    const promise2 = axios.post(url2, userObject);

    Promise.all([promise1, promise2])
    .then(response => {
      setFollowData({
        follower_count: response[0].data.rows[0].follower_count ? response[0].data.rows[0].follower_count : 0,
        followed_count: response[1].data.rows[0].followed_count ? response[1].data.rows[0].followed_count : 0
      })

    })
    // axios.post("http://localhost:8080/profile/following", userObject)
    // .then((response) => {
    //   console.log("get follow counts", response);
    //   if (response.data.rows[0].follower_count) {
    //     setFollowData({
    //       ...followData,
    //       follower_count: response.data.rows[0].follower_count
    //     });
    //   } else {
    //     setFollowData({
    //       ...followData,
    //       follower_count: 0
    //     });
    //   }

    // });
    // axios.post("http://localhost:8080/profile/followed", userObject)
    // .then((response) => {
    //   console.log("get follow counts", response);
    //   if (response.data.rows[0].followed_count) {
    //     setFollowData({
    //       ...followData, 
    //       followed_count: response.data.rows[0].followed_count
    //     })
    //   } else {
    //     setFollowData({
    //       ...followData,
    //       followed_count: 0
    //     });
    //   }
    // });
  };

  useEffect(() => {
    getFollowCounts();
  }, [followedStatus]);

  let following = followData.follower_count;
  let followers = followData.followed_count;
  // let following = 10;
  // let followers = 10;

console.log('following: ', following, 'followers: ', followers);
  
  const updateFollow = () => {
    if (!followedStatus) {
      axios.post('http://localhost:8080/profile/follow/add', userObject)
      .then (response => {
        console.log(response);
        
      })
      updateFollowedStatus(true);
      
    } else {
      axios.post('http://localhost:8080/profile/follow/remove', userObject)
      .then(response => {
        console.log(response);
        
      }) 
      updateFollowedStatus(false); 
    }
  }

  return (
    <div className="user-profile">
      <header className="user-profile-header">
      <img src="./images/minion.jpeg" alt="img" className="avatar" />
      <div className="name-location">
      <h1>{props.username}</h1>
      <h5>{props.location}</h5>
      </div>
      </header>
      <main className="user-profile-main">
      <div>Likes: {props.likes}</div>
      <div>Following: {following}</div>
      <div>Followers: {followers}</div>
      {followedStatus ? 
      <button className="follow-button" onClick={updateFollow}>Unfollow</button> : 
      <button className="follow-button" onClick={updateFollow}>Follow</button>
      }
      </main>
    </div>
  )
}

export default UserProfile;