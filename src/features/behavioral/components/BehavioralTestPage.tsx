// Caminho: src/features/behavioral/components/BehavioralTestPage.tsx
// CÓDIGO COMPLETO DO NOVO ARQUIVO

import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { ADJECTIVES_STEP_1, ADJECTIVES_STEP_2 } from '../data/questions';
import { Loader2, AlertCircle } from 'lucide-react';
import ProgressBar from '../../../shared/components/Layout/ProgressBar/index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface BehavioralTestPageProps {
  candidateIdForTest: number | null;
  onTestComplete: (testId: number) => void;
  onCancel: () => void;
}

const AdjectiveButton: React.FC<{
  adjective: string;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}> = ({ adjective, isSelected, isDisabled, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={isDisabled && !isSelected}
        className={`
            px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200
            ${isSelected
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }
            ${isDisabled && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
        `}
    >
        {adjective}
    </button>
);

const BehavioralTestPage: React.FC<BehavioralTestPageProps> = ({ candidateIdForTest, onTestComplete, onCancel }) => {
    const { profile } = useAuth();
    const [step, setStep] = useState(1);
    const [step1Answers, setStep1Answers] = useState<string[]>([]);
    const [step2Answers, setStep2Answers] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const SELECTIONS_LIMIT = 10;

    const currentAnswers = step === 1 ? step1Answers : step2Answers;
    const setAnswers = step === 1 ? setStep1Answers : setStep2Answers;
    const adjectives = step === 1 ? ADJECTIVES_STEP_1 : ADJECTIVES_STEP_2;
    
    const handleSelect = (adjective: string) => {
        if (currentAnswers.includes(adjective)) {
            setAnswers(currentAnswers.filter(a => a !== adjective));
        } else if (currentAnswers.length < SELECTIONS_LIMIT) {
            setAnswers([...currentAnswers, adjective]);
        }
    };

    const handleNextStep = () => {
        if (currentAnswers.length !== SELECTIONS_LIMIT) {
            alert(`Você deve selecionar exatamente ${SELECTIONS_LIMIT} adjetivos.`);
            return;
        }
        setStep(2);
    };

    const handleSubmit = async () => {
        if (currentAnswers.length !== SELECTIONS_LIMIT) {
            alert(`Você deve selecionar exatamente ${SELECTIONS_LIMIT} adjetivos.`);
            return;
        }

        if (!profile || !candidateIdForTest) {
            setError('Recrutador ou candidato não identificado. Não é possível enviar o teste.');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/behavioral-test/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    candidateId: candidateIdForTest,
                    recruiterId: profile.id,
                    responses: {
                        step1: step1Answers,
                        step2: step2Answers,
                    }
                }),
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Falha ao enviar o teste.');
            }

            onTestComplete(data.testId);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = step === 1 ? (currentAnswers.length / SELECTIONS_LIMIT) * 50 : 50 + (currentAnswers.length / SELECTIONS_LIMIT) * 50;

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 text-center">Teste de Perfil Comportamental</h1>
            <p className="text-center text-gray-600 mt-2">Passo {step} de 2</p>

            <div className="my-6">
                <ProgressBar progress={progress} />
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border">
                <h2 className="text-lg font-semibold text-gray-900">
                    {step === 1 ? 'Como os outros te veem?' : 'Como você se vê?'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                    {step === 1 
                        ? 'Na sua percepção, marque os adjetivos que descrevem como os outros pensam que você deveria ser.' 
                        : 'Agora, marque os adjetivos que melhor te representam.'
                    }
                </p>
                <p className="mt-4 font-bold text-indigo-700">
                    Selecione exatamente {SELECTIONS_LIMIT} opções. ({currentAnswers.length}/{SELECTIONS_LIMIT})
                </p>
            </div>
            
            {error && (
                <div className="mt-6 flex items-center gap-2 rounded-md bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {adjectives.map(adj => (
                    <AdjectiveButton
                        key={adj}
                        adjective={adj}
                        isSelected={currentAnswers.includes(adj)}
                        isDisabled={currentAnswers.length >= SELECTIONS_LIMIT}
                        onClick={() => handleSelect(adj)}
                    />
                ))}
            </div>

            <div className="mt-10 flex justify-between items-center">
                 <button onClick={onCancel} className="text-gray-600 font-medium hover:underline">
                    Cancelar
                </button>
                {step === 1 ? (
                    <button onClick={handleNextStep} disabled={currentAnswers.length !== SELECTIONS_LIMIT} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50">
                        Próximo Passo
                    </button>
                ) : (
                    <button onClick={handleSubmit} disabled={isSubmitting || currentAnswers.length !== SELECTIONS_LIMIT} className="px-8 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Finalizar Teste'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default BehavioralTestPage;