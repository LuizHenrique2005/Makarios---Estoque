import { useState, useEffect } from 'react';
import { Package, Eye, ShoppingCart, Factory } from 'lucide-react';
import type { Produto, Material } from '../types';
import { storageService } from '../services/storage';
import { calcularCustoProduto, calcularQuantidadeMaximaProduzir } from '../utils/calculos';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { formatarMoeda } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    setProdutos(storageService.getProdutos());
    setMateriais(storageService.getMateriais());
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Meus Produtos</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/cadastrar')}
          icon={ShoppingCart}
        >
          Novo Produto
        </Button>
      </div>

      {produtos.length === 0 ? (
        <Card>
          <EmptyState
            icon={Package}
            title="Nenhum produto cadastrado"
            description="Comece criando seu primeiro produto. Você precisará ter materiais cadastrados antes de criar um produto."
            actionLabel="Cadastrar Produto"
            onAction={() => navigate('/cadastrar')}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map((produto) => {
            const custo = calcularCustoProduto(produto, materiais);
            const quantidadeMaxima = calcularQuantidadeMaximaProduzir(produto, materiais);
            const estoqueInsuficiente = quantidadeMaxima === 0;

            return (
              <Card
                key={produto.id}
                className={`cursor-pointer hover:shadow-lg transition-all border-2 ${
                  estoqueInsuficiente 
                    ? 'border-red-300 bg-red-50/30' 
                    : 'border-transparent hover:border-blue-500'
                }`}
                onClick={() => handleSelecionarProduto(produto)}
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {produto.nome}
                    </h3>
                    {estoqueInsuficiente && (
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded">
                        Estoque Insuficiente
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Custo de Produção:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatarMoeda(custo)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Estoque para:</span>
                      <span className={`text-lg font-bold ${
                        estoqueInsuficiente ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {quantidadeMaxima} {quantidadeMaxima === 1 ? 'unidade' : 'unidades'}
                      </span>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs text-gray-500">
                        {produto.materiais.length} {produto.materiais.length === 1 ? 'material' : 'materiais'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelecionarProduto(produto);
                      }}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Detalhes */}
      {produtoSelecionado && (
        <Modal
          isOpen={!!produtoSelecionado}
          onClose={fecharDetalhes}
          title={produtoSelecionado.nome}
          size="lg"
        >
          <div className="space-y-6">
            {/* Resumo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Custo Total</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatarMoeda(calcularCustoProduto(produtoSelecionado, materiais))}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Estoque para</p>
                <p className="text-2xl font-bold text-blue-600">
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

                  const estoqueSuficiente = material.estoqueAtual > 0;

                  return (
                    <div
                      key={mp.materialId}
                      className={`p-4 rounded-lg border ${
                        estoqueSuficiente
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-800 text-lg">
                              {material.nome}
                            </p>
                            {!estoqueSuficiente && (
                              <span className="px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-100 rounded">
                                Sem estoque
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {mp.quantidadeUsada} {material.unidadeUso} por produto
                          </p>
                          <p className={`text-xs mt-1 ${
                            estoqueSuficiente ? 'text-gray-500' : 'text-red-600 font-semibold'
                          }`}>
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

          <div className="mt-6 flex gap-3">
            <Button
              variant="success"
              onClick={() => {
                fecharDetalhes();
                navigate('/confeccoes', { state: { produtoId: produtoSelecionado.id } });
              }}
              className="flex-1"
              icon={Factory}
            >
              Ir para Confecção
            </Button>
            <Button
              variant="secondary"
              onClick={fecharDetalhes}
              className="flex-1"
            >
              Fechar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
