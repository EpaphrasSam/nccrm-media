import { User } from "./types";
import { mockUsers } from "./mock-data";
import { USER_STATUSES } from "@/lib/constants";

// Simulating API call with mock data
export async function fetchUsers(): Promise<User[]> {
  return new Promise((resolve) => setTimeout(() => resolve(mockUsers), 1000));
}

export async function fetchUserById(id: string): Promise<User | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.id === id);
      resolve(user || null);
    }, 1000);
  });
}

export async function createUser(
  user: Omit<User, "id" | "createdAt" | "avatarUrl">
): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: User = {
        ...user,
        id: Math.random().toString(36).substr(2, 9),
      };
      resolve(newUser);
    }, 1000);
  });
}

export async function updateUser(
  id: string,
  user: Partial<User>
): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingUser = mockUsers.find((u) => u.id === id);
      if (!existingUser) {
        reject(new Error("User not found"));
        return;
      }
      const updatedUser = { ...existingUser, ...user };
      resolve(updatedUser);
    }, 1000);
  });
}

export async function deleteUser(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userIndex = mockUsers.findIndex((u) => u.id === id);
      if (userIndex === -1) {
        reject(new Error("User not found"));
        return;
      }
      resolve();
    }, 1000);
  });
}

export async function approveUser(id: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.id === id);
      if (!user) {
        reject(new Error("User not found"));
        return;
      }
      const updatedUser = { ...user, status: USER_STATUSES.ACTIVE };
      resolve(updatedUser);
    }, 1000);
  });
}

export async function rejectUser(id: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.id === id);
      if (!user) {
        reject(new Error("User not found"));
        return;
      }
      const updatedUser = { ...user, status: USER_STATUSES.INACTIVE };
      resolve(updatedUser);
    }, 1000);
  });
}
