
import asyncio
import json
import os
import sys
from playwright.async_api import async_playwright

async def run_demo(record_video=False):
    # 读取剧本
    with open('demo/workflow.json', 'r', encoding='utf-8') as f:
        workflow = json.load(f)
    
    settings = workflow.get('settings', {})
    steps = workflow.get('steps', [])

    async with async_playwright() as p:
        browser_args = {
            "headless": False,
            "args": ["--start-maximized"]
        }
        
        if record_video:
            browser_args["record_video_dir"] = "demo/recordings/"
            print("🔴 屏幕录制已开启，视频将保存至 demo/recordings/")

        browser = await p.chromium.launch(**browser_args)
        context = await browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = await context.new_page()

        # 注入持久化覆盖层
        overlay_js = open('demo/overlay.js', 'r', encoding='utf-8').read()
        await page.add_init_script(overlay_js)

        for i, step in enumerate(steps):
            # 检查是否暂停
            while await page.evaluate("window.demoPaused"):
                await asyncio.sleep(0.5)

            action = step.get('action')
            subtitle = step.get('subtitle', '')
            print(f"执行步骤 {i+1}: {action} - {subtitle}")

            # 更新字幕
            if subtitle:
                await page.evaluate(f"window.setDemoSubtitle('{subtitle}')")

            # 执行操作
            try:
                if action == 'goto':
                    url = step.get('url')
                    await page.goto(f"{settings.get('baseUrl')}{url}")
                elif action == 'click':
                    await page.click(step.get('selector'))
                elif action == 'fill':
                    await page.fill(step.get('selector'), step.get('value'))
                elif action == 'hover':
                    await page.hover(step.get('selector'))
                elif action == 'scroll':
                    direction = step.get('direction', 'down')
                    if direction == 'down':
                        await page.mouse.wheel(0, 2000)
                    else:
                        await page.mouse.wheel(0, -2000)
                elif action == 'wait':
                    await asyncio.sleep(step.get('duration', 1000) / 1000)
                
                # 步骤后的等待
                wait_after = step.get('waitAfter', settings.get('defaultWaitAfter', 2000))
                await asyncio.sleep(wait_after / 1000)

            except Exception as e:
                print(f"❌ 步骤 {i+1} 执行失败: {e}")

        print("✅ 演示流程结束。")
        await asyncio.sleep(2)
        await browser.close()

if __name__ == "__main__":
    is_recording = "--record" in sys.argv
    asyncio.run(run_demo(is_recording))
