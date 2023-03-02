import { PROJECTION_PLANE_DISTANCE, WIDTH } from "./consts";


export function precalculateViewDistances(): number[] {
    const currentViewDistances = [];
    for(let x = 0; x < WIDTH; x++) {
        let dx = (WIDTH / 2 - x);
        let currentViewDistance = Math.sqrt(dx * dx + PROJECTION_PLANE_DISTANCE * PROJECTION_PLANE_DISTANCE);
        currentViewDistances.push(currentViewDistance); 
    }
    return currentViewDistances;
}
