import type { Produto, Material } from '../types';
import { calcularConsumoMaterial } from './conversoes';

export const calcularCustoProduto = (
  produto: Produto,
  materiais: Material[]
): number => {
  return produto.materiais.reduce((total, mp) => {
    const material = materiais.find(m => m.id === mp.materialId);
    if (!material) return total;
    
    // Converte a quantidade usada para a unidade de compra
    const quantidadeEmUnidadeCompra = calcularConsumoMaterial(
      mp.quantidadeUsada,
      material.unidadeUso,
      material.unidadeCompra
    );
    
    // Multiplica pelo valor unitário e pela quantidade de produtos
    const quantidadeProdutos = produto.quantidadeProduzir || 1;
    return total + (quantidadeEmUnidadeCompra * material.valorUnitario * quantidadeProdutos);
  }, 0);
};

export const calcularQuantidadeMaximaProduzir = (
  produto: Produto,
  materiais: Material[]
): number => {
  const quantidades = produto.materiais.map(mp => {
    const material = materiais.find(m => m.id === mp.materialId);
    if (!material || mp.quantidadeUsada === 0) return Infinity;
    
    // Converte o estoque para a unidade de uso para facilitar o cálculo
    const estoqueEmUnidadeUso = calcularConsumoMaterial(
      material.estoqueAtual,
      material.unidadeCompra,
      material.unidadeUso
    );
    
    return Math.floor(estoqueEmUnidadeUso / mp.quantidadeUsada);
  });

  return quantidades.length > 0 ? Math.min(...quantidades) : 0;
};
