# 科普型手绘 4D 打印平台实施计划

## 已确定边界
- 独立免登录触摸展示模式；工作人员确认后才允许设备动作。
- 画板支持填充区域和中心线两种绘画语义。
- 触摸端首期使用 X+/X-/Y+/Y-，数据层保留六轴扩展。
- 形变首期为参数化科普动画，后续通过位移场接口接入真实仿真。
- DIW 输出无 E 轴运动验证版和带 E 轴打印版；不输出温控指令。
- 默认喷嘴直径 1.63 mm、平台 100 x 100 mm，所有参数可配置。

## 分阶段计划
1. 数据契约：`DrawingDocument`、`Magnetization2D`、`DiwPrinterProfile`、磁化事件、仿真和导出清单。
2. 触摸画板：Pointer Events、撤销/重做、填充/中心线、物理毫米坐标。
3. 二维网格：稳定 `x:y` 单元 ID、涂选、反选、强度和方向设置。
4. 形变展示：强度/方向驱动的参数化动画，预留 `DisplacementField`。
5. DIW 后处理：按线宽规划单层 `G0/G1`，生成无 E 和带 E 两种文件，统一 `MAG_ON/MAG_OFF`。
6. 设备接入：能力发现、profile、工作人员确认、异常和断连时 `MAG_OFF`。
7. 测试：坐标、边界、路径、哈希稳定性、安全状态和真实设备实验记录。

## 本版本交付
- 纯前端可运行触摸展示原型。
- 画板、二维网格、四方向/强度、参数化形变、DIW 路径预览。
- 下载无 E 运动验证版和带 E 打印版 G-code。
- 后端、Moonraker 和 AI 接口暂以数据契约预留，不直接启动硬件。

## 后续实现位置
- `src/types/platform.ts`：数据契约。
- `src/lib/diw-gcode.ts`：二维路径和 G-code。
- `src/pages/TouchStudio.tsx`：展示工作流。
- 后端接入时，通过独立 API 传输 `DrawingDocument`、`Magnetization2D` 和 `DiwPrinterProfile`。
