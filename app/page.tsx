import FileSystemItemComponent from '../components/FileSystemItem';
import { FileSystemItem } from './types/index';

async function getFileSystemData(): Promise<FileSystemItem[]> {
  const res = await fetch('http://dc1.dallari.biz:3002/api/home/files', {
    cache: 'no-store',
    headers: {
      'Connection': 'close',
    },
  });
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
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