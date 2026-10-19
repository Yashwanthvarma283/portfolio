import os
from PIL import Image
from rembg import remove, new_session

input_path = 'public/yashwanth-portrait.jpg'
output_path = 'public/yashwanth-cutout.png'

print(f"Loading {input_path}...")
input_image = Image.open(input_path)
orig_w, orig_h = input_image.size
print(f"Original size: {orig_w}x{orig_h}")

# Downscale slightly for neural network inference speed if larger than 2000px,
# or run directly. Let's do max 1800px on longest side for optimal balance of speed & razor sharpness
max_dim = 1800
if max(orig_w, orig_h) > max_dim:
    scale = max_dim / max(orig_w, orig_h)
    new_w = int(orig_w * scale)
    new_h = int(orig_h * scale)
    print(f"Resizing to {new_w}x{new_h} for high-fidelity segmentation...")
    resized_image = input_image.resize((new_w, new_h), Image.Resampling.LANCZOS)
else:
    resized_image = input_image

print("Running rembg background removal (u2net)...")
session = new_session('u2net')
output_image = remove(resized_image, session=session)

# Crop any extraneous transparent margins if any, but maintain aspect ratio
print(f"Saving transparent cutout to {output_path}...")
output_image.save(output_path, format="PNG", optimize=True)
print("Done! Cutout saved successfully.")
