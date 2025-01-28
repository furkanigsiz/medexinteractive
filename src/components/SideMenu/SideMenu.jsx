import React, { useState } from 'react';
import './SideMenu.css';

const departments = [
  {
    id: 'it',
    name: 'Bilişim Teknolojileri',
    description: 'Yazılım geliştirme ve teknoloji çözümleri'
  },
  {
    id: 'research',
    name: 'Klinik Araştırma',
    description: 'Klinik araştırma projeleri ve çalışmaları'
  },
  {
    id: 'data',
    name: 'Veri Analizi',
    description: 'Veri analizi ve istatistiksel değerlendirmeler'
  },
  {
    id: 'biotech',
    name: 'Biyoteknoloji',
    description: 'Biyoteknoloji araştırma ve geliştirme'
  },
  {
    id: 'medical',
    name: 'Tıbbi Cihaz',
    description: 'Tıbbi cihaz tasarım ve geliştirme'
  },
  {
    id: 'ai',
    name: 'Yapay Zeka',
    description: 'Yapay zeka ve makine öğrenimi çözümleri'
  },
  {
    id: 'pharma',
    name: 'İlaç Geliştirme',
    description: 'İlaç araştırma ve geliştirme projeleri'
  },
  {
    id: 'genomics',
    name: 'Genomik',
    description: 'Genomik araştırmalar ve analizler'
  },
  {
    id: 'innovation',
    name: 'İnovasyon',
    description: 'İnovasyon ve AR-GE çalışmaları'
  },
  {
    id: 'digital',
    name: 'Dijital Sağlık',
    description: 'Dijital sağlık çözümleri ve uygulamaları'
  }
];

const SideMenu = ({ onHoverNeuron, onClickNeuron, hideButton }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = (departmentId) => {
    if (onHoverNeuron) {
      onHoverNeuron(departmentId);
    }
  };

  const handleMouseLeave = () => {
    if (onHoverNeuron) {
      onHoverNeuron(null);
    }
  };

  const handleClick = (department) => {
    if (onClickNeuron) {
      onClickNeuron(department.id);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        className={`menu-toggle ${isOpen ? 'open' : ''} ${hideButton ? 'hidden' : ''}`}
        onClick={toggleMenu}
      >
        <span className="toggle-icon"></span>
      </button>
      <div className={`side-menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h2>Departmanlar</h2>
        </div>
        <div className="menu-items">
          {departments.map((department) => (
            <div
              key={department.id}
              className="menu-item"
              onMouseEnter={() => handleMouseEnter(department.id)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(department)}
            >
              <h3>{department.name}</h3>
              <p>{department.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SideMenu; 