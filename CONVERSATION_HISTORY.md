# Conversation History

## 2025-12-26: PPT 文件解析方案

**问题**：如果项目中有 PPT 文件，如何通过技术手段解读其中的文字和图片？

**解决方案**：
1. **主流方案：Python + `python-pptx` 库**
   - **文字提取**：通过遍历 `Presentation` 中的 `slides` 和 `shapes`，识别 `has_text_frame` 的形状并提取文本。
   - **图片提取**：识别 `MSO_SHAPE_TYPE.PICTURE` 类型的形状，直接读取其二进制流 (`blob`) 并保存。
2. **备选方案：解压法**
   - 将 `.pptx` 重命名为 `.zip` 并解压。
   - 图片存放在 `ppt/media/` 目录下。
   - 文字存放在 `ppt/slides/` 的 XML 文件中。
3. **特殊场景：OCR**
   - 若 PPT 文字为图片形式，需对提取出的图片进行 OCR（如 Tesseract 或 视觉大模型 API）识别。
