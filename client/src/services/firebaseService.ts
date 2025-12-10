import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import type { Material, Produto, Confeccao } from '../types';

export const firebaseService = {
  // Materiais
  async getMateriais(): Promise<Material[]> {
    const querySnapshot = await getDocs(collection(db, 'materiais'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Material));
  },

  async addMaterial(material: Omit<Material, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'materiais'), material);
    return docRef.id;
  },

  async updateMaterial(id: string, material: Partial<Material>): Promise<void> {
    await updateDoc(doc(db, 'materiais', id), material);
  },

  async deleteMaterial(id: string): Promise<void> {
    await deleteDoc(doc(db, 'materiais', id));
  },

  // Produtos
  async getProdutos(): Promise<Produto[]> {
    const querySnapshot = await getDocs(collection(db, 'produtos'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Produto));
  },

  async addProduto(produto: Omit<Produto, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'produtos'), produto);
    return docRef.id;
  },

  async updateProduto(id: string, produto: Partial<Produto>): Promise<void> {
    await updateDoc(doc(db, 'produtos', id), produto);
  },

  async deleteProduto(id: string): Promise<void> {
    await deleteDoc(doc(db, 'produtos', id));
  },

  // Confecções
  async getConfeccoes(): Promise<Confeccao[]> {
    const q = query(collection(db, 'confeccoes'), orderBy('dataConfeccao', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Confeccao));
  },

  async addConfeccao(confeccao: Omit<Confeccao, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'confeccoes'), confeccao);
    return docRef.id;
  },

  async deleteConfeccao(id: string): Promise<void> {
    await deleteDoc(doc(db, 'confeccoes', id));
  },

  // Função para salvar materiais em lote (útil para manter localStorage sincronizado)
  async saveMateriais(materiais: Material[]): Promise<void> {
    // Esta função só é necessária se quiser sincronizar dados do localStorage
    // Para o Firebase, use addMaterial/updateMaterial individualmente
  },

  async saveProdutos(produtos: Produto[]): Promise<void> {
    // Similar ao saveMateriais
  },

  async saveConfeccoes(confeccoes: Confeccao[]): Promise<void> {
    // Similar ao saveMateriais
  },
};
