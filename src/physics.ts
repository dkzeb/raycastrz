import { CELL_SIZE } from "./consts";
import { Player } from "./player";


// if this returns true, it should be used to limit movement
export function CheckCollisionOnMap(player: Player, map: number[][]): boolean {

    // get next cell hit
    const nextMapX = Math.floor((player.x + player.dirV.x) / CELL_SIZE);
    const nextMapY = Math.floor((player.y + player.dirV.y) / CELL_SIZE);
    return map[nextMapY][nextMapX] === 1;
}