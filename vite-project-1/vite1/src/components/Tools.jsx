import React from 'react'
import './tools.css'
import {Link} from 'react-router-dom'

const Tools = () => {
  return (
  <>
    <div className="tools-content py-16 " id="tools">
    <div className='flex justify-evenly '> 
          <div className="max-w-sm bg-white shadow-black rounded-lg ">
              <Link to='/blogpage' className='rounded block'><img className="rounded w-full" src="images/generativeai.jpeg" alt="" /></Link>
              <div className="p-5">
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Get your hands dirty with some cool AI applications.
                </p>
                <Link to="#" className="read-more">
                  Check Out
                  <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                  </svg>
                </Link>
            </div>
          </div>
          <div className="max-w-sm bg-white shadow-black rounded-lg" >
            <Link className='block'>
              <img className="rounded w-full" src="images/merchandise logo.jpeg" alt="" />
            </Link>
            <div className="p-5">
              
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Check out our exquisite collection of merchandise.
              </p>
              <Link to="#" className="read-more">
                  Check Out
                  <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                  </svg>
              </Link>
            </div>
          </div>
          <div className="max-w-sm bg-white shadow-black rounded-lg ">
            <Link to="/blogpage" className='block w-full'>
              <img className="rounded w-full" src="images/blog logo.jpeg" alt="" />
            </Link>
            <div className="p-5">
              
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Give a pen to your opinion and thoughts.
              </p>
              <Link to="/blogpage" className="read-more">
                  View
                  <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                  </svg>
              </Link>
            </div>
          </div>
        </div>
    </div>
  </> 
  )
}

export default Tools