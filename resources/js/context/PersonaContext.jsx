import React, { createContext, useContext, useState, useEffect } from 'react';

const PersonaContext = createContext();

const PERSONA_KEY = 'portoda_persona_pref';

export function PersonaProvider({ children }) {
  const [persona, setPersonaState] = useState(() => {
    try {
      const saved = localStorage.getItem(PERSONA_KEY);
      return saved === 'dpd' ? 'dpd' : 'mgd';
    } catch (e) {
      return 'mgd';
    }
  });

  const setPersona = (newPersona) => {
    const validPersona = newPersona === 'dpd' ? 'dpd' : 'mgd';
    setPersonaState(validPersona);
    try {
      localStorage.setItem(PERSONA_KEY, validPersona);
    } catch (e) {
      console.error('Failed to save persona preference', e);
    }
  };

  const togglePersona = () => {
    setPersona(persona === 'mgd' ? 'dpd' : 'mgd');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-persona', persona);
  }, [persona]);

  return (
    <PersonaContext.Provider value={{ persona, setPersona, togglePersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
}
