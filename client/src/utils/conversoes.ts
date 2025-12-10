// Conversão de unidades
export const converterParaUnidadeBase = (valor: number, unidade: string): number => {
  const unidadeLower = unidade.toLowerCase();
  
  // Conversão de comprimento
  if (unidadeLower === 'metros' || unidadeLower === 'm') {
    return valor; // metros é a base
  }
  if (unidadeLower === 'cm' || unidadeLower === 'centimetros') {
    return valor / 100; // cm para metros
  }
  
  // Conversão de massa
  if (unidadeLower === 'kg' || unidadeLower === 'quilos') {
    return valor; // kg é a base
  }
  if (unidadeLower === 'gramas' || unidadeLower === 'g') {
    return valor / 1000; // gramas para kg
  }
  
  // Conversão de volume
  if (unidadeLower === 'litros' || unidadeLower === 'l') {
    return valor; // litros é a base
  }
  if (unidadeLower === 'ml' || unidadeLower === 'mililitros') {
    return valor / 1000; // ml para litros
  }
  
  // Unidades que não precisam conversão
  return valor;
};

export const converterDeUnidadeBase = (valor: number, unidade: string): number => {
  const unidadeLower = unidade.toLowerCase();
  
  // Conversão de comprimento
  if (unidadeLower === 'cm' || unidadeLower === 'centimetros') {
    return valor * 100; // metros para cm
  }
  
  // Conversão de massa
  if (unidadeLower === 'gramas' || unidadeLower === 'g') {
    return valor * 1000; // kg para gramas
  }
  
  // Conversão de volume
  if (unidadeLower === 'ml' || unidadeLower === 'mililitros') {
    return valor * 1000; // litros para ml
  }
  
  // Unidades que não precisam conversão
  return valor;
};

// Calcula quanto de material (em unidade de compra) será usado
export const calcularConsumoMaterial = (
  quantidadeUso: number,
  unidadeUso: string,
  unidadeCompra: string
): number => {
  // Converte a quantidade de uso para a unidade base
  const quantidadeBase = converterParaUnidadeBase(quantidadeUso, unidadeUso);
  
  // Converte da unidade base para a unidade de compra
  return converterDeUnidadeBase(quantidadeBase, unidadeCompra);
};
