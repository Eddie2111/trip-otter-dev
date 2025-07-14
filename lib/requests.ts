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
      const response = await this.apiClient.get("/api/posts");
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  };
  public getPost = async (id: string): Promise<AxiosResponse> => {
    if (!id) throw new Error("Post ID is required");
    try {
      const response = await this.apiClient.get(`/api/posts?id=${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  };
  public createPost = async (data: any): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.post("/api/posts", data);
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  };
  public deletePost = async (id: string): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.delete(`/api/posts?id=${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  };
  public updatePost = async (
    data: { postId: string; caption?: string; location?: string }
  ): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.patch(`/api/posts`, data);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data: any; status: number };
        message: string;
      };
      throw axiosError.response?.data || axiosError.message;
    }
  };
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

class LikeAPI extends BaseAPI {
  public likePost = async (postId: string): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.post(`/api/reaction`, { post: postId });
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  }
  public getLikes = async (id: string): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.get(`/api/reaction?id=${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  }
}

class CommentAPI extends BaseAPI {
  public createComment = async (postId: string, comment: string): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.post(`/api/comment/`, {
        content: comment,
        post: postId,
      });
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  }
  public getComments = async (postId: string): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.get(`/api/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  }
  public updateComment = async (commentId: string, comment: string): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.patch(`/api/comment`, { id: commentId, content: comment });
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  }
  public deleteComment = async (commentId: string): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.delete(`/api/comment?id=${commentId}`);
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  }
}

class UserAPI extends BaseAPI {
  public getUser = async (id: string): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.get(`/api/users?id=${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as any;
      throw axiosError.response?.data || axiosError.message;
    }
  }
  public updateUser = async (data: any): Promise<AxiosResponse> => {
    try {
      const response = await this.apiClient.patch(`/api/users`, data);
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
export const useLikeApi = new LikeAPI();
export const useCommentApi = new CommentAPI();
export const useUserApi = new UserAPI();
