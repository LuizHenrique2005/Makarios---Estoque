import { useState, useEffect } from 'react';
import { Package2, Edit, Trash2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Material } from '../types';
import { storageService } from '../services/storage';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import EmptyState from '../components/EmptyState';
import { formatarMoeda } from '../utils/helpers';

export default function Materiais() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [nome, setNome] = useState('');
  const [unidadeCompra, setUnidadeCompra] = useState('metros');
  const [unidadeUso, setUnidadeUso] = useState('cm');
  const [estoqueAtual, setEstoqueAtual] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [editando, setEditando] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarMateriais();
  }, []);

  const carregarMateriais = async () => {
    try {
      const dados = await storageService.getMateriais();
      setMateriais(dados);
    } catch (error) {
      toast.error('Erro ao carregar materiais');
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const material: Material = {
        id: editando || crypto.randomUUID(),
        nome,
        unidadeCompra,
        unidadeUso,
        estoqueAtual: parseFloat(estoqueAtual),
        valorUnitario: parseFloat(valorUnitario),
      };

      if (editando) {
        await storageService.updateMaterial(material);
        toast.success('Material atualizado com sucesso!');
        setEditando(null);
      } else {
        await storageService.addMaterial(material);
        toast.success('Material cadastrado com sucesso!');
      }

      limparFormulario();
      await carregarMateriais();
    } catch (error) {
      toast.error('Erro ao salvar material. Tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const limparFormulario = () => {
    setNome('');
    setUnidadeCompra('metros');
    setUnidadeUso('cm');
    setEstoqueAtual('');
    setValorUnitario('');
    setEditando(null);
  };

  const handleEditar = (material: Material) => {
    setNome(material.nome);
    setUnidadeCompra(material.unidadeCompra);
    setUnidadeUso(material.unidadeUso);
    setEstoqueAtual(material.estoqueAtual.toString());
    setValorUnitario(material.valorUnitario.toString());
    setEditando(material.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletar = async (id: string, nome: string) => {
    if (confirm(`Deseja realmente deletar o material "${nome}"?`)) {
      try {
        await storageService.deleteMaterial(id);
        await carregarMateriais();
        toast.success('Material deletado com sucesso!');
      } catch (error) {
        toast.error('Erro ao deletar material.');
        console.error(error);
      }
    }
  };

  const unidadesCompra = [
    { value: 'metros', label: 'Metros' },
    { value: 'unidades', label: 'Unidades' },
    { value: 'kg', label: 'Quilogramas (kg)' },
    { value: 'litros', label: 'Litros' },
  ];

  const getUnidadesUso = (unidadeCompra: string) => {
    if (unidadeCompra === 'metros') {
      return [
        { value: 'metros', label: 'Metros' },
        { value: 'cm', label: 'Centímetros (cm)' },
      ];
    }
    if (unidadeCompra === 'kg') {
      return [
        { value: 'kg', label: 'Quilogramas (kg)' },
        { value: 'gramas', label: 'Gramas' },
      ];
    }
    if (unidadeCompra === 'litros') {
      return [
        { value: 'litros', label: 'Litros' },
        { value: 'ml', label: 'Mililitros (ml)' },
      ];
    }
    return [{ value: 'unidades', label: 'Unidades' }];
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciar Materiais</h1>
      </div>

      <Card 
        title={editando ? 'Editar Material' : 'Cadastrar Novo Material'}
        className="mb-8"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome do Material"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Ex: Tecido, Linha, Couro..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidade de Compra
              </label>
              <select
                value={unidadeCompra}
                onChange={(e) => {
                  setUnidadeCompra(e.target.value);
                  // Ajusta a unidade de uso automaticamente
                  if (e.target.value === 'metros') setUnidadeUso('cm');
                  else if (e.target.value === 'kg') setUnidadeUso('gramas');
                  else if (e.target.value === 'litros') setUnidadeUso('ml');
                  else setUnidadeUso('unidades');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {unidadesCompra.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Como você compra</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidade de Uso
              </label>
              <select
                value={unidadeUso}
                onChange={(e) => setUnidadeUso(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {getUnidadesUso(unidadeCompra).map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Como você usa na peça</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={`Estoque Atual (${unidadeCompra})`}
              type="number"
              step="0.01"
              value={estoqueAtual}
              onChange={(e) => setEstoqueAtual(e.target.value)}
              required
              placeholder="0"
            />

            <Input
              label={`Valor Unitário (R$ por ${unidadeCompra})`}
              type="number"
              step="0.01"
              value={valorUnitario}
              onChange={(e) => setValorUnitario(e.target.value)}
              required
              placeholder="0.00"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={editando ? undefined : Plus}
            >
              {editando ? 'Atualizar' : 'Cadastrar'} Material
            </Button>
            {editando && (
              <Button
                type="button"
                variant="secondary"
                onClick={limparFormulario}
                icon={X}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card 
        title="Materiais Cadastrados"
        subtitle={`${materiais.length} ${materiais.length === 1 ? 'material' : 'materiais'} cadastrado${materiais.length === 1 ? '' : 's'}`}
      >
        {materiais.length === 0 ? (
          <EmptyState
            icon={Package2}
            title="Nenhum material cadastrado"
            description="Comece adicionando seu primeiro material usando o formulário acima."
            actionLabel="Ir para o formulário"
            onAction={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Unidades
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {materiais.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {material.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {material.estoqueAtual} {material.unidadeCompra}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Compra: {material.unidadeCompra}</span>
                        <span className="text-xs text-gray-500">Uso: {material.unidadeUso}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {formatarMoeda(material.valorUnitario)}/{material.unidadeCompra}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditar(material)}
                          icon={Edit}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeletar(material.id, material.nome)}
                          icon={Trash2}
                        >
                          Deletar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
