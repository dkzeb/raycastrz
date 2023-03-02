import { CELL_SIZE, PLAYER_MOVE_SPEED, PLAYER_TURN_SPEED, toRadians } from "./consts";
import { ControlState } from "./controls";

export interface Player {
    x: number,
    y: number,
    angle: number,
    speed: number,
    strafeSpeed: number
}

export const playerObj: Player = {
    x: CELL_SIZE * 1.5,
    y: CELL_SIZE * 2,
    angle: 0,
    speed: 0,
    strafeSpeed: 0
}

const STRAFE_SPEED = PLAYER_MOVE_SPEED / 2;
const TURN_SPEED = toRadians(PLAYER_TURN_SPEED);

export function movePlayer(controlState: ControlState, player: Player) {

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

    /*if(Math.abs(player.angle) > Math.PI * 2) // we rotated 360 degrees, reset angle to 
        player.angle = 0;*/
    
    // compensate for movement speed when both moving and strafing
    if(player.strafeSpeed !== 0 && player.speed !== 0) {
        player.speed *= .75;
        player.strafeSpeed *= .75;    
    }

    // forward / backwards movement + strafe (note the inverted angle since we are switching cos/sin    )
    player.x += Math.cos(player.angle) * player.speed + (Math.sin(player.angle * -1) * player.strafeSpeed);
    player.y += Math.sin(player.angle) * player.speed + (Math.cos(player.angle * -1) * player.strafeSpeed);
}
