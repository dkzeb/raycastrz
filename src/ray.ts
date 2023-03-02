import { CELL_SIZE, FOV, WIDTH } from "./consts";
import { Player } from "./player";


export interface Ray {
    angle: number,
    distance: number,
    vertical: boolean,
    x: number,
    y: number
}

export function getRays(player: Player, map: number[][]): Ray[] {
    
    const initialAngle = player.angle - FOV / 2;
    const numberOfRays = WIDTH;
    const angleStep = FOV / numberOfRays;
    return Array.from({ length: numberOfRays}, (_, i) => {
        const angle = initialAngle + i * angleStep;
        const ray: Ray = castRay(angle, player, map);
        return ray;
    });
}


function castRay(angle: number, player: Player, map: number[][]): Ray {
    const vCollision = getVCollision(angle, player, map);
    const hCollision = getHCollision(angle, player, map);
    return hCollision.distance >= vCollision.distance ? vCollision : hCollision;
}

function getVCollision(angle: number, player: Player, map: number[][]): Ray {
    const right = Math.abs(Math.floor((angle-Math.PI / 2) / Math.PI) % 2);
    const firstX = right ? 
        Math.floor(player.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE :
        Math.floor(player.x / CELL_SIZE) * CELL_SIZE;
    const firstY = player.y + (firstX - player.x) * Math.tan(angle);
    const xA = right ? CELL_SIZE : -CELL_SIZE;
    const yA = xA * Math.tan(angle);

    let wall;
    let nextX = firstX;
    let nextY = firstY;
    while(!wall) {
        const cellX = right ? Math.floor(nextX / CELL_SIZE) : Math.floor(nextX / CELL_SIZE) - 1;
        const cellY = Math.floor(nextY / CELL_SIZE);

        if(outOfMapBounds(cellX, cellY, map)) {
            break;
        }

        wall = map[cellY][cellX];
        if(!wall) {
            nextX += xA;
            nextY += yA;
        }
    }
    return { angle, distance: distance(player.x, player.y, nextX, nextY), vertical: true, x: nextX, y: nextY }
}

function getHCollision(angle: number, player: Player, map: number[][]): Ray {
    const up = Math.abs(Math.floor(angle / Math.PI) % 2);
    const firstY = up
        ? Math.floor(player.y / CELL_SIZE) * CELL_SIZE
        : Math.floor(player.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE;
    const firstX = player.x + (firstY - player.y) / Math.tan(angle);

    const yA = up ? -CELL_SIZE : CELL_SIZE;
    const xA = yA / Math.tan(angle);
    let wall;
    let nextX = firstX;
    let nextY = firstY;
    while (!wall) {
        const cellX = Math.floor(nextX / CELL_SIZE);
        const cellY = up
            ? Math.floor(nextY / CELL_SIZE) - 1
            : Math.floor(nextY / CELL_SIZE);

        if (outOfMapBounds(cellX, cellY, map)) {
            break;
        }

        wall = map[cellY][cellX];
        if (!wall) {
            nextX += xA;
            nextY += yA;
        }
    }
    return {
        angle,
        distance: distance(player.x, player.y, nextX, nextY),
        vertical: false,
        x: nextX,
        y: nextY
    };
}
function distance(x: number, y: number, nextX: number, nextY: number): number {
    return Math.sqrt(Math.pow(nextX - x, 2) + Math.pow(nextY - y, 2));
}

function outOfMapBounds(cellX: number, cellY: number, map: number[][]) {
    return cellX < 0 || cellX >= map[0].length || cellY < 0 || cellY >= map.length;
}

