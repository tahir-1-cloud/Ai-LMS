import {BlogsModel,Blogsdetail} from "@/types/blogs";
import axiosInstance from "@/services/axiosInstance";
import axios from "axios";

export async function Addblogs(data: FormData) {
    try {
        const response = await axiosInstance.post('/Blog/AddBlogs', data, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.error('Axios error adding Blogs:', error);
        throw error;
    }
}

export const getAllBlogs = async (): Promise<BlogsModel[]> => {
    const response = await axiosInstance.get<BlogsModel[]>(`/Blog/GetAllBlogs`);
    return response.data;
};

export const getBlogDetails = async (blogId: number): Promise<Blogsdetail> => {
  try {
    const response = await axiosInstance.get<Blogsdetail>(`/Blog/GetBlogDetails/${blogId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog details:", error);
    throw error;
  }
};

export const deleteBlogs = async (blogsId: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/Blog/DeleteBlogs/${blogsId}`);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Error deleting Students:", error.response?.data || error.message);
        } else {
            console.error("Unexpected error deleting Students:", error);
        }
        throw error;
    }
};