import React, { useEffect } from 'react'
import {Link} from "react-router-dom";
const DisplayBlogs = ({_id,Author,Time,Heading,Content,Category}) => {
  console.log('By')

  return (
    <div className="post">
      <div className="image">
        <Link to={`blogdata/${_id}`}>
          <img src="" alt="Image" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/blogdata/${_id}`}>
          <h2>{Heading}</h2>
        </Link>
        <p className='info'>
          <a className="author">{Author}</a>
          <time>{Time}</time>
        </p>
        <p className='summary'>{Content}</p>
      </div>
    </div>
  );    
}

// const BlogPost = () => {
//     const [blogPosts,setBlogPosts] = useState([]);

//     useEffect(() =>{
//       axios.get('http://localhost:5173/blogdata')
//       .then(blogPosts => {
//         console.log(blogPosts, "-------------------------");
//         setBlogPosts(blogPosts.data)})
//       .catch(err => console.log(err))

      
//     },[])

//     return (<>
//       {
//       blogPosts.map(blogPosts =>{
        
//         <div className="post">
//         <div className="image">
//             <img src="images/images.jpeg" alt="" />
//         </div>
//         <div className="texts">
//             <h2>{blogPosts.Heading}</h2>
//             <p className='info'>
//                 <a className='author' href='#/author'>{blogPosts.Author} </a>
//                 <time>{blogPosts.Time}</time>
//                 </p>
//                 <p className='summary'>{blogPosts.Content}
//             </p></div>
//     </div>
//       })
//       }
//       </>
//     )
// }

export default DisplayBlogs