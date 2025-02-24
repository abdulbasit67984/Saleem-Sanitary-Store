import React, {Children, useId} from 'react'

const Input = React.forwardRef( function Input({
    children,
    label,
    type = "text",
    labelClass = "",
    className = "",
    divClass = "",
    ...props
}, ref){
    const id = useId()
    return (
        <div className={`w-full ${divClass}`}>
            {label && <label 
            className={`inline-block mb-1 pl-1 ${labelClass}`} 
            htmlFor={id}>
                {label}
            </label>
            }
            <input
            type={type}
            className={`rounded-lg bg-white text-black outline-none focus:bg-gray-100 duration-200 border border-gray-200  ${className} 
            
            `}
            ref={ref}
            {...props}
            id={id}
            />
            {children}
        </div>
    )
})

export default Input