import axiosInstance from "@/services/axiosInstance";
import axios from "axios";
import { LiveClass } from "@/types/liveclass";

/**
 * Create Live Class (Admin)
 */
export async function createLiveClass(payload: {
  sessionId: number;
  title: string;
  scheduledAt: string; // PKT ISO string
  durationMinutes: number;
}): Promise<void> {
  try {
    await axiosInstance.post("/LiveClass/Create", payload);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error creating live class:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error creating live class:", error);
    }
    throw error;
  }
}

/**
 * Get Live Classes for a Session
 */
export async function getSessionLiveClasses(
  sessionId: number
): Promise<LiveClass[]> {
  try {
    const response = await axiosInstance.get<LiveClass[]>(
      `/LiveClass/GetAllForSession/session/${sessionId}/all`
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching live classes:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error fetching live classes:", error);
    }
    throw error;
  }
}

/**
 * Start Live Class (Admin joins as host)
 */
export async function startLiveClass(id: number): Promise<void> {
  try {
    await axiosInstance.post(`/LiveClass/Start/${id}/start`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error starting live class:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error starting live class:", error);
    }
    throw error;
  }
}

/**
 * End Live Class
 */
export async function endLiveClass(id: number): Promise<void> {
  try {
    await axiosInstance.post(`/LiveClass/End/${id}/end`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error ending live class:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error ending live class:", error);
    }
    throw error;
  }
}

export const getStudentLiveClasses = async (id: number): Promise<LiveClass[]> => {
  try {
    const response = await axiosInstance.get<LiveClass[]>(
      `/LiveClass/GetAllForSession/session/${id}/all`
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Error fetching student live classes:',
        error.response?.data || error.message
      );
    } else {
      console.error(
        'Unexpected error fetching student live classes:',
        error
      );
    }
    throw error;
  }
};
