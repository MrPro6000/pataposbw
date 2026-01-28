import YocoLogo from "./YocoLogo";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-10 md:px-20 py-6">
      <YocoLogo className="h-6" />
      <button className="yoco-btn-outline">
        Sign up
      </button>
    </header>
  );
};

export default Header;
