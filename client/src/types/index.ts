export interface Material {
  id: string;
  nome: string;
  unidadeCompra: string; // metros, unidades, kg, litros
  unidadeUso: string; // cm, unidades, gramas, ml
  estoqueAtual: number; // em unidade de compra
  valorUnitario: number; // por unidade de compra
}

export interface MaterialProduto {
  materialId: string;
  quantidadeUsada: number; // em unidade de USO
}

export interface Produto {
  id: string;
  nome: string;
  materiais: MaterialProduto[];
  quantidadeProduzir?: number; // quantidade de peças que pretende fazer
}

export interface Confeccao {
  id: string;
  produtoId: string;
  produtoNome: string;
  quantidadeConfeccionada: number;
  custoTotal: number;
  materiaisUsados: MaterialProduto[];
  dataConfeccao: string;
}
