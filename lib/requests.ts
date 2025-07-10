import axios, { AxiosError, AxiosResponse, AxiosInstance } from 'axios';
import { SignUpData } from '@/types/requests.d';

export class BaseAPI {
  protected readonly apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      // baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/',
      withCredentials: true,
    });
  }
}

export class AuthAPI extends BaseAPI {
  public signUp = async (data: SignUpData): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.post('/api/auth/signup', data);
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  };
}

export class PostAPI extends BaseAPI {
  public getPosts = async (): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.get('/api/posts');
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  };
  public createPost = async (data: any): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.post('/api/posts', data);
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  }
  public deletePost = async (id: string): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.delete(`/api/posts/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  }
  public updatePost = async (id: string, data: any): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.put(`/api/posts/${id}`, data);
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  }
}

class MediaAPI extends BaseAPI {
  public getMedia = async (): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.get('/api/media');
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  }
  public uploadMedia = async (file: File): Promise<AxiosResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await this.apiClient.post('/api/media', formData);
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  }
  public deleteMedia = async (id: string): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.delete(`/api/media/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  }
}

export const useAuthApi = new AuthAPI();
export const usePostApi = new PostAPI();
export const useMediaApi = new MediaAPI();
