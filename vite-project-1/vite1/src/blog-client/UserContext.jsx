import {createContext} from 'react';

import React from 'react'

const UserContext = () => {
  return (
    <div>UserContext</div>
  )
}
function UserContextProvider({Children}){
    const [userInfo,setUserInfo] = useState({});
    return (
    <UserContext.Provider value={{}}>
        {Children}
    </UserContext.Provider>
    
    )
}
export default UserContext


