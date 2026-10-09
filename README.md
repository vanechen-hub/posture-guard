# 低头探颈检测器

摄像头检测低头 / 探颈，超过阈值整屏变红。画面只在本机处理，不上传。

## 打开方式

**Mac：双击 `打开检测器.command`** —— 自动起本地服务并打开浏览器，关掉终端窗口即停止。
首次双击若提示「无法打开」，右键 → 打开 → 确认一次即可。

手动方式（任意系统，需 node 或 python3）：

    node serve.js          # 或 python3 -m http.server 8811
    # 然后浏览器打开 http://localhost:8811/posture-guard.html

> **必须走 localhost**：Chrome 只在安全来源下给摄像头权限，直接双击 html 用 `file://` 打开会被拒。

## 用法

坐正 → 点「校准基准 (C)」采 30 帧建立基准 → 之后偏离基准就报警。
- **置顶小窗 (P)**：切到别的标签/应用后仍可见，检测不被浏览器冻结。
- **测试红屏 (T)**：不用真低头就能确认报警通路。
- 三个滑杆：低头角度阈值（默认 12°）、探颈距离阈值（默认 8%）、持续时间（默认 0.8 秒）。

侧头、歪头不会误报也不会漏报 —— 尺度基准用 3D 位姿距离而非两眼间距。

## 文件

| 文件 | 用途 |
|---|---|
| `posture-guard.html` | **单文件版，拷贝这一个就能用**（几何模块已内联） |
| `index.html` + `posture-math.mjs` | 开发用源文件 |
| `build.sh` | 源文件改完后重新生成单文件版 |
| `test-math.mjs` | 几何验证，`node test-math.mjs`，14 项断言 |
| `face_landmarker.task` | MediaPipe 人脸模型，3.6MB，本地优先加载 |
| `serve.js` | 本地静态服务，端口被占会自动往后找 |

模型 `face_landmarker.task`（3.6MB）已随包提供，页面优先加载同目录的本地副本，
官方地址 `storage.googleapis.com` 仅作兜底 —— 该域名在部分网络完全不可达，
只挂官方地址会让页面永远停在「加载模型…」。

仍需联网：MediaPipe 的 wasm 运行时从 `cdn.jsdelivr.net` 加载。
加载任何一步失败都会在界面上报错并显示原因，不会静默卡住。

## 在其他设备上用

- **另一台电脑**：拷 `posture-guard.html` + `serve.js`（+ `.command`），同上启动。
- **手机 / 平板**：需要一个 https 地址，见下方 GitHub Pages 方案。
