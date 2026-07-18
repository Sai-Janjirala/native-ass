import React, { createContext, useState, useContext, useEffect } from 'react';

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

// Seed some initial surveys for visual excellence
const mockSurveys = [
  {
    id: 'SURV-17212100001',
    siteName: 'Metro Station Phase 3',
    clientName: 'City Transit Authority',
    description: 'Foundation check and drainage line survey near sector 12 block C.',
    priority: 'High',
    date: new Date().toISOString().split('T')[0],
    photoUri: undefined,
    photoTime: undefined,
    location: {
      latitude: 12.9716,
      longitude: 77.5946,
      accuracy: 5.4,
      timestamp: Date.now(),
    },
    contact: {
      name: 'Rohan Sharma',
      phoneNumber: '+91 98765 43210',
    },
    notes: 'Drainage pipes look slightly worn out. Recommend immediate reinforcement.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'SURV-17212100002',
    siteName: 'Sunrise Heights Tower A',
    clientName: 'Apex Builders',
    description: 'Elevator shaft structural inspection and concrete testing.',
    priority: 'Medium',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    photoUri: undefined,
    photoTime: undefined,
    location: {
      latitude: 12.9816,
      longitude: 77.6046,
      accuracy: 10.2,
      timestamp: Date.now() - 86400000,
    },
    contact: {
      name: 'Anjali Verma',
      phoneNumber: '+91 91234 56789',
    },
    notes: 'Shaft walls are vertical within tolerances. Standard concrete cure checks passed.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'SURV-17212100003',
    siteName: 'Greenwood Solar Farm',
    clientName: 'EcoPower Corp',
    description: 'Inverter substation thermal analysis and security check.',
    priority: 'Low',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 Days Ago
    photoUri: undefined,
    photoTime: undefined,
    location: {
      latitude: 13.0827,
      longitude: 80.2707,
      accuracy: 15.1,
      timestamp: Date.now() - 172800000,
    },
    contact: {
      name: 'Suresh Kumar',
      phoneNumber: '+91 88888 77777',
    },
    notes: 'Substation cooling fans operational. Security fencing is secure and undamaged.',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const SurveyContext = createContext(undefined);

export const SurveyProvider = ({ children }) => {
  const [surveys, setSurveys] = useState(mockSurveys);
  const [draft, setDraft] = useState(initialDraft);
  const [todayCount, setTodayCount] = useState(0);

  // Compute today's survey count whenever surveys list changes
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const count = surveys.filter((s) => s.date === todayStr).length;
    setTodayCount(count);
  }, [surveys]);

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
