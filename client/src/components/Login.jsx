import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useLoginMutation } from '../features/auth/authApiSlice';

// Componente funcional
// Representará la sección para que el usuario pueda logearse
const Login = () => {

  // Utilizando 'useNavigate' para manejar la navegación
  const navigate = useNavigate();

  /* Utilizando 'useRef' */
  const userRef = useRef();
  const errRef = useRef();

  /* Utilizando 'useState' para manejar los siguientes estados */
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  // Utilizando 'useDispatch' para invovocar acciones
  const dispatch = useDispatch();

  // Utilizando el hook personalizado para realizar una 'mutation'
  const [login, { isLoading }] = useLoginMutation();

  /* Utilizando 'useEffect' para combinarlo con 'useRef' y hacer referencia a lo siguiente... */
  useEffect(() => {
    userRef.current.focus(); // Realizar un 'focus' al 'User' input
  }, []);

  useEffect(() => {
    setErrMsg(''); // 
  }, [username, password]);

  // Método para poder realizar el 'login'
  const handleSubmit = async (e) => {
    e.preventDefault(); // Para evitar que la página se recargue
    try {
      // Acceder a el token de acceso al realizar el respectivo login
      const { accessToken } = await login({ username, password }).unwrap();
      // Realizar el dispatch correspondiente para establecer las credenciales
      dispatch(setCredentials({ accessToken }));
      setUsername('');
      setPassword('');
      navigate('/dash'); // Navegar hacia la dirección especificada
    } catch (err) {
      // Actualizandao el estado del error con los posibles errores...
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus(); // Finalizar con el focus
    }
  }

  // Para manejar lo ingresado en los inputs que están relacionados a los siguientes estados
  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);

  // Clase dinámica dependiendo si hubo o no error
  const errClass = errMsg ? "errmsg" : "offscreen";

  // Si se está cargando...
  if (isLoading) return <p>Loading...</p>

  return (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            className="form__input"
            type="text"
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            className="form__input"
            type="password"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          <button className="form__submit-button">Sign In</button>
        </form>
      </main>
      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  )
}

export default Login;