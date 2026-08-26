# AI Image To Vector Redesign

**语言 / Language:** 中文 | [English](#english)

把 GPT Image 2 生成的“看起来很美、但文字糊掉且不可编辑”的设计图，重建成文字清晰、结构可编辑、能交付的 SVG / PDF / 4K PNG。

## 这个 Skill 解决什么问题

GPT Image 2 很适合快速生成海报、长图、活动图、产品图和社交媒体视觉。但它生成的通常是一张扁平位图：第一眼好看，真正交付时会暴露问题。

常见问题包括：

- 文字被烘进像素里，错字、日期、价格、姓名、法律文案都很难准确修改。
- 小字在聊天窗口里看着还行，发到公众号、小红书、朋友圈或客户群后容易被压缩到模糊。
- 卡片、边框、图标、图表、标签、分割线都不是可编辑对象。
- 只想改一个字，重新生成可能把整张图的风格和构图都改掉。
- 最终文件通常不适合打印、客户审核、品牌归档或多平台发布。

这个 skill 的核心定位不是“把图放大”，而是“把设计重新做成可交付资产”。

## 解决方案

这个工作流会把原始 AI 图当作视觉参考，然后重新构建设计：

- 重要文字重新排成真实文本，或在需要时转成清晰轮廓。
- 版式、卡片、线条、按钮、标签、简单图表等重画为矢量结构。
- 照片感背景、产品渲染、复杂插画等区域保留为高分辨率栅格素材。
- 最后导出适合编辑、发布、聊天软件转发、打印审核的文件包。

一句话：**文字变清楚，版式变可编辑，复杂图像保持好看。**

## 输出文件

一次完整重建通常会产出：

- `source.html` 或 `source.svg`：可维护源文件。
- `editable.svg`：可编辑和归档版本。
- `publish-3x.png`：适合聊天、社交媒体、移动端发布。
- `publish-4k.png`：需要 4K 或高分辨率平台交付时使用。
- `print.pdf`：适合打印、审核和客户确认。
- `qa-report.md`：记录哪些内容被重建、哪些区域仍是栅格、检查过什么。

## 安装

克隆仓库并安装依赖：

```bash
git clone https://github.com/hxr223/ai-image-to-vector-redesign.git
cd ai-image-to-vector-redesign
npm install
```

如果你已经安装了 Google Chrome，并且不想下载 Playwright 自带浏览器，可以用：

```bash
npm install --ignore-scripts
```

把它安装成 Codex / Claude 兼容 skill：

```bash
mkdir -p ~/.codex/skills
ln -s "$PWD" ~/.codex/skills/ai-image-to-vector-redesign
```

## 使用方式

把这个目录安装成 skill 后，直接把 GPT Image 2 生成的图交给 agent，并说明你要重建成可交付文件包：

```text
使用 ai-image-to-vector-redesign，把这张 GPT Image 2 海报重建成可编辑 SVG、PDF 和高清 PNG。
```

如果文字准确性很重要，请提供最终文案，或先确认 agent 从原图中整理出的文字草稿，再开始重建。

## 辅助脚本

这个 skill 主要给 agent 使用，但仓库也提供了一些可复用脚本：

```bash
npm run inspect -- original.png
npm run draft-text -- original.png --copy final-copy.txt --out confirmed-text.md
npm run init-case -- event-poster
npm run export -- output/source.html --out output --preset xiaohongshu --four-k
npm run compare -- original.png output/publish-3x.png --crop 80,760,860,220
npm run qa -- output --min-long-edge 4096 --require publish-4k.png,print.pdf
```

可用模板：

- `templates/poster.html`
- `templates/long-image.html`
- `templates/social-card.html`
- `templates/qa-report.md`

## 参考文档

- [交付风险诊断](references/delivery-diagnosis.md)
- [文字确认流程](references/text-confirmation.md)
- [重建策略](references/reconstruction-strategy.md)
- [导出预设](references/export-presets.md)
- [输出文件包](references/output-package.md)
- [QA 检查清单](references/qa-checklist.md)

## 和放大 / 描摹有什么区别

图片放大只是让像素变大，不会让 AI 生成的假字、糊字、错字变得可信。

矢量描摹适合简单 logo 或图标，但用于 AI 海报时通常会产生大量噪声路径，文字也仍然难以编辑。

这个 skill 做的是语义重建：文字重新成为文字，版式重新成为结构，复杂画面则作为图像区域保留。

## 案例

更多案例格式见 [examples/README.md](examples/README.md)。每个案例会展示原始 GPT Image 2 输出、问题裁剪、重建结果、细节对比、导出文件和 QA 记录。

### 活动海报

原始 GPT Image 2 位图：

![Event poster original](examples/event-poster/original.png)

重建后的交付版本：

![Event poster rebuilt](examples/event-poster/rebuilt-preview.png)

细节对比：

![Event poster detail comparison](examples/event-poster/detail-comparison.png)

### 微信风格长图

原始 GPT Image 2 位图：

![Long image original](examples/wechat-long-image/original.png)

重建后的交付版本：

![Long image rebuilt](examples/wechat-long-image/rebuilt-preview.png)

细节对比：

![Long image detail comparison](examples/wechat-long-image/detail-comparison.png)

### 产品社交媒体图

原始 GPT Image 2 位图：

![Product card original](examples/product-social-card/original.png)

重建后的交付版本：

![Product card rebuilt](examples/product-social-card/rebuilt-preview.png)

细节对比：

![Product card detail comparison](examples/product-social-card/detail-comparison.png)

## 路线图

- GPT Image 2 交付风险诊断。
- 确认文案工作流。
- 矢量 / 栅格混合重建策略。
- 稳定输出文件包。
- 平台导出预设。
- 自动 QA 检查清单。
- Before / after 案例。
- 轻量导出和 QA 脚本。
- OCR 辅助文字草稿提取。
- 细节 review 用视觉对比图。

---

## English

**Language:** [中文](#ai-image-to-vector-redesign) | English

Turn GPT Image 2 designs with blurry, baked-in, or unreliable text into sharp, editable, publish-ready SVG / PDF / 4K PNG deliverables.

## What Problem This Skill Solves

GPT Image 2 is excellent for quickly generating posters, long-form graphics, event visuals, product cards, and social media designs. But the result is usually a flattened raster image: it looks good at first glance, then breaks down during real delivery.

Common problems include:

- Text is baked into pixels, so typos, dates, prices, names, and legal copy are hard to fix.
- Small text may look acceptable in chat, but becomes blurry after social or messaging platform compression.
- Cards, borders, icons, charts, badges, and separators are not editable design objects.
- Regenerating the image to fix one word can change the entire composition.
- The final image is often not ready for print, client review, brand archive, or platform-specific publishing.

This skill is not primarily an upscaler. It rebuilds the design into a deliverable asset.

## Solution

The source image is treated as a visual reference. The design is reconstructed as maintainable artwork:

- Important text is retyped as real editable text, or converted to clean outlines when needed.
- Layout elements are redrawn as vector shapes.
- Photos, painterly backgrounds, product renders, and complex illustrations are preserved as high-resolution raster assets.
- Practical delivery files are exported for editing, publishing, sharing, and review.

In short: **text becomes clear, layout becomes editable, and complex imagery keeps its visual quality.**

## Output Package

A complete reconstruction should produce:

- `source.html` or `source.svg` as the maintainable source.
- `editable.svg` for editing and archive.
- `publish-3x.png` for chat, social, and mobile publishing.
- `publish-4k.png` when the user asks for 4K or platform-safe high resolution.
- `print.pdf` for review and print.
- `qa-report.md` explaining what was rebuilt, what remains raster, and what was checked.

## Install

Clone the repository and install the optional export dependency:

```bash
git clone https://github.com/hxr223/ai-image-to-vector-redesign.git
cd ai-image-to-vector-redesign
npm install
```

If you already have Google Chrome installed and want to avoid Playwright browser downloads, use:

```bash
npm install --ignore-scripts
```

Install it as a Codex or Claude-compatible skill by copying or symlinking the folder into your agent's skill directory:

```bash
mkdir -p ~/.codex/skills
ln -s "$PWD" ~/.codex/skills/ai-image-to-vector-redesign
```

## Usage

Install this folder as a skill, then ask the agent to rebuild a GPT Image 2 design:

```text
Use ai-image-to-vector-redesign to turn this GPT Image 2 poster into a publish-ready SVG/PDF/high-resolution PNG package.
```

When text accuracy matters, provide the final copy or confirm the agent's extracted text before reconstruction.

## Helper Scripts

The skill is designed for agent use, but the helper scripts make common delivery steps repeatable:

```bash
npm run inspect -- original.png
npm run draft-text -- original.png --copy final-copy.txt --out confirmed-text.md
npm run init-case -- event-poster
npm run export -- output/source.html --out output --preset xiaohongshu --four-k
npm run compare -- original.png output/publish-3x.png --crop 80,760,860,220
npm run qa -- output --min-long-edge 4096 --require publish-4k.png,print.pdf
```

Available templates:

- `templates/poster.html`
- `templates/long-image.html`
- `templates/social-card.html`
- `templates/qa-report.md`

## References

- [Delivery diagnosis](references/delivery-diagnosis.md)
- [Text confirmation](references/text-confirmation.md)
- [Reconstruction strategy](references/reconstruction-strategy.md)
- [Export presets](references/export-presets.md)
- [Output package](references/output-package.md)
- [QA checklist](references/qa-checklist.md)

## How It Differs From Upscaling Or Tracing

Upscaling makes the pixels larger. It does not make fake or blurry text trustworthy.

Vector tracing converts pixels into paths. It can be useful for simple logos or icons, but it usually creates noisy paths for AI posters and still leaves text difficult to edit.

This skill rebuilds the design semantically: text becomes text, layout becomes vector structure, and complex image regions remain raster when that preserves quality.

## Examples

See [examples/README.md](examples/README.md) for the case format. Each example shows the original GPT Image 2 output, problem crops, rebuilt result, detail comparison, exported files, and QA notes.

### Event Poster

Original GPT Image 2 raster:

![Event poster original](examples/event-poster/original.png)

Rebuilt publish-ready output:

![Event poster rebuilt](examples/event-poster/rebuilt-preview.png)

Detail comparison:

![Event poster detail comparison](examples/event-poster/detail-comparison.png)

### WeChat-Style Long Image

Original GPT Image 2 raster:

![Long image original](examples/wechat-long-image/original.png)

Rebuilt publish-ready output:

![Long image rebuilt](examples/wechat-long-image/rebuilt-preview.png)

Detail comparison:

![Long image detail comparison](examples/wechat-long-image/detail-comparison.png)

### Product Social Card

Original GPT Image 2 raster:

![Product card original](examples/product-social-card/original.png)

Rebuilt publish-ready output:

![Product card rebuilt](examples/product-social-card/rebuilt-preview.png)

Detail comparison:

![Product card detail comparison](examples/product-social-card/detail-comparison.png)

## Roadmap

- GPT Image 2 delivery-risk diagnosis.
- Confirmed text workflow.
- Layered vector/raster reconstruction strategy.
- Stable output package.
- Platform export presets.
- Automatic QA checklist.
- Before/after example cases.
- Lightweight export and QA scripts.
- OCR-assisted text draft extraction.
- Visual diff sheets for before/after detail review.
