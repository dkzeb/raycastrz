import { Pixel } from './rendering';

export function pixelDataToArray(pixelData: Uint8ClampedArray, width: number) {
    const pixelArr: Pixel[][] = [];
    const dim1: Pixel[] = [];
    for(let i = 0; i < pixelData.length; i += 4) {
        dim1.push({
            r: pixelData[i],
            g: pixelData[i + 1],
            b: pixelData[i + 2],
            a: pixelData[i + 3]
        });
    }

    let currentWidth = 0;
    let tmpArr: Pixel[] = [];
    dim1.forEach(p => {
        if(currentWidth === width) {
            currentWidth = 0;
            pixelArr.push(tmpArr);
            tmpArr = []; // reset the tmp array after pushing it
        }
        tmpArr.push(p);
        currentWidth++;        
    });
    // get last row
    pixelArr.push(tmpArr);
    return pixelArr;
}

export function pixelArrayToData(pixelArray: Pixel[][]): Uint8ClampedArray {        
    const arr: number[] = [];
    for(let i = 0; i < pixelArray.length; i++) {
        for(let j = 0; j < pixelArray[i].length; j++) {
            const p: Pixel = pixelArray[i][j];
            arr.push(p.r);
            arr.push(p.g);
            arr.push(p.b);
            arr.push(p.a);
        }
    }
    return new Uint8ClampedArray(arr);
}

export function getRndColor() {
    const r = 255*Math.random()|0,
        g = 255*Math.random()|0,
        b = 255*Math.random()|0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

export function distnaceBetweenPoints(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1 ,2))
}