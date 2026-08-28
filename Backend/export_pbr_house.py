import bpy
import math

# Reset Blender
bpy.ops.wm.read_factory_settings(use_empty=True)

# Helper function for PBR materials
def make_pbr_mat(name, base_color, roughness=0.5, metalness=0.0, specular=0.5, emissive=(0,0,0,1), emissive_strength=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = base_color
        bsdf.inputs['Roughness'].default_value = roughness
        if 'Metallic' in bsdf.inputs:
            bsdf.inputs['Metallic'].default_value = metalness
        if 'Specular IOR Level' in bsdf.inputs:
            bsdf.inputs['Specular IOR Level'].default_value = specular
        elif 'Specular' in bsdf.inputs:
            bsdf.inputs['Specular'].default_value = specular
        if 'Emission Color' in bsdf.inputs:
            bsdf.inputs['Emission Color'].default_value = emissive
        elif 'Emission' in bsdf.inputs:
            bsdf.inputs['Emission'].default_value = emissive
        if 'Emission Strength' in bsdf.inputs:
            bsdf.inputs['Emission Strength'].default_value = emissive_strength
    return mat

# --- Photorealistic PBR Materials Matching User Reference Image ---
mat_stucco = make_pbr_mat("Stucco_LightGray", (0.84, 0.86, 0.88, 1.0), roughness=0.75, metalness=0.02) # Light gray rendered stucco
mat_trim_white = make_pbr_mat("Trim_CrispWhite", (0.95, 0.96, 0.97, 1.0), roughness=0.4, metalness=0.05)
mat_roof_metal = make_pbr_mat("Roof_CharcoalStandingSeam", (0.16, 0.18, 0.22, 1.0), roughness=0.32, metalness=0.75) # Charcoal corrugated metal
mat_roof_trim = make_pbr_mat("Roof_GutterTrim", (0.12, 0.13, 0.16, 1.0), roughness=0.25, metalness=0.85)

# High-Efficiency Photovoltaic Solar Panels
mat_solar_glass = make_pbr_mat("Solar_Glass_Monocrystalline", (0.015, 0.05, 0.16, 1.0), roughness=0.08, metalness=0.98, specular=1.0)
mat_solar_frame = make_pbr_mat("Solar_Frame_SilverAlum", (0.75, 0.77, 0.80, 1.0), roughness=0.2, metalness=0.95) # Silver aluminum frames

# Windows & Emissive Night Lighting
mat_window_glass = make_pbr_mat("Window_Glass_Emissive", (0.25, 0.45, 0.7, 1.0), roughness=0.04, metalness=0.15, emissive=(1.0, 0.72, 0.3, 1.0), emissive_strength=0.0)
mat_sconce_emissive = make_pbr_mat("Sconce_Light_Emissive", (1.0, 0.85, 0.5, 1.0), roughness=0.1, emissive=(1.0, 0.8, 0.35, 1.0), emissive_strength=0.0)
mat_black_fixture = make_pbr_mat("Sconce_BlackFixture", (0.05, 0.05, 0.06, 1.0), roughness=0.3, metalness=0.9)

# Garage & Doors
mat_garage_white = make_pbr_mat("Garage_WhitePanels", (0.94, 0.95, 0.96, 1.0), roughness=0.5, metalness=0.1)
mat_lawn = make_pbr_mat("Lawn_GreenGrass", (0.12, 0.28, 0.10, 1.0), roughness=0.92)
mat_hedge = make_pbr_mat("Shrub_LushGreen", (0.08, 0.22, 0.07, 1.0), roughness=0.88)
mat_driveway = make_pbr_mat("Driveway_AggregateConcrete", (0.55, 0.56, 0.58, 1.0), roughness=0.85)

# Helper function
def add_arch_box(name, loc, scale, mat, rot=(0,0,0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(mat)
    return obj

# 1. Main Villa Structure (Single-Story Suburban Layout Matching Reference)

# A. Center Section (Living Area with large windows)
add_arch_box("Wall_Center_Living", (-0.2, 1.1, 0.0), (5.2, 2.2, 3.8), mat_stucco)

# B. Left Section (Two-Car White Panel Garage)
add_arch_box("Wall_Garage_Wing", (-4.2, 1.0, 0.3), (3.6, 2.0, 4.4), mat_stucco)

# Garage White Panel Door with 4x4 Grid Panels
add_arch_box("Garage_Door_WhiteFrame", (-4.2, 0.9, 2.52), (3.0, 1.6, 0.06), mat_trim_white)
for r in range(4):
    for c in range(4):
        gx = -5.35 + c * 0.76
        gy = 0.28 + r * 0.38
        add_arch_box(f"Garage_Panel_{r}_{c}", (gx, gy, 2.55), (0.70, 0.32, 0.03), mat_garage_white)

# C. Right Section (Protruding Gabled Entrance Pavilion)
add_arch_box("Wall_Entrance_Pavilion", (3.2, 1.25, 0.8), (2.8, 2.5, 4.2), mat_stucco)

# Front Gabled Entrance Facade Triangle / Peak
add_arch_box("Entrance_Gable_Trim", (3.2, 2.65, 2.92), (2.85, 0.12, 0.15), mat_trim_white)

# Double White French Glass Doors at Entrance
add_arch_box("Door_Outer_Frame", (3.2, 0.95, 2.92), (1.8, 1.7, 0.08), mat_trim_white)
# Left French Door & Glass
add_arch_box("Door_Left_Frame", (2.78, 0.95, 2.95), (0.75, 1.6, 0.04), mat_trim_white)
add_arch_box("Window_Door_Left", (2.78, 0.95, 2.96), (0.55, 1.35, 0.03), mat_window_glass)
# Right French Door & Glass
add_arch_box("Door_Right_Frame", (3.62, 0.95, 2.95), (0.75, 1.6, 0.04), mat_trim_white)
add_arch_box("Window_Door_Right", (3.62, 0.95, 2.96), (0.55, 1.35, 0.03), mat_window_glass)

# Black Exterior Sconce Lamps flanking the entrance
for idx, sx in enumerate([2.1, 4.3]):
    add_arch_box(f"Sconce_Fixture_{idx}", (sx, 1.1, 2.95), (0.12, 0.28, 0.14), mat_black_fixture)
    add_arch_box(f"Sconce_Bulb_{idx}", (sx, 1.1, 2.98), (0.08, 0.18, 0.08), mat_sconce_emissive)

# D. Central Bank of 6 Floor-to-Ceiling Picture Windows
for i in range(6):
    wx = -2.2 + i * 0.78
    # White Frame
    add_arch_box(f"Win_Main_Frame_{i}", (wx, 1.05, 1.92), (0.68, 1.45, 0.08), mat_trim_white)
    # Glass Pane
    add_arch_box(f"Window_Glass_Main_{i}", (wx, 1.05, 1.94), (0.56, 1.32, 0.04), mat_window_glass)

# 2. Charcoal Standing-Seam Corrugated Metal Pitched Roof

roof_pitch = math.radians(22)

# Main Wide Pitched Roof Plane (Facing +Z front directly)
add_arch_box("Roof_Main_Pitched", (-1.2, 2.58, 0.45), (10.6, 0.08, 4.4), mat_roof_metal, rot=(roof_pitch, 0, 0))

# Front Eave Gutter & Ridge Trim
add_arch_box("Roof_Front_Gutter", (-1.2, 1.95, 2.45), (10.7, 0.12, 0.14), mat_roof_trim)
add_arch_box("Roof_Ridge_Trim", (-1.2, 3.20, -1.55), (10.7, 0.14, 0.18), mat_roof_trim)

# Entrance Pavilion Gabled Roof (Protruding front right)
add_arch_box("Roof_Entrance_Gable_Left", (2.5, 2.75, 1.8), (1.8, 0.08, 2.8), mat_roof_metal, rot=(math.radians(24), math.radians(24), 0))
add_arch_box("Roof_Entrance_Gable_Right", (3.9, 2.75, 1.8), (1.8, 0.08, 2.8), mat_roof_metal, rot=(math.radians(24), math.radians(-24), 0))

# Upper Clerestory Roof Extension (Back Raised Roof)
add_arch_box("Roof_Clerestory_Upper", (1.8, 3.45, -0.8), (4.8, 0.08, 2.2), mat_roof_metal, rot=(roof_pitch, 0, 0))

# 3. Dense Grid of Photovoltaic Monocrystalline Solar Panels (Exact match to image!)

# Main Roof Array: 2 Rows of 7 Large Panels = 14 Panels
cols_main = 7
rows_main = 2
mod_w = 1.05
mod_h = 1.35
gap_x = 0.06
gap_y = 0.06

for r in range(rows_main):
    for c in range(cols_main):
        x_pos = -4.6 + c * (mod_w + gap_x)
        offset_down = (r - 0.5) * (mod_h + gap_y)

        y_pos = 2.58 - offset_down * math.sin(roof_pitch) + 0.06
        z_pos = 0.45 + offset_down * math.cos(roof_pitch)

        # Silver Aluminum Frame
        add_arch_box(f"Solar_Frame_{r}_{c}", (x_pos, y_pos, z_pos), (mod_w, 0.03, mod_h), mat_solar_frame, rot=(roof_pitch, 0, 0))
        # Dark Blue Anti-Reflective Silicon Cell
        add_arch_box(f"Solar_Glass_{r}_{c}", (x_pos, y_pos + 0.015, z_pos), (mod_w * 0.94, 0.02, mod_h * 0.94), mat_solar_glass, rot=(roof_pitch, 0, 0))

# Upper Clerestory Roof Array: 2 Rows of 4 Panels = 8 Panels
for r in range(2):
    for c in range(4):
        x_pos = 0.2 + c * (mod_w * 0.92 + gap_x)
        offset_down = (r - 0.5) * (mod_h * 0.85 + gap_y)

        y_pos = 3.45 - offset_down * math.sin(roof_pitch) + 0.06
        z_pos = -0.8 + offset_down * math.cos(roof_pitch)

        add_arch_box(f"Solar_Upper_Frame_{r}_{c}", (x_pos, y_pos, z_pos), (mod_w * 0.92, 0.03, mod_h * 0.85), mat_solar_frame, rot=(roof_pitch, 0, 0))
        add_arch_box(f"Solar_Upper_Glass_{r}_{c}", (x_pos, y_pos + 0.015, z_pos), (mod_w * 0.88, 0.02, mod_h * 0.80), mat_solar_glass, rot=(roof_pitch, 0, 0))

# 4. Landscaping, Shrubs & Driveway (Positioned below the house baseline)

# Concrete Driveway (Left in front of garage)
add_arch_box("Driveway_Concrete", (-4.2, -0.04, 4.8), (3.8, 0.06, 4.5), mat_driveway)

# Manicured Lawn
add_arch_box("Lawn_Front_Grass", (0.5, -0.06, 5.2), (12.0, 0.06, 5.0), mat_lawn)

# Lush Green Shrubs & Hedges around the front garden bed
shrub_coords = [
    (-2.2, 0.25, 2.7),
    (-1.4, 0.35, 2.8),
    (-0.6, 0.40, 2.9),
    (0.3, 0.32, 2.8),
    (1.4, 0.45, 3.2), # Big round bush in front of entrance
    (4.6, 0.35, 3.2),
    (5.2, 0.45, 2.2)
]
for idx, (sx, sy, sz) in enumerate(shrub_coords):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.42, location=(sx, sy, sz))
    shrub = bpy.context.active_object
    shrub.name = f"Shrub_{idx}"
    shrub.scale = (1.1, 0.85, 1.0)
    shrub.data.materials.append(mat_hedge)

# Export to GLB
script_dir = os.path.dirname(os.path.abspath(__file__)) if '__file__' in locals() else os.getcwd()
output_dir = os.path.abspath(os.path.join(script_dir, "..", "Frontend", "public", "models"))
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "house.glb")

bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    use_selection=False,
    export_materials='EXPORT',
    export_apply=True
)

print("SUCCESS: Photorealistic suburban homestead exported to:", output_path)

