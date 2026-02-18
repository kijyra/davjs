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
              {(() => {
                const folders = item.children.filter(child => child.type === 'Directory');
                const files = item.children.filter(child => child.type !== 'Directory');
                const sortedFolders = folders.sort((a, b) => a.name.localeCompare(b.name));

                const sortedFiles = files.sort((a, b) => {
                  const extA = a.fileExtension || '';
                  const extB = b.fileExtension || '';
                  const extCompare = extA.localeCompare(extB);
                  if (extCompare !== 0) return extCompare;
                  return a.name.localeCompare(b.name);
                });

                const allSorted = [...sortedFolders, ...sortedFiles];
                return allSorted.map((child, idx) => (
                  <FileSystemItemComponent key={idx} item={child} />
                ));
              })()}
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