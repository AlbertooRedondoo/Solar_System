# Sistema Solar 3D Interactivo

## Descripción

Simulación interactiva en 3D del Sistema Solar desarrollada con **Three.js**. El proyecto recrea de forma realista los ocho planetas principales, sus órbitas elípticas, texturas de alta calidad y un sistema de iluminación físicamente preciso que simula la luz solar.

---
## Link del proyecto y del vídeo
https://codesandbox.io/p/sandbox/ig2526-s6-forked-4xl3cj

https://drive.google.com/file/d/1z1bE5xv_5QGz9z60ODhiCCx9AiYx6RLs/view?usp=sharing

---

## Características Principales

### Texturas y Materiales

El proyecto utiliza texturas de alta resolución (2K) para cada cuerpo celeste, aplicadas mediante el sistema de materiales de Three.js:

#### **Sol**
- **Textura:** `2k_sun.jpg`
- **Material:** `MeshBasicMaterial` (emisivo, no requiere iluminación)
- **Características:** Rotación propia a 0.5 rad/s sobre su eje Z
- **Color base:** Amarillo brillante (#ffff00)

#### **Planetas Rocosos**

**Mercurio**
- **Textura:** `2k_mercury.jpg`
- **Material:** `MeshPhongMaterial` con especular bajo
- **Radio:** 0.2 unidades
- **Spin:** 0.02 rad/s

**Venus**
- **Textura:** `2k_venus_surface.jpg` (superficie volcánica)
- **Material:** `MeshPhongMaterial`
- **Radio:** 0.3 unidades
- **Spin:** 0.004 rad/s (rotación muy lenta, característica real de Venus)

**Tierra**
- **Textura:** `earthmap1k.jpg` (continentes y océanos)
- **Material:** `MeshPhongMaterial` con `shininess: 10`
- **Radio:** 0.8 unidades
- **Spin:** 0.05 rad/s
- **Extra:** Capa de nubes semi-transparente (`earthcloudmap.jpg`)
  - Material: `MeshPhongMaterial` con `opacity: 0.5` y `transparent: true`
  - Radio ligeramente mayor (0.805) para flotar sobre la superficie
  - Rotación independiente más lenta para simular movimiento atmosférico

**Marte**
- **Textura:** `2k_mars.jpg` (desiertos rojizos)
- **Material:** `MeshPhongMaterial`
- **Radio:** 0.5 unidades
- **Spin:** 0.04 rad/s

#### **Planetas Gaseosos**

**Júpiter**
- **Textura:** `2k_jupiter.jpg` (bandas atmosféricas)
- **Material:** `MeshPhongMaterial`
- **Radio:** 1.3 unidades (el más grande)
- **Spin:** 0.1 rad/s (rotación rápida característica)

**Saturno**
- **Textura:** `2k_saturn.jpg`
- **Material:** `MeshPhongMaterial`
- **Radio:** 1.0 unidades
- **Spin:** 0.09 rad/s
- **Extra:** Anillos icónicos
  - Geometría: `RingGeometry` (radio interno 1.25, externo 2.2)
  - Textura: `2k_saturn_ring.png` con transparencia
  - Material: `MeshPhongMaterial` con `side: THREE.DoubleSide`
  - Rotación 90° para alineación ecuatorial

**Urano**
- **Textura:** `2k_uranus.jpg` (color turquesa característico)
- **Material:** `MeshPhongMaterial`
- **Radio:** 0.7 unidades
- **Spin:** 0.03 rad/s

**Neptuno**
- **Textura:** `2k_neptune.jpg` (azul profundo)
- **Material:** `MeshPhongMaterial`
- **Radio:** 0.6 unidades
- **Spin:** 0.035 rad/s

#### **Satélites**

**Luna (Tierra)**
- **Textura:** `2k_moon.jpg`
- **Material:** `MeshPhongMaterial` con `shininess: 5`
- **Radio:** 0.15 unidades
- **Órbita:** Pivote inclinado -3.5 radianes
- **Distancia:** 1.2 unidades desde la Tierra

---

### Sistema de Iluminación

El proyecto implementa un modelo de iluminación realista basado en física:

#### **Iluminación Principal: PointLight**
- **Posición:** Centro del Sol (0, 0, 0)
- **Intensidad:** 2.0
- **Rango:** Infinito (decay natural con la distancia)
- **Color:** Blanco puro (#ffffff)
- **Función:** Simula la emisión de luz solar en todas direcciones

#### **Iluminación Ambiental**
- **Tipo:** `AmbientLight`
- **Intensidad:** 0.12 (muy tenue)
- **Color:** Blanco (#ffffff)
- **Función:** Evita sombras completamente negras, simula luz reflejada del espacio

#### **Propiedades de Material (MeshPhongMaterial)**

Todos los planetas utilizan `MeshPhongMaterial`, que responde a la iluminación mediante el modelo de reflexión de Phong:

- **Shininess:** 10 (planetas), 5 (luna) - Controla el tamaño del brillo especular
- **Specular:** 0x222222 (gris oscuro) - Color de los reflejos brillantes
- **Resultado:** Superficies con aspecto semi-mate y pequeños brillos realistas

**Ventajas del modelo Phong:**
- Cálculo eficiente de reflejos
- Aspecto realista para superficies planetarias
- Degradado suave de iluminación desde el lado iluminado al oscuro
- Reflejos especulares sutiles que añaden dimensionalidad

#### **Fondo Estelar**
- **Textura:** `2k_stars.jpg`
- **Mapping:** `EquirectangularReflectionMapping`
- **Color Space:** sRGB
- **Implementación:** Textura como fondo de escena (`scene.background`)

---

### Interactividad

#### **Controles de Cámara**
- **OrbitControls:** Navegación libre con ratón/táctil
- **Rotación:** Click y arrastrar
- **Zoom:** Rueda del ratón / pellizco
- **Pan:** Click derecho y arrastrar (deshabilitado en modo seguimiento)

#### **Panel de Navegación**
Botonera interactiva con 9 opciones:

1. **Default:** Vista general del sistema solar
2. **Mercurio - Neptuno:** Enfoque y seguimiento individual de cada planeta

**Características del seguimiento:**
- Desplazamiento suave mediante interpolación (lerp)
- Constante de suavizado: 0.08 (FOLLOW_SMOOTH)
- Cámara posicionada dinámicamente respecto al planeta:
  - Distancia: 6× radio planetario (detrás)
  - Offset lateral: 3× radio
  - Elevación: 2.2× radio
- Actualización continua durante el movimiento orbital
- Zoom habilitado para ajustar distancia

---

### Física y Animación

#### **Órbitas Elípticas**
Cada planeta sigue una trayectoria elíptica definida por:
- **Distancia orbital:** De 3 (Mercurio) a 26 (Neptuno) unidades
- **Factores de excentricidad:** f1 y f2 para el semieje mayor y menor
- **Velocidad orbital:** Inversamente proporcional a la distancia (leyes de Kepler simplificadas)
  - Mercurio: 2.0 (más rápido)
  - Neptuno: 0.4 (más lento)

**Cálculo de posición:**
```javascript
x = cos(timestamp × speed) × f1 × dist
y = sin(timestamp × speed) × f2 × dist
```

#### **Rotación Planetaria**
- **Eje de rotación:** Z (perpendicular al plano orbital)
- **Velocidades diferenciadas:** Cada planeta gira a su propia velocidad característica
- **Actualización:** `rotation.z += spin × deltaTime`

#### **Sistema de Tiempo**
- **Variable global:** `accglobal = 0.001` (aceleración temporal)
- **Clock de Three.js:** Gestión de deltaTime para animaciones independientes del framerate
- **Timestamp:** `(Date.now() - t0) × accglobal`

---

### Estructura de Archivos

```
proyecto/
├── src/
│   ├── main.js                    # Código principal
│   ├── 2k_stars.jpg               # Textura de fondo estelar
│   ├── 2k_sun.jpg                 # Textura del Sol
│   ├── 2k_mercury.jpg             # Textura de Mercurio
│   ├── 2k_venus_surface.jpg       # Textura de Venus
│   ├── earthmap1k.jpg             # Textura de la Tierra
│   ├── earthcloudmap.jpg          # Textura de nubes terrestres
│   ├── 2k_moon.jpg                # Textura de la Luna
│   ├── 2k_mars.jpg                # Textura de Marte
│   ├── 2k_jupiter.jpg             # Textura de Júpiter
│   ├── 2k_saturn.jpg              # Textura de Saturno
│   ├── 2k_saturn_ring.png         # Textura de anillos de Saturno
│   ├── 2k_uranus.jpg              # Textura de Urano
│   └── 2k_neptune.jpg             # Textura de Neptuno
├── package.json
└── README.md
```

---

## Tecnologías

- **Three.js (r128):** Motor de renderizado 3D
- **OrbitControls:** Sistema de controles de cámara
- **WebGL:** Renderizado acelerado por hardware
- **JavaScript ES6+:** Sintaxis moderna

---

## Características Técnicas Destacadas

### Gestión de Color
- **Color Space:** Conversión automática a sRGB para todas las texturas
- **Renderer:** Output en sRGB color space para precisión cromática

### Optimizaciones de Rendimiento
- **Geometrías eficientes:** 32 segmentos para planetas, 25 para el Sol
- **Materiales compartidos:** Reutilización de shaders Phong
- **DepthWrite:** Deshabilitado en elementos transparentes (nubes, anillos)
- **RequestAnimationFrame:** Loop de animación optimizado

### Responsive Design
- Ajuste automático de aspect ratio y tamaño del renderer
- Event listener de resize con actualización de proyección

---

## 📝 Funciones Principales

### `Estrella(radio, color, texture)`
Crea el Sol con material básico emisivo.

### `Planeta(radio, dist, vel, col, f1, f2, texture, spin)`
Genera un planeta con órbita, material Phong y rotación propia.

### `Luna(planeta, radio, dist, vel, col, angle, texture)`
Añade un satélite con pivote orbital inclinado.

### `flyTo(targetCamPos, targetLook, duration)`
Transición suave de cámara con easing InOutQuad.

### `focusPlanetFollow(index)`
Activa seguimiento continuo de un planeta específico.

---

## Autor

**Alberto Redondo Álvarez de Sotomayor**

---


