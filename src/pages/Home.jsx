import React, { useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { isUserLoggedIn } from '../auth/HelperAuth'
import { UserContext } from '../context/UserContext'
import useJwtChecker from '../helper/useJwtChecker'

const Home = () => {
  const userContext = useContext(UserContext)
  const navigate = useNavigate()
  const jetChecker=useJwtChecker()
  return isUserLoggedIn() ? (

    <div>Home</div>
  ) :
    (
      <Navigate to={"/"} />
    )
}

export default Home