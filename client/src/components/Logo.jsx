/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import logo from '../../src/assets/pandas1.png';

function Logo({divClass='', className='', width, ...props}) {
  return (
    <div id='logo' className={divClass}>
      <img src={logo} alt="" className={` hue-rotate-180 ${className} ${width}`}/>
    </div>
  )
}

export default Logo