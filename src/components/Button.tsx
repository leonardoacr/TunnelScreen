interface Props {
  backgroundColor: string;
  borderColor: string;
  text: string;
  textColor?: string;
  onClick?: () => void | Promise<void> | undefined;
}

const Button = ({
  backgroundColor,
  borderColor,
  text,
  textColor,
  onClick,
}: Props) => {
  const classes =
    `bg-${backgroundColor}-800 ` +
    `hover:bg-${backgroundColor}-700 ` +
    `border-${borderColor}-800 ` +
    `border ` +
    `px-4 ` +
    `py-1.5 ` +
    `font-semibold ` +
    `rounded ` +
    `shadow ` +
    (textColor ? `text-${textColor}-700` : "");

  return (
    <button className={classes} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
