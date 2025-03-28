import { createCanvas, loadImage } from "canvas";
import { ImageProcessorPort } from "../../core/domain/image-processor.port";

export class CanvasImageProcessor implements ImageProcessorPort {
    async processImage(colorOption: string, backgroundPath: string, overlayPath: string, dimension: number): Promise<Buffer> {
        const schema = colorOption.split('-');
        const hue = parseInt(schema[0]);
        const sat = parseInt(schema[1]);
        let lightness = parseInt(schema[2]);
    
        const mainCanvas = createCanvas(dimension, dimension);
        const mainCtx = mainCanvas.getContext('2d');
    
        const backgroundCanvas = createCanvas(dimension, dimension);
        const backgroundCtx = backgroundCanvas.getContext('2d');
    
        const overlayCanvas = createCanvas(dimension, dimension);
        const overlayCtx = overlayCanvas.getContext('2d');
    
        const backgroundImg = await loadImage(backgroundPath);
        const overlayImg = await loadImage(overlayPath);
    
        backgroundCtx.drawImage(backgroundImg, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
    
        overlayCtx.drawImage(overlayImg, 0, 0, overlayCanvas.width, overlayCanvas.height);
    
        overlayCtx.globalCompositeOperation = lightness < 100 ? 'color-burn' : 'color-dodge';
        lightness = lightness >= 100 ? lightness - 100 : 100 - (100 - lightness);
        overlayCtx.fillStyle = `hsl(0, 50%, ${lightness}%)`;
        overlayCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
        overlayCtx.globalCompositeOperation = 'saturation';
        overlayCtx.fillStyle = `hsl(0, ${sat}%, 50%)`;
        overlayCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
        overlayCtx.globalCompositeOperation = 'hue';
        overlayCtx.fillStyle = `hsl(${hue}, 1%, 50%)`;
        overlayCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
        overlayCtx.globalCompositeOperation = 'destination-in';
        overlayCtx.drawImage(overlayImg, 0, 0, overlayCanvas.width, overlayCanvas.height);
    
        // Combine background and overlay on the main canvas
        mainCtx.drawImage(backgroundCanvas, 0, 0);
        mainCtx.drawImage(overlayCanvas, 0, 0);
    
        return mainCanvas.toBuffer();
    }
}