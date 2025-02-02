import React, { useEffect, useState } from "react";
import { authAPI } from "../api";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  // Obtener datos del usuario autenticado
  const fetchUserData = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response);
      setProfileImage(response.imgProfile || ""); // Imagen por defecto si no tiene
    } catch (error) {
      console.error("❌ Error obteniendo usuario:", error);
    }
  };

  // Manejar el cambio de imagen de perfil (cargar base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setProfileImage(reader.result);
      };
    }
  };

  // Enviar la actualización del perfil
  const handleUpdateProfile = async () => {
    if (!password.trim() && !profileImage) {
      alert("⚠️ Debes cambiar al menos un campo.");
      return;
    }

    try {
      const updatedData = {};
      if (password) updatedData.password = password;
      if (profileImage) updatedData.imgProfile = profileImage;

      await authAPI.updateProfile(updatedData);
      alert("✅ Perfil actualizado con éxito.");
      fetchUserData();
    } catch (error) {
      console.error("❌ Error actualizando perfil:", error);
      alert("⚠️ No se pudo actualizar el perfil.");
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 max-w-md border shadow-lg rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Perfil de Usuario</h2>

      {user ? (
        <div className="text-center">
          {/* Imagen de perfil (Tamaño máximo 3cm x 3cm) */}
          <img
            src={profileImage || "/default-avatar.png"} // Imagen por defecto
            alt="Perfil"
            className="mx-auto rounded-full border shadow-md"
            style={{ width: "113px", height: "113px", objectFit: "cover" }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />

          {/* Usuario (No editable) */}
          <div className="mt-4">
            <label className="block text-gray-700">Usuario:</label>
            <input
              type="text"
              value={user.username}
              disabled
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Campo para cambiar contraseña */}
          <div className="mt-4">
            <label className="block text-gray-700">Nueva Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Nueva contraseña..."
            />
          </div>

          {/* Botón de actualización */}
          <button
            onClick={handleUpdateProfile}
            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Guardar Cambios
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500">Cargando datos...</p>
      )}
    </div>
  );
};

export default UserProfile;
