interface Props {
  text: string;
  onClick?: () => void | Promise<void> | undefined;
}

const Button = ({ text, onClick }: Props) => {
  const classes =
    `bg-purple-700 ` +
    `hover:bg-purple-600 ` +
    `border-none ` +
    `border ` +
    `px-4 ` +
    `py-1.5 ` +
    `font-semibold ` +
    `rounded ` +
    `shadow ` +
    `text-neutral-200`;

  return (
    <button className={classes} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
