import React, { createContext, useState, useContext, useEffect } from 'react';
import sampleSurveys from '../data/sample_surveys.json';
import { getStoredSurveys, saveStoredSurveys } from '../utils/storage';

const initialDraft = {
  siteName: '',
  clientName: '',
  description: '',
  priority: 'Medium',
  date: new Date().toISOString().split('T')[0],
  photoUri: undefined,
  photoTime: undefined,
  location: undefined,
  contact: undefined,
  notes: '',
};

const SurveyContext = createContext(undefined);

export const SurveyProvider = ({ children }) => {
  const [surveys, setSurveys] = useState(sampleSurveys);
  const [draft, setDraft] = useState(initialDraft);
  const [todayCount, setTodayCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial load from persistent storage (Web localStorage / Native AsyncStorage)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const stored = await getStoredSurveys(sampleSurveys);
      if (isMounted && stored) {
        setSurveys(stored);
        setIsLoaded(true);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Compute today's survey count and persist surveys whenever surveys list changes
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const count = surveys.filter((s) => s.date === todayStr).length;
    setTodayCount(count);

    if (isLoaded) {
      saveStoredSurveys(surveys);
    }
  }, [surveys, isLoaded]);

  const updateDraftField = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearDraft = () => {
    setDraft({
      ...initialDraft,
      date: new Date().toISOString().split('T')[0], // Reset to current date
    });
  };

  const submitSurvey = () => {
    if (!draft.siteName || !draft.clientName) {
      return { success: false, error: 'Site Name and Client Name are required.' };
    }

    const newSurvey = {
      ...draft,
      id: `SURV-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setSurveys((prev) => [newSurvey, ...prev]);
    clearDraft();
    return { success: true, survey: newSurvey };
  };

  const updateSurvey = (id, updatedSurvey) => {
    setSurveys((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedSurvey } : s))
    );
  };

  const deleteSurvey = (id) => {
    setSurveys((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <SurveyContext.Provider
      value={{
        surveys,
        draft,
        todayCount,
        updateDraftField,
        clearDraft,
        submitSurvey,
        updateSurvey,
        deleteSurvey,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};
