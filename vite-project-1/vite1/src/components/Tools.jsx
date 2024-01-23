import React from 'react'
import './tools.css'
const Tools = () => {
  return (
  <>
    <div className="tools-content py-16 " id="tools">
    <div className='flex justify-evenly '> 
          <div className="max-w-sm bg-white shadow-black rounded-lg ">
            <a href="#">
              <img className="rounded-t-lg" src="images/generativeai.jpeg" alt="" />
            </a>
            <div className="p-5">
              <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Generative AI</h5>
              </a>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                Get your hands dirty with some cool AI applications.
              </p>
              <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Read more
                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="max-w-sm bg-white shadow-black rounded-lg" >
            <a href="#" className='toolsimage'>
              <img className="rounded" src="images/generativeai.jpeg" alt="" />
            </a>
            <div className="p-5">
              <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Get our Merch </h5>
              </a>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Check out our exquisite collection of merchandise.
              </p>
              <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Read more
                  <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                  </svg>
              </a>
            </div>
          </div>
          <div className="max-w-sm bg-white shadow-black rounded-lg ">
            <a href="#" className='toolsimage'>
              <img className="rounded" src="images/generativeai.jpeg" alt="" />
            </a>
            <div className="p-5">
              <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Create content</h5>
              </a>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Give a pen to your opinion and thoughts.
              </p>
              <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Read more
                  <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                  </svg>
              </a>
            </div>
          </div>
        </div>
    </div>
  </> 
  )
}

export default Tools