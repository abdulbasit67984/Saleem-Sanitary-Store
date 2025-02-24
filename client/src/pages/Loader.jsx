/* eslint-disable react/prop-types */

function Loader({message = "", ...props}) {
  return (
    <div className={`${props.mt} flex gap-3 absolute top-0 left-0 w-screen flex-col justify-center items-center h-screen`}>
      <div className={`${props.h_w} animate-spin rounded-full border-gray-500`}></div>
      {message && <p className='text-gray-500'>{message}</p>}
    </div>
  )
}

export default Loader