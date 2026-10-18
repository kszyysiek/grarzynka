/** Panorama tour: one equirectangular photo per room, linked by floor arrows. */

export interface PanoLink {
  to: string;
  /** compass direction of the arrow in degrees, 0 = initial view */
  yaw: number;
  pitch?: number;
}

export interface PanoNode {
  title: string;
  src: string;
  startYaw?: number;
  links: PanoLink[];
}

export const PANO_START = 'salon';

export const PANO_NODES: Record<string, PanoNode> = {
  salon: {
    title: 'Salon',
    src: '/renders/pano/salon.jpg',
    startYaw: -50,
    links: [],
  },
};
