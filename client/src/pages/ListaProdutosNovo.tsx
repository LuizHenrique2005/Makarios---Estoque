import { useState, useEffect } from 'react';
import type { Produto, Material } from '../types';
import { storageService } from '../services/storage';
import { calcularCustoProduto, calcularQuantidadeMaximaProduzir } from '../utils/calculos';

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const produtosData = await storageService.getProdutos();
    const materiaisData = await storageService.getMateriais();
    setProdutos(produtosData);
    setMateriais(materiaisData);
  };

  const handleSelecionarProduto = (produto: Produto) => {
    setProdutoSelecionado(produto);
  };

  const fecharDetalhes = () => {
    setProdutoSelecionado(null);
  };

  const getMaterial = (materialId: string) => {
    return materiais.find(m => m.id === materialId);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Meus Produtos</h1>

      {produtos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">
            Nenhum produto cadastrado ainda.
          </p>
          <p className="text-gray-400">
            Acesse "Cadastrar Produto" para criar seu primeiro produto!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map((produto) => {
            const custo = calcularCustoProduto(produto, materiais);
            const quantidadeMaxima = calcularQuantidadeMaximaProduzir(produto, materiais);

            return (
              <div
                key={produto.id}
                onClick={() => handleSelecionarProduto(produto)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {produto.nome}
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Custo de Produção:</span>
                    <span className="text-lg font-bold text-green-600">
                      R$ {custo.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Estoque para:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {quantidadeMaxima} {quantidadeMaxima === 1 ? 'unidade' : 'unidades'}
                    </span>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-gray-500 mb-2">
                      {produto.materiais.length} {produto.materiais.length === 1 ? 'material' : 'materiais'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <span className="text-sm text-blue-600 font-medium">
                    Clique para ver detalhes →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Detalhes */}
      {produtoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {produtoSelecionado.nome}
              </h2>
              <button
                onClick={fecharDetalhes}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Resumo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Custo Total</p>
                  <p className="text-3xl font-bold text-green-600">
                    R$ {calcularCustoProduto(produtoSelecionado, materiais).toFixed(2)}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Estoque para</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {calcularQuantidadeMaximaProduzir(produtoSelecionado, materiais)} un
                  </p>
                </div>
              </div>

              {/* Materiais Detalhados */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Materiais Necessários (por unidade)
                </h3>
                <div className="space-y-2">
                  {produtoSelecionado.materiais.map((mp) => {
                    const material = getMaterial(mp.materialId);
                    if (!material) return null;

                    return (
                      <div
                        key={mp.materialId}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-lg">{material.nome}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {mp.quantidadeUsada} {material.unidadeUso} por produto
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Estoque: {material.estoqueAtual} {material.unidadeCompra}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
              <button
                onClick={fecharDetalhes}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
