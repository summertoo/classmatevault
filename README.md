# ClassmateVault - 传承你的信任

基于 Sui 区块链的去中心化班级通讯录和生前赠款平台

## 项目简介

ClassmateVault 是一个参加 Sui Vibe 黑客松的项目，提供以下核心功能：
- 班级通讯录：加密存储同学信息，确保隐私安全
- 生前赠款：设定受益人和签到周期，未签到则自动转账给受益人

## 技术栈

### 后端（智能合约）
- Move 2024
- Sui 区块链
- Sui SDK（TypeScript）

### 前端
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Sui dapp-kit
- i18next（多语言支持）

## 项目结构

```
classmate/
├── contracts/          # Move 合约代码
│   ├── sources/
│   │   ├── classmate.move   # 班级通讯录合约
│   │   └── promise.move     # 生前赠款合约
│   └── Move.toml
├── frontend/           # 前端应用
│   ├── src/
│   │   ├── contexts/
│   │   ├── i18n/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── AGENTS.md          # 项目上下文文档
├── plan.md            # 开发计划
├── prompt_log.md      # AI 提示词日志
└── README.md          # 项目说明
```

## 开发进度

- [x] 项目规划和技术选型
- [x] 目录结构创建
- [x] Git 仓库初始化
- [x] Move 合约开发
  - [x] 班级通讯录模块
  - [x] 生前赠款模块
- [x] 前端基础框架
  - [x] React + Vite + TypeScript
  - [x] Tailwind CSS 配置
  - [x] 中英文切换
  - [x] 网络切换
- [ ] 前端页面开发
  - [ ] 班级管理页面
  - [ ] 通讯录页面
  - [ ] 生前赠款页面
  - [ ] 签到页面
- [ ] Testnet 集成测试
- [ ] 主网部署

## 开始使用

### 前端开发

```bash
cd frontend
npm install
npm run dev
```

### 构建前端

```bash
cd frontend
npm run build
```

### 部署合约

需要安装 Sui CLI：

```bash
cd contracts
sui client publish
```

## 功能特性

### 班级通讯录
- 创建班级
- 添加同学信息（加密存储）
- 查看班级成员
- 数据隐私保护

### 生前赠款
- 创建生前赠款承诺
- 设置受益人和金额
- 自定义签到周期
- 超时自动转账

### 用户体验
- 中英文界面切换
- Testnet/Mainnet 网络切换
- 钱包连接支持

## AI 使用披露

本项目使用了 AI 工具辅助开发：

| 工具 | 模型 | 用途 |
|------|------|------|
| iFlow CLI (心流 CLI) | glm-4.7 | 代码生成、项目规划、文档编写 |

详细的提示词记录请参考 `prompt_log.md` 文件。

## 参考

- [Sui Move 2024 文档](https://docs.sui.io/concepts/sui-move-concepts/move-2024-migration)
- [Sui dapp-kit](https://sdk.mystenlabs.com/dapp-kit)
- [ruok 项目](https://github.com/summertoo/ruok)

## 许可证

MIT