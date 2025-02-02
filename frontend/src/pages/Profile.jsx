import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext); // Obtiene la información del usuario

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      {user ? (
        <div>
          <p><strong>Usuario:</strong> {user.username}</p>
        </div>
      ) : (
        <p>No estás autenticado.</p>
      )}
    </div>
  );
};

export default Profile;
