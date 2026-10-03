// useAnimatedInput.ts
import { useState } from "react";

export function useAnimatedInput() {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (v: string) => {
    setValue(v);
    setError(v.trim() === "");
  };

  const handleBlur = () => {
    setError(value.trim() === "");
  };

  return {
    value,
    error,
    setValue,
    handleChange,
    handleBlur,
  };
}