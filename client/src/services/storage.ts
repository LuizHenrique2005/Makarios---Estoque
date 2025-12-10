import type { Material, Produto, Confeccao } from '../types';

const MATERIAIS_KEY = 'materiais';
const PRODUTOS_KEY = 'produtos';
const CONFECCOES_KEY = 'confeccoes';

export const storageService = {
  // Materiais
  getMateriais(): Material[] {
    const data = localStorage.getItem(MATERIAIS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveMateriais(materiais: Material[]): void {
    localStorage.setItem(MATERIAIS_KEY, JSON.stringify(materiais));
  },

  addMaterial(material: Material): void {
    const materiais = this.getMateriais();
    materiais.push(material);
    this.saveMateriais(materiais);
  },

  updateMaterial(material: Material): void {
    const materiais = this.getMateriais();
    const index = materiais.findIndex(m => m.id === material.id);
    if (index !== -1) {
      materiais[index] = material;
      this.saveMateriais(materiais);
    }
  },

  deleteMaterial(id: string): void {
    const materiais = this.getMateriais().filter(m => m.id !== id);
    this.saveMateriais(materiais);
  },

  // Produtos
  getProdutos(): Produto[] {
    const data = localStorage.getItem(PRODUTOS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveProdutos(produtos: Produto[]): void {
    localStorage.setItem(PRODUTOS_KEY, JSON.stringify(produtos));
  },

  addProduto(produto: Produto): void {
    const produtos = this.getProdutos();
    produtos.push(produto);
    this.saveProdutos(produtos);
  },

  updateProduto(produto: Produto): void {
    const produtos = this.getProdutos();
    const index = produtos.findIndex(p => p.id === produto.id);
    if (index !== -1) {
      produtos[index] = produto;
      this.saveProdutos(produtos);
    }
  },

  deleteProduto(id: string): void {
    const produtos = this.getProdutos().filter(p => p.id !== id);
    this.saveProdutos(produtos);
  },

  // Confecções
  getConfeccoes(): Confeccao[] {
    const data = localStorage.getItem(CONFECCOES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveConfeccoes(confeccoes: Confeccao[]): void {
    localStorage.setItem(CONFECCOES_KEY, JSON.stringify(confeccoes));
  },

  addConfeccao(confeccao: Confeccao): void {
    const confeccoes = this.getConfeccoes();
    confeccoes.unshift(confeccao); // Adiciona no início
    this.saveConfeccoes(confeccoes);
  },

  deleteConfeccao(id: string): void {
    const confeccoes = this.getConfeccoes().filter(c => c.id !== id);
    this.saveConfeccoes(confeccoes);
  },
};
