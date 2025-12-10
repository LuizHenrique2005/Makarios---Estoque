import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Package, DollarSign, TrendingUp, AlertTriangle, 
  ShoppingBag
} from 'lucide-react';
import { storageService } from '../services/storage';
import type { Produto, Material, Confeccao } from '../types';
import StatCard from '../components/StatCard';
import Card from '../components/Card';

export default function Dashboard() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [confeccoes, setConfeccoes] = useState<Confeccao[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const produtosData = await storageService.getProdutos();
    const materiaisData = await storageService.getMateriais();
    const confeccoesData = await storageService.getConfeccoes();
    setProdutos(produtosData);
    setMateriais(materiaisData);
    setConfeccoes(confeccoesData);
  };

  // KPIs
  const totalProdutos = produtos.length;
  const totalConfeccoes = confeccoes.reduce((sum, c) => sum + c.quantidadeConfeccionada, 0);
  const custoTotalConfeccoes = confeccoes.reduce((sum, c) => sum + c.custoTotal, 0);

  const valorEstoque = materiais.reduce(
    (sum, m) => sum + (m.estoqueAtual * m.valorUnitario),
    0
  );

  // Materiais com estoque baixo (menos de 20% do ideal - estimando 100 unidades como ideal)
  const materiaisBaixoEstoque = materiais.filter(m => m.estoqueAtual < 20).length;

  // Dados para gráfico de confecções por produto
  const confeccoesPorProduto = confeccoes.reduce((acc, conf) => {
    const existing = acc.find(item => item.nome === conf.produtoNome);
    if (existing) {
      existing.quantidade += conf.quantidadeConfeccionada;
      existing.custo += conf.custoTotal;
    } else {
      acc.push({
        nome: conf.produtoNome,
        quantidade: conf.quantidadeConfeccionada,
        custo: conf.custoTotal,
      });
    }
    return acc;
  }, [] as { nome: string; quantidade: number; custo: number }[]);

  // Dados para gráfico de valor de estoque por material
  const estoqueValorMateriais = materiais
    .map(m => ({
      nome: m.nome.length > 15 ? m.nome.substring(0, 15) + '...' : m.nome,
      valor: parseFloat((m.estoqueAtual * m.valorUnitario).toFixed(2)),
    }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 10);

  // Dados para gráfico de pizza - distribuição de custos
  const distribuicaoCustos = materiais.map(m => ({
    name: m.nome,
    value: parseFloat((m.estoqueAtual * m.valorUnitario).toFixed(2)),
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  // Confecções dos últimos 7 dias
  const ultimasConfeccoes = confeccoes
    .sort((a, b) => new Date(b.dataConfeccao).getTime() - new Date(a.dataConfeccao).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do seu negócio</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Produtos"
          value={totalProdutos}
          icon={<Package className="w-6 h-6" />}
          color="blue"
          subtitle="Produtos cadastrados"
        />
        <StatCard
          title="Valor em Estoque"
          value={`R$ ${valorEstoque.toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
          subtitle="Total investido"
        />
        <StatCard
          title="Produção Total"
          value={totalConfeccoes}
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
          subtitle="Peças confeccionadas"
        />
        <StatCard
          title="Estoque Baixo"
          value={materiaisBaixoEstoque}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="red"
          subtitle="Materiais para repor"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confecções por Produto */}
        <Card title="Produção por Produto" subtitle="Quantidade confeccionada">
          {confeccoesPorProduto.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={confeccoesPorProduto}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantidade" fill="#3B82F6" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Nenhuma confecção registrada ainda
            </div>
          )}
        </Card>

        {/* Valor em Estoque por Material */}
        <Card title="Valor em Estoque" subtitle="Por material (Top 10)">
          {estoqueValorMateriais.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={estoqueValorMateriais} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="nome" type="category" width={100} />
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Bar dataKey="valor" fill="#10B981" name="Valor (R$)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Nenhum material cadastrado
            </div>
          )}
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição de Investimento */}
        <Card title="Distribuição de Investimento" subtitle="Estoque por material">
          {distribuicaoCustos.length > 0 && distribuicaoCustos.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribuicaoCustos}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: R$ ${entry.value.toFixed(2)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distribuicaoCustos.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Nenhum investimento em estoque
            </div>
          )}
        </Card>

        {/* Últimas Confecções */}
        <Card title="Últimas Confecções" subtitle="Atividade recente">
          {ultimasConfeccoes.length > 0 ? (
            <div className="space-y-3">
              {ultimasConfeccoes.map((conf) => (
                <div
                  key={conf.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <ShoppingBag className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{conf.produtoNome}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(conf.dataConfeccao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {conf.quantidadeConfeccionada} {conf.quantidadeConfeccionada === 1 ? 'un' : 'uns'}
                    </p>
                    <p className="text-sm text-green-600">R$ {conf.custoTotal.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Nenhuma confecção registrada
            </div>
          )}
        </Card>
      </div>

      {/* Resumo Financeiro */}
      <Card title="Resumo Financeiro" subtitle="Análise de custos">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium">Total em Estoque</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              R$ {valorEstoque.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium">Custo de Produção</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              R$ {custoTotalConfeccoes.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium">Custo Médio/Peça</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              R$ {totalConfeccoes > 0 ? (custoTotalConfeccoes / totalConfeccoes).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </Card>

      {/* Alertas */}
      {materiaisBaixoEstoque > 0 && (
        <Card>
          <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Atenção: Estoque Baixo</h4>
              <p className="text-sm text-red-700 mt-1">
                Você tem {materiaisBaixoEstoque} {materiaisBaixoEstoque === 1 ? 'material' : 'materiais'} com estoque baixo. 
                Considere fazer uma reposição para não interromper a produção.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
