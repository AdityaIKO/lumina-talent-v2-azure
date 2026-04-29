import { useState } from 'react';

const AzureAPI = window.AzureAPI || {
  analyzeMatch: async () => ({ strengths: [], improvements: [] }),
  translateProposal: async () => 'Translated text...'
};

export default function useAzureAI() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [translation, setTranslation] = useState('');

  const runAnalysis = async (jobDesc, freelancerData) => {
    setLoading(true);
    try {
      const result = await AzureAPI.analyzeMatch(jobDesc, freelancerData);
      setAnalysis(result);
    } catch (error) {
      console.error('AI Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const runTranslation = async (text) => {
    setLoading(true);
    try {
      const result = await AzureAPI.translateProposal(text);
      setTranslation(result);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    analysis,
    translation,
    runAnalysis,
    runTranslation
  };
}
