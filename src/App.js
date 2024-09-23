// CreateSubscription.js
import React, { useState } from 'react';
import axios from 'axios';

function CreateSubscription() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [externalId, setExternalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateSubscription = async () => {
    if (!name || !email || !externalId) {
      setMessage('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Paso 1: Crear el cliente
      const customerResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/flow/createCustomer`,
        {
          name,
          email,
          externalId,
        }
      );
      const customerId = customerResponse.data.customerId;
      console.log('Cliente creado:', customerResponse.data);

      // Paso 2: Crear la suscripción y obtener el enlace de pago
      const subscriptionResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/flow/createSubscription`,
        {
          planId: 'plan-individual-lexia-3', // Asegúrate de que este plan exista
          customerId,
        }
      );
      console.log('Suscripción creada:', subscriptionResponse.data);

      if (subscriptionResponse.data.paymentUrl) {
        // Redirigir al usuario al enlace de pago de Flow
        window.location.href = subscriptionResponse.data.paymentUrl;
      } else {
        setMessage('¡Suscripción creada exitosamente!');
      }
    } catch (error) {
      console.error(
        'Error al crear la suscripción:',
        error.response ? error.response.data : error.message
      );
      setMessage('Ocurrió un error al crear la suscripción.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Crear Suscripción</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="ID Externo"
        value={externalId}
        onChange={(e) => setExternalId(e.target.value)}
      />
      <button onClick={handleCreateSubscription} disabled={loading}>
        {loading ? 'Creando...' : 'Crear Suscripción'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateSubscription;