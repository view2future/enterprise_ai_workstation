
import asyncio
import json
import os
import sys
from playwright.async_api import async_playwright

async def run_demo(record_video=False, width=1440, height=900):
    # 读取剧本
    with open('demo/workflow.json', 'r', encoding='utf-8') as f:
        workflow = json.load(f)
    
    settings = workflow.get('settings', {})
    steps = workflow.get('steps', [])
    overlay_js = open('demo/overlay.js', 'r', encoding='utf-8').read()

    async with async_playwright() as p:
        browser_args = {
            "headless": False,
            "args": [f"--window-size={width},{height}", "--start-maximized"]
        }
        
        if record_video:
            browser_args["record_video_dir"] = "demo/recordings/"
            print(f"🔴 屏幕录制已开启，视频将保存至 demo/recordings/")

        browser = await p.chromium.launch(**browser_args)
        
        # 适配 MacBook Air 的 Retina 特性：设置 device_scale_factor=2
        context = await browser.new_context(
            viewport={'width': width, 'height': height},
            device_scale_factor=2
        )
        page = await context.new_page()

        # 核心逻辑：确保 UI 始终存在
        async def ensure_ui_persistence():
            exists = await page.evaluate("!!document.getElementById('demo-subtitle-hud')")
            if not exists:
                await page.evaluate(overlay_js)

        # 初始注入
        await page.add_init_script(overlay_js)

        for i, step in enumerate(steps):
            action = step.get('action')
            subtitle = step.get('subtitle', '')
            
            if action == 'goto':
                url = step.get('url')
                print(f"执行步骤 {i+1}: 跳转到 {url}")
                await page.goto(f"{settings.get('baseUrl')}{url}", wait_until="load")
            
            # 每一操作步前强制检查并恢复 UI
            await ensure_ui_persistence()

            # 检查是否暂停
            while await page.evaluate("window.demoPaused"):
                await asyncio.sleep(0.5)

            # 更新字幕
            if subtitle:
                print(f"解说: {subtitle}")
                try:
                    await page.evaluate(f"window.setDemoSubtitle('{subtitle}')")
                except:
                    await page.evaluate(overlay_js)
                    await page.evaluate(f"window.setDemoSubtitle('{subtitle}')")

            # 执行操作
            try:
                if action == 'click':
                    await page.wait_for_selector(step.get('selector'), state="visible", timeout=5000)
                    await page.click(step.get('selector'))
                elif action == 'fill':
                    await page.fill(step.get('selector'), step.get('value'))
                elif action == 'hover':
                    await page.hover(step.get('selector'))
                elif action == 'scroll':
                    direction = step.get('direction', 'down')
                    if direction == 'down':
                        await page.mouse.wheel(0, 1500)
                    else:
                        await page.mouse.wheel(0, -1500)
                elif action == 'wait':
                    await asyncio.sleep(step.get('duration', 1000) / 1000)
                
                wait_after = step.get('waitAfter', settings.get('defaultWaitAfter', 2500))
                await asyncio.sleep(wait_after / 1000)

            except Exception as e:
                print(f"⚠️ 操作提示: {e}")

        print("✅ 演示流程结束。")
        await asyncio.sleep(3)
        await browser.close()

if __name__ == "__main__":
    is_recording = "--record" in sys.argv
    # 默认分辨率适配 MacBook Air (1440x900)
    asyncio.run(run_demo(is_recording, 1440, 900))
