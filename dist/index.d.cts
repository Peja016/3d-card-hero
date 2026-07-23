type Hero3DOptions = {
    maxRotate?: number;
    scaleOnHover?: number;
    transitionMs?: number;
    depth?: number;
    glare?: boolean;
};
type Hero3DInstance = {
    destroy: () => void;
    update: (nextOptions: Partial<Hero3DOptions>) => void;
};
type Hero3DProjectItem = {
    image: string;
    title?: string;
    href?: string;
    target?: string;
    overlayOpacity?: number;
};
type Hero3DAngles = {
    x: number;
    y: number;
    z: number;
};
type Hero3DProjectListOptions = {
    items: Hero3DProjectItem[];
    baseAngles?: Partial<Hero3DAngles>;
    hoverRotate?: number;
    hoverShift?: number;
    density?: number;
    enableMouseDynamic?: boolean;
    resetOnPointerLeave?: boolean;
    transitionMs?: number;
    cardAspectRatio?: string;
    className?: string;
};
type Hero3DProjectListInstance = {
    destroy: () => void;
    update: (nextOptions: Partial<Hero3DProjectListOptions>) => void;
};
declare function createHero3D(element: HTMLElement, userOptions?: Hero3DOptions): Hero3DInstance;
declare function createHero3DProjectList(element: HTMLElement, userOptions: Hero3DProjectListOptions): Hero3DProjectListInstance;

export { type Hero3DAngles, type Hero3DInstance, type Hero3DOptions, type Hero3DProjectItem, type Hero3DProjectListInstance, type Hero3DProjectListOptions, createHero3D, createHero3DProjectList };
