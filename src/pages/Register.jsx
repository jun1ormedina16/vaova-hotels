import { useForm } from "react-hook-form";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { registerUser } = useUser();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    const result = registerUser(data);
    if (result.error) return alert(result.error);

    // Redirige según rol
    if (data.role === "hotel") navigate("/dashboard-hotel");
    else navigate("/dashboard-user");
  };

  return (
    <div
      className="vh-100 d-flex justify-content-center align-items-center"
      style={{ background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)" }}
    >
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{ width: "400px", backgroundColor: "white" }}
      >
        <h2 className="text-center mb-4 text-primary" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Registro
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className="form-control mb-3 py-2 rounded-3 shadow-sm"
            placeholder="Nombre"
            {...register("name")}
          />
          <input
            className="form-control mb-3 py-2 rounded-3 shadow-sm"
            placeholder="Email"
            {...register("email")}
          />
          <input
            className="form-control mb-3 py-2 rounded-3 shadow-sm"
            type="password"
            placeholder="Contraseña"
            {...register("password")}
          />

          <select
            className="form-select mb-3 py-2 rounded-3 shadow-sm"
            {...register("role")}
          >
            <option value="">Selecciona un rol</option>
            <option value="user">Usuario</option>
            <option value="hotel">Admin Hotel</option>
          </select>

          <button
            className="btn btn-primary w-100 py-2 rounded-3 mb-2"
            style={{ transition: "0.3s", fontWeight: "600" }}
          >
            Registrarse
          </button>
        </form>
        <div className="text-center mt-2">
          <span className="text-muted">¿Ya tienes cuenta? </span>
          <button
            className="btn btn-link p-0"
            onClick={() => navigate("/login")}
            style={{ fontWeight: "600", color: "#0d6efd" }}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>

      <style>{`
        input.form-control, select.form-select {
          border: 1px solid #ced4da;
          transition: all 0.3s;
        }
        input.form-control:focus, select.form-select:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 5px rgba(13,110,253,0.5);
        }
        button.btn-primary:hover {
          background-color: #0b5ed7;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default Register;
