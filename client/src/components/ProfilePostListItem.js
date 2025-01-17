import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import "./PostListItem.css";
import $ from "jquery";

const ProfilePostListItem = (props) => {
  let songString = `${props.songName} by ${props.songArtist}`;
  const [likes, setLikes] = useState(-1);
  const [liked, updateLiked] = useState(false);
  const [date, setDate] = useState();

  const post = {
    id: props.id,
    likes: likes
  };

  const dbLikes = () => {
    axios.post('http://localhost:8080/feed/likes', post)
    .then((response) => {
      console.log('dblikes response', response);
      setLikes(response.data.rows[0].likes);
      console.log('after setting likes initially', likes)
    })
  }

  useEffect(() => {
    dbLikes();
  }, [])

  const updateLikes = async () => {
   try {
    console.log('update likes post', post)
    console.log('liked', liked);
    liked ? post.likes += 1 : post.likes -= 1;
    await axios.post('http://localhost:8080/feed/likes/update', post);
    setLikes(likes => likes + (liked ? 1 : -1));
   } catch (err) {
    console.log(err);
   }
  }

  useEffect(() => {
    if (likes !== -1) {
      updateLikes();
    }
  }, [liked]);


  const getDate = () => {
    axios.post('http://localhost:8080/feed/date', post)
    .then((response) => {
      console.log('getDate', response);
      setDate(response.data.rows[0].created_at);
    })
  }
  
  useEffect(() => {
    getDate();
  })

  $(function(){
    $('.content').on("click", function(){
      $('.content').toggleClass("heart-active")
      $('.text').toggleClass("heart-active")
      $('.numb').toggleClass("heart-active")
      $('.heart').toggleClass("heart-active")
    });
  });


  let username = props.username;
  let initial = username.charAt(0);

  return (
  <article className="post-box">
    <header className="post-header">
      <div className="avatar">{initial}</div>
      <span className="post-user">{props.username}</span>
    </header>
    <div className="post">
    <div className="song-info">
    {props.songName && props.songArtist && songString}
    </div>
    <div>
      {props.albumName}
    </div>
    </div>
    <footer className="post-footer">
      <div className="post-date">
      {date ? date : props.date}
      </div>
      <div className="content" onClick={function clickLike(liked) {
        updateLiked(liked => !liked);
      }}>
        <span className="heart"></span>
        <span className="numb">{likes === -1 ? 0 : likes}</span>
      </div>
    </footer>
  </article>
  )

}

export default ProfilePostListItem