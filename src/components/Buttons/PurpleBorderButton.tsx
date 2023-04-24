interface Props {
  text: string;
  onClick?: () => void | Promise<void> | undefined;
}

const Button = ({ text, onClick }: Props) => {
  const classes =
    "bg-inherit border border-purple-600 px-4 py-1.5 font-semibold rounded shadow text-neutral-200 transition-colors duration-300 hover:bg-purple-600 hover:text-white";

  return (
    <button className={classes} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
