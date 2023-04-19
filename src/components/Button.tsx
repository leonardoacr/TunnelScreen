interface Props {
  backgroundColor: string;
  borderColor: string;
  text: string;
  onClick?: () => void | Promise<void> | undefined;
}

const Button = ({ backgroundColor, borderColor, text, onClick }: Props) => {
  return (
    <button
      className={`bg-${backgroundColor}-800 mb-2 hover:bg-${backgroundColor}-700 text-zinc-50 font-semibold py-1.5 px-4 border border-${borderColor}-800 rounded shadow`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
