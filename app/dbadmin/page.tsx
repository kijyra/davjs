'use client'

import { useState, useEffect } from 'react'
import { getTableData } from './dbaction'
import DynamicTable from '../../components/Admin/DynamicTable'

const menu = [
  { label: 'Инфраструктура', items: ['Locations', 'Buildings', 'Floors', 'Offices'] },
  { label: 'Принтеры', items: ['Manufactors', 'Cartridges', 'PrinterModels', 'Printers'] },
  { label: 'Пользователи', items: ['Users', 'ADUsers'] },
  { label: 'Другое', items: ['PCs', 'Phones', 'Workplaces', 'HardwareInfo'] },
]

export default function AdminPage() {
  const [activeTable, setActiveTable] = useState('')
  const [data, setData] = useState<any[]>([]) // ✅ явно указываем тип any[]
  const [loading, setLoading] = useState(false)

  const loadData = async (tableName: string) => {
    setLoading(true)
    setActiveTable(tableName)
    localStorage.setItem('activeTableName', tableName)
    try {
      const result = await getTableData(tableName)
      setData(result)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('activeTableName') || 'Workplaces'
    loadData(saved)
  }, [])
  
  return (
    <div className="container mt-4 pb-4">
      <h1 className="mb-4">Управление Базой Данных</h1>
      
      <nav className="nav nav-pills flex-column flex-sm-row mb-4 bg-body-secondary p-2 rounded-3 shadow-sm">
        {menu.map((group) => (
          <div key={group.label} className="nav-item dropdown">
            <a 
              className="nav-link dropdown-toggle" 
              data-bs-toggle="dropdown" 
              href="#" 
              role="button" 
              aria-expanded="false"
            >
              {group.label}
            </a>
            <ul className="dropdown-menu">
              {group.items.map(item => (
                <li key={item}>
                  <a 
                    onClick={(e) => { e.preventDefault(); loadData(item); }}
                    className={`dropdown-item ${activeTable === item ? 'active' : ''}`}
                    href="#"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="card shadow-sm border">
        {loading ? (
          <div className="card-body text-center text-muted p-5">Загрузка данных...</div>
        ) : (
          <DynamicTable 
            tableName={activeTable} 
            data={data} 
            onRefresh={() => loadData(activeTable)} 
          />
        )}
      </div>
    </div>
  )
}