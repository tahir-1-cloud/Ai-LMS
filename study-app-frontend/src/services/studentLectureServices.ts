
import {LectureDetailsResponseDto} from "@/types/studentLectures";
import axiosInstance from "@/services/axiosInstance";
import axios from "axios";

export async function addStudentLectures(data: FormData) {
  try {
    const response = await axiosInstance.post("/StudentLectures/UploadLectures",
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 5 * 60 * 1000, // 5 minutes timeout
      }
    );
    return response.data;
  } catch (error) {
    console.error("Axios error adding lecture:", error);
    throw error;
  }
}

export const getAllstudentLectures = async (): Promise<LectureDetailsResponseDto[]> => {
    const response = await axiosInstance.get<LectureDetailsResponseDto[]>(`/StudentLectures/GetAlllectures`);
    return response.data;
};

export const assignLectureToSession = async (lectureId: number, sessionId: number): Promise<void> => {
    try {
        await axiosInstance.post("/StudentLectures/AssignToSession", { lectureId, sessionId });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Error assigning Lectures:", error.response?.data || error.message);
        } else {
            console.error("Unexpected error assigning Lectures:", error);
        }
        throw error;
    }
};

export const unassignPaperFromSession = async (lectureId: number, sessionId: number): Promise<void> => {
  await axiosInstance.post('/StudentLectures/UnassignFromSession', { lectureId, sessionId });
};

export const getLectureAssignments = async (
  lectureId: number
): Promise<number[]> => {
  const res = await axiosInstance.get<
    { sessionId: number }[] >(`/StudentLectures/GetLectureAssignments?lectureId=${lectureId}`);

  // return only session ids
  return res.data.map(x => x.sessionId);
};
