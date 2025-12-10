// Validações
export const validarNumeroPositivo = (valor: string): boolean => {
  const num = parseFloat(valor);
  return !isNaN(num) && num > 0;
};

export const validarTextoNaoVazio = (texto: string): boolean => {
  return texto.trim().length > 0;
};

// Formatação
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

export const formatarData = (dataISO: string): string => {
  const data = new Date(dataISO);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatarDataHora = (dataISO: string): string => {
  const data = new Date(dataISO);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatarNumero = (valor: number, casasDecimais: number = 2): string => {
  return valor.toFixed(casasDecimais);
};

// Truncar texto
export const truncarTexto = (texto: string, maxLength: number): string => {
  if (texto.length <= maxLength) return texto;
  return texto.substring(0, maxLength) + '...';
};

// Debounce
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Cálculos estatísticos
export const calcularMedia = (valores: number[]): number => {
  if (valores.length === 0) return 0;
  return valores.reduce((sum, val) => sum + val, 0) / valores.length;
};

export const calcularTotal = (valores: number[]): number => {
  return valores.reduce((sum, val) => sum + val, 0);
};

// Ordenação
export const ordenarPor = <T,>(
  array: T[],
  chave: keyof T,
  ordem: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const valorA = a[chave];
    const valorB = b[chave];
    
    if (valorA < valorB) return ordem === 'asc' ? -1 : 1;
    if (valorA > valorB) return ordem === 'asc' ? 1 : -1;
    return 0;
  });
};
