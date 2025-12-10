import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  writeBatch,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';
import type { Material, Produto, Confeccao } from '../types';

export const firebaseService = {
  // Materiais
  async getMateriais(): Promise<Material[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'materiais'));
      return querySnapshot.docs.map(doc => ({ 
        ...doc.data(), 
        id: doc.id 
      } as Material));
    } catch (error) {
      console.error('Erro ao buscar materiais:', error);
      return [];
    }
  },

  async addMaterial(material: Material): Promise<void> {
    try {
      if (material.id) {
        // Usa setDoc para criar documento com ID customizado
        await setDoc(doc(db, 'materiais', material.id), material);
      } else {
        // Usa addDoc para criar com ID auto-gerado
        await addDoc(collection(db, 'materiais'), material);
      }
    } catch (error) {
      console.error('Erro ao adicionar material:', error);
      throw error;
    }
  },

  async updateMaterial(material: Material): Promise<void> {
    try {
      if (!material.id) throw new Error('ID do material não fornecido');
      // Usa setDoc com merge para atualizar mantendo o documento completo
      await setDoc(doc(db, 'materiais', material.id), material, { merge: true });
    } catch (error) {
      console.error('Erro ao atualizar material:', error);
      throw error;
    }
  },

  async deleteMaterial(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'materiais', id));
    } catch (error) {
      console.error('Erro ao deletar material:', error);
      throw error;
    }
  },

  async saveMateriais(materiais: Material[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      materiais.forEach((material) => {
        if (material.id) {
          const docRef = doc(db, 'materiais', material.id);
          batch.set(docRef, material);
        }
      });
      await batch.commit();
    } catch (error) {
      console.error('Erro ao salvar materiais:', error);
      throw error;
    }
  },

  // Produtos
  async getProdutos(): Promise<Produto[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'produtos'));
      return querySnapshot.docs.map(doc => ({ 
        ...doc.data(), 
        id: doc.id 
      } as Produto));
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  },

  async addProduto(produto: Produto): Promise<void> {
    try {
      if (produto.id) {
        await setDoc(doc(db, 'produtos', produto.id), produto);
      } else {
        await addDoc(collection(db, 'produtos'), produto);
      }
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      throw error;
    }
  },

  async updateProduto(produto: Produto): Promise<void> {
    try {
      if (!produto.id) throw new Error('ID do produto não fornecido');
      await setDoc(doc(db, 'produtos', produto.id), produto, { merge: true });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  },

  async deleteProduto(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'produtos', id));
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  },

  async saveProdutos(produtos: Produto[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      produtos.forEach((produto) => {
        if (produto.id) {
          const docRef = doc(db, 'produtos', produto.id);
          batch.set(docRef, produto);
        }
      });
      await batch.commit();
    } catch (error) {
      console.error('Erro ao salvar produtos:', error);
      throw error;
    }
  },

  // Confecções
  async getConfeccoes(): Promise<Confeccao[]> {
    try {
      const q = query(collection(db, 'confeccoes'), orderBy('dataConfeccao', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        ...doc.data(), 
        id: doc.id 
      } as Confeccao));
    } catch (error) {
      console.error('Erro ao buscar confecções:', error);
      return [];
    }
  },

  async addConfeccao(confeccao: Confeccao): Promise<void> {
    try {
      if (confeccao.id) {
        await setDoc(doc(db, 'confeccoes', confeccao.id), confeccao);
      } else {
        await addDoc(collection(db, 'confeccoes'), confeccao);
      }
    } catch (error) {
      console.error('Erro ao adicionar confecção:', error);
      throw error;
    }
  },

  async deleteConfeccao(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'confeccoes', id));
    } catch (error) {
      console.error('Erro ao deletar confecção:', error);
      throw error;
    }
  },

  async saveConfeccoes(confeccoes: Confeccao[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      confeccoes.forEach((confeccao) => {
        if (confeccao.id) {
          const docRef = doc(db, 'confeccoes', confeccao.id);
          batch.set(docRef, confeccao);
        }
      });
      await batch.commit();
    } catch (error) {
      console.error('Erro ao salvar confecções:', error);
      throw error;
    }
  },
};
