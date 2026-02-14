import sys
import os

try:
    from PIL import Image, ImageOps
except ImportError:
    print("Pillow not installed")
    sys.exit(1)

def process_sprite(input_path, output_path):
    print(f"Processing {input_path}...")
    img = Image.open(input_path).convert("RGBA")
    
    # 1. Background Removal (Simple White/Light Gray Keying)
    datas = img.getdata()
    newData = []
    for item in datas:
        # If pixel is white-ish (tolerance 200), make it transparent
        if item[0] > 200 and item[1] > 200 and item[2] > 200:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    img.putdata(newData)
    
    # 2. Slice Grid (2 Rows, 4 Columns)
    # The image likely has borders. We'll try to guess cell size.
    width, height = img.size
    rows = 2
    cols = 4
    cell_w = width // cols
    cell_h = height // rows
    
    frames = []
    
    for r in range(rows):
        for c in range(cols):
            left = c * cell_w
            top = r * cell_h
            right = left + cell_w
            bottom = top + cell_h
            
            # Crop the cell
            cell = img.crop((left, top, right, bottom))
            
            # Optional: Trim empty transparent space from cell?
            # Ideally we keep them uniform for animation stability.
            # But we might want to crop inner borders if DALL-E added them.
            # Let's crop 5% from edges to remove potential grid lines
            inset_w = int(cell_w * 0.05)
            inset_h = int(cell_h * 0.05)
            cell_clean = cell.crop((inset_w, inset_h, cell_w - inset_w, cell_h - inset_h))
            
            frames.append(cell_clean)
            
    # 3. Stitch Horizontal
    total_w = sum(f.width for f in frames)
    max_h = max(f.height for f in frames)
    
    sprite_strip = Image.new("RGBA", (total_w, max_h))
    
    current_x = 0
    for f in frames:
        sprite_strip.paste(f, (current_x, 0))
        current_x += f.width
        
    # Save
    if not os.path.exists(os.path.dirname(output_path)):
        os.makedirs(os.path.dirname(output_path))
        
    sprite_strip.save(output_path)
    print(f"Saved processed sprite to {output_path}")
    print(f"Frame Count: {len(frames)}, Total Width: {total_w}, Frame Width: {frames[0].width}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python script.py <input> <output>")
    else:
        process_sprite(sys.argv[1], sys.argv[2])
