import { useState } from 'react';

export const useGitHubValidation = () => {
  const [githubUrl, setGithubUrl] = useState('');
  const [error, setError] = useState('');

  const validateGithubUrl = (url: string): string => {
    if (!url.trim()) return 'El enlace no puede estar vacío';

    if (url.trim() === 'https://github.com/') {
      return 'Ingresa tu enlace completo de perfil';
    }

    const githubProfileRegex = /^https:\/\/github\.com\/[A-Za-z0-9-]+$/;
    if (!githubProfileRegex.test(url.trim())) {
      return 'El enlace no es válido';
    }

    return '';
  };

  const handleChange = (value: string) => {
    setGithubUrl(value);
    setError(validateGithubUrl(value));
  };

  const isValid = !validateGithubUrl(githubUrl);

  return {
    githubUrl,
    error,
    isValid,
    setGithubUrl: handleChange,
    rawSetGithubUrl: setGithubUrl, // opcional, si quieres saltarte validaciones
  }
}
