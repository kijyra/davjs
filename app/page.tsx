import { apiFetch } from '@/services/api';
import FileSystemItemComponent from '../components/FileSystemItem';
import { FileSystemItem } from './types/index';

async function getFileSystemData(): Promise<FileSystemItem[]> { 
  const data = await apiFetch<FileSystemItem[]>('/api/home/files', { 
    cache: 'no-store', 
    headers: { 
      'Connection': 'close', 
    }, 
  }); 
  return data;
}

export default async function HomePage() {
  const data = await getFileSystemData();

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Загрузки</h3>
      <ul className="list-group w-50 mx-auto shadow">
        {data.map((item, index) => (
          <FileSystemItemComponent key={index} item={item} />
        ))}
      </ul>
    </div>
  );
}
