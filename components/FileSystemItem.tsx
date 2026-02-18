'use client';
import { useState } from 'react';
import { FileSystemItem } from '../app/types/index';

export default function FileSystemItemComponent({ item }: { item: FileSystemItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const getIcon = (item: FileSystemItem) => {
    if (item.type === 'Directory') return '📂';
    switch (item.fileExtension?.toLowerCase()) {
      case '.msi': case '.exe': return '💻';
      case '.zip': case '.rar': return '📦';
      case '.pdf': return '📑';
      default: return '📄';
    }
  };

  return (
    <li className="list-group-item border-0 pb-0">
      {item.type === 'Directory' ? (
        <>
          <span 
            className="fw-bold" 
            onClick={() => setIsOpen(!isOpen)} 
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            {isOpen ? '🔽' : '▶️'} {getIcon(item)} {item.name}
          </span>
          {isOpen && item.children && (
            <ul className="list-group ms-3 mt-1 shadow-sm">
              {item.children.map((child, idx) => (
                <FileSystemItemComponent key={idx} item={child} />
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="d-flex justify-content-between align-items-center">
          <a 
            href={item.relativePath} 
            download 
            className="text-decoration-none text-reset" 
            style={{ cursor: 'pointer' }}
          >
            {getIcon(item)} {item.name}
          </a>
          <a 
            href={item.relativePath} 
            download 
            className="btn btn-outline-primary btn-sm"
          >
            {item.formattedSize}
          </a>
        </div>
      )}
    </li>
  );
}