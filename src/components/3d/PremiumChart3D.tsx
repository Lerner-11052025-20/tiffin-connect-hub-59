import { useEffect, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

interface Chart3DProps {
  data: number[]
  labels: string[]
  height?: number
  width?: number
}

function BarChart3D({ data, labels }: Omit<Chart3DProps, 'height' | 'width'>) {
  const groupRef = useRef<THREE.Group>(null)
  const barsRef = useRef<THREE.Mesh[]>([])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001
      barsRef.current.forEach((bar) => {
        if (bar.position.y < 2.5) {
          bar.position.y += 0.02
        }
      })
    }
  })

  useEffect(() => {
    barsRef.current = []
    if (groupRef.current) {
      groupRef.current.clear()

      const maxValue = Math.max(...data)
      const spacing = 1.5

      data.forEach((value, index) => {
        const height = (value / maxValue) * 4
        const geometry = new THREE.BoxGeometry(0.8, height, 0.8)
        
        // Create gradient material
        const colors = [
          new THREE.Color(0x9d5e34),   // Primary green
          new THREE.Color(0x18b864),   // Darker green
          new THREE.Color(0x22d3ee),   // Cyan for variety
        ]
        const color = colors[index % colors.length]
        const material = new THREE.MeshStandardMaterial({
          color,
          metalness: 0.3,
          roughness: 0.4,
          emissive: color,
          emissiveIntensity: 0.2,
        })

        const bar = new THREE.Mesh(geometry, material)
        bar.position.x = (index - data.length / 2) * spacing
        bar.position.y = -2 // Start below
        bar.castShadow = true
        bar.receiveShadow = true

        groupRef.current?.add(bar)
        barsRef.current.push(bar)
      })
    }
  }, [data])

  return (
    <group ref={groupRef}>
      {/* Ambient light */}
      <ambientLight intensity={0.6} />
      
      {/* Directional light */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Point light for glow effect */}
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#9d5e34" />
      
      <OrbitControls
        autoRotate
        autoRotateSpeed={4}
        enableZoom={true}
        enablePan={true}
        minDistance={8}
        maxDistance={20}
      />
    </group>
  )
}

export function PremiumChart3D({
  data,
  labels,
  height = 500,
  width = 600,
}: Chart3DProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-card border border-border/40 bg-card/50 backdrop-blur-md"
      style={{ height, width: width || "100%" }}
    >
      <Canvas
        camera={{
          position: [0, 5, 10],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["transparent"]} />
        <BarChart3D data={data} labels={labels} />
      </Canvas>
      
      {/* Overlay gradient for premium effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-card/60 via-transparent to-transparent" />
    </div>
  )
}

// Simpler 2D-like 3D charts using Three.js primitives
interface LineChart3DProps {
  data: number[]
  height?: number
  width?: number
}

function LineVisualization({ data }: { data: number[] }) {
  const lineRef = useRef<THREE.LineSegments>(null)
  const maxValue = Math.max(...data)

  useFrame(() => {
    if (lineRef.current) {
      lineRef.current.rotation.z += 0.0005
    }
  })

  useEffect(() => {
    if (lineRef.current) {
      const points: THREE.Vector3[] = []
      const spacing = 0.5
      
      data.forEach((value, index) => {
        const x = index * spacing - (data.length * spacing) / 2
        const y = (value / maxValue) * 3 - 1.5
        points.push(new THREE.Vector3(x, y, 0))
      })

      // Create line geometry
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      lineRef.current.geometry = geometry
    }
  }, [data, maxValue])

  return (
    <group>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      
      <lineSegments ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color={0x9d5e34} linewidth={2} />
      </lineSegments>

      <OrbitControls autoRotate autoRotateSpeed={2} />
    </group>
  )
}

export function LineChart3D({
  data,
  height = 400,
  width = 600,
}: LineChart3DProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-card border border-border/40 bg-card/50 backdrop-blur-md"
      style={{ height, width: width || "100%" }}
    >
      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 75,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["transparent"]} />
        <LineVisualization data={data} />
      </Canvas>
    </div>
  )
}

export default PremiumChart3D
