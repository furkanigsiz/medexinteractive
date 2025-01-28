neuropath-interactive/
├── public/                 # Static dosyalar
│   ├── models/             # 3D beyin modeli ve nöronlar
│   │   └── brain.glb       # Optimize edilmiş GLB/glTF modeli
│   ├── config/             
│   │   └── neuron_mappings.json # Nöron-URL eşleşmeleri
│   └── index.html          # Temel HTML
│
├── src/                    # Ana kod klasörü
│   ├── components/         # React bileşenleri
│   │   ├── Brain3DViewer/  # 3D beyin ve Babylon.js entegrasyonu
│   │   │   ├── Brain3DViewer.jsx 
│   │   │   └── Brain3DViewer.css
│   │   └── Loader/         # Yükleme animasyonu
│   │       └── Loader.jsx
│   │
│   ├── contexts/           # Global state (nöron seçimi vs.)
│   │   └── BrainContext.jsx
│   │
│   ├── hooks/              # Özel hook'lar (örneğin, Babylon.js için)
│   │   └── useBabylonEngine.js
│   │
│   ├── pages/              # Yönlendirilecek sayfalar
│   │   ├── HomePage.jsx    # Ana sayfa (3D beyin)
│   │   ├── MemoryPage.jsx  # Örnek sayfa: Bellek
│   │   └── LearningPage.jsx
│   │
│   ├── styles/             # Global CSS/SCSS
│   │   ├── global.css      
│   │   └── animations.css
│   │
│   ├── utils/              # Yardımcı fonksiyonlar
│   │   ├── brainUtils.js   # Nöron tıklama mantığı
│   │   └── api.js          # JSON veri çekme
│   │
│   ├── App.jsx             # Ana rotalar
│   └── main.jsx            # React render
│
├── .gitignore              # Git ignore ayarları
├── package.json            # Bağımlılıklar
├── vite.config.js          # Build ayarları (Vite önerilir)
└── README.md               # Proje dokümantasyonu

Önemli Dosyaların Açıklamaları
1. public/models/brain.glb

    Babylon.js ile yüklenecek 3D beyin modeli.

    Blender veya benzeri araçlarla hazırlanmış, nöronlar ayrı mesh'ler veya gruplar halinde olmalı.

2. public/config/neuron_mappings.json

    Nöron ID'leri ile hedef URL'leri eşleştiren yapılandırma dosyası:
    json
    Copy

    {
      "hypocampus_neuron_1": {
        "target_url": "/memory",
        "tooltip": "Bellek Mekanizmaları"
      }
    }

3. src/components/Brain3DViewer/Brain3DViewer.jsx

    Babylon.js sahnesinin kurulduğu ve tıklama olaylarının yönetildiği ana bileşen:
    javascript
    Copy

    // Örnek kod parçası:
    useEffect(() => {
      const engine = new BABYLON.Engine(canvasRef.current, true);
      const scene = new BABYLON.Scene(engine);

      // Model yükleme
      BABYLON.SceneLoader.Append("/models/", "brain.glb", scene, (scene) => {
        scene.meshes.forEach(mesh => {
          if (mesh.name.startsWith("neuron_")) {
            mesh.actionManager = new BABYLON.ActionManager(scene);
            mesh.actionManager.registerAction(
              new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => handleNeuronClick(mesh.name) // Tıklanan nöronun ID'sini al
              )
            );
          }
        });
      });
    }, []);

4. src/utils/brainUtils.js

    Tıklama mantığını yöneten fonksiyon:
    javascript
    Copy

    export const handleNeuronClick = (neuronId) => {
      import("../config/neuron_mappings.json").then((data) => {
        const targetUrl = data[neuronId]?.target_url || "/";
        window.location.href = targetUrl; // React Router ile değiştirilebilir
      });
    };

Bağımlılıklar (package.json)
json
Copy

{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0", // Yönlendirme için
    "@babylonjs/core": "^6.32.0",  // 3D render için
    "gsap": "^3.12.2"              // Animasyonlar için
  },
  "devDependencies": {
    "vite": "^4.4.0"
  }
}

Ek Notlar

    Performans İçin: GLB modelinizi 100k poligon altında tutun, gereksiz dokuları kaldırın.

    Mobil Optimizasyon: @babylonjs/loaders ile LOD (Level of Detail) kullanın.

    Router Entegrasyonu: Yönlendirmelerde react-router-dom'un useNavigate hook'unu tercih edin.