import React from 'react'

type InputProps={
name:string;
value?:string;
type?:string;
onChange?:(e:any)=>void;
onKeyDown?:(e:any)=>void;
disabled?:boolean;
className?:string;
}

const Input = ({
  type='text',
  name,
  value,
  onChange,
  onKeyDown,
  disabled,
  className
}:InputProps) => {
  return (
    <input type={type} onChange={onChange} onKeyDown={onKeyDown} value={value} name={name}   placeholder={`Enter ${name}`} className={`flex-1 placeholder-gray-300 bg-transparent px-3 py-1 border-2 border-gray-200 ${className}` } />

  )
}

export default Input