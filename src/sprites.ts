import { Texture } from './rendering';

export interface StaticSprite {
    x: number,
    y: number,
    z: number
    worldSize: number,
    texture: Texture
}

export interface AnimatedSprite {
    idle: Texture,
    scale: number,
    frameTimeout: number,
    activeSprite?: Texture
}

export interface AnimatedWeaponsSprite extends AnimatedSprite {
    fire: Texture[],    
    offsetX: number,
    offsetY: number,
    scale: number
}

export interface AnimatedCharacterSprite extends AnimatedSprite {

}
