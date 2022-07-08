const PostListItem = (props) => {
  let songString = `${props.songName} by ${props.songArtist}`;
  
  return (
    <div>
      {props.songName && props.songArtist && songString}
    </div>
  )

}

export default PostListItem