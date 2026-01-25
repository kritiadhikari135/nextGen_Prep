import { createContext , useEffect, useState } from 'react'
import { projectApi } from "@/api/project"
import { serviceApi } from "@/api/service"
import { teamMemberApi } from '@/api/team-member';
import { testimonialsApi } from '@/api/testimonials';

interface Project {
  _id: string;
  name: string;
  description: string;
  image:{
    url:string
  };
  liveLink:string;
  category:string;
  title:string;
  solution: string;
  technologies: [];
  problem: string;
};

interface Service{
  _id: string;
  icon: string;
  title:string;
  description:string;
  tools: [];
  features:[];
};

interface Teams{
  _id: string;
  title: string;
  role:string;
  photoUrl:{
    url: string
  };
  name: string;
  bio: string;
};

interface Testimonials{
  _id: string;
  rating: number;
  name: string;
  quote: string;
  role: string;
  company:string;
  photoUrl:{
    url: string
  };
}

interface ApiContextType {
  projects: Project[];
  services: Service[];
  teams : Teams[];
  testimonials: Testimonials[];
}



export const DataContext = createContext<ApiContextType | null>(null);

export const DataProvider = ({children}) => {

  const [projects, setProjects] = useState<Project[]>([]); 
  const [services, setServices] = useState<Service[]>([]); 
  const [teams, setTeams] = useState<Teams[]>([]); 
  const [testimonials, setTestimonials] = useState<Testimonials[]>([]);

  useEffect(() => {
      const fetchProjects = async () => {
        try {
          const response = await projectApi.getAll();
          setProjects(response.data);
        } catch (error) {
          console.error('Failed to fetch projects:', error);
        }
      };
      fetchProjects();
    }, []);

  useEffect(() => {
      const fetchServices = async () => {
        try {
          const response = await serviceApi.getAll();
          setServices(response.data);
        } catch (error) {
          console.error('Failed to fetch projects:', error);
        }
      };
      fetchServices();
    }, []);

    useEffect(() => {
      const fetchTeams = async () => {
        try {
          const response = await teamMemberApi.getAll();
          setTeams(response.data);
        } catch (error) {
          console.error('Failed to fetch projects:', error);
        }
      };
      fetchTeams();
    }, []);

    useEffect(() => {
      const fetchTestimonials = async () => {
        try {
          const response = await testimonialsApi.getAll();
          setTestimonials(response.data);
        } catch (error) {
          console.error('Failed to fetch projects:', error);
        }
      };
      fetchTestimonials();
    }, []);
    
  return (
    <DataContext.Provider value={{projects, services, teams, testimonials}}>{children}</DataContext.Provider>
  )
}

