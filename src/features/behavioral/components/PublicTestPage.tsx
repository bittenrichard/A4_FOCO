// CÓDIGO COMPLETO DO ARQUIVO PARA SUBSTITUIÇÃO
import React, { useState, useEffect } from 'react';
import { ADJECTIVES_STEP_1, ADJECTIVES_STEP_2 } from '../data/questions';
import { Loader2, AlertCircle, BrainCircuit } from 'lucide-react';
import ProgressBar from '../../../shared/components/Layout/ProgressBar/index';
import { BehavioralTestResult } from '../types';
import CandidateResultDisplay from './CandidateResultDisplay';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdjectiveButton: React.FC<{
  adjective: string, isSelected: boolean, onClick: () => void
}> = ({ adjective, isSelected, onClick }) => (
    <button type="button" onClick={onClick}
        className={`px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200 ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>
        {adjective}
    </button>
);

// --- NOVO COMPONENTE DE TELA DE PROCESSAMENTO ---
const ProcessingState: React.FC = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
        <div className="relative flex items-center justify-center mb-8">
            <Loader2 className="h-24 w-24 text-indigo-200 animate-spin-slow" />
            <BrainCircuit className="h-12 w-12 text-indigo-600 absolute" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Analisando suas respostas...</h1>
        <p className="text-gray-600 mt-3 max-w-md">Nossa Inteligência Artificial está gerando seu perfil comportamental. Por favor, aguarde, isso pode levar alguns instantes.</p>
    </div>
);

const PublicTestPage: React.FC<{ testId: string }> = ({ testId }) => {
    const [step, setStep] = useState(1);
    const [step1Answers, setStep1Answers] = useState<string[]>([]);
    const [step2Answers, setStep2Answers] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [candidateName, setCandidateName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    // --- NOVO ESTADO PARA GUARDAR O RESULTADO ---
    const [resultData, setResultData] = useState<BehavioralTestResult | null>(null);
    
    const SELECTIONS_MINIMUM = 6;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/public/behavioral-test/${testId}`);
                if (!response.ok) throw new Error('Teste inválido ou não encontrado.');
                const { data } = await response.json();
                setCandidateName(data.candidateName);
            } catch (err: any) { setError(err.message); } 
            finally { setIsLoading(false); }
        };
        fetchTestData();
    }, [testId]);

    const handleSelect = (adjective: string, currentStep: number) => {
        const setAnswers = currentStep === 1 ? setStep1Answers : setStep2Answers;
        setAnswers(prev => prev.includes(adjective) ? prev.filter(a => a !== adjective) : [...prev, adjective]);
    };

    const handleNextStep = () => {
        if (step1Answers.length < SELECTIONS_MINIMUM) {
            alert(`Você deve selecionar no mínimo ${SELECTIONS_MINIMUM} adjetivos.`);
            return;
        }
        setStep(2);
    };

    const handleSubmit = async () => {
        if (step2Answers.length < SELECTIONS_MINIMUM) {
            alert(`Você deve selecionar no mínimo ${SELECTIONS_MINIMUM} adjetivos no Passo 2.`);
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            // A chamada agora espera o backend receber a resposta da IA
            const response = await fetch(`${API_BASE_URL}/api/behavioral-test/submit`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ testId, responses: { step1: step1Answers, step2: step2Answers } }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Falha ao processar o teste.');
            // Armazena o resultado completo no estado
            setResultData(data.result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            // Não precisamos mais de 'setIsSubmitting(false)' aqui, pois a tela mudará
        }
    };
    
    // --- LÓGICA DE RENDERIZAÇÃO ATUALIZADA ---
    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-100"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
    if (isSubmitting && !resultData) return <ProcessingState />;
    if (resultData) return <CandidateResultDisplay result={resultData} candidateName={candidateName} />;

    const currentAnswers = step === 1 ? step1Answers : step2Answers;
    const adjectives = step === 1 ? ADJECTIVES_STEP_1 : ADJECTIVES_STEP_2;
    const progress = step === 1 ? (currentAnswers.length / SELECTIONS_MINIMUM) * 50 : 50 + (currentAnswers.length / SELECTIONS_MINIMUM) * 50;

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex items-center justify-center">
            <div className="max-w-4xl w-full mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800 text-center">Teste de Perfil Comportamental</h1>
                <p className="text-center text-gray-600 mt-2">Olá, {candidateName}! Siga as instruções abaixo.</p>
                <p className="text-center text-gray-600 mt-2">Passo {step} de 2</p>
                <div className="my-6"><ProgressBar progress={progress} /></div>
                <div className="bg-gray-50 p-6 rounded-lg border">
                    <h2 className="text-lg font-semibold text-gray-900">{step === 1 ? 'Como os outros te veem?' : 'Como você se vê?'}</h2>
                    <p className="text-sm text-gray-600 mt-1">{step === 1 ? 'Marque os adjetivos que descrevem como você acha que as outras pessoas te veem.' : 'Agora, marque os adjetivos que melhor te representam.'}</p>
                    <p className="mt-4 font-bold text-indigo-700">Selecione no mínimo {SELECTIONS_MINIMUM} opções. ({currentAnswers.length} selecionadas)</p>
                </div>
                {error && <div className="mt-6 flex items-center gap-2 rounded-md bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} /> {error}</div>}
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {adjectives.map(adj => <AdjectiveButton key={adj} adjective={adj} isSelected={currentAnswers.includes(adj)} onClick={() => handleSelect(adj, step)} />)}
                </div>
                <div className="mt-10 flex justify-end items-center">
                    {step === 1 ? (
                        <button onClick={handleNextStep} disabled={currentAnswers.length < SELECTIONS_MINIMUM} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50">Próximo Passo</button>
                    ) : (
                        <button onClick={handleSubmit} disabled={currentAnswers.length < SELECTIONS_MINIMUM} className="px-8 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:opacity-50">Finalizar e Ver Resultado</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicTestPage;