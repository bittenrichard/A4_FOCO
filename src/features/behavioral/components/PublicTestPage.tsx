// Local: src/features/behavioral/components/PublicTestPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { ADJECTIVES_STEP_1, ADJECTIVES_STEP_2 } from '../data/questions';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import ProgressBar from '../../../shared/components/Layout/ProgressBar/index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface PublicTestPageProps {
  testId: string;
}

const AdjectiveButton: React.FC<{
  adjective: string, isSelected: boolean, isDisabled: boolean, onClick: () => void
}> = ({ adjective, isSelected, isDisabled, onClick }) => (
    <button type="button" onClick={onClick} disabled={isDisabled && !isSelected}
        className={`px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200 ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'} ${isDisabled && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}>
        {adjective}
    </button>
);

const PublicTestPage: React.FC<PublicTestPageProps> = ({ testId }) => {
    const [step, setStep] = useState(1);
    const [step1Answers, setStep1Answers] = useState<string[]>([]);
    const [step2Answers, setStep2Answers] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [candidateName, setCandidateName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);
    
    const pageTopRef = useRef<HTMLDivElement>(null);

    const SELECTIONS_MINIMUM = 6;

    // --- AJUSTE APLICADO AQUI ---
    // Este "efeito" observa a variável 'step'.
    // Quando o 'step' muda para 2, o código dentro dele é executado.
    useEffect(() => {
        if (step === 2) {
            // Rola suavemente para o topo da página.
            pageTopRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [step]); // A dependência [step] garante que isso só rode quando o passo mudar.

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/public/behavioral-test/${testId}`);
                if (!response.ok) throw new Error('Teste inválido ou não encontrado.');
                const { data } = await response.json();
                setCandidateName(data.candidateName);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTestData();
    }, [testId]);

    const currentAnswers = step === 1 ? step1Answers : step2Answers;
    const setAnswers = step === 1 ? setStep1Answers : setStep2Answers;
    const adjectives = step === 1 ? ADJECTIVES_STEP_1 : ADJECTIVES_STEP_2;

    const handleSelect = (adjective: string) => {
        if (currentAnswers.includes(adjective)) {
            setAnswers(currentAnswers.filter(a => a !== adjective));
        } else {
            setAnswers([...currentAnswers, adjective]);
        }
    };

    const handleNextStep = () => {
        if (currentAnswers.length < SELECTIONS_MINIMUM) {
            alert(`Você deve selecionar no mínimo ${SELECTIONS_MINIMUM} adjetivos.`);
            return;
        }
        // Apenas atualiza o estado. A rolagem agora é tratada pelo useEffect.
        setStep(2);
    };

    const handleSubmit = async () => {
        if (currentAnswers.length < SELECTIONS_MINIMUM) {
            alert(`Você deve selecionar no mínimo ${SELECTIONS_MINIMUM} adjetivos.`);
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/behavioral-test/submit`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ testId, responses: { step1: step1Answers, step2: step2Answers } }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Falha ao enviar o teste.');
            setIsCompleted(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
    }
    
    if (isCompleted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="max-w-xl mx-auto bg-white p-12 rounded-lg shadow-lg text-center">
                    <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                    <h1 className="text-3xl font-bold text-gray-800">Obrigado, {candidateName}!</h1>
                    <p className="text-gray-600 mt-4">Seu teste comportamental foi enviado com sucesso. O recrutador entrará em contato em breve. Você já pode fechar esta janela.</p>
                </div>
            </div>
        );
    }

    const progress = step === 1 
        ? Math.min(50, (currentAnswers.length / SELECTIONS_MINIMUM) * 50) 
        : 50 + Math.min(50, (currentAnswers.length / SELECTIONS_MINIMUM) * 50);

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex items-center justify-center" ref={pageTopRef}>
            <div className="max-w-4xl w-full mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800 text-center">Teste de Perfil Comportamental</h1>
                <p className="text-center text-gray-600 mt-2">Olá, {candidateName}! Siga as instruções abaixo.</p>
                <p className="text-center text-gray-600 mt-2">Passo {step} de 2</p>

                <div className="my-6"><ProgressBar progress={progress} /></div>

                <div className="bg-gray-50 p-6 rounded-lg border">
                    <h2 className="text-lg font-semibold text-gray-900">{step === 1 ? 'Como os outros te veem?' : 'Como você se vê?'}</h2>
                    <p className="text-sm text-gray-600 mt-1">{step === 1 ? 'Na sua percepção, marque os adjetivos que descrevem como os outros pensam que você deveria ser.' : 'Agora, marque os adjetivos que melhor te representam.'}</p>
                    <p className="mt-4 font-bold text-indigo-700">
                        Selecione no mínimo {SELECTIONS_MINIMUM} opções. ({currentAnswers.length} selecionadas)
                    </p>
                </div>
                
                {error && <div className="mt-6 flex items-center gap-2 rounded-md bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={18} /> {error}</div>}

                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {adjectives.map(adj => <AdjectiveButton key={adj} adjective={adj} isSelected={currentAnswers.includes(adj)} isDisabled={false} onClick={() => handleSelect(adj)} />)}
                </div>

                <div className="mt-10 flex justify-end items-center">
                    {step === 1 ? (
                        <button onClick={handleNextStep} disabled={currentAnswers.length < SELECTIONS_MINIMUM} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50">Próximo Passo</button>
                    ) : (
                        <button onClick={handleSubmit} disabled={isSubmitting || currentAnswers.length < SELECTIONS_MINIMUM} className="px-8 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:opacity-50">{isSubmitting ? <Loader2 className="animate-spin" /> : 'Finalizar Teste'}</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicTestPage;