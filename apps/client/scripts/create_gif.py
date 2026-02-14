import sys
import os
from PIL import Image

def create_gif(input_path, output_path):
    print(f"Processing {input_path} into GIF...")
    try:
        sheet = Image.open(input_path).convert("RGBA")
    except Exception as e:
        print(f"Error opening image: {e}")
        return

    # Dimensions
    sheet_w, sheet_h = sheet.size
    cols = 8
    frame_w = sheet_w // cols
    frame_h = sheet_h
    
    frames = []
    
    print(f"Sheet Size: {sheet_w}x{sheet_h}")
    print(f"Frame Size: {frame_w}x{frame_h}")
    
    for i in range(cols):
        left = i * frame_w
        right = left + frame_w
        # Crop frame
        frame = sheet.crop((left, 0, right, frame_h))
        
        # trim whitespace?
        # bbox = frame.getbbox()
        # if bbox:
        #     frame = frame.crop(bbox)
        # Actually better to keep uniform size for stability, 
        # but maybe create a uniform bounding box based on all frames?
        # For now, let's just resize neatly to reduced size to save bytes/performance
        # Target height: 128px (approx preloader size)
        aspect = frame_w / frame_h
        target_h = 150
        target_w = int(target_h * aspect)
        
        frame_resized = frame.resize((target_w, target_h), Image.Resampling.LANCZOS)
        frames.append(frame_resized)

    # Save as GIF
    # duration = ms per frame. 
    # User wants "Wild Gallop". Fast.
    # 8 frames. 1 cycle = ~0.5s ? -> 60ms per frame = 480ms cycle.
    description = "Jaguar Running"
    
    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        optimize=True,
        duration=65, 
        loop=0,
        transparency=0, 
        disposal=2 
    )
    print(f"Saved GIF to {output_path}")

if __name__ == "__main__":
    # Hardcoded paths based on context to ensure it runs easily
    input_file = r"c:\Users\moise\Downloads\APP_TURISMO\apps\client\public\images\jaguar-sprite-processed.png"
    output_file = r"c:\Users\moise\Downloads\APP_TURISMO\apps\client\public\images\jaguar-run.gif"
    
    create_gif(input_file, output_file)
