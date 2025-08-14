// CÓDIGO COMPLETO DO NOVO ARQUIVO
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BrainCircuit, Star, Zap, UserCheck, CheckCircle } from 'lucide-react';
import { BehavioralTestResult } from '../types';
import ProfileChart from './ProfileChart';

interface CandidateResultDisplayProps {
  result: BehavioralTestResult;
  candidateName: string;
}

const InfoCard: React.FC<{ icon: React.ElementType, title: string, content: string | null }> = ({ icon: Icon, title, content }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Icon size={22} className="mr-3 text-indigo-600 flex-shrink-0"/> 
            {title}
        </h3>
        <div className="text-gray-600 leading-relaxed space-y-2">
            {content ? content.split('\n').map((line, index) => <p key={index}>{line}</p>) : <p>Nenhuma informação gerada.</p>}
        </div>
    </div>
);

const CandidateResultDisplay: React.FC<CandidateResultDisplayProps> = ({ result, candidateName }) => {

    const chartData = {
        executor: result.perfil_executor || 0,
        comunicador: result.perfil_comunicador || 0,
        planejador: result.perfil_planejador || 0,
        analista: result.perfil_analista || 0,
    };

    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center border mb-8">
                <CheckCircle className="mx-auto text-green-500 mb-4" size={50} />
                <h1 className="text-4xl font-bold text-gray-900">Análise Comportamental Concluída!</h1>
                <p className="text-lg text-gray-600 mt-2">Olá, {candidateName}! Aqui está o seu resultado.</p>
                <p className="text-sm text-gray-500 mt-4">
                  Análise gerada em: {format(new Date(result.data_de_resposta), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
            </div>
          
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna Esquerda com os cards de texto */}
                <div className="lg:col-span-2 space-y-8">
                    <InfoCard icon={BrainCircuit} title="Resumo do Perfil" content={result.resumo_perfil} />
                    <InfoCard icon={Star} title="Habilidades Comuns" content={result.habilidades_comuns} />
                    <InfoCard icon={Zap} title="Pontos a Desenvolver" content={result.pontos_a_desenvolver} />
                    <InfoCard icon={UserCheck} title="Perfil Isolado" content={result.perfil_isolado} />
                </div>

                {/* Coluna Direita com o gráfico */}
                <div className="lg:col-span-1">
                    <ProfileChart data={chartData} />
                </div>
            </div>
             <div className="text-center mt-12 text-gray-500 text-sm">
                <p>Este é um relatório gerado por Inteligência Artificial. Os resultados são indicadores e devem ser usados como apoio no processo de seleção.</p>
            </div>
        </div>
      </div>
    );
};

export default CandidateResultDisplay;