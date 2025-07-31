// import { useEffect } from 'react';
// import { useAuth0 } from '@auth0/auth0-react';
// import { useUserStore } from '@/store/initiativeStore';
// import { userSchema } from '@/store/schema/initiativeSchema';
// import { userSchema } from '../schemas/userSchema';
// import { useUserStore } from '../stores/userStore';

export const useFetchUser = () => {
  // const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  // const setUser = useUserStore((s) => s.setUser);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     if (!isAuthenticated) return;

  //     try {
  //       const token = await getAccessTokenSilently();

  //       const res = await fetch('https://openlab-c1id.onrender.com/api/v1/initiative/list', {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           Accept: 'application/json',
  //         },
  //       });

  //       if (!res.ok) {
  //         throw new Error(`Error de red: ${res.status}`);
  //       }

  //       const data = await res.json();

  //       const validated = userSchema.parse(data);
  //       setUser(validated);
  //     } catch (err) {
  //       console.error('Error al obtener el usuario:', err);
  //     }
  //   };

  //   fetchUser();
  // }, [getAccessTokenSilently, isAuthenticated, setUser]);
};