import { useState, useEffect } from 'react';
import type { Material } from '../types';
import { storageService } from '../services/storage';

export default function Materiais() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [nome, setNome] = useState('');
  const [unidadeCompra, setUnidadeCompra] = useState('metros');
  const [unidadeUso, setUnidadeUso] = useState('cm');
  const [estoqueAtual, setEstoqueAtual] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [editando, setEditando] = useState<string | null>(null);

  useEffect(() => {
    carregarMateriais();
  }, []);

  const carregarMateriais = () => {
    setMateriais(storageService.getMateriais());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const material: Material = {
      id: editando || crypto.randomUUID(),
      nome,
      unidadeCompra,
      unidadeUso,
      estoqueAtual: parseFloat(estoqueAtual),
      valorUnitario: parseFloat(valorUnitario),
    };

    if (editando) {
      storageService.updateMaterial(material);
      setEditando(null);
    } else {
      storageService.addMaterial(material);
    }

    limparFormulario();
    carregarMateriais();
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
  };

  const handleDeletar = (id: string) => {
    if (confirm('Deseja realmente deletar este material?')) {
      storageService.deleteMaterial(id);
      carregarMateriais();
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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Gerenciar Materiais</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {editando ? 'Editar Material' : 'Cadastrar Novo Material'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Material
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Tecido, Linha, Couro..."
            />
          </div>

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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estoque Atual ({unidadeCompra})
              </label>
              <input
                type="number"
                step="0.01"
                value={estoqueAtual}
                onChange={(e) => setEstoqueAtual(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Unitário (R$ por {unidadeCompra})
              </label>
              <input
                type="number"
                step="0.01"
                value={valorUnitario}
                onChange={(e) => setValorUnitario(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {editando ? 'Atualizar' : 'Cadastrar'} Material
            </button>
            {editando && (
              <button
                type="button"
                onClick={limparFormulario}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 bg-gray-50 text-gray-700">
          Materiais Cadastrados ({materiais.length})
        </h2>
        
        {materiais.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">
            Nenhum material cadastrado ainda. Adicione o primeiro material acima!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
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
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {material.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {material.estoqueAtual} {material.unidadeCompra}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      Compra: {material.unidadeCompra}<br/>
                      Uso: {material.unidadeUso}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      R$ {material.valorUnitario.toFixed(2)}/{material.unidadeCompra}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditar(material)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeletar(material.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
