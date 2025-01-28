import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import SideMenu from './SideMenu/SideMenu';

const Brain3DViewer = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const neuronsRef = useRef({});
  const originalMaterialsRef = useRef({});

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new BABYLON.Engine(canvasRef.current, true);
    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;

    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      0,
      Math.PI / 2,
      10,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 20;

    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(0, 1, 0),
      scene
    );

    BABYLON.SceneLoader.ImportMesh(
      '',
      '/models/',
      'brain.glb',
      scene,
      (meshes) => {
        const rootMesh = meshes[0];
        rootMesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);

        // Nöron noktalarını oluştur
        createNeuronPoints(scene);
      }
    );

    const createNeuronPoints = (scene) => {
      const neuronPositions = [
        new BABYLON.Vector3(2, 1, 0),    // IT
        new BABYLON.Vector3(-2, 1, 0),   // Research
        new BABYLON.Vector3(0, 2, 1),    // Data
        new BABYLON.Vector3(0, 1, 2),    // Biotech
        new BABYLON.Vector3(1, -1, 1),   // Medical
        new BABYLON.Vector3(-1, -1, 1),  // AI
        new BABYLON.Vector3(2, 0, -1),   // Pharma
        new BABYLON.Vector3(-2, 0, -1),  // Genomics
        new BABYLON.Vector3(0, 1, -2),   // Innovation
        new BABYLON.Vector3(0, -1, -2)   // Digital
      ];

      const departments = [
        'it', 'research', 'data', 'biotech', 'medical',
        'ai', 'pharma', 'genomics', 'innovation', 'digital'
      ];

      departments.forEach((dept, index) => {
        const sphere = BABYLON.MeshBuilder.CreateSphere(
          dept,
          { diameter: 0.3 },
          scene
        );
        sphere.position = neuronPositions[index];

        const material = new BABYLON.StandardMaterial(
          `${dept}-material`,
          scene
        );
        material.emissiveColor = new BABYLON.Color3(0, 1, 1);
        material.alpha = 0.8;

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
      } else if (id === departmentId) {
        const material = new BABYLON.StandardMaterial(
          `${id}-hover`,
          sceneRef.current
        );
        material.emissiveColor = new BABYLON.Color3(0, 1, 0.5);
        material.alpha = 1;
        mesh.material = material;
      }
    });
  };

  const handleNeuronClick = (departmentId, callback) => {
    const targetMesh = neuronsRef.current[departmentId];
    if (!targetMesh) return;

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

    BABYLON.Animation.CreateAndStartAnimation(
      'cameraMove',
      camera,
      'position',
      30,
      30,
      startPosition,
      targetPosition,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
      null,
      () => {
        setTimeout(callback, 500);
      }
    );

    BABYLON.Animation.CreateAndStartAnimation(
      'cameraTarget',
      camera,
      'target',
      30,
      30,
      startTarget,
      targetMesh.position,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
  };

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0
        }} 
      />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <SideMenu
          onHoverNeuron={handleNeuronHover}
          onClickNeuron={handleNeuronClick}
        />
      </div>
    </div>
  );
};

export default Brain3DViewer; 