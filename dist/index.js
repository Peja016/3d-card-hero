// src/index.ts
import * as React from "react";
var DEFAULT_OPTIONS = {
  maxRotate: 11,
  scaleOnHover: 1.02,
  transitionMs: 320,
  depth: 40,
  glare: true
};
var DEFAULT_PROJECT_LIST_OPTIONS = {
  baseAngles: {
    x: 70,
    y: 0,
    z: 40
  },
  hoverRotate: 0,
  hoverShift: 0,
  density: 0.3,
  enableMouseDynamic: false,
  resetOnPointerLeave: false,
  transitionMs: 320,
  cardAspectRatio: "16 / 9",
  className: ""
};
var DEFAULT_PROJECT_LIST_BASE_ANGLES = {
  x: 70,
  y: 0,
  z: 40
};
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function toNumber(value, fallback) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }
  return value;
}
function applyBaseStyles(element, options) {
  element.style.setProperty("--hero-depth", `${options.depth}px`);
  element.style.setProperty("--hero-transition", `${options.transitionMs}ms`);
  element.style.transformStyle = "preserve-3d";
  element.style.willChange = "transform";
}
function ensureGlareLayer(element) {
  let glare = element.querySelector(":scope > .hero3d-glare");
  if (!glare) {
    glare = document.createElement("div");
    glare.className = "hero3d-glare";
    element.appendChild(glare);
  }
  return glare;
}
function createHero3D(element, userOptions = {}) {
  if (!element) {
    throw new Error("createHero3D: element is required.");
  }
  let options = { ...DEFAULT_OPTIONS, ...userOptions };
  let glareLayer = null;
  applyBaseStyles(element, options);
  if (options.glare) {
    glareLayer = ensureGlareLayer(element);
  }
  const onPointerMove = (event) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = x / rect.width * 2 - 1;
    const py = y / rect.height * 2 - 1;
    const rotateY = clamp(
      px * options.maxRotate,
      -options.maxRotate,
      options.maxRotate
    );
    const rotateX = clamp(
      -py * options.maxRotate,
      -options.maxRotate,
      options.maxRotate
    );
    element.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(${options.scaleOnHover})`;
    if (glareLayer) {
      const gx = Math.round(x / rect.width * 100);
      const gy = Math.round(y / rect.height * 100);
      glareLayer.style.opacity = "1";
      glareLayer.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.45), rgba(255,255,255,0.03) 34%, rgba(255,255,255,0) 56%)`;
    }
  };
  const onPointerLeave = () => {
    element.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
    if (glareLayer) {
      glareLayer.style.opacity = "0";
    }
  };
  element.addEventListener("pointermove", onPointerMove);
  element.addEventListener("pointerleave", onPointerLeave);
  const update = (nextOptions) => {
    options = { ...options, ...nextOptions };
    applyBaseStyles(element, options);
    if (options.glare && !glareLayer) {
      glareLayer = ensureGlareLayer(element);
    }
    if (!options.glare && glareLayer) {
      glareLayer.remove();
      glareLayer = null;
    }
  };
  const destroy = () => {
    element.removeEventListener("pointermove", onPointerMove);
    element.removeEventListener("pointerleave", onPointerLeave);
    element.style.removeProperty("--hero-depth");
    element.style.removeProperty("--hero-transition");
    element.style.transform = "";
    if (glareLayer) {
      glareLayer.remove();
      glareLayer = null;
    }
  };
  return { destroy, update };
}
function normalizeProjectListOptions(userOptions) {
  const baseAngles = {
    x: toNumber(userOptions.baseAngles?.x, DEFAULT_PROJECT_LIST_BASE_ANGLES.x),
    y: toNumber(userOptions.baseAngles?.y, DEFAULT_PROJECT_LIST_BASE_ANGLES.y),
    z: toNumber(userOptions.baseAngles?.z, DEFAULT_PROJECT_LIST_BASE_ANGLES.z)
  };
  return {
    items: userOptions.items,
    baseAngles,
    hoverRotate: toNumber(
      userOptions.hoverRotate,
      DEFAULT_PROJECT_LIST_OPTIONS.hoverRotate
    ),
    hoverShift: toNumber(
      userOptions.hoverShift,
      DEFAULT_PROJECT_LIST_OPTIONS.hoverShift
    ),
    density: clamp(
      toNumber(userOptions.density, DEFAULT_PROJECT_LIST_OPTIONS.density),
      0,
      1
    ),
    enableMouseDynamic: userOptions.enableMouseDynamic ?? DEFAULT_PROJECT_LIST_OPTIONS.enableMouseDynamic,
    resetOnPointerLeave: userOptions.resetOnPointerLeave ?? DEFAULT_PROJECT_LIST_OPTIONS.resetOnPointerLeave,
    transitionMs: toNumber(
      userOptions.transitionMs,
      DEFAULT_PROJECT_LIST_OPTIONS.transitionMs
    ),
    cardAspectRatio: userOptions.cardAspectRatio ?? DEFAULT_PROJECT_LIST_OPTIONS.cardAspectRatio,
    className: userOptions.className ?? DEFAULT_PROJECT_LIST_OPTIONS.className
  };
}
function createCardAnchor(item) {
  const card = document.createElement("a");
  card.className = "hero3d-project-card link project-card";
  card.href = item.href ?? "#";
  card.style.pointerEvents = "auto";
  if (item.target) {
    card.target = item.target;
    if (item.target === "_blank") {
      card.rel = "noreferrer noopener";
    }
  }
  card.style.backgroundImage = `url("${item.image}")`;
  const solid = document.createElement("div");
  solid.className = "hero3d-project-solid solid";
  const baseOverlayOpacity = clamp(item.overlayOpacity ?? 0.52, 0, 1);
  solid.style.opacity = `${baseOverlayOpacity}`;
  solid.dataset.baseOpacity = `${baseOverlayOpacity}`;
  if (item.title && item.title.trim().length > 0) {
    const title = document.createElement("div");
    title.className = "hero3d-project-title project-title";
    title.textContent = item.title;
    card.appendChild(title);
  }
  card.appendChild(solid);
  return card;
}
function setProjectListTransform(listElement, options, rotateDeltaX = 0, rotateDeltaY = 0, rotateDeltaZ = 0) {
  const rx = options.baseAngles.x + rotateDeltaX;
  const ry = options.baseAngles.y + rotateDeltaY;
  const rz = options.baseAngles.z + rotateDeltaZ;
  listElement.style.transform = `rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) rotateZ(${rz.toFixed(3)}deg) skew(0deg, 0deg)`;
}
function applyStackDensityLayout(listElement, options) {
  const listItems = Array.from(
    listElement.querySelectorAll(":scope > .hero3d-project-item")
  );
  const density = clamp(options.density, 0, 1);
  const overlapVh = 4 + density * 16;
  const cardHeightVh = 30 + density * 10;
  listItems.forEach((item, index) => {
    const baseZ = listItems.length - index;
    item.style.zIndex = `${baseZ}`;
    item.dataset.baseZIndex = `${baseZ}`;
    item.style.aspectRatio = "40 / 17";
    item.style.objectFit = "cover";
    item.style.height = `${cardHeightVh.toFixed(2)}vh`;
    item.style.marginTop = `-${overlapVh.toFixed(2)}vh`;
    item.style.marginBottom = `-${overlapVh.toFixed(2)}vh`;
    item.style.transformStyle = "preserve-3d";
    item.style.transform = "rotateX(-90deg) rotateY(0deg) rotateZ(0deg)";
  });
}
function createHero3DProjectList(element, userOptions) {
  if (!element) {
    throw new Error("createHero3DProjectList: element is required.");
  }
  if (!Array.isArray(userOptions.items) || userOptions.items.length === 0) {
    throw new Error(
      "createHero3DProjectList: options.items must be a non-empty array."
    );
  }
  let options = normalizeProjectListOptions(userOptions);
  let listWrapElement = null;
  let listElement = null;
  const cardDisposers = [];
  const clearCardListeners = () => {
    while (cardDisposers.length > 0) {
      const dispose = cardDisposers.pop();
      if (dispose) {
        dispose();
      }
    }
  };
  const bindCardHoverShift = () => {
    if (!listElement) {
      return;
    }
    clearCardListeners();
    const cards = listElement.querySelectorAll(
      ":scope .hero3d-project-card"
    );
    cards.forEach((card) => {
      const listItem = card.closest(".hero3d-project-item");
      const solid = card.querySelector(
        ":scope .hero3d-project-solid"
      );
      const onEnter = () => {
        const hoverShiftPx = options.hoverShift > 0 ? options.hoverShift : 8;
        if (listItem) {
          listItem.style.zIndex = "9999";
        }
        if (solid) {
          solid.style.opacity = "0";
        }
        card.style.transform = `translate3d(0, ${-hoverShiftPx}px, 24px) scale(1.03)`;
      };
      const onLeave = () => {
        card.style.transform = "";
        if (solid) {
          solid.style.opacity = solid.dataset.baseOpacity ?? "0.52";
        }
        if (listItem) {
          listItem.style.zIndex = listItem.dataset.baseZIndex ?? "1";
        }
      };
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);
      cardDisposers.push(() => {
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointerleave", onLeave);
      });
    });
  };
  const render = () => {
    element.innerHTML = "";
    element.classList.add("hero3d-project-root");
    if (options.className) {
      element.classList.add(options.className);
    }
    element.style.setProperty(
      "--hero-project-transition",
      `${options.transitionMs}ms`
    );
    element.style.setProperty("--hero-project-aspect", options.cardAspectRatio);
    listElement = document.createElement("div");
    listWrapElement = document.createElement("div");
    listWrapElement.className = "hero3d-project-list-wrap project-list-wrap";
    listWrapElement.style.transformStyle = "preserve-3d";
    listWrapElement.style.willChange = "transform";
    listWrapElement.style.transform = "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)";
    listElement.className = "hero3d-project-list";
    listElement.classList.add("project-list");
    listElement.setAttribute("role", "list");
    listElement.style.display = "flex";
    listElement.style.flexFlow = "column-reverse";
    listElement.style.justifyContent = "center";
    listElement.style.alignItems = "center";
    listElement.style.perspective = "none";
    listElement.style.transformStyle = "preserve-3d";
    options.items.forEach((item) => {
      const listItem = document.createElement("div");
      listItem.className = "hero3d-project-item";
      listItem.classList.add("project-item");
      listItem.setAttribute("role", "listitem");
      listItem.style.pointerEvents = "none";
      listItem.appendChild(createCardAnchor(item));
      listElement?.appendChild(listItem);
    });
    listWrapElement.appendChild(listElement);
    element.appendChild(listWrapElement);
    applyStackDensityLayout(listElement, options);
    setProjectListTransform(listElement, options);
    bindCardHoverShift();
  };
  const onPointerMove = (event) => {
    if (!listElement) {
      return;
    }
    if (options.hoverRotate <= 0 && !options.enableMouseDynamic) {
      return;
    }
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = x / rect.width * 2 - 1;
    const py = y / rect.height * 2 - 1;
    const rotateDeltaY = clamp(
      px * options.hoverRotate,
      -options.hoverRotate,
      options.hoverRotate
    );
    const rotateDeltaX = clamp(
      -py * options.hoverRotate,
      -options.hoverRotate,
      options.hoverRotate
    );
    const rotateDeltaZ = clamp(
      px * options.hoverRotate * 0.85,
      -options.hoverRotate,
      options.hoverRotate
    );
    let mouseDynamicDeltaX = 0;
    let mouseDynamicDeltaZ = 0;
    if (options.enableMouseDynamic) {
      const targetX = clamp(options.baseAngles.x + -py * 10, 65, 89);
      mouseDynamicDeltaX = targetX - options.baseAngles.x;
      mouseDynamicDeltaZ = px * 12;
    }
    setProjectListTransform(
      listElement,
      options,
      rotateDeltaX + mouseDynamicDeltaX,
      rotateDeltaY,
      rotateDeltaZ + mouseDynamicDeltaZ
    );
  };
  const onPointerLeave = () => {
    if (!listElement) {
      return;
    }
    if (!options.resetOnPointerLeave) {
      return;
    }
    setProjectListTransform(listElement, options);
  };
  const bindListPointerRotate = () => {
    if (options.hoverRotate <= 0 && !options.enableMouseDynamic) {
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerleave", onPointerLeave);
      return;
    }
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerleave", onPointerLeave);
  };
  bindListPointerRotate();
  render();
  const update = (nextOptions) => {
    const nextItems = nextOptions.items ?? options.items;
    options = normalizeProjectListOptions({
      ...options,
      ...nextOptions,
      items: nextItems,
      baseAngles: {
        ...options.baseAngles,
        ...nextOptions.baseAngles
      }
    });
    render();
    bindListPointerRotate();
  };
  const destroy = () => {
    element.removeEventListener("pointermove", onPointerMove);
    element.removeEventListener("pointerleave", onPointerLeave);
    clearCardListeners();
    element.classList.remove("hero3d-project-root");
    if (options.className) {
      element.classList.remove(options.className);
    }
    element.style.removeProperty("--hero-project-transition");
    element.style.removeProperty("--hero-project-aspect");
    element.innerHTML = "";
  };
  return { destroy, update };
}
function HeroCardContainer(props) {
  const {
    items,
    baseAngles,
    hoverRotate,
    hoverShift,
    density,
    enableMouseDynamic,
    resetOnPointerLeave,
    transitionMs,
    cardAspectRatio,
    className,
    style,
    ...domProps
  } = props;
  const containerRef = React.useRef(null);
  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }
    const instance = createHero3DProjectList(element, {
      items,
      baseAngles,
      hoverRotate,
      hoverShift,
      density,
      enableMouseDynamic,
      resetOnPointerLeave,
      transitionMs,
      cardAspectRatio,
      className
    });
    return () => {
      instance.destroy();
    };
  }, [
    items,
    baseAngles?.x,
    baseAngles?.y,
    baseAngles?.z,
    hoverRotate,
    hoverShift,
    density,
    enableMouseDynamic,
    resetOnPointerLeave,
    transitionMs,
    cardAspectRatio,
    className
  ]);
  return React.createElement("div", {
    ref: containerRef,
    className,
    style,
    ...domProps
  });
}
export {
  HeroCardContainer,
  createHero3D,
  createHero3DProjectList
};
