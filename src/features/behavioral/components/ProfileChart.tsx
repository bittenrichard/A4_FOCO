// CÓDIGO COMPLETO DO ARQUIVO
import React from 'react';
interface ProfileChartProps { data: { executor: number; comunicador: number; planejador: number; analista: number; }; }
const ProfileChart: React.FC<ProfileChartProps> = ({ data }) => {
  const profiles = [ { name: 'Executor', value: data.executor, color: 'bg-red-500' }, { name: 'Comunicador', value: data.comunicador, color: 'bg-yellow-500' }, { name: 'Planejador', value: data.planejador, color: 'bg-green-500' }, { name: 'Analista', value: data.analista, color: 'bg-blue-500' }, ];
  return (<div className="w-full bg-white p-6 rounded-lg shadow-md border border-gray-200"><h3 className="text-lg font-semibold text-gray-800 mb-6">Perfis Comportamentais</h3><div className="space-y-4">{profiles.map(profile => (<div key={profile.name}><div className="flex justify-between items-center mb-1"><span className="text-sm font-medium text-gray-700">{profile.name}</span><span className="text-sm font-bold text-gray-800">{profile.value.toFixed(2)}%</span></div><div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden"><div className={`${profile.color} h-4 rounded-full transition-all duration-500 ease-out`} style={{ width: `${profile.value}%` }}></div></div></div>))}</div></div>);
};
export default ProfileChart;