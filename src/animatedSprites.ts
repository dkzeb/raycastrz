import { Texture } from './rendering';

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
