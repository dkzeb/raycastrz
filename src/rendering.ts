import { WIDTH, HEIGHT, CELL_SIZE, PLAYER_SIZE, COLORS, PROJECTION_PLANE_DISTANCE, percentageResolution, aspectRatioFactor } from "./consts";
import { precalculateViewDistances } from "./lookupTables";
import { Player } from './player';
import { Ray } from "./ray";
import { pixelDataToArray } from "./utils";
import { Weapon } from "./weapons";

export interface Texture {
    data: any,
    ctx: CanvasRenderingContext2D,
    height: number,
    width: number,
    pixelArray: Pixel[][]
}

export interface Pixel {
    r: number,
    g: number,
    b: number,
    a: number
}

const canvas = document.createElement("canvas");
canvas.setAttribute("width", WIDTH.toString());
canvas.setAttribute("height", HEIGHT.toString());
export const ctx = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
ctx.imageSmoothingEnabled = true;
document.body.appendChild(canvas);
let currentViewDistances = precalculateViewDistances();

const floor = Math.floor;
const cos = Math.cos;
const sin = Math.sin;

const buffer = new OffscreenCanvas(WIDTH, HEIGHT);
const bufferCtx = buffer.getContext('2d', {
    willReadFrequenctly: true
}) as OffscreenCanvasRenderingContext2D;
bufferCtx.imageSmoothingEnabled = true;
bufferCtx.imageSmoothingQuality = "high";

let textures: { wall?: Texture, floor?: Texture, ceiling?: Texture } = {};



export function initRendering(loadedTextures: any) {
    textures = loadedTextures;

    console.log('Render init with internal res;', WIDTH +'x'+HEIGHT, '- scalefactor:', percentageResolution, 'aspect factor:', aspectRatioFactor);
}

export function loadTexture(path: string): Promise<Texture> {
    return new Promise((resolve, reject) => {
        const image: HTMLImageElement = new Image();
        image.onload = () => {
            console.log('loaded image from', path);
            const cvs = document.createElement("canvas");
            const textCtx = cvs.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
            ctx.imageSmoothingEnabled = true;
            cvs.setAttribute("height", image.height.toString());// = image.height;
            cvs.setAttribute("width", image.width.toString());
            textCtx.drawImage(image,0,0);

            const pixelData = textCtx.getImageData(0,0,cvs.width, cvs.height);
            const pixelArray = pixelDataToArray(pixelData.data, cvs.width);           
            resolve({
                data: pixelData,
                ctx: textCtx,
                height: cvs.height,
                width: cvs.width,
                pixelArray
            });
        }
        image.onerror = (err) => {
            console.log('could not load image from', path);
            reject(err);
        }
        image.src = path;
    });
}
export function renderPlayerOrientation(player: Player) {
    ctx.fillStyle = 'white';
    ctx.fillRect(WIDTH - 100, 0, 100, 100);

    // helper statics
    const playerX = WIDTH - 50;
    const playerY = 50;

    // draw player orientation
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(WIDTH - 50, 50, 10, 0, 360);
    ctx.closePath();
    ctx.fill();

    // direction
    const rayLength = 20;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(WIDTH - 50, 50);
    ctx.lineTo(
        (playerX + cos(player.angle) * rayLength),
        (playerY + sin(player.angle) * rayLength)
    );
    ctx.closePath();
    ctx.stroke();

    // draw out strafe line based on rotation
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(
        (playerX + sin(player.angle * -1) * -rayLength),
        (playerY + cos(player.angle * -1) * -rayLength)
    );

    ctx.lineTo(
        (playerX + sin(player.angle * -1) * rayLength),
        (playerY + cos(player.angle * -1) * rayLength)
    );
    ctx.closePath();
    ctx.stroke();

    
    ctx.canvas.style.fontSize = "5px";
    ctx.fillText("RAD: " + player.angle, WIDTH - 90, 10);

}

export function renderMinimap(posX: number, posY: number, scale: number, rays: Ray[], player: Player, map: any[] ) {
    const cellSize = CELL_SIZE * scale;
    map.forEach((row, y) => {
        row.forEach((cell: number, x: number) => {
             if(cell) {
                ctx.fillStyle = 'gray';
                ctx.fillRect(posX + x * cellSize, posY + y * cellSize, cellSize, cellSize);
             }
        });
    });


    // player 
    ctx.fillStyle = 'red';
    ctx.fillRect(
        posX + player.x * scale - PLAYER_SIZE / 4,
        posY + player.y * scale - PLAYER_SIZE / 4,
        PLAYER_SIZE / 2,
        PLAYER_SIZE / 2
    );

    const rayLength = PLAYER_SIZE * 2;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(player.x * scale + posX, player.y * scale + posY);
    ctx.lineTo(
        (player.x + cos(player.angle) * rayLength) * scale,
        (player.y + sin(player.angle) * rayLength) * scale
    );
    ctx.closePath();
    ctx.stroke();

    // rays
    ctx.strokeStyle = COLORS.rays;
    rays.forEach((r: Ray) => {
        ctx.beginPath();
        ctx.moveTo(player.x * scale + posX, player.y * scale + posY);
        ctx.lineTo(
            (player.x + cos(r.angle) * r.distance) * scale,
            (player.y + sin(r.angle) * r.distance) * scale
        );
        ctx.closePath();
        ctx.stroke();
    })

}

function fixFishEye(distance: number, angle: number, playerAngle: number) {
    const diff = angle - playerAngle;
    return distance * cos(diff);
}


export function renderScene(rays: Ray[], player: Player, mapWidth: number, mapHeight: number) {   
    if(!textures.floor) {
        ctx.fillStyle = COLORS.floor;
        ctx.fillRect(0, HEIGHT / 2, WIDTH, HEIGHT);
    }

    const currentBuffer = bufferCtx.getImageData(0,0,WIDTH,HEIGHT);

    rays.forEach((ray, i) => {
        const distance = fixFishEye(ray.distance, ray.angle, player.angle);
        let distShade = distance / (CELL_SIZE * 10) > .6 ? .6 : distance / (CELL_SIZE * 10);            
        const wallHeight = ((CELL_SIZE) / distance) * PROJECTION_PLANE_DISTANCE;

        const wallTop = floor(HEIGHT / 2 - wallHeight / 2);
        const wallBottom = floor(HEIGHT / 2 + wallHeight / 2);
    
        // floor
    // algo:
    /*
        1. find distance to point F (floor coord) from player pos
        2. rotate that distance using current ray angle to find F
            relative to the player
        3. translate F relative to player pos to get world coords
        4. map world coords to texture coord
    */
        if(textures.floor && wallBottom > 0) {
            const eyeHeight = CELL_SIZE / 2;            
            const centerY = HEIGHT / 2;
            const currentViewDistance = currentViewDistances[i];
            const cosRayAngle = cos(ray.angle);
            const sinRayAngle = sin(ray.angle);        

            let pixelbufferIndexIncrement = 0;
            for(let pY = wallBottom; pY < HEIGHT; pY++) {
                const dY = pY - centerY;
                const floorDist = (currentViewDistance * eyeHeight) / dY;
                const worldX = player.x + floorDist * cosRayAngle;
                const worldY = player.y + floorDist * sinRayAngle;
                if(worldX < 0 || worldY < 0 || worldX > mapWidth || worldY > mapHeight) {
                    continue; // we are outside of map bounds - never mind
                }
    
                let textureX = floor(worldX) % CELL_SIZE;
                let textureY = floor(worldY) % CELL_SIZE;
                
                if(CELL_SIZE != textures.floor.width) {
                    textureX = floor(textureX / CELL_SIZE * textures.floor.height);
                    textureY = floor(textureY / CELL_SIZE * textures.floor.width);
                }

                // select the pixel, and put it in the current buffer pixels
                const pixel = textures.floor.pixelArray[textureY][textureX];            
                //currentPixels[pY][i] = pixel;
                // lets go
                // pixelArray index = y * width + x;
                //const bufferIdx = pY * WIDTH + i;
                //const bufferIdx = pY * (currentBuffer.width * 4);
                const bufferIdx = (pY * currentBuffer.width + i) * 4;
                currentBuffer.data[bufferIdx] = pixel.r;
                currentBuffer.data[bufferIdx + 1] = pixel.g;
                currentBuffer.data[bufferIdx + 2] = pixel.b;
                currentBuffer.data[bufferIdx + 3] = pixel.a;
                                 
            }

            if(textures.ceiling) {
                for(let pY = wallTop; pY > 0; pY--) {
                    const dY = pY - centerY;
                    const floorDist = (currentViewDistance * eyeHeight) / dY;
                    const worldX = player.x + floorDist * -cosRayAngle;
                    const worldY = player.y + floorDist * -sinRayAngle;
                    if(worldX < 0 || worldY < 0 || worldX > mapWidth || worldY > mapHeight) {
                        continue; // we are outside of map bounds - never mind
                    }
        
                    let textureX = floor(worldX)  % CELL_SIZE;
                    let textureY = floor(worldY) % CELL_SIZE;
                    
                    if(CELL_SIZE != textures.ceiling.width) {
                        textureX = floor(textureX / CELL_SIZE * textures.ceiling.height);
                        textureY = floor(textureY / CELL_SIZE * textures.ceiling.width);
                    }
    
                    // select the pixel, and put it in the current buffer pixels
                    const pixel = textures.ceiling.pixelArray[textureY][textureX];
                    //currentPixels[pY][i] = pixel;

                    // lets go
                    // pixelArray index = y * width + x;
                    //const bufferIdx = pY * WIDTH + i;
                    //const bufferIdx = pY * (currentBuffer.width * 4);
                    const bufferIdx = (pY * currentBuffer.width + i) * 4;
                    currentBuffer.data[bufferIdx] = pixel.r;
                    currentBuffer.data[bufferIdx + 1] = pixel.g;
                    currentBuffer.data[bufferIdx + 2] = pixel.b;
                    currentBuffer.data[bufferIdx + 3] = pixel.a;
                }
            }
        }

        
        
        // wall
        if(!textures.wall) {
            ctx.fillStyle = ray.vertical ? COLORS.wallDark : COLORS.wall;
            ctx.fillRect(i, HEIGHT / 2 - wallHeight / 2, 1, wallHeight);
        } else {
            const offset = ray.vertical ? ray.y % textures.wall.width : ray.x % textures.wall.width;        
            
            bufferCtx.drawImage(textures.wall.ctx.canvas, 
                Math.floor(offset), 0, // start clip, x,y                 
                1, textures.wall.height, // clip width, clip height,                                
                i, wallTop, // x y on ctx canvas
                1, wallHeight // width, height scale
            );
            if(!ray.vertical) distShade += .1;
            bufferCtx.fillStyle = 'rgba(0,0,0,' + distShade + ')';
            bufferCtx.fillRect(i, wallTop, 1, wallHeight);            
        }
    });

    //currentBuffer.data.set(pixelArrayToData(currentPixels));
    ctx.putImageData(currentBuffer, 0, 0);
}

let weaponAnimating = false;
export function renderWeapon(weapon: Weapon, fire: boolean) {
    if(fire && !weaponAnimating) {
        weaponAnimating = true;
        weapon.fire();
        animateSprite(weapon, "fire", 0, weapon.sprites.frameTimeout, () => {
            weaponAnimating = false;
            weapon.sprites.activeSprite = weapon.sprites.idle;
        });
    }
    if(weapon.sprites.activeSprite)
        ctx.drawImage(weapon.sprites.activeSprite.ctx.canvas, WIDTH / 2 + weapon.sprites.offsetX, HEIGHT - weapon.sprites.activeSprite.ctx.canvas.height + weapon.sprites.offsetY, weapon.sprites.scale, weapon.sprites.scale);
    
}

export function clearScreen() {
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,WIDTH,HEIGHT);
}


function animateSprite(animatedObject: any, key: string, index = 0, timeout = 250, cb: Function = () => {}) {
    if(index < animatedObject.sprites[key].length) {
        animatedObject.sprites.activeSprite = animatedObject.sprites[key][index];
        setTimeout(() => {
            animateSprite(animatedObject, key, index + 1, timeout, cb);
        }, timeout);
    } else {
        cb();
    }

}
