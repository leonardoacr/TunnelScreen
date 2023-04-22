interface Props {
  text: string;
  onClick?: () => void | Promise<void> | undefined;
}

const Button = ({ text, onClick }: Props) => {
  const classes =
    `bg-gray-700 ` +
    `hover:bg-gray-600 ` +
    `border-none ` +
    `border ` +
    `px-4 ` +
    `py-1.5 ` +
    `font-semibold ` +
    `rounded ` +
    `shadow `;
  // (textColor ? `${textColor}` : "");

  return (
    <button className={classes} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
