import React from 'react'
import './Navbar.css';
import logo  from "../../assets/assets/logo.png";
import  profile_image  from "../../assets/assets/profile_image.png";

const Navbar = () => {
  return (
    <div className='navbar'>
      <img className='logo' src={logo} alt="" />
      <img className='profile' src={profile_image} alt="" />
    </div>
  )
}

export default Navbar
