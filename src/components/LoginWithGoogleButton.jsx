import { useUser } from "../context/UserContext";

const LoginWithGoogleButton = () => {
  const { loginWithGoogle } = useUser();

  return (
    <button className="btn btn-danger w-100 mt-2" onClick={loginWithGoogle}>
      <i className="bi bi-google"></i> Login con Google
    </button>
  );
};

export default LoginWithGoogleButton;
