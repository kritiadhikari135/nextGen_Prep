import { createContext , useEffect, useState } from 'react';

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

interface ApiContextType {
}



export const DataContext = createContext<ApiContextType | null>(null);

export const DataProvider = ({children}) => {
  return (
    <DataContext.Provider value={{}}>{children}</DataContext.Provider>
  )
}

