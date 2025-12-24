
import os
from PIL import Image, ImageDraw

def create_nexus_icon(size=1024):
    # 背景颜色和阴影
    bg_color = (255, 255, 255, 255)  # 白色
    border_color = (17, 24, 39, 255) # gray-900
    nexus_blue = (37, 99, 235, 255) # blue-600
    shadow_color = (0, 0, 0, 255)
    red_status = (239, 68, 68, 255) # red-500
    
    # 创建画布 (带透明度)
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 计算边距和主框大小 (预留阴影空间)
    padding = size // 10
    box_size = size - padding * 2
    shadow_offset = size // 40
    
    # 1. 绘制阴影 (Neubrutalism 风格)
    draw.rectangle(
        [padding + shadow_offset, padding + shadow_offset, padding + box_size + shadow_offset, padding + box_size + shadow_offset],
        fill=shadow_color
    )
    
    # 2. 绘制主框
    draw.rectangle(
        [padding, padding, padding + box_size, padding + box_size],
        fill=bg_color,
        outline=border_color,
        width=size // 64
    )
    
    # 3. 绘制 "N" 字形
    # 内部区域
    inner_padding = box_size // 4
    n_x = padding + inner_padding
    n_y = padding + inner_padding
    n_size = box_size - inner_padding * 2
    
    # 左柱
    left_w = n_size // 4
    draw.rectangle(
        [n_x, n_y, n_x + left_w, n_y + n_size],
        fill=nexus_blue,
        outline=border_color,
        width=size // 128
    )
    
    # 右柱
    draw.rectangle(
        [n_x + n_size - left_w, n_y, n_x + n_size, n_y + n_size],
        fill=nexus_blue,
        outline=border_color,
        width=size // 128
    )
    
    # 对角线 (Polygon)
    # 对应 React 代码: polygon(15% 0, 45% 0, 85% 100%, 55% 100%)
    # 我们映射到 n_size 内部坐标
    poly = [
        (n_x + n_size * 0.15, n_y),
        (n_x + n_size * 0.45, n_y),
        (n_x + n_size * 0.85, n_y + n_size),
        (n_x + n_size * 0.55, n_y + n_size)
    ]
    draw.polygon(poly, fill=nexus_blue, outline=border_color)
    
    # 4. 右上角状态红点
    status_size = box_size // 6
    draw.rectangle(
        [padding + box_size - status_size, padding, padding + box_size, padding + status_size],
        fill=red_status,
        outline=border_color,
        width=size // 128
    )
    # 小白点
    dot_size = status_size // 3
    dot_padding = (status_size - dot_size) // 2
    draw.ellipse(
        [padding + box_size - status_size + dot_padding, padding + dot_padding, 
         padding + box_size - dot_padding, padding + status_size - dot_padding],
        fill=(255, 255, 255, 255)
    )
    
    return img

if __name__ == "__main__":
    icon = create_nexus_icon(1024)
    if not os.path.exists('assets'):
        os.makedirs('assets')
    icon.save('assets/icon.png')
    print("✅ 已根据 NexusLogo 组件设计生成 assets/icon.png")
