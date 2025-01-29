import axios, { AxiosInstance, AxiosError } from "axios";
import { UserPayload } from "./types";
import { ApiStatus } from "./status";
import { Messages } from "../../../../../constants/messages";

axios.defaults.withCredentials = true;

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3210/api",
});

export class ApiService {
  async login(email: string, auth_identifier: string): Promise<number> {
    try {
      const response = await api.post("/auth/login", {
        email,
        auth_identifier,
      });
      return response.status;
    } catch (error) {
      if ((error as AxiosError).response?.status === 401) {
        return 401;
      }
      throw error;
    }
  }

  async registerNewUser(data: UserPayload): Promise<number> {
    console.log(data);
    try {
      const response = await api.post("/users/create-new-user", {
        userData: data,
      });
      return response.status;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response?.data.message ===
          Messages.commonUserExistsByEmail()
          ? ApiStatus.ExistingUser
          : error.response?.status || 500;
      }
      throw error;
    }
  }

  async status() {
    try {
      const response = await api.get("/auth/status", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        if (error.response?.data.message === "Email not verified") {
          return ApiStatus.EmailNotVerified;
        }
        return null;
      }
    }
  }

  async createDepositInvoice(amount: number) {
    try {
      const response = await api.post(
        "/invoices/create-deposit-invoice",
        { amount },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating deposit invoice:", error);
    }
  }

  async createWithdrawalInvoice(amount: number, isManual: boolean) {
    try {
      const response = await api.post(
        "/invoices/create-withdrawal-invoice",
        { amount, isManual },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating withdrawal invoice:", error);
    }
  }

  async verifyEmail(userId: string): Promise<boolean> {
    try {
      const response = await api.post("/auth/verify-email", {
        id: userId,
      });
      return response.data;
    } catch (error) {
      console.error("Error verifying email:", error);
      return false;
    }
  }

  async resendEmail(): Promise<boolean> {
    try {
      const response = await api.post("/auth/resend-verification-email");
      return response.data;
    } catch (error) {
      console.error("Error resending email:", error);
      return false;
    }
  }

  async logout() {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }
}
