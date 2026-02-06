import FileSystemItemComponent from './_components/FileSystemItem';
import { FileSystemItem } from './types/index';

async function getFileSystemData(): Promise<FileSystemItem[]> {
  const res = await fetch('https://dc1.dallari.biz/api/home/files', { 
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Ошибка при загрузке файлов');
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
