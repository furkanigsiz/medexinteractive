import React, { useEffect, useRef, useState } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import SideMenu from '../SideMenu/SideMenu';
import DepartmentProjects from '../DepartmentProjects/DepartmentProjects';
import { departmentProjects } from '../../data/departmentProjects';
import './Brain3DViewer.css';

const Brain3DViewer = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const neuronsRef = useRef({});
  const originalMaterialsRef = useRef({});
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [hoveredNeuron, setHoveredNeuron] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState(null);
  const [showProjects, setShowProjects] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new BABYLON.Engine(canvasRef.current, true);
    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;

    // Sahne arka plan rengi - Koyu uzay siyahı
    scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.05, 1);

    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI / 4,
      Math.PI / 3,
      36,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 0.1;
    camera.upperRadiusLimit = 50;
    camera.wheelPrecision = 15;
    camera.pinchPrecision = 15;
    camera.panningSensibility = 100;
    camera.angularSensibilityX = 4000;
    camera.angularSensibilityY = 4000;

    // Ana ışık kaynağı - Turkuaz tonlu
    const hemisphericLight = new BABYLON.HemisphericLight(
      'hemisphericLight',
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    hemisphericLight.intensity = 0.2;
    hemisphericLight.groundColor = new BABYLON.Color3(0, 0.1, 0.1);
    hemisphericLight.diffuse = new BABYLON.Color3(0, 0.2, 0.2);
    hemisphericLight.specular = new BABYLON.Color3(0, 0.1, 0.1);

    // Nokta ışıkları - Turkuaz tonları
    const pointLight1 = new BABYLON.PointLight(
      'pointLight1',
      new BABYLON.Vector3(5, 5, -5),
      scene
    );
    pointLight1.intensity = 0.2;
    pointLight1.diffuse = new BABYLON.Color3(0, 0.8, 0.8);

    const pointLight2 = new BABYLON.PointLight(
      'pointLight2',
      new BABYLON.Vector3(-5, -5, 5),
      scene
    );
    pointLight2.intensity = 0.2;
    pointLight2.diffuse = new BABYLON.Color3(0, 0.8, 0.8);

    // Global glow layer oluştur
    const glowLayer = new BABYLON.GlowLayer("glow", scene, {
      mainTextureFixedSize: 512,
      blurKernelSize: 64
    });
    glowLayer.intensity = 0.4;

    BABYLON.SceneLoader.ImportMesh(
      '',
      '/models/',
      'brain.glb',
      scene,
      (meshes) => {
        const rootMesh = meshes[0];
        rootMesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);

        // Beyin modelinin tüm parçalarını saydam yap
        meshes.forEach((mesh) => {
          const material = new BABYLON.StandardMaterial(`${mesh.name}-material`, scene);
          material.alpha = 0.30;
          material.emissiveColor = new BABYLON.Color3(1, 1, 1);
          material.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
          material.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
          mesh.material = material;
        });

        // Nöron noktalarını oluştur
        createNeuronPoints(scene);
        setLoading(false);
      },
      (evt) => {
        const progress = (evt.loaded * 100 / evt.total).toFixed();
        setLoadingProgress(progress);
      },
      (error) => {
        console.error('Model yükleme hatası:', error);
        setLoading(false);
      }
    );

    const createNeuronPoints = (scene) => {
      const neuronPositions = [
        new BABYLON.Vector3(3.5, 2.2, -1.0),    // IT - sağ üst ön
        new BABYLON.Vector3(-3.5, 2.2, -1.0),   // Research - sol üst ön
        new BABYLON.Vector3(0.5, 3.2, 2.0),     // Data - üst sağ ön
        new BABYLON.Vector3(-1.2, -0.8, 3.0),   // Biotech - sol orta ön
        new BABYLON.Vector3(3.0, -2.0, 1.5),    // Medical - sağ alt ön
        new BABYLON.Vector3(-3.0, -2.0, 1.5),   // AI - sol alt ön
        new BABYLON.Vector3(3.2, 1.2, -2.5),    // Pharma - sağ üst arka
        new BABYLON.Vector3(-3.2, 1.2, -2.5),   // Genomics - sol üst arka
        new BABYLON.Vector3(0.8, 2.5, -3.0),    // Innovation - üst orta arka
        new BABYLON.Vector3(-1.5, -2.2, -2.8)   // Digital - sol alt arka
      ];

      const departments = [
        'it', 'research', 'data', 'biotech', 'medical',
        'ai', 'pharma', 'genomics', 'innovation', 'digital'
      ];

      const departmentNames = {
        'it': 'Bilişim Teknolojileri',
        'research': 'Klinik Araştırma',
        'data': 'Veri Analizi',
        'biotech': 'Biyoteknoloji',
        'medical': 'Tıbbi Cihaz',
        'ai': 'Yapay Zeka',
        'pharma': 'İlaç Geliştirme',
        'genomics': 'Genomik',
        'innovation': 'İnovasyon',
        'digital': 'Dijital Sağlık'
      };

      departments.forEach((dept, index) => {
        const sphere = BABYLON.MeshBuilder.CreateSphere(
          dept,
          { diameter: 0.7 },
          scene
        );
        sphere.position = neuronPositions[index];

        const material = new BABYLON.StandardMaterial(
          `${dept}-material`,
          scene
        );
        material.emissiveColor = new BABYLON.Color3(0, 0.9, 0.9);
        material.specularColor = new BABYLON.Color3(0, 0.5, 0.5);
        material.diffuseColor = new BABYLON.Color3(0, 0.3, 0.3);
        material.ambientColor = new BABYLON.Color3(0, 0.3, 0.3);
        material.alpha = 1;

        // Glow efekti için
        glowLayer.addIncludedOnlyMesh(sphere);
        glowLayer.customEmissiveColorSelector = function(mesh, subMesh, material, result) {
          result.set(0, 0.9, 0.9, 1.0);
        };

        // Tıklama ve hover işlemleri için action manager ekle
        sphere.actionManager = new BABYLON.ActionManager(scene);
        
        sphere.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOverTrigger,
            () => {
              setHoveredNeuron(departmentNames[dept]);
              handleNeuronHover(dept);
              
              // Hover animasyonu
              const animation = new BABYLON.Animation(
                "hoverScale",
                "scaling",
                30,
                BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
              );

              const keys = [];
              keys.push({
                frame: 0,
                value: new BABYLON.Vector3(1, 1, 1)
              });
              keys.push({
                frame: 10,
                value: new BABYLON.Vector3(1.2, 1.2, 1.2)
              });

              animation.setKeys(keys);

              sphere.animations = [];
              sphere.animations.push(animation);
              scene.beginAnimation(sphere, 0, 10, false);
            }
          )
        );

        sphere.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOutTrigger,
            () => {
              setHoveredNeuron(null);
              handleNeuronHover(null);

              // Hover out animasyonu
              const animation = new BABYLON.Animation(
                "hoverOutScale",
                "scaling",
                30,
                BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
              );

              const keys = [];
              keys.push({
                frame: 0,
                value: new BABYLON.Vector3(1.2, 1.2, 1.2)
              });
              keys.push({
                frame: 10,
                value: new BABYLON.Vector3(1, 1, 1)
              });

              animation.setKeys(keys);

              sphere.animations = [];
              sphere.animations.push(animation);
              scene.beginAnimation(sphere, 0, 10, false);
            }
          )
        );

        sphere.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            () => {
              handleNeuronClick(dept);
            }
          )
        );

        sphere.material = material;
        neuronsRef.current[dept] = sphere;
        originalMaterialsRef.current[dept] = material.clone();
      });
    };

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener('resize', () => {
      engine.resize();
    });

    return () => {
      engine.dispose();
    };
  }, []);

  const handleNeuronHover = (departmentId) => {
    Object.entries(neuronsRef.current).forEach(([id, mesh]) => {
      if (departmentId === null) {
        mesh.material = originalMaterialsRef.current[id].clone();
        mesh.scaling = new BABYLON.Vector3(1, 1, 1);
      } else if (id === departmentId) {
        const material = new BABYLON.StandardMaterial(
          `${id}-hover`,
          sceneRef.current
        );
        material.emissiveColor = new BABYLON.Color3(0, 1, 1);
        material.specularColor = new BABYLON.Color3(0, 0.5, 0.5);
        material.diffuseColor = new BABYLON.Color3(0, 0.4, 0.4);
        material.ambientColor = new BABYLON.Color3(0, 0.3, 0.3);
        material.alpha = 1;

        mesh.material = material;
        mesh.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2);
      }
    });
  };

  const handleNeuronClick = (departmentId) => {
    const targetMesh = neuronsRef.current[departmentId];
    if (!targetMesh || isTransitioning) return;

    setIsTransitioning(true);

    const camera = sceneRef.current.cameras[0];
    const startPosition = camera.position.clone();
    const startTarget = camera.target.clone();

    const targetPosition = targetMesh.position.add(
      new BABYLON.Vector3(
        -Math.sin(camera.alpha) * 3,
        1,
        -Math.cos(camera.alpha) * 3
      )
    );

    // Kamera animasyonu
    BABYLON.Animation.CreateAndStartAnimation(
      'cameraMove',
      camera,
      'position',
      30,
      30,
      startPosition,
      targetPosition,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    BABYLON.Animation.CreateAndStartAnimation(
      'cameraTarget',
      camera,
      'target',
      30,
      30,
      startTarget,
      targetMesh.position,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
      null,
      () => {
        // Kamera animasyonu bittikten sonra fade-out başlat
        const fadeOutDuration = 500;
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgb(2, 2, 16)';
        overlay.style.opacity = '0';
        overlay.style.transition = `opacity ${fadeOutDuration}ms ease-in-out`;
        overlay.style.zIndex = '9999';
        document.body.appendChild(overlay);

        setTimeout(() => {
          overlay.style.opacity = '1';
        }, 50);

        setTimeout(() => {
          setActiveDepartment(departmentId);
          setShowProjects(true);
          setIsTransitioning(false);
          document.body.removeChild(overlay);
        }, fadeOutDuration);
      }
    );
  };

  const handleCloseProjects = () => {
    setShowProjects(false);
    setActiveDepartment(null);
    
    // Kamerayı orijinal pozisyonuna döndür
    const camera = sceneRef.current.cameras[0];
    const targetPosition = new BABYLON.Vector3(
      25 * Math.sin(Math.PI / 4),
      25 * Math.sin(Math.PI / 3),
      25 * Math.cos(Math.PI / 4)
    );

    // Kamera dönüş animasyonunu yavaşlat (120 frame ve easing)
    const cameraReturnAnim = new BABYLON.Animation(
      'cameraReturn',
      'position',
      60,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const cameraTargetAnim = new BABYLON.Animation(
      'cameraTargetReturn',
      'target',
      60,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    // Easing fonksiyonu ekle
    const easingFunction = new BABYLON.CircleEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    cameraReturnAnim.setEasingFunction(easingFunction);
    cameraTargetAnim.setEasingFunction(easingFunction);

    // Pozisyon animasyonu
    const positionKeys = [];
    positionKeys.push({
      frame: 0,
      value: camera.position.clone()
    });
    positionKeys.push({
      frame: 120,
      value: targetPosition
    });
    cameraReturnAnim.setKeys(positionKeys);

    // Hedef animasyonu
    const targetKeys = [];
    targetKeys.push({
      frame: 0,
      value: camera.target.clone()
    });
    targetKeys.push({
      frame: 120,
      value: BABYLON.Vector3.Zero()
    });
    cameraTargetAnim.setKeys(targetKeys);

    // Animasyonları başlat
    camera.animations = [];
    camera.animations.push(cameraReturnAnim);
    camera.animations.push(cameraTargetAnim);
    sceneRef.current.beginAnimation(camera, 0, 120, false);
  };

  return (
    <div className="brain-viewer-container">
      <canvas 
        ref={canvasRef} 
        className="brain-canvas"
      />
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <div className="loading-text">
            Model Yükleniyor... {loadingProgress}%
          </div>
        </div>
      )}
      <div className="tooltip">
        {hoveredNeuron ? (
          <>
            <h3>{hoveredNeuron}</h3>
            <p>Departman projelerini görüntülemek için tıklayın</p>
          </>
        ) : (
          <>
            <h3>
              <span className="brand-name">MEDEX</span>
              <span className="brand-suffix">Interactive</span>
            </h3>
            <p>Yenilikçi klinik araştırma projelerimizi keşfetmek için nöron bölgelerine tıklayın</p>
          </>
        )}
      </div>
      <SideMenu
        onHoverNeuron={handleNeuronHover}
        onClickNeuron={handleNeuronClick}
        hideButton={showProjects}
      />
      {showProjects && (
        <DepartmentProjects
          department={activeDepartment}
          projects={departmentProjects[activeDepartment] || []}
          onClose={handleCloseProjects}
        />
      )}
    </div>
  );
};

export default Brain3DViewer; 