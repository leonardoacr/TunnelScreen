interface Props {
  text: string;
  onClick?: () => void | Promise<void> | undefined;
}

const Button = ({ text, onClick }: Props) => {
  const classes =
    `bg-sky-700 ` +
    `hover:bg-sky-600 ` +
    `border-none ` +
    `border ` +
    `px-4 ` +
    `py-1.5 ` +
    `font-semibold ` +
    `rounded ` +
    `shadow `;

  return (
    <button className={classes} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
