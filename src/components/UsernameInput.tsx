import React from "react";

interface UsernameInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

const UsernameInput: React.FC<UsernameInputProps> = ({
  id,
  value,
  onChange,
}) => {
  return (
    <>
      <p className="left mt-2 flex">Chose your username</p>
      <input
        className="my-2 w-full flex-grow rounded border border-gray-600 bg-neutral-800 p-2 text-center text-neutral-100 focus:border-sky-700 focus:outline-none"
        type="text"
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Idyllic"
        maxLength={32}
      />
    </>
  );
};

export default UsernameInput;
