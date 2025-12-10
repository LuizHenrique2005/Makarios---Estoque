import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { Produto, Confeccao } from '../types';
import { storageService } from '../services/storage';
import { calcularCustoProduto } from '../utils/calculos';
import { calcularConsumoMaterial } from '../utils/conversoes';

export default function Confeccoes() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [confeccoes, setConfeccoes] = useState<Confeccao[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidadeConfeccionada, setQuantidadeConfeccionada] = useState('1');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    setProdutos(storageService.getProdutos());
    setConfeccoes(storageService.getConfeccoes());
  };

  const handleRemoverConfeccao = (confeccaoId: string, produtoNome: string) => {
    if (confirm(`Deseja realmente remover a confecção de "${produtoNome}"?`)) {
      try {
        storageService.deleteConfeccao(confeccaoId);
        carregarDados();
        toast.success('Confecção removida com sucesso!');
      } catch (error) {
        toast.error('Erro ao remover confecção.');
        console.error(error);
      }
    }
  };

  const handleConfirmarProducao = (e: React.FormEvent) => {
    e.preventDefault();
    
    const produto = produtos.find(p => p.id === produtoSelecionado);
    if (!produto) {
      alert('Produto não encontrado!');
      return;
    }

    const materiais = storageService.getMateriais();
    const quantidade = parseInt(quantidadeConfeccionada);

    // Verifica se há estoque suficiente
    for (const mp of produto.materiais) {
      const material = materiais.find(m => m.id === mp.materialId);
      if (!material) continue;

      const consumoTotal = calcularConsumoMaterial(
        mp.quantidadeUsada * quantidade,
        material.unidadeUso,
        material.unidadeCompra
      );

      if (material.estoqueAtual < consumoTotal) {
        alert(`Estoque insuficiente de ${material.nome}! Necessário: ${consumoTotal.toFixed(2)} ${material.unidadeCompra}, Disponível: ${material.estoqueAtual} ${material.unidadeCompra}`);
        return;
      }
    }

    // Baixa o estoque
    const materiaisAtualizados = materiais.map(material => {
      const mp = produto.materiais.find(m => m.materialId === material.id);
      if (mp) {
        const consumoTotal = calcularConsumoMaterial(
          mp.quantidadeUsada * quantidade,
          material.unidadeUso,
          material.unidadeCompra
        );
        return {
          ...material,
          estoqueAtual: material.estoqueAtual - consumoTotal
        };
      }
      return material;
    });

    storageService.saveMateriais(materiaisAtualizados);

    // Registra a confecção
    const confeccao: Confeccao = {
      id: crypto.randomUUID(),
      produtoId: produto.id,
      produtoNome: produto.nome,
      quantidadeConfeccionada: quantidade,
      custoTotal: calcularCustoProduto(
        { ...produto, quantidadeProduzir: quantidade },
        materiais
      ),
      materiaisUsados: produto.materiais,
      dataConfeccao: new Date().toISOString(),
    };

    storageService.addConfeccao(confeccao);

    alert(`Produção registrada com sucesso! ${quantidade} ${quantidade === 1 ? 'unidade' : 'unidades'} de ${produto.nome}`);
    
    setProdutoSelecionado('');
    setQuantidadeConfeccionada('1');
    carregarDados();
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const produtoSelecionadoObj = produtos.find(p => p.id === produtoSelecionado);
  const materiais = storageService.getMateriais();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Produtos Confeccionados</h1>

      {/* Registrar Nova Confecção */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Registrar Nova Confecção
        </h2>

        {produtos.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-yellow-800">
              ⚠️ Você precisa cadastrar produtos antes de registrar confecções.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirmarProducao} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selecione o Produto
                </label>
                <select
                  value={produtoSelecionado}
                  onChange={(e) => setProdutoSelecionado(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Escolha um produto...</option>
                  {produtos.map(produto => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade Confeccionada
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantidadeConfeccionada}
                  onChange={(e) => setQuantidadeConfeccionada(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Preview da Confecção */}
            {produtoSelecionadoObj && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Preview - Materiais que serão consumidos:
                </h3>
                <ul className="space-y-2 text-sm">
                  {produtoSelecionadoObj.materiais.map(mp => {
                    const material = materiais.find(m => m.id === mp.materialId);
                    if (!material) return null;

                    const quantidadeTotal = mp.quantidadeUsada * parseInt(quantidadeConfeccionada);
                    const consumoEmUnidadeCompra = calcularConsumoMaterial(
                      quantidadeTotal,
                      material.unidadeUso,
                      material.unidadeCompra
                    );
                    const estoqueRestante = material.estoqueAtual - consumoEmUnidadeCompra;

                    return (
                      <li key={mp.materialId} className="flex justify-between items-center p-2 bg-white rounded">
                        <div>
                          <span className="font-medium text-gray-800">{material.nome}</span>
                          <p className="text-xs text-gray-600">
                            Consumo: {quantidadeTotal} {material.unidadeUso} = {consumoEmUnidadeCompra.toFixed(2)} {material.unidadeCompra}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-700">
                            Estoque atual: {material.estoqueAtual} {material.unidadeCompra}
                          </p>
                          <p className={`text-sm font-semibold ${estoqueRestante >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            Após: {estoqueRestante.toFixed(2)} {material.unidadeCompra}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 pt-4 border-t border-blue-300">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Custo total:</span>
                    <span className="text-xl font-bold text-green-600 ml-2">
                      R$ {calcularCustoProduto(
                        { ...produtoSelecionadoObj, quantidadeProduzir: parseInt(quantidadeConfeccionada) },
                        materiais
                      ).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              ✓ Confirmar Confecção e Baixar Estoque
            </button>
          </form>
        )}
      </div>

      {/* Histórico de Confecções */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 bg-gray-50 text-gray-700">
          Histórico de Confecções ({confeccoes.length})
        </h2>
        
        {confeccoes.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">
            Nenhuma confecção registrada ainda.
          </p>
        ) : (
          <div className="divide-y divide-gray-200">
            {confeccoes.map((confeccao) => (
              <div key={confeccao.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {confeccao.produtoNome}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatarData(confeccao.dataConfeccao)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      R$ {confeccao.custoTotal.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {confeccao.quantidadeConfeccionada} {confeccao.quantidadeConfeccionada === 1 ? 'unidade' : 'unidades'}
                    </p>
                    <button
                      onClick={() => handleRemoverConfeccao(confeccao.id, confeccao.produtoNome)}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">Materiais consumidos:</p>
                  <ul className="space-y-1 ml-2">
                    {confeccao.materiaisUsados.map((mp) => {
                      const material = materiais.find(m => m.id === mp.materialId);
                      if (!material) return null;
                      
                      const quantidadeTotal = mp.quantidadeUsada * confeccao.quantidadeConfeccionada;
                      
                      return (
                        <li key={mp.materialId}>
                          • {material.nome}: {quantidadeTotal} {material.unidadeUso}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
