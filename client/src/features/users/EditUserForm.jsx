import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan  } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";
// REGEX para los siguientes campos: username & password
const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

// Componente funcional
// Representará un formulario con los datos de un 'User' en específico para poder actualizarlo
const EditUserForm = ({ user }) => { // Utilizando la destructuración en las props

  // Utilizando 'useNavigate' para manejar la navegación
  const navigate = useNavigate();

  /* Utilizando los Hooks personalizados para manejar la actualización y eliminación */
  const [updateUser, {
    // Los respectivos estados después de llamar a la función
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateUserMutation();

  const [deleteUser, {
    // Los respectivos estados después de llamar a la función
    isSuccess: isDelSuccess, // Renombrando esta propiedad para evitar confusiones
    isError: isDelError, // Renombrando esta propiedad para evitar confusiones
    error: delerror // Renombrando esta propiedad para evitar confusiones
  }] = useDeleteUserMutation();

  /* Utilizando 'useState' para manejar los respectivos estados... */
  const [username, setUsername] = useState(user.username);
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(user.roles);
  const [active, setActive] = useState(user.active);

  /* Utilizando 'useEffect' para validar los campos 'username' y 'password' */
  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  // Utilizando 'useEffect' para verificar el estado luego de haber invocado cualquiera de los Hooks
  useEffect(() => {
    console.log(isSuccess);
    if (isSuccess || isDelSuccess) {
      // Resetear los siguientes estados...
      setUsername('');
      setPassword('');
      setRoles([]);
      navigate('/dash/users'); // Navegar a la lista de usuarios
    }
  }, [isSuccess, isDelSuccess, navigate]);

  // Para manejar los cambios en los campos 'username' y 'password'
  const onUsernameChanged = e => setUsername(e.target.value);
  const onPasswordChanged = e => setPassword(e.target.value);

  // Para manejar el cambio de 'rol' del 'User'
  const onRolesChanged = e => {
    // La lógica implementada aquí permitirá elegir más de una opción
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRoles(values); // Actualizar el respectivo estado
  };

  // Para manejar el estado de actividad del 'User'
  const onActiveChanged = () => setActive(prev => !prev);

  // Método para actualizar a el 'User'
  const onSaveUserClicked = async (e) => {
    if (password) { // Si está la 'password'
      await updateUser({ id: user.id, username, password, roles, active }); // Actualizar con ella
    } else { // Si no está la 'password'
      await updateUser({ id: user.id, username, roles, active }); // Actualizar sin ella
    }
  };

  // Método para poder dar de baja al 'User'
  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };

  // Mostrar las opciones con los 'ROLES' para poder seleccionar el/los deseado/s...
  const options = Object.values(ROLES).map(role => {
    return (
      <option
        key={role}
        value={role}

      > {role}</option >
    )
  });

  // Verificar si se puede 'guardar' los datos de los campos modificados...
  let canSave;
  if (password) { // Si se encuentra la 'password'...
    canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
  } else { // Si no se encuentra la 'password'...
    canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
  }

  // Clases que dependen de condiciones para que se implementen sus respectivos estilos...
  const errClass = (isError || isDelError) ? "errmsg" : "offscreen"; // Si hay algún error...
  const validUserClass = !validUsername ? 'form__input--incomplete' : '';
  const validPwdClass = password && !validPassword ? 'form__input--incomplete' : '';
  const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : '';

  // Si surge algún error en cualquiera de los Hooks...
  const errContent = (error?.data?.message || delerror?.data?.message) ?? '';

  return (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={e => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit User</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveUserClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteUserClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
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
          Password: <span className="nowrap">[empty = no change]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
        />

        <label className="form__label form__checkbox-container" htmlFor="user-active">
          ACTIVE:
          <input
            className="form__checkbox"
            id="user-active"
            name="user-active"
            type="checkbox"
            checked={active}
            onChange={onActiveChanged}
          />
        </label>

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

export default EditUserForm;