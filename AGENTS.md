# Classmate 项目上下文文档

## 项目概述

**项目名称：** Classmate（同学录）

**项目目的：** 基于区块链构建的去中心化班级通讯录和"生前赠款"应用。用户可以添加同学信息（姓名、学号、联系方式），这些信息加密存储在链上，前端展示时解密。核心功能包括：班级通讯录、好友查找、以及类似 ruok3 的"未签到自动转账"功能（在设定时间内不签到则自动转账给托付的人）。

**目标黑客松：** Sui Vibe 黑客松

## 技术栈

### 区块链
- **网络：** Sui
- **合约语言：** Move 2024 版本
- **SDK：** 官方最新版 Sui SDK（TypeScript / Rust 等）

### 前端
- **DApp Kit：** Sui dapp-kit
- **SDK 参考文档：** https://sdk.mystenlabs.com/dapp-kit

## 关键参考资源

### Move 2024 语法
- 迁移指南：https://docs.sui.io/concepts/sui-move-concepts/move-2024-migration

### API 文档
- Sui API 参考：https://docs.sui.io/sui-api-ref#suix_getallbalances

### 参考项目
- sui-eco-skills：https://github.com/RandyPen/sui-eco-skills
- ruok 项目：https://github.com/summertoo/ruok

## 开发要求

### 代码规范
1. **Move 合约：** 必须使用最新 Move 2024 语法，不符合规范的项目将不被评审
2. **SDK 版本：** 必须使用官方 Sui SDK 最新版本，不得使用已弃用的接口
3. **AI 使用披露：** 必须披露所有 AI 工具使用情况，包括：
   - AI 工具名称（如 ChatGPT, Claude, Cursor, Copilot, iflow CLI 等）
   - 模型名称/版本
   - 使用到的确切提示词
   - 敏感信息可脱敏

### 目录结构
```
classmate/
├── contracts/       # Move 合约代码
├── frontend/        # 前端应用
└── plan.md          # 项目规划文档
```

### 功能要求
1. **网络切换：** 前端支持 testnet 和 mainnet 自由切换
2. **多语言支持：** 中英文界面自由切换
3. **版本控制：** 使用 Git 进行代码管理

## 核心功能

### 1. 班级通讯录
- 添加同学信息（姓名、学号、联系方式）
- 信息加密存储在链上
- 前端展示时解密
- 汇聚成学校、班级群组

### 2. 好友查找
- 用户可以查找以前的至交好友

### 3. 生前赠款
- 设定一个托付的人
- 在设定好的时间内不签到就自动转账给托付的人
- 类似 ruok3 项目的实现

## iflow CLI 使用记录

### 使用原则
- 每次使用的提示词都要记录备份，方便日后查阅
- 主要开发工具使用 iflow CLI

### AI 工具披露模板
```
AI 工具：iFlow CLI (心流 CLI)
模型：glm-4.7
使用日期：YYYY-MM-DD
提示词：[记录使用的提示词]
用途：[描述具体用途]
```

## 项目命名和介绍建议

### 项目命名
- 需要好听、容易记住

### 项目介绍
- 需要简洁明了地说明项目目的和核心功能

## 注意事项

1. 项目目前处于规划阶段，尚未开始实际开发
2. 优先在 testnet 上测试，成功后再部署到 mainnet
3. 需要遵循 Sui 官方的最佳实践和安全规范