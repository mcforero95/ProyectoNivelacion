import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <div className="login-page">
      <h2>Iniciar Sesión</h2>
      {/* Renderiza el formulario de inicio de sesión */}
      <LoginForm />
    </div>
  );
};

export default Login;
