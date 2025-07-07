import axios, { AxiosError, AxiosResponse } from 'axios';
import { SignInData, SignUpData } from '@/types/requests.d';

class AuthAPI {
  private apiClient = axios.create({
    withCredentials: true,
  });

  public signIn = async (data: SignInData): Promise<any> => {
    try {
      const response: AxiosResponse = await this.apiClient.post(
        '/api/auth/callback/credentials',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  };

  public signUp = async (data: SignUpData): Promise<any> => {
    try {
      const response: AxiosResponse = await this.apiClient.post(
        '/api/auth/signup',
        data
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  };

  public signOut = async (): Promise<any> => {
    try {
      const response: AxiosResponse = await this.apiClient.get(
        '/api/auth/signout',
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  }
}

export const useAuthApi = new AuthAPI();