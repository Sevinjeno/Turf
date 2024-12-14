import React from 'react'

type ButtonProps = {
    text?:string;
    className?:string;
    secondary?:boolean;
    onClick?:()=>void;
    loading?:boolean;
}

function Button({
    className,
    text="Button",
    secondary,
    onClick,
    loading=false,
}: ButtonProps) {
  return (
    <button  className={`py-2 px-9 flex justify-center gap-3 rounded-full text-white border-2 border-white hover:bg-myPink transition-all hover:drop-shadow-lg ${secondary?"bg-myPink":"bg-myBlue"} ${className} ${loading && "cursor-wait"}`} onClick={onClick}>
        {text}
    </button>
  )
}

export default Button