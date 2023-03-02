export const percentageResolution = .25;
export const aspectRatioFactor = window.innerHeight / window.innerWidth;
// aspect ratio:


export const WIDTH = Math.floor(window.innerWidth * percentageResolution);
export const HEIGHT = Math.floor(window.innerWidth * aspectRatioFactor * percentageResolution); // window.innerHeight * percentageResolution;
export const TICK = 30;
export const CELL_SIZE = 64;
export const PLAYER_SIZE = 10;
export const PLAYER_MOVE_SPEED = 4;
export const PLAYER_TURN_SPEED = 2;

export const FOVDEGREES = 60;
export const FOV = toRadians(FOVDEGREES);

export const PROJECTION_PLANE_DISTANCE = Math.floor((WIDTH / 2) / Math.tan(FOV / 2));
//export const PROJECTION_PLANE_DISTANCE = Math.floor((WIDTH / 2) / Math.tan((30 * Math.PI) / 100));

export const COLORS = {
    rays: "#ffa600",
    floor: '#cccccc',
    wall: '#9fb3d4',
    wallDark: '#99abc9',
    ceiling: '#cadfed'
}

export function toRadians(deg: number) {
    return (deg * Math.PI) / 180;
}

export function toDegrees(rad: number) {
    return Math.ceil(rad * 180 / Math.PI);
}
