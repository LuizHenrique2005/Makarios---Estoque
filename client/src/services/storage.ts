import type { Material, Produto, Confeccao } from '../types';
import { firebaseService } from './firebaseService';

// Service que usa Firebase (sincroniza entre dispositivos)
export const storageService = {
  // Materiais
  getMateriais(): Promise<Material[]> {
    return firebaseService.getMateriais();
  },

  saveMateriais(materiais: Material[]): Promise<void> {
    return firebaseService.saveMateriais(materiais);
  },

  addMaterial(material: Material): Promise<void> {
    return firebaseService.addMaterial(material);
  },

  updateMaterial(material: Material): Promise<void> {
    return firebaseService.updateMaterial(material);
  },

  deleteMaterial(id: string): Promise<void> {
    return firebaseService.deleteMaterial(id);
  },

  // Produtos
  getProdutos(): Promise<Produto[]> {
    return firebaseService.getProdutos();
  },

  saveProdutos(produtos: Produto[]): Promise<void> {
    return firebaseService.saveProdutos(produtos);
  },

  addProduto(produto: Produto): Promise<void> {
    return firebaseService.addProduto(produto);
  },

  updateProduto(produto: Produto): Promise<void> {
    return firebaseService.updateProduto(produto);
  },

  deleteProduto(id: string): Promise<void> {
    return firebaseService.deleteProduto(id);
  },

  // Confecções
  getConfeccoes(): Promise<Confeccao[]> {
    return firebaseService.getConfeccoes();
  },

  saveConfeccoes(confeccoes: Confeccao[]): Promise<void> {
    return firebaseService.saveConfeccoes(confeccoes);
  },

  addConfeccao(confeccao: Confeccao): Promise<void> {
    return firebaseService.addConfeccao(confeccao);
  },

  deleteConfeccao(id: string): Promise<void> {
    return firebaseService.deleteConfeccao(id);
  },
};
