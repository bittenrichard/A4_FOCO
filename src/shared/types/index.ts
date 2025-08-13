// Caminho: src/shared/types/index.ts
// CÓDIGO COMPLETO DO ARQUIVO PARA SUBSTITUIÇÃO

// Chave da página para navegação
export type PageKey = 
  'login' | 
  'signup' | 
  'dashboard' | 
  'new-screening' | 
  'edit-screening' | 
  'results' | 
  'settings' | 
  'database' | 
  'agenda' |
  'behavioral-test' |
  'behavioral-result';

// Representa um Candidato como vem da API do Baserow
export interface Candidate {
  id: number;
  order: string;
  nome: string;
  email?: string;
  telefone: string | null;
  score: number | null;
  resumo_ia: string | null;
  data_triagem: string;
  vaga: { id: number; value: string }[] | null;
  usuario: { id: number; value: string }[] | null;
  curriculo?: { url: string; name: string }[] | null;
  
  cidade?: string;
  bairro?: string;
  idade?: number;
  sexo?: string;
  escolaridade?: string;
  status?: { id: number; value: 'Triagem' | 'Entrevista' | 'Aprovado' | 'Reprovado' } | null;
}