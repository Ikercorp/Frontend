import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/axios';

export default function MyProfileLink({ className = '' }) {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    let active = true;
    api.get('/auth/me')
      .then((res) => {
        const id = res.data?.data?.id || res.data?.id;
        if (active && id) setUserId(id);
      })
      .catch(() => {
        if (active) setUserId(null);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!userId) return null;

  return (
    <Link
      to={`/profile/${userId}`}
      className={`px-6 py-2.5 bg-white text-[#1e8b4d] font-black text-lg md:text-xl rounded-full shadow hover:bg-gray-50 transition-colors ${className}`}
    >
      Mi perfil
    </Link>
  );
}
