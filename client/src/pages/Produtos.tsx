import { useState, useEffect } from 'react';
import type { Material, Produto, MaterialProduto } from '../types';
import { storageService } from '../services/storage';
import { calcularCustoProduto, calcularQuantidadeMaximaProduzir } from '../utils/calculos';

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [materiaisCadastrados, setMateriaisCadastrados] = useState<Material[]>([]);
  const [nome, setNome] = useState('');
  const [quantidadeProduzir, setQuantidadeProduzir] = useState('1');
  const [materiaisSelecionados, setMateriaisSelecionados] = useState<MaterialProduto[]>([]);
  const [editando, setEditando] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const produtosData = await storageService.getProdutos();
    const materiaisData = await storageService.getMateriais();
    setProdutos(produtosData);
    setMateriaisCadastrados(materiaisData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (materiaisSelecionados.length === 0) {
      alert('Adicione pelo menos um material ao produto!');
      return;
    }

    const produto: Produto = {
      id: editando || crypto.randomUUID(),
      nome,
      materiais: materiaisSelecionados,
      quantidadeProduzir: parseInt(quantidadeProduzir),
    };

    try {
      if (editando) {
        await storageService.updateProduto(produto);
        setEditando(null);
      } else {
        await storageService.addProduto(produto);
      }

      limparFormulario();
      await carregarDados();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto. Tente novamente.');
    }
  };

  const limparFormulario = () => {
    setNome('');
    setQuantidadeProduzir('1');
    setMateriaisSelecionados([]);
    setEditando(null);
  };

  const adicionarMaterial = (materialId: string, quantidade: number) => {
    const jaExiste = materiaisSelecionados.find(m => m.materialId === materialId);
    
    if (jaExiste) {
      setMateriaisSelecionados(
        materiaisSelecionados.map(m =>
          m.materialId === materialId
            ? { ...m, quantidadeUsada: quantidade }
            : m
        )
      );
    } else {
      setMateriaisSelecionados([
        ...materiaisSelecionados,
        { materialId, quantidadeUsada: quantidade }
      ]);
    }
  };

  const removerMaterial = (materialId: string) => {
    setMateriaisSelecionados(
      materiaisSelecionados.filter(m => m.materialId !== materialId)
    );
  };

  const handleEditar = (produto: Produto) => {
    setNome(produto.nome);
    setQuantidadeProduzir(produto.quantidadeProduzir?.toString() || '1');
    setMateriaisSelecionados(produto.materiais);
    setEditando(produto.id);
  };

  const handleDeletar = async (id: string) => {
    if (confirm('Deseja realmente deletar este produto?')) {
      try {
        await storageService.deleteProduto(id);
        await carregarDados();
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
        alert('Erro ao deletar produto. Tente novamente.');
      }
    }
  };

  const getMaterial = (materialId: string) => {
    return materiaisCadastrados.find(m => m.id === materialId);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        {editando ? 'Editar Produto' : 'Cadastrar Novo Produto'}
      </h1>

      {materiaisCadastrados.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-800">
            ⚠️ Você precisa cadastrar materiais antes de criar produtos. 
            Acesse a página de Materiais primeiro!
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome do Produto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Produto
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Bolsa de Couro, Vestido Longo..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade a Produzir
              </label>
              <input
                type="number"
                min="1"
                value={quantidadeProduzir}
                onChange={(e) => setQuantidadeProduzir(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1"
              />
            </div>
          </div>

          {/* Selecionar Materiais */}
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Materiais Necessários (por unidade)
            </h3>

            {materiaisCadastrados.length > 0 ? (
              <div className="space-y-3 mb-4">
                {materiaisCadastrados.map((material) => {
                  const materialSelecionado = materiaisSelecionados.find(
                    m => m.materialId === material.id
                  );

                  return (
                    <div key={material.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        checked={!!materialSelecionado}
                        onChange={(e) => {
                          if (e.target.checked) {
                            adicionarMaterial(material.id, 1);
                          } else {
                            removerMaterial(material.id);
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">
                          {material.nome}
                        </span>
                        <p className="text-xs text-gray-500">
                          Estoque: {material.estoqueAtual} {material.unidadeCompra} | 
                          R$ {material.valorUnitario.toFixed(2)}/{material.unidadeCompra}
                        </p>
                      </div>
                      {materialSelecionado && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.01"
                            value={materialSelecionado.quantidadeUsada}
                            onChange={(e) => adicionarMaterial(material.id, parseFloat(e.target.value) || 0)}
                            className="w-24 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="0"
                          />
                          <span className="text-sm text-gray-600">{material.unidadeUso}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Nenhum material cadastrado
              </p>
            )}

            {/* Resumo dos Materiais Selecionados */}
            {materiaisSelecionados.length > 0 && (
              <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Resumo (para {quantidadeProduzir} {parseInt(quantidadeProduzir) === 1 ? 'produto' : 'produtos'}):
                </h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {materiaisSelecionados.map((mp) => {
                    const material = getMaterial(mp.materialId);
                    if (!material) return null;
                    
                    const quantidadeTotal = mp.quantidadeUsada * parseInt(quantidadeProduzir);
                    
                    return (
                      <li key={mp.materialId}>
                        • {material.nome}: {quantidadeTotal} {material.unidadeUso}
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-3 pt-3 border-t border-blue-300">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Custo total:</span>
                    <span className="text-xl font-bold text-green-600 ml-2">
                      R$ {calcularCustoProduto(
                        { id: '', nome, materiais: materiaisSelecionados, quantidadeProduzir: parseInt(quantidadeProduzir) },
                        materiaisCadastrados
                      ).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={materiaisCadastrados.length === 0}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {editando ? 'Atualizar Produto' : 'Salvar Produto'}
            </button>
            {editando && (
              <button
                type="button"
                onClick={limparFormulario}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Produtos Cadastrados */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 bg-gray-50 text-gray-700">
          Produtos Cadastrados ({produtos.length})
        </h2>
        
        {produtos.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">
            Nenhum produto cadastrado ainda. Crie seu primeiro produto acima!
          </p>
        ) : (
          <div className="divide-y divide-gray-200">
            {produtos.map((produto) => {
              const custo = calcularCustoProduto(produto, materiaisCadastrados);
              const quantidadeMaxima = calcularQuantidadeMaximaProduzir(produto, materiaisCadastrados);

              return (
                <div key={produto.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {produto.nome}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Planejado: {produto.quantidadeProduzir || 1} {(produto.quantidadeProduzir || 1) === 1 ? 'unidade' : 'unidades'}
                      </p>
                      <p className="text-2xl font-bold text-green-600 mt-2">
                        R$ {custo.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditar(produto)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletar(produto.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Deletar
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Materiais por unidade:</p>
                    <ul className="space-y-1 ml-2">
                      {produto.materiais.map((mp) => {
                        const material = getMaterial(mp.materialId);
                        if (!material) return null;
                        
                        return (
                          <li key={mp.materialId}>
                            • {material.nome}: {mp.quantidadeUsada} {material.unidadeUso}
                          </li>
                        );
                      })}
                    </ul>
                    <p className="mt-3 text-blue-600 font-medium">
                      Estoque disponível para: {quantidadeMaxima} {quantidadeMaxima === 1 ? 'unidade' : 'unidades'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
