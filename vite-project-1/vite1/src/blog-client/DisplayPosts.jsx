import DisplayBlogs from "./DisplayBlogs";
import { useEffect } from "react";

import React from 'react'

const DisplayPosts = () => {

    useEffect(()=>{
        fetch('http:localhost:8000/blogdata').then(response=>{
            response.json().then(posts=>{
                console.log(posts)
            })
        })
    },[]);

  return (
    <div><DisplayBlogs/></div>
  )
}

export default DisplayPosts