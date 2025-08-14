// CÓDIGO COMPLETO DO ARQUIVO PARA SUBSTITUIÇÃO
export interface BehavioralTestResult {
    id: number;
    candidato: { id: number; value: string }[];
    recrutador: { id: number; value: string }[];
    data_de_resposta: string;
    status: 'Pendente' | 'Processando' | 'Concluído' | 'Erro';
    respostas: string; // JSON string

    // --- Campos de resultado da IA ---
    perfil_executor: number | null;
    perfil_comunicador: number | null;
    perfil_planejador: number | null;
    perfil_analista: number | null;
    resumo_perfil: string | null;
    habilidades_comuns: string | null;
    pontos_a_desenvolver: string | null; // Novo campo
    perfil_isolado: string | null;      // Novo campo
    indicadores: string | null;
}