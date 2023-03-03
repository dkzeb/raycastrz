import { CELL_SIZE, PLAYER_MOVE_SPEED, PLAYER_TURN_SPEED, toRadians } from "./consts";
import { ControlState } from "./controls";
import { CheckCollisionOnMap } from "./physics";

export interface Player {
    x: number,
    y: number,
    angle: number,
    speed: number,
    strafeSpeed: number,
    cellX: number,
    cellY: number,
    dirV: {x:number, y:number}, // direction vector
    dirM: {x: number, y: number} // direction magnitude
}

export const playerObj: Player = {
    x: CELL_SIZE * 1.5,
    y: CELL_SIZE * 2,
    angle: 0,
    speed: 0,
    strafeSpeed: 0,
    cellX: 1,
    cellY: 2,
    dirV: {x: 0, y: 0},
    dirM: {x: 0, y: 0}
}

const STRAFE_SPEED = PLAYER_MOVE_SPEED / 2;
const TURN_SPEED = toRadians(PLAYER_TURN_SPEED);

export function movePlayer(controlState: ControlState, player: Player, map: number[][]) {

    if(controlState.up) {
        player.speed = PLAYER_MOVE_SPEED;
    } else {
        if(!controlState.down)
            player.speed = 0;
    }

    if(controlState.down) {
        player.speed = -PLAYER_MOVE_SPEED;
    } else {
        if(!controlState.up)
            player.speed = 0;
    }

    if(controlState.strafeLeft) {
        player.strafeSpeed = -STRAFE_SPEED;
    } else {
        if(!controlState.strafeRight)
            player.strafeSpeed = 0;
        
    }

    if(controlState.strafeRight) {
        player.strafeSpeed = STRAFE_SPEED;
    } else {
        if(!controlState.strafeLeft)
            player.strafeSpeed = 0;
    }   

    if(controlState.turnLeft) {
        player.angle -= TURN_SPEED;
    } 

    if(controlState.turnRight) {
        player.angle += TURN_SPEED;
    }
    
    // compensate for movement speed when both moving and strafing
    if(player.strafeSpeed !== 0 && player.speed !== 0) {
        player.speed *= .75;
        player.strafeSpeed *= .75;    
    }

    player.dirV = { x: Math.cos(player.angle), y: Math.sin(player.angle) };

    // check for collisions - i know where i want to go
    let moveX = player.dirV.x * player.speed + (Math.sin(player.angle * -1) * player.strafeSpeed);
    let moveY = player.dirV.y * player.speed + (Math.cos(player.angle * -1) * player.strafeSpeed);

    player.cellX = Math.floor(player.x / CELL_SIZE);
    player.cellY = Math.floor(player.y / CELL_SIZE);

    player.dirV = {
        x: moveX, 
        y: moveY
    };

    if(CheckCollisionOnMap(player, map)) {                
        player.dirV = {x: 0, y: 0}
    }    
    
    player.x += player.dirV.x;
    player.y += player.dirV.y;
}
