import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";
import useTitle from "../../hooks/useTitle";
// REGEX para los campos: username & password
const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

// Componente funcional
// Representará un formulario para poder crear un nuevo 'User'
const NewUserForm = () => {

  // Utilizando 'useTitle' para cambiar el título de la pestaña
  useTitle('techNotes: New User');

  // Utilizando 'useNavigate' para manejar la navegación
  const navigate = useNavigate();

  // Utilizando el Hook personalizado para manejar la creación de un nuevo 'User'
  const [addNewUser, {
    // Los estados después de llamar a esta función
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewUserMutation();

  /* Utilizando 'useState' para manejar los respectivos estados... */
  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["Employee"]); // Posibilidad de añadir más roles a un 'user'

  // Utilizando 'useEffect' para validar los campos 'username' y 'password' al ver si cumplen o no con los Regex
  useEffect(() => {
    setValidUsername(USER_REGEX.test(username)); // Chqueando 'username'
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password)); // Chequeando 'password'
  }, [password]);

  // Utilizando 'useEffect' para verificar el estado luego de haber invocado la mutación
  useEffect(() => {
    if (isSuccess) { // Si ha sido exitosa...
      // Resetear los siguientes estados...
      setUsername('');
      setPassword('');
      setRoles([]);
      navigate('/dash/users'); // Navegar a el listado de los usuarios
    }
  }, [isSuccess, navigate]);

  // Para manejar los cambios de los campos 'username' y 'password'
  const onUsernameChanged = e => setUsername(e.target.value);
  const onPasswordChanged = e => setPassword(e.target.value);

  // Para manejar el cambio de 'rol' del 'user'
  const onRolesChanged = e => {
    // La lógica implementada aquí permitirá elegir más de una opción
    const values = Array.from(
      e.target.selectedOptions, //HTMLCollection 
      (option) => option.value
    );
    setRoles(values); // Actualizar el respectivo estado
  };

  // Verificar que todos los campos han sido llenados de manera correcta
  // Y si no se están cargando los datos...
  const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

  // Método para insertar un nuevo 'User' en la B.D
  const onSaveUserClicked = async (e) => {
    e.preventDefault(); // Para evitar que se recargue la página
    if (canSave) { // Si se puede guardar...
      // Invocar la mutación para añadir un nuevo registro
      await addNewUser({ username, password, roles });
    }
  };

  // Mostrar las opciones con los 'ROLES' para poder seleccionar el/los deseado/s...
  // El campo a rescatar será el 'role' del respectivo 'User'
  const options = Object.values(ROLES).map(role => {
    return (
      <option
        key={role}
        value={role}

      > {role}</option >
    )
  });

  // Clases que dependen de condiciones para que se implementen sus respectivos estilos...
  const errClass = isError ? "errmsg" : "offscreen"; // Si hay error...
  const validUserClass = !validUsername ? 'form__input--incomplete' : '';
  const validPwdClass = !validPassword ? 'form__input--incomplete' : '';
  const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : '';

  return (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveUserClicked}>
        <div className="form__title-row">
          <h2>New User</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span></label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />

        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
        />

        <label className="form__label" htmlFor="roles">
          ASSIGNED ROLES:</label>
        <select
          id="roles"
          name="roles"
          className={`form__select ${validRolesClass}`}
          multiple={true}
          size="3"
          value={roles}
          onChange={onRolesChanged}
        >
          {options}
        </select>

      </form>
    </>
  )
}

export default NewUserForm;