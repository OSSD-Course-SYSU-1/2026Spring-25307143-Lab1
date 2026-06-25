"""
HarmonyOS 星际战机 APP 图标生成脚本
生成内容：
1. background.png - 深空蓝紫星空背景
2. foreground.png - 白色战斗机剪影
3. startIcon.png - 简化版启动页图标
"""

import math
import random
from PIL import Image, ImageDraw

SIZE = 1024
CENTER = SIZE // 2

# ─── 颜色定义 ───
BG_TOP = (11, 14, 45)       # #0B0E2D
BG_MID = (26, 16, 64)       # #1A1040
BG_BOT = (45, 27, 105)      # #2D1B69
STAR_COLOR = (255, 255, 255)
STAR_BLUE = (180, 200, 255)
FOREGROUND_WHITE = (255, 255, 255)
FOREGROUND_LIGHT = (220, 230, 255)
FLAME_CORE = (255, 255, 255)
FLAME_MID = (180, 200, 255)
FLAME_OUTER = (100, 150, 255)


def generate_background():
    """生成深空蓝紫星空背景"""
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 径向渐变
    for y in range(SIZE):
        for x in range(SIZE):
            dx = x - CENTER
            dy = y - CENTER
            dist = math.sqrt(dx * dx + dy * dy) / (SIZE * 0.6)
            dist = min(dist, 1.0)

            # 垂直方向渐变因子 (从上到下)
            v_factor = y / SIZE

            # 混合颜色 - 从BG_TOP到BG_MID再到BG_BOT
            if v_factor < 0.5:
                t = v_factor * 2
                r = int(BG_TOP[0] * (1 - t) + BG_MID[0] * t)
                g = int(BG_TOP[1] * (1 - t) + BG_MID[1] * t)
                b = int(BG_TOP[2] * (1 - t) + BG_MID[2] * t)
            else:
                t = (v_factor - 0.5) * 2
                r = int(BG_MID[0] * (1 - t) + BG_BOT[0] * t)
                g = int(BG_MID[1] * (1 - t) + BG_BOT[1] * t)
                b = int(BG_MID[2] * (1 - t) + BG_BOT[2] * t)

            # 边缘暗化
            edge_factor = 1 - dist * 0.2
            r = int(r * edge_factor)
            g = int(g * edge_factor)
            b = int(b * edge_factor)

            draw.point((x, y), fill=(r, g, b, 255))

    # 绘制星云光晕
    nebula_positions = [
        (CENTER - 100, CENTER - 80, 300),
        (CENTER + 150, CENTER + 100, 200),
        (CENTER - 50, CENTER + 180, 150),
    ]
    for nx, ny, radius in nebula_positions:
        for i in range(200):
            angle = random.uniform(0, 2 * math.pi)
            r_offset = random.uniform(0, radius)
            x = int(nx + r_offset * math.cos(angle))
            y = int(ny + r_offset * math.sin(angle))
            if 0 <= x < SIZE and 0 <= y < SIZE:
                alpha = random.randint(10, 40)
                draw.point((x, y), fill=(120, 80, 200, alpha))

    # 绘制星星
    random.seed(42)
    for _ in range(500):
        x = random.randint(0, SIZE - 1)
        y = random.randint(0, SIZE - 1)
        size = random.choice([1, 1, 1, 2, 2, 3])
        brightness = random.randint(150, 255)
        is_blue = random.random() < 0.3
        if is_blue:
            color = (180, 200, brightness, brightness)
        else:
            color = (brightness, brightness, brightness, brightness)

        if size == 1:
            draw.point((x, y), fill=color)
        elif size == 2:
            draw.ellipse([x - 1, y - 1, x + 1, y + 1], fill=color)
        else:
            # 十字星芒
            draw.ellipse([x - 2, y - 2, x + 2, y + 2], fill=color)
            draw.line([x - 4, y, x + 4, y], fill=(255, 255, 255, 150), width=1)
            draw.line([x, y - 4, x, y + 4], fill=(255, 255, 255, 150), width=1)

    return img


def draw_fighter(draw, cx, cy, scale=1.0, color=FOREGROUND_WHITE, detail=True):
    """在(cx, cy)位置绘制战斗机剪影"""
    s = scale * 1.0

    # 战斗机机身多边形 (侧视图，朝右)
    # 机头 (右侧)
    nose = (int(cx + 140 * s), int(cy))
    # 机身顶部
    top_cockpit = (int(cx + 80 * s), int(cy - 30 * s))
    top_mid = (int(cx - 20 * s), int(cy - 35 * s))
    top_tail = (int(cx - 120 * s), int(cy - 30 * s))
    # 尾翼顶部
    tail_top = (int(cx - 140 * s), int(cy - 80 * s))
    # 尾翼后部
    tail_rear = (int(cx - 160 * s), int(cy - 75 * s))
    tail_bottom = (int(cx - 130 * s), int(cy - 35 * s))
    # 机身底部 - 后半部
    bottom_rear = (int(cx - 120 * s), int(cy + 25 * s))
    # 后翼底部
    wing_rear_bottom = (int(cx - 80 * s), int(cy + 65 * s))
    wing_rear_tip = (int(cx - 100 * s), int(cy + 55 * s))
    wing_rear_connect = (int(cx - 40 * s), int(cy + 30 * s))
    # 机身底部 - 前半部
    bottom_front = (int(cx + 60 * s), int(cy + 15 * s))
    # 前翼
    wing_front_tip = (int(cx + 50 * s), int(cy + 50 * s))
    wing_front_connect = (int(cx + 80 * s), int(cy + 15 * s))
    # 回到机头
    bottom_nose = (int(cx + 120 * s), int(cy + 5 * s))

    # 主机身轮廓
    body_points = [
        nose, top_cockpit, top_mid, top_tail, tail_top,
        tail_rear, tail_bottom, bottom_rear, wing_rear_bottom,
        wing_rear_tip, wing_rear_connect, bottom_front,
        wing_front_tip, wing_front_connect, bottom_nose
    ]
    draw.polygon(body_points, fill=color)

    if detail:
        # 座舱盖 (浅色)
        cockpit = [
            (int(cx + 70 * s), int(cy - 4 * s)),
            (int(cx + 75 * s), int(cy - 28 * s)),
            (int(cx + 50 * s), int(cy - 30 * s)),
            (int(cx + 45 * s), int(cy - 4 * s)),
        ]
        draw.polygon(cockpit, fill=(200, 220, 255, 200))

        # 尾喷火焰
        flame_points = [
            (int(cx - 155 * s), int(cy - 10 * s)),
            (int(cx - 220 * s), int(cy - 5 * s)),
            (int(cx - 240 * s), int(cy)),
            (int(cx - 220 * s), int(cy + 5 * s)),
            (int(cx - 155 * s), int(cy + 10 * s)),
        ]
        draw.polygon(flame_points, fill=(150, 200, 255, 180))

        # 更亮的火焰核心
        flame_core_pts = [
            (int(cx - 155 * s), int(cy - 5 * s)),
            (int(cx - 200 * s), int(cy - 2 * s)),
            (int(cx - 215 * s), int(cy)),
            (int(cx - 200 * s), int(cy + 2 * s)),
            (int(cx - 155 * s), int(cy + 5 * s)),
        ]
        draw.polygon(flame_core_pts, fill=(220, 235, 255, 220))

        # 机身细节 - 机翼分隔线
        draw.line(
            [(int(cx - 40 * s), int(cy + 30 * s)), (int(cx - 40 * s), int(cy - 8 * s))],
            fill=(200, 210, 230, 100), width=2
        )


def generate_foreground():
    """生成白色战斗机剪影前景"""
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 居中绘制战斗机，稍微偏左一点让火焰有空间
    draw_fighter(draw, CENTER - 30, CENTER, scale=1.1, color=FOREGROUND_WHITE, detail=True)

    return img


def generate_start_icon():
    """生成简化版启动页图标"""
    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 简化版战斗机 - 更大的主体，去掉细节
    draw_fighter(draw, CENTER - 20, CENTER, scale=1.3, color=FOREGROUND_WHITE, detail=False)

    # 添加一点柔和的发光效果
    glow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse(
        [CENTER - 200, CENTER - 200, CENTER + 200, CENTER + 200],
        fill=(100, 150, 255, 30)
    )
    img = Image.alpha_composite(img, glow)

    return img


def save_icon(img, filepath):
    """保存图标并确保是 RGBA PNG"""
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    img.save(filepath, "PNG")
    print(f"  ✅ 已生成: {filepath}")


def main():
    print("🚀 开始生成星际战机 APP 图标...\n")

    # 基础路径
    base = "d:\\ClassWork\\Space-fighter"

    # 路径列表
    bg_paths = [
        f"{base}\\AppScope\\resources\\base\\media\\background.png",
        f"{base}\\product\\phone\\src\\main\\resources\\base\\media\\background.png",
        f"{base}\\product\\tablet\\src\\main\\resources\\base\\media\\background.png",
    ]
    fg_paths = [
        f"{base}\\AppScope\\resources\\base\\media\\foreground.png",
        f"{base}\\product\\phone\\src\\main\\resources\\base\\media\\foreground.png",
        f"{base}\\product\\tablet\\src\\main\\resources\\base\\media\\foreground.png",
    ]
    si_paths = [
        f"{base}\\product\\phone\\src\\main\\resources\\base\\media\\startIcon.png",
        f"{base}\\product\\tablet\\src\\main\\resources\\base\\media\\startIcon.png",
    ]

    # 1. 生成背景
    print("📌 步骤 1: 生成 background.png (深空蓝紫星空背景)...")
    bg_img = generate_background()

    # 2. 生成前景
    print("📌 步骤 2: 生成 foreground.png (白色战斗机剪影)...")
    fg_img = generate_foreground()

    # 3. 生成启动页图标
    print("📌 步骤 3: 生成 startIcon.png (简化版战斗机)...")
    si_img = generate_start_icon()

    # 4. 保存到所有路径
    print("\n📌 步骤 4: 同步图标到各模块目录...")
    for path in bg_paths:
        save_icon(bg_img, path)
    for path in fg_paths:
        save_icon(fg_img, path)
    for path in si_paths:
        save_icon(si_img, path)

    print("\n✅ 所有图标已成功生成!")


if __name__ == "__main__":
    main()
