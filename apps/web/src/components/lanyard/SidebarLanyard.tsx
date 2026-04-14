/* eslint-disable react/no-unknown-property */
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF, useTexture } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  type RigidBodyProps,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";
import cardGlb from "@/assets/lanyard/card.glb";
import lanyardTexture from "@/assets/lanyard/lanyard.png";
import { cn } from "@/lib/utils";
import "./SidebarLanyard.css";

extend({ MeshLineGeometry, MeshLineMaterial });

const MeshLineGeometryElement: any = "meshLineGeometry";
const MeshLineMaterialElement: any = "meshLineMaterial";
const BADGE_BASE_WIDTH = 1024;
const BADGE_BASE_HEIGHT = 1536;
const BADGE_TEXTURE_SCALE = 2;

const DEFAULT_PHOTO_SVG = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="720" height="960" viewBox="0 0 720 960">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1d4ed8" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
    </defs>
    <rect width="720" height="960" rx="60" fill="url(#bg)" />
    <circle cx="360" cy="320" r="138" fill="rgba(255,255,255,0.18)" />
    <path d="M180 788c42-146 148-230 278-230s236 84 278 230" fill="rgba(255,255,255,0.18)" />
  </svg>
`);

const DEFAULT_PHOTO_URL = `data:image/svg+xml;charset=utf-8,${DEFAULT_PHOTO_SVG}`;

type SidebarLanyardProps = {
  badgeImage?: string;
  className?: string;
  profileImage?: string;
  userName?: string;
  roleLabel?: string;
};

export function SidebarLanyard({
  badgeImage,
  className,
  profileImage,
  userName = "내 계정",
  roleLabel = "구성원",
}: SidebarLanyardProps) {
  const [isCompact, setIsCompact] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerHeight < 860 : false,
  );

  useEffect(() => {
    const handleResize = () => setIsCompact(window.innerHeight < 860);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={cn("sidebar-lanyard-shell", className)}>
      <div className="sidebar-lanyard-canvas">
        <Canvas
          camera={{ position: [0, 0, 17.1], fov: 20.6 }}
          dpr={[1, isCompact ? 1.35 : 1.85]}
          gl={{ alpha: true, antialias: true }}
          onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), 0)}
        >
          <ambientLight intensity={Math.PI * 0.72} />
          <Suspense fallback={null}>
            <Physics gravity={[0, -34, 0]} timeStep={isCompact ? 1 / 50 : 1 / 60}>
              <Band
                badgeImage={badgeImage}
                isCompact={isCompact}
                profileImage={profileImage}
                roleLabel={roleLabel}
                userName={userName}
              />
            </Physics>
            <Environment blur={0.9}>
              <Lightformer
                intensity={2.8}
                color="#e2e8f0"
                position={[0, -1, 5]}
                rotation={[0, 0, Math.PI / 3]}
                scale={[100, 0.1, 1]}
              />
              <Lightformer
                intensity={3.6}
                color="#93c5fd"
                position={[-1.4, -0.5, 1]}
                rotation={[0, 0, Math.PI / 3]}
                scale={[100, 0.1, 1]}
              />
              <Lightformer
                intensity={3.4}
                color="#f8fafc"
                position={[1.4, 1.2, 1]}
                rotation={[0, 0, Math.PI / 3]}
                scale={[100, 0.1, 1]}
              />
              <Lightformer
                intensity={7}
                color="#60a5fa"
                position={[-10, 0, 14]}
                rotation={[0, Math.PI / 2, Math.PI / 3]}
                scale={[100, 10, 1]}
              />
            </Environment>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

type BandProps = {
  badgeImage?: string;
  isCompact?: boolean;
  profileImage?: string;
  roleLabel?: string;
  userName?: string;
};

function Band({
  badgeImage,
  isCompact = false,
  profileImage,
  roleLabel = "구성원",
  userName = "내 계정",
}: BandProps) {
  const { gl } = useThree();
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const jointA = useRef<any>(null);
  const jointB = useRef<any>(null);
  const jointC = useRef<any>(null);
  const card = useRef<any>(null);
  const dragPointerRef = useRef<{ pointerId: number | null; target: HTMLElement | null }>({
    pointerId: null,
    target: null,
  });

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: RigidBodyProps = {
    angularDamping: 4,
    canSleep: true,
    colliders: false,
    linearDamping: 4,
    type: "dynamic",
  };

  const { nodes, materials } = useGLTF(cardGlb) as any;
  const strapTexture = useTexture(lanyardTexture);
  const resolvedBadgeImage = badgeImage || profileImage || DEFAULT_PHOTO_URL;
  const frontOverlayTexture = useCardOverlayTexture({
    imageUrl: resolvedBadgeImage,
    roleLabel,
    side: "front",
    userName,
  });
  const backOverlayTexture = useCardOverlayTexture({
    side: "back",
  });
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );
  const [dragged, setDragged] = useState<false | THREE.Vector3>(false);
  const [hovered, setHovered] = useState(false);

  useRopeJoint(fixed, jointA, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(jointA, jointB, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(jointB, jointC, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(jointC, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (!hovered) return;

    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [dragged, hovered]);

  const releaseDrag = () => {
    const { pointerId, target } = dragPointerRef.current;

    if (target && pointerId !== null && target.hasPointerCapture(pointerId)) {
      try {
        target.releasePointerCapture(pointerId);
      } catch {
        // Ignore release errors if capture has already been cleared.
      }
    }

    dragPointerRef.current = { pointerId: null, target: null };
    setDragged(false);
  };

  useEffect(() => {
    if (!dragged || typeof dragged === "boolean") return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const isOutsideCanvas =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;

      if (isOutsideCanvas) {
        releaseDrag();
      }
    };

    const handlePointerEnd = () => {
      releaseDrag();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerEnd);
    window.addEventListener("blur", handlePointerEnd);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
      window.removeEventListener("blur", handlePointerEnd);
    };
  }, [dragged, gl]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== "boolean") {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, jointA, jointB, jointC, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (!fixed.current) return;

    [jointA, jointB].forEach((ref) => {
      if (!ref.current?.lerped) {
        ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
      }
      const distance = Math.max(
        0.1,
        Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())),
      );
      ref.current.lerped.lerp(ref.current.translation(), delta * (0.18 + distance * 34));
    });

    curve.points[0].copy(jointC.current.translation());
    curve.points[1].copy(jointB.current.lerped);
    curve.points[2].copy(jointA.current.lerped);
    curve.points[3].copy(fixed.current.translation());

    band.current.geometry.setPoints(curve.getPoints(isCompact ? 18 : 28));

    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
  });

  curve.curveType = "chordal";
  strapTexture.wrapS = strapTexture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={jointA} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={jointB} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={jointC} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.04]} />
          <group
            scale={2.38}
            position={[0, -1.1, -0.05]}
            onPointerDown={(event: any) => {
              event.target.setPointerCapture(event.pointerId);
              dragPointerRef.current = {
                pointerId: event.pointerId,
                target: event.target as HTMLElement,
              };
              setDragged(
                new THREE.Vector3().copy(event.point).sub(vec.copy(card.current.translation())),
              );
            }}
            onPointerOut={() => setHovered(false)}
            onPointerOver={() => setHovered(true)}
            onPointerUp={(event: any) => {
              releaseDrag();
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                color="#d7e3ef"
                clearcoat={isCompact ? 0.75 : 1}
                clearcoatRoughness={0.16}
                emissive="#f8fbff"
                emissiveIntensity={0.04}
                metalness={0.18}
                roughness={0.72}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.28} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />

            <mesh position={[0, 0.01, 0.013]} renderOrder={10}>
              <planeGeometry args={[1.29, 1.97]} />
              <meshBasicMaterial
                alphaTest={0.02}
                depthWrite={false}
                map={frontOverlayTexture}
                polygonOffset
                polygonOffsetFactor={-1}
                polygonOffsetUnits={-1}
                toneMapped={false}
                transparent
              />
            </mesh>

            <mesh position={[0, 0.01, -0.013]} renderOrder={10} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[1.29, 1.97]} />
              <meshBasicMaterial
                alphaTest={0.02}
                depthWrite={false}
                map={backOverlayTexture}
                toneMapped={false}
                transparent
              />
            </mesh>
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <MeshLineGeometryElement />
        <MeshLineMaterialElement
          color="white"
          depthTest={false}
          lineWidth={0.72}
          map={strapTexture}
          repeat={[-4, 1]}
          resolution={isCompact ? [800, 1200] : [1000, 1400]}
          useMap
        />
      </mesh>
    </>
  );
}

type CardOverlayTextureOptions = {
  imageUrl?: string;
  roleLabel?: string;
  side: "back" | "front";
  userName?: string;
};

function useCardOverlayTexture({
  imageUrl,
  roleLabel = "",
  side,
  userName = "",
}: CardOverlayTextureOptions) {
  const [texture] = useState(() => {
    const canvas = document.createElement("canvas");
    canvas.width = BADGE_BASE_WIDTH * BADGE_TEXTURE_SCALE;
    canvas.height = BADGE_BASE_HEIGHT * BADGE_TEXTURE_SCALE;
    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.anisotropy = 16;
    canvasTexture.colorSpace = THREE.SRGBColorSpace;
    canvasTexture.magFilter = THREE.LinearFilter;
    canvasTexture.minFilter = THREE.LinearFilter;
    canvasTexture.generateMipmaps = false;
    canvasTexture.wrapS = THREE.ClampToEdgeWrapping;
    canvasTexture.wrapT = THREE.ClampToEdgeWrapping;
    return canvasTexture;
  });

  useEffect(() => {
    let active = true;
    const canvas = texture.image as HTMLCanvasElement;
    const context = canvas.getContext("2d");

    if (!context) return;

    const render = (image?: HTMLImageElement) => {
      if (!active) return;
      drawCardOverlay(context, {
        image,
        roleLabel,
        side,
        userName,
      });
      texture.needsUpdate = true;
    };

    if (side === "back") {
      render();
      return () => {
        active = false;
      };
    }

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = () => render(image);
    image.onerror = () => render();
    image.src = imageUrl || DEFAULT_PHOTO_URL;

    return () => {
      active = false;
    };
  }, [imageUrl, roleLabel, side, texture, userName]);

  useEffect(() => () => texture.dispose(), [texture]);

  return texture;
}

type DrawCardOverlayOptions = {
  image?: HTMLImageElement;
  roleLabel: string;
  side: "back" | "front";
  userName: string;
};

function drawCardOverlay(
  context: CanvasRenderingContext2D,
  { image, roleLabel, side, userName }: DrawCardOverlayOptions,
) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.save();
  context.scale(
    context.canvas.width / BADGE_BASE_WIDTH,
    context.canvas.height / BADGE_BASE_HEIGHT,
  );

  if (side === "back") {
    drawRoundedPanel(context, {
      height: 1320,
      width: 976,
      x: 24,
      y: 24,
    });
    context.restore();
    return;
  }

  drawRoundedPanel(context, {
    height: 1320,
    width: 976,
    x: 24,
    y: 24,
  });

  context.save();
  roundRect(context, 24, 24, 976, 1488, 78);
  context.clip();

  const frontGlow = context.createRadialGradient(
    BADGE_BASE_WIDTH * 0.3,
    BADGE_BASE_HEIGHT * 0.16,
    0,
    BADGE_BASE_WIDTH * 0.3,
    BADGE_BASE_HEIGHT * 0.16,
    BADGE_BASE_WIDTH * 0.55,
  );
  frontGlow.addColorStop(0, "rgba(191, 219, 254, 0.28)");
  frontGlow.addColorStop(1, "rgba(191, 219, 254, 0)");
  context.fillStyle = frontGlow;
  context.fillRect(0, 0, BADGE_BASE_WIDTH, BADGE_BASE_HEIGHT);
  context.restore();

  drawPhoto({
    context,
    image,
    size: { height: 700, width: 700 },
    x: 162,
    y: 170,
  });

  drawCanvasText(context, userName, BADGE_BASE_WIDTH / 2, 1000, {
    align: "center",
    color: "#ffffff",
    font: "800 102px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    shadowBlur: 16,
    shadowColor: "rgba(15, 23, 42, 0.22)",
  });

  context.fillStyle = "rgba(219, 234, 254, 0.98)";
  roundRect(context, 332, 1038, 360, 84, 42);
  context.fill();

  drawCanvasText(context, roleLabel, BADGE_BASE_WIDTH / 2, 1096, {
    align: "center",
    color: "#1d4ed8",
    font: "800 44px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  });

  context.restore();
}

type DrawPhotoOptions = {
  context: CanvasRenderingContext2D;
  image?: HTMLImageElement;
  size: { height: number; width: number };
  x: number;
  y: number;
};

function drawPhoto({ context, image, size, x, y }: DrawPhotoOptions) {
  const { width, height } = size;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  context.save();
  roundRect(context, x, y, width, height, 36);
  context.clip();
  context.fillStyle = "rgba(255,255,255,0.12)";
  context.fillRect(x, y, width, height);

  if (image) {
    const sourceWidth = image.naturalWidth || image.width;
    const sourceHeight = image.naturalHeight || image.height;
    const scale = Math.min(width / sourceWidth, height / sourceHeight);
    const drawWidth = sourceWidth * scale;
    const drawHeight = sourceHeight * scale;
    const offsetX = x + (width - drawWidth) / 2;
    const offsetY = y + (height - drawHeight) / 2;
    context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  } else {
    context.fillStyle = "rgba(255,255,255,0.18)";
    context.beginPath();
    context.arc(x + width / 2, y + height * 0.34, width * 0.2, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.ellipse(x + width / 2, y + height * 0.9, width * 0.34, height * 0.24, 0, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();

  context.strokeStyle = "rgba(255,255,255,0.26)";
  context.lineWidth = 10;
  roundRect(context, x, y, width, height, 36);
  context.stroke();
}

type RoundedPanelOptions = {
  endColor?: string;
  height: number;
  radius?: number;
  startColor?: string;
  strokeColor?: string;
  width: number;
  x: number;
  y: number;
};

function drawRoundedPanel(
  context: CanvasRenderingContext2D,
  {
    height,
    radius = 78,
    startColor = "rgba(76, 125, 255, 0.96)",
    strokeColor = "rgba(191, 219, 254, 0.28)",
    width,
    x,
    y,
    endColor = "rgba(44, 82, 208, 0.96)",
  }: RoundedPanelOptions,
) {
  const panelGradient = context.createLinearGradient(x, y, x + width, y + height);
  panelGradient.addColorStop(0, startColor);
  panelGradient.addColorStop(1, endColor);
  context.fillStyle = panelGradient;
  roundRect(context, x, y, width, height, radius);
  context.fill();

  context.strokeStyle = strokeColor;
  context.lineWidth = 6;
  roundRect(context, x, y, width, height, radius);
  context.stroke();
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const resolvedRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + resolvedRadius, y);
  context.arcTo(x + width, y, x + width, y + height, resolvedRadius);
  context.arcTo(x + width, y + height, x, y + height, resolvedRadius);
  context.arcTo(x, y + height, x, y, resolvedRadius);
  context.arcTo(x, y, x + width, y, resolvedRadius);
  context.closePath();
}

type CanvasTextOptions = {
  align?: CanvasTextAlign;
  color: string;
  font: string;
  shadowBlur?: number;
  shadowColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
};

function drawCanvasText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  {
    align = "left",
    color,
    font,
    shadowBlur = 0,
    shadowColor = "transparent",
    strokeColor,
    strokeWidth = 0,
  }: CanvasTextOptions,
) {
  context.save();
  context.textAlign = align;
  context.fillStyle = color;
  context.font = font;
  context.textBaseline = "alphabetic";
  context.shadowBlur = shadowBlur;
  context.shadowColor = shadowColor;
  if (strokeColor && strokeWidth > 0) {
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
    context.strokeText(text, x, y);
  }
  context.fillText(text, x, y);
  context.restore();
}

useGLTF.preload(cardGlb);
