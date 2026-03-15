import { useState } from "react";

export default function useKeyboardBlur() {

  const [typing,setTyping] = useState(false);

  const onFocus = () => setTyping(true);
  const onBlur = () => setTyping(false);

  return { typing, onFocus, onBlur };

}